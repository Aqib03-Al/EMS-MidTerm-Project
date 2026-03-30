var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var session = require('express-session');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var appLogger = require('./middleware/requestLogger');
var authMiddleware = require('./middleware/auth');
var User = require('./models/User');

var app = express();

var mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ems_db';
mongoose.connect(mongoURI)
  .then(function() {
    console.log('MongoDB connected successfully');
    bootstrapDefaultAdmin();
  })
  .catch(function(err) {
    console.error('MongoDB connection error:', err.message);
  });

async function bootstrapDefaultAdmin() {
  try {
    var adminEmail = process.env.ADMIN_EMAIL || 'admin@ems.com';
    var adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    var adminName = process.env.ADMIN_NAME || 'Aqib Ali';
    var existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      console.log('Default admin created:', adminEmail);
    } else if (existingAdmin.name !== adminName) {
      existingAdmin.name = adminName;
      await existingAdmin.save();
    }
  } catch (err) {
    console.error('Admin bootstrap error:', err.message);
  }
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(appLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'ems_super_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 8
  }
}));
app.use(authMiddleware.exposeUser);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/', indexRouter);

// 404 middleware for unknown routes
app.use(function(req, res, next) {
  next(createError(404, 'Route not found'));
});

// Centralized error-handling middleware (500 and others)
app.use(function(err, req, res, next) {
  var statusCode = err.status || 500;
  var errorMessage = err.message || 'Internal Server Error';

  if (req.originalUrl.indexOf('/api/') === 0) {
    return res.status(statusCode).json({
      success: false,
      message: errorMessage
    });
  }

  res.status(statusCode);
  res.render('error', {
    title: 'Error',
    message: errorMessage,
    status: statusCode,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;

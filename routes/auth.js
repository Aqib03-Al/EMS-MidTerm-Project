var express = require('express');
var router = express.Router();
var User = require('../models/User');

function buildAlert(type, text) {
  return { type: type, text: text };
}

function formatAuthError(err) {
  if (err && err.code === 11000) {
    return 'Email already exists. Please use another email.';
  }

  if (err && err.name === 'ValidationError') {
    return Object.keys(err.errors).map(function(key) {
      return err.errors[key].message;
    }).join(' | ');
  }

  return err && err.message ? err.message : 'Authentication failed';
}

router.get('/login', function(req, res) {
  if (req.session && req.session.user) {
    return res.redirect('/');
  }

  res.render('login', {
    title: 'Login',
    alert: req.query.alert ? buildAlert(req.query.alert, req.query.message || '') : null
  });
});

router.post('/login', async function(req, res) {
  try {
    var email = (req.body.email || '').toLowerCase().trim();
    var password = req.body.password || '';
    var user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).render('login', {
        title: 'Login',
        alert: buildAlert('danger', 'Invalid email or password')
      });
    }

    var isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).render('login', {
        title: 'Login',
        alert: buildAlert('danger', 'Invalid email or password')
      });
    }

    req.session.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.redirect('/?alert=success&message=' + encodeURIComponent('Welcome back ' + user.name));
  } catch (err) {
    res.status(500).render('login', {
      title: 'Login',
      alert: buildAlert('danger', formatAuthError(err))
    });
  }
});

router.post('/logout', function(req, res) {
  req.session.destroy(function() {
    res.redirect('/auth/login?alert=success&message=Logged out successfully');
  });
});

module.exports = router;

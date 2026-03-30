var mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
  },
  designation: {
    type: String,
    trim: true,
    default: ''
  },
  department: {
    type: String,
    trim: true,
    default: ''
  },
  salary: {
    type: Number,
    required: [true, 'Salary is required'],
    validate: {
      validator: function(value) {
        return value > 0;
      },
      message: 'Salary must be a positive number'
    }
  },
  joiningDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);

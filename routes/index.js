var express = require('express');
var router = express.Router();
var Employee = require('../models/Employee');
var Department = require('../models/Department');
var authMiddleware = require('../middleware/auth');

function buildAlert(type, text) {
  return {
    type: type,
    text: text
  };
}

function formatValidationError(err) {
  if (err && err.code === 11000) {
    return 'Duplicate email detected. Please use a different email.';
  }

  if (err && err.name === 'ValidationError') {
    return Object.keys(err.errors).map(function(key) {
      return err.errors[key].message;
    }).join(' | ');
  }

  return err && err.message ? err.message : 'Something went wrong.';
}

/* Web route: About page. */
router.get('/about', function(req, res) {
  res.render('about', {
    title: 'About EMS'
  });
});

/* Web route: Services page. */
router.get('/services', function(req, res) {
  res.render('services', {
    title: 'EMS Services'
  });
});

/* Web route: Policy page. */
router.get('/policy', function(req, res) {
  res.render('policy', {
    title: 'EMS Policy'
  });
});

/* Web route: Landing page for unauthenticated users + dashboard for logged-in users. */
router.get('/', async function(req, res, next) {
  try {
    if (!req.session || !req.session.user) {
      var totalEmployees = await Employee.countDocuments();
      var totalDepartments = await Department.countDocuments();

      return res.render('landing', {
        title: 'Employee Management System',
        totalEmployees: totalEmployees,
        totalDepartments: totalDepartments
      });
    }

    var search = (req.query.search || '').trim();
    var department = (req.query.department || '').trim();
    var filter = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (department) {
      filter.department = department;
    }

    var employees = await Employee.find(filter).sort({ createdAt: -1 });
    var departments = await Department.find().sort({ name: 1 });
    var totalEmployeesDashboard = await Employee.countDocuments();
    var totalDepartmentsDashboard = await Department.countDocuments();
    var recentEmployees = await Employee.countDocuments({
      joiningDate: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
    });

    res.render('index', {
      title: 'Employee Management System',
      employees: employees,
      departments: departments,
      search: search,
      selectedDepartment: department,
      stats: {
        totalEmployees: totalEmployeesDashboard,
        totalDepartments: totalDepartmentsDashboard,
        recentEmployees: recentEmployees
      },
      userRole: req.session.user.role,
      alert: req.query.alert ? buildAlert(req.query.alert, req.query.message || '') : null
    });
  } catch (err) {
    next(err);
  }
});

/* Web route: Employee creation form. */
router.get('/employees/new', authMiddleware.ensureRole(['admin']), async function(req, res, next) {
  try {
    var departments = await Department.find().sort({ name: 1 });
    res.render('employee-form', {
      title: 'Add Employee',
      formTitle: 'Add New Employee',
      employee: {},
      departments: departments,
      formAction: '/employees',
      methodOverride: null,
      submitLabel: 'Create Employee',
      alert: null
    });
  } catch (err) {
    next(err);
  }
});

/* Web route: Create employee from form submission. */
router.post('/employees', authMiddleware.ensureRole(['admin']), async function(req, res, next) {
  try {
    await Employee.create(req.body);
    res.redirect('/?alert=success&message=Employee created successfully');
  } catch (err) {
    try {
      var departments = await Department.find().sort({ name: 1 });
      res.status(400).render('employee-form', {
        title: 'Add Employee',
        formTitle: 'Add New Employee',
        employee: req.body,
        departments: departments,
        formAction: '/employees',
        methodOverride: null,
        submitLabel: 'Create Employee',
        alert: buildAlert('danger', formatValidationError(err))
      });
    } catch (nestedError) {
      next(nestedError);
    }
  }
});

/* Web route: Edit form for an existing employee. */
router.get('/employees/:id/edit', authMiddleware.ensureRole(['admin']), async function(req, res, next) {
  try {
    var employee = await Employee.findById(req.params.id);
    var departments = await Department.find().sort({ name: 1 });
    if (!employee) {
      return res.status(404).render('error', {
        title: 'Not Found',
        message: 'Employee not found',
        status: 404,
        error: {}
      });
    }

    res.render('employee-form', {
      title: 'Edit Employee',
      formTitle: 'Edit Employee',
      employee: employee,
      departments: departments,
      formAction: '/employees/' + employee._id + '?_method=PUT',
      methodOverride: 'PUT',
      submitLabel: 'Update Employee',
      alert: null
    });
  } catch (err) {
    next(err);
  }
});

/* Web route: Update employee from form submission. */
router.put('/employees/:id', authMiddleware.ensureRole(['admin']), async function(req, res, next) {
  try {
    var updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true
    });

    if (!updated) {
      return res.redirect('/?alert=danger&message=Employee not found');
    }

    res.redirect('/?alert=success&message=Employee updated successfully');
  } catch (err) {
    try {
      var departments = await Department.find().sort({ name: 1 });
      res.status(400).render('employee-form', {
        title: 'Edit Employee',
        formTitle: 'Edit Employee',
        employee: Object.assign({ _id: req.params.id }, req.body),
        departments: departments,
        formAction: '/employees/' + req.params.id + '?_method=PUT',
        methodOverride: 'PUT',
        submitLabel: 'Update Employee',
        alert: buildAlert('danger', formatValidationError(err))
      });
    } catch (nestedError) {
      next(nestedError);
    }
  }
});

/* Web route: Delete an employee by id. */
router.delete('/employees/:id', authMiddleware.ensureRole(['admin']), async function(req, res, next) {
  try {
    var deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.redirect('/?alert=danger&message=Employee not found');
    }

    res.redirect('/?alert=success&message=Employee deleted successfully');
  } catch (err) {
    next(err);
  }
});

/* Web route: Department management page. */
router.get('/departments', authMiddleware.ensureRole(['admin']), async function(req, res, next) {
  try {
    var departments = await Department.find().sort({ name: 1 });
    res.render('departments', {
      title: 'Departments',
      departments: departments,
      alert: req.query.alert ? buildAlert(req.query.alert, req.query.message || '') : null
    });
  } catch (err) {
    next(err);
  }
});

/* Web route: Add new department. */
router.post('/departments', authMiddleware.ensureRole(['admin']), async function(req, res) {
  try {
    await Department.create({
      name: req.body.name,
      description: req.body.description
    });
    res.redirect('/departments?alert=success&message=Department created successfully');
  } catch (err) {
    res.redirect('/departments?alert=danger&message=' + encodeURIComponent(formatValidationError(err)));
  }
});

/* Web route: Update department details. */
router.put('/departments/:id', authMiddleware.ensureRole(['admin']), async function(req, res) {
  try {
    var updatedDepartment = await Department.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description
    }, {
      new: true,
      runValidators: true
    });

    if (!updatedDepartment) {
      return res.redirect('/departments?alert=danger&message=Department not found');
    }

    res.redirect('/departments?alert=success&message=Department updated successfully');
  } catch (err) {
    res.redirect('/departments?alert=danger&message=' + encodeURIComponent(formatValidationError(err)));
  }
});

/* Web route: Delete department. */
router.delete('/departments/:id', authMiddleware.ensureRole(['admin']), async function(req, res, next) {
  try {
    var departmentToDelete = await Department.findById(req.params.id);
    if (!departmentToDelete) {
      return res.redirect('/departments?alert=danger&message=Department not found');
    }

    await Employee.updateMany(
      { department: departmentToDelete.name },
      { $set: { department: '' } }
    );
    await Department.findByIdAndDelete(req.params.id);

    res.redirect('/departments?alert=success&message=Department deleted successfully');
  } catch (err) {
    next(err);
  }
});

/* API route: Fetch all employees (JSON). */
router.get('/api/employees', authMiddleware.ensureAuthenticated, async function(req, res, next) {
  try {
    var employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (err) {
    next(err);
  }
});

/* API route: Fetch a single employee by id (JSON). */
router.get('/api/employees/:id', authMiddleware.ensureAuthenticated, async function(req, res, next) {
  try {
    var employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    next(err);
  }
});

/* API route: Create a new employee (JSON). */
router.post('/api/employees', authMiddleware.ensureRole(['admin']), async function(req, res) {
  try {
    var employee = await Employee.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (err) {
    var statusCode = err.code === 11000 || err.name === 'ValidationError' ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: formatValidationError(err)
    });
  }
});

/* API route: Fully update employee by id (JSON). */
router.put('/api/employees/:id', authMiddleware.ensureRole(['admin']), async function(req, res) {
  try {
    var employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      overwrite: true
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (err) {
    var statusCode = err.code === 11000 || err.name === 'ValidationError' ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: formatValidationError(err)
    });
  }
});

/* API route: Partially update employee by id (JSON). */
router.patch('/api/employees/:id', authMiddleware.ensureRole(['admin']), async function(req, res) {
  try {
    var employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (err) {
    var statusCode = err.code === 11000 || err.name === 'ValidationError' ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: formatValidationError(err)
    });
  }
});

/* API route: Remove employee by id (JSON). */
router.delete('/api/employees/:id', authMiddleware.ensureRole(['admin']), async function(req, res, next) {
  try {
    var employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    next(err);
  }
});

module.exports = router;

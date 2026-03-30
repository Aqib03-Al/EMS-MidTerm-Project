function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }

  if (req.originalUrl.indexOf('/api/') === 0) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  res.redirect('/auth/login?alert=danger&message=Please login to continue');
}

function ensureRole(allowedRoles) {
  return function(req, res, next) {
    if (!req.session || !req.session.user) {
      if (req.originalUrl.indexOf('/api/') === 0) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }
      return res.redirect('/auth/login?alert=danger&message=Please login to continue');
    }

    if (allowedRoles.indexOf(req.session.user.role) === -1) {
      if (req.originalUrl.indexOf('/api/') === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
      return res.redirect('/?alert=danger&message=Access denied for your role');
    }

    next();
  };
}

function exposeUser(req, res, next) {
  res.locals.currentUser = req.session ? req.session.user : null;
  next();
}

module.exports = {
  ensureAuthenticated: ensureAuthenticated,
  ensureRole: ensureRole,
  exposeUser: exposeUser
};

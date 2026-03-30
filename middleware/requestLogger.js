module.exports = function requestLogger(req, res, next) {
  var timestamp = new Date().toISOString();
  console.log('[' + timestamp + '] ' + req.method + ' ' + req.originalUrl);
  next();
};

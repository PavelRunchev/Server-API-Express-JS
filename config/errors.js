

module.exports = function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).json({ error: 'Something failed!' })
  } else {
    next(err)
  }
}

module.exports = function errorHandler (err, req, res, next) {
  res.status(500).json('error', { message: 'Internal Server Error!' });
}
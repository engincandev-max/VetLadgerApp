// backend/src/middlewares/errorHandler.js

module.exports = function errorHandler(err, req, res, next) {
  // eslint yoksa next kullanılmıyor diye uyarabilir, ama express için standard
  const status =
    err.statusCode ||
    err.status ||
    500;

  const message =
    err.message || 'Internal Server Error';

  if (process.env.NODE_ENV === 'development') {
    console.error('🔥 Error:', err);
  }

  res.status(status).json({
    error: message,
  });
};

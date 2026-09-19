function errorHandler(err, req, res, next) {
  console.error(`[${req.method} ${req.originalUrl}] ${err.message}`);

  const statusCode = err.statusCode || err.status || 500;

  res.status(statusCode).json({
    error: err.message || "Error interno del servidor",
  });
}

module.exports = errorHandler;
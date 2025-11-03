const errorHandler = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';

  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: err.message || 'Internal Server Error',
    ...(isProduction ? null : { stackTrace: err.stack })
  });
};

module.exports = errorHandler;

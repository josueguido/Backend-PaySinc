import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  logger.error(`Error captured: ${err.message}`);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  logger.error(`${req.method} ${req.originalUrl} ${statusCode} - ${err.message}`);

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default errorHandler;

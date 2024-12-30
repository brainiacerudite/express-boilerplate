const HttpException = require("../exceptions/HttpException");
const { logger } = require("../utils/logger");

const ErrorMiddleware = (err, req, res, next) => {
  try {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";

    logger.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`
    );
    res.status(status).json({ success: false, message });
  } catch (error) {
    next(error);
  }
};

module.exports = ErrorMiddleware;

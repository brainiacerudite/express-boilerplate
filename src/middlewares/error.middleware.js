const config = require("../config");
const HttpException = require("../exceptions/HttpException");
const { logger } = require("../utils/logger");

const ErrorMiddleware = (err, req, res, next) => {
  try {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";

    // log only non-validation errors
    if (status === 400 || status === 422) {
      return res
        .status(status)
        .json({ success: false, message: "Validation error", errors: message });
    }

    logger.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`
    );
    if (config.env !== "development" && status === 500) {
      return res
        .status(status)
        .json({ success: false, message: "Internal server error" });
    }
    res.status(status).json({ success: false, message });
  } catch (error) {
    next(error);
  }
};

module.exports = ErrorMiddleware;

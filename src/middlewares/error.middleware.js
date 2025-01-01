const config = require("../config");
const ValidationException = require("../exceptions/ValidationException");
const { logger } = require("../utils/logger");

const ErrorMiddleware = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  // check if the error is a Joi validation error
  if (err instanceof ValidationException) {
    const response = {
      success: false,
      message: err.message,
    };
    if (err.errors) {
      response.errors = err.errors;
    }
    return res.status(err.status).json(response);
  }

  // log only non-validation errors
  if (status !== 400 && status !== 422) {
    logger.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`
    );
  }

  if (config.env !== "development" && status === 500) {
    return res
      .status(status)
      .json({ success: false, message: "Internal server error" });
  }
  res.status(status).json({ success: false, message });
};

module.exports = ErrorMiddleware;

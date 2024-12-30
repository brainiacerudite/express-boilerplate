const HttpException = require("../exceptions/HttpException");

const RouteNotFoundMiddleware = (req, res, next) => {
  const error = new HttpException(404, "Route not found");
  next(error);
};

module.exports = RouteNotFoundMiddleware;

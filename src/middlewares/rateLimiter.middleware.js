const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // limit each IP to 100 requests per windowMs
  skipSuccessfulRequests: true,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

const RateLimiterMiddleware = (req, res, next) => {
  rateLimiter(req, res, next);
};

module.exports = RateLimiterMiddleware;

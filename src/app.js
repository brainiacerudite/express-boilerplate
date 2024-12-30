const express = require("express");
const config = require("./config");
const dbConnection = require("./database");
const morgan = require("morgan");
const cors = require("cors");
const hpp = require("hpp");
const helmet = require("helmet");
const compression = require("compression");
const routes = require("./routes");
const RateLimiterMiddleware = require("./middlewares/rateLimiter.middleware");
const ErrorMiddleware = require("./middlewares/error.middleware");
const { stream } = require("./utils/logger");
const RouteNotFoundMiddleware = require("./middlewares/route.middleware");

const app = express();

// connect database
dbConnection();

// middlewares
app.use(morgan(config.log.format, { stream }));
app.use(
  cors({ origin: config.cors.origin, credentials: config.cors.credentials })
);
app.use(hpp());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(RateLimiterMiddleware);

// routes
app.use("/", routes);
// 404 error handling
app.use(RouteNotFoundMiddleware);

// error handling
app.use(ErrorMiddleware);

module.exports = app;

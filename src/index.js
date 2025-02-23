const app = require("./app");
const config = require("./config");
const { logger } = require("./utils/logger");

const server = app.listen(config.port, () => {
  logger.info(`=================================`);
  logger.info(`======= ENV: ${config.env} =======`);
  logger.info(`🚀 App listening on the port ${config.port}`);
  logger.info(`=================================`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});

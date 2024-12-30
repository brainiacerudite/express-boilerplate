const { existsSync, mkdirSync } = require("fs");
const { join } = require("path");
const winston = require("winston");
const winstonDaily = require("winston-daily-rotate-file");
const config = require("../config");

// log directory
const logDir = join(__dirname, config.log.dir);

// create log directory if it doesn't exist
if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

// log format
const logFormat = winston.format.printf(
  ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`
);

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    new winstonDaily({
      level: "debug",
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/debug",
      filename: `%DATE%.log`,
      maxFiles: 30,
      json: false,
      zippedArchive: true,
    }),
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/error",
      filename: `%DATE%.error.log`,
      maxFiles: 30,
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.colorize()
      ),
    }),
  ],
  exitOnError: false,
});

const stream = {
  write: (message) => {
    logger.info(message.substring(0, message.lastIndexOf("\n")));
  },
};

module.exports = { logger, stream };

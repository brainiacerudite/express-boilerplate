import { configDotenv } from "dotenv";
configDotenv({ path: ".env" });

const config = {
  env: process.env.NODE_ENV || "development", // "development" | "production"
  port: process.env.PORT || 5000,
  api: {
    name: process.env.API_NAME || "Express API",
    url: process.env.API_URL || "http://localhost:5000",
    prefix: process.env.API_PREFIX || "/api/v1",
  },
  frontend: {
    url: process.env.FRONTEND_URL,
  },
  log: {
    format: process.env.LOG_FORMAT || "combined",
    dir: process.env.LOG_DIR || "logs",
    level: process.env.LOG_LEVEL || "info",
  },
  db: {
    type: process.env.DB_TYPE || "mongodb",
    mongodb: {
      url: process.env.DB_URL,
      name: process.env.DB_NAME,
    },
    // can add more databases like mysql, postgres
  },
  jwt: {
    secret: process.env.JWT_SECRET || "secret",
    access: {
      expiresIn: process.env.JWT_ACCESS_EXPIRES || "1h",
    },
    refresh: {
      expiresIn: process.env.JWT_REFRESH_EXPIRES || "30d",
    },
    resetPassword: {
      expiresIn: process.env.JWT_RESET_PASSWORD_EXPIRES || "30m",
    },
    verifyEmail: {
      expiresIn: process.env.JWT_VERIFY_EMAIL_EXPIRES || "30m",
    },
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASS,
    from: {
      email: process.env.MAIL_FROM,
      name: process.env.MAIL_FROM_NAME,
    },
  },
};

module.exports = config;

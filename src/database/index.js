const config = require("../config");
const mongoose = require("mongoose");
const HttpException = require("../exceptions/HttpException");
const { logger } = require("../utils/logger");
// const mysql = require("mysql2/promise"); // install if needed
// const { Client: PgClient } = require("pg"); // install if needed

const dbConnection = async () => {
  const dbConfig = config.db[config.db.type]; // Get the config for the specified db type

  try {
    if (config.db.type === "mongodb") {
      const mongoConfig = {
        url: `${dbConfig.url}/${dbConfig.name}`,
        options: {},
      };

      if (config.env === "development") {
        mongoose.set("debug", true);
      }

      await mongoose.connect(mongoConfig.url, mongoConfig.options);
    }
    // Uncomment and complete the following sections if needed
    // else if (config.db.type === "postgresql") {
    //   const client = new PgClient({
    //     connectionString: dbConfig.url,
    //   });

    //   await client.connect();
    //   // Store the client for later use
    //   global.pgClient = client;
    // } else if (config.db.type === "mysql") {
    //   const connection = await mysql.createConnection({
    //     host: dbConfig.host,
    //     user: dbConfig.user,
    //     password: dbConfig.password,
    //     database: dbConfig.database,
    //   });

    //   // Store the connection for later use
    //   global.mysqlConnection = connection;
    // }
    else {
      throw new HttpException(500, "Unsupported database type");
    }
  } catch (error) {
    // logger.error("Database connection error:", error);
    throw new HttpException(500, `Internal server error: ${error.message}`);
  }
};

module.exports = dbConnection;

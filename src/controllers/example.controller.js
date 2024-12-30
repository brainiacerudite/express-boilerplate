const HttpException = require("../exceptions/HttpException");

const example = async (req, res, next) => {
  try {
    // Some logic that might throw an error
    throw new HttpException(400, "This is a bad request");
  } catch (error) {
    next(error);
  }
};

const exampleController = { example };
module.exports = exampleController;

const HttpException = require("../exceptions/HttpException");
const asyncHandler = require("../utils/asyncHandler");

const example = asyncHandler(async (req, res, next) => {
  // Some logic that might throw an error
  throw new HttpException(400, "This is a bad request");
  // res.status(200).json({ success: true, message: "This is an example route" });
});

const exampleController = { example };
module.exports = exampleController;

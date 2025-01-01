const Joi = require("joi");
const HttpException = require("../exceptions/HttpException");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../utils/validationHandler");

const example = asyncHandler(async (req, res, next) => {
  // Some logic that might throw an error
  throw new HttpException(400, "This is a bad request");
  // res.status(200).json({ success: true, message: "This is an example route" });
});

const postExample = asyncHandler(async (req, res, next) => {
  // define the validation schema here or you can create validation folder and separate the schema
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
  });
  validate(req.body, schema);

  const { name, email } = req.body;

  res.status(200).json({
    success: true,
    message: "This is a post example route",
    data: { name, email },
  });
});

const exampleController = { example, postExample };
module.exports = exampleController;

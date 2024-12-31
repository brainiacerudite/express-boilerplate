const HttpException = require("../exceptions/HttpException");

const validate = (reqBody, validationSchema) => {
  const { error } = validationSchema.validate(reqBody, { abortEarly: false });
  if (error) {
    const formattedErrors = error.details.reduce((acc, err) => {
      acc[err.context.key] = err.message;
      return acc;
    }, {});

    throw new HttpException(400, formattedErrors);
  }
};

module.exports = validate;

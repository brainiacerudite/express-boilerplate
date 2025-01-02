const ValidationException = require("../exceptions/ValidationException");

const validate = (reqBody, validationSchema) => {
  const { error } = validationSchema.validate(reqBody, { abortEarly: false });
  if (error) {
    const formattedErrors = error.details.reduce((acc, err) => {
      acc[err.context.key] = err.message;
      return acc;
    }, {});

    throw new ValidationException(422, "Validation error", formattedErrors);
  }
};

module.exports = validate;

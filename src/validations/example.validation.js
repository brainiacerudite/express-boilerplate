const Joi = require("joi");

const exampleValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});

module.exports = exampleValidation;

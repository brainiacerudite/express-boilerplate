const Joi = require("joi");

const register = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")),
});

const resendOtp = Joi.object({
  email: Joi.string().email().required(),
});

const verifyOtp = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.number().required(),
});

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const logout = Joi.object({
  refreshToken: Joi.string().required(),
});

const refreshToken = Joi.object({
  refreshToken: Joi.string().required(),
});

const forgotPassword = Joi.object({
  email: Joi.string().email().required(),
});

const verifyForgotPasswordOtp = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.number().required(),
});

const resetPassword = Joi.object({
  password: Joi.string().required(),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")),
});

const authValidation = {
  register,
  resendOtp,
  verifyOtp,
  login,
  logout,
  refreshToken,
  forgotPassword,
  verifyForgotPasswordOtp,
  resetPassword,
};
module.exports = authValidation;

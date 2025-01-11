const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../utils/validationHandler");
const authValidation = require("../validations/auth.validation");

const register = asyncHandler(async (req, res) => {
  validate(req.body, authValidation.register);

  const userDataWithTokens = await authService.register(req.body);

  res.status(201).json({
    success: true,
    message: "Registered Successfully",
    data: userDataWithTokens,
  });
});

const resendOtp = asyncHandler(async (req, res) => {
  validate(req.body, authValidation.resendOtp);

  await authService.resendOtp(req.body);

  res.status(200).json({ success: true, message: "OTP Resent Successfully" });
});

const verifyOtp = asyncHandler(async (req, res) => {
  validate(req.body, authValidation.verifyOtp);

  await authService.verifyOtp(req.body);

  res.status(200).json({ success: true, message: "OTP Verified Successfully" });
});

const login = asyncHandler(async (req, res) => {
  validate(req.body, authValidation.login);

  const userDataWithTokens = await authService.login(req.body);

  res.status(200).json({
    success: true,
    message: "Login Successfully",
    data: userDataWithTokens,
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  validate(req.body, authValidation.refreshToken);

  const tokens = await authService.refreshToken(req.body.refreshToken);

  res
    .status(200)
    .json({ success: true, message: "Refresh Tokens", data: tokens });
});

const logout = asyncHandler(async (req, res) => {
  validate(req.body, authValidation.logout);

  await authService.logout(req.body.refreshToken);

  res.status(200).json({ success: true, message: "Logout Successfully" });
});

const forgotPassword = asyncHandler(async (req, res) => {
  validate(req.body, authValidation.forgotPassword);

  await authService.forgotPassword(req.body);

  res.status(200).json({ success: true, message: "Code Sent Successfully" });
});

const verifyForgotPasswordOtp = asyncHandler(async (req, res) => {
  validate(req.body, authValidation.verifyForgotPasswordOtp);

  const tempToken = await authService.verifyForgotPasswordOtp(req.body);

  res.status(200).json({
    success: true,
    message: "OTP Verified Successfully",
    data: tempToken,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  validate(req.body, authValidation.resetPassword);

  await authService.resetPassword(req.body);

  res
    .status(200)
    .json({ success: true, message: "Password Reset Successfully" });
});

const AuthController = {
  register,
  resendOtp,
  verifyOtp,
  login,
  refreshToken,
  logout,
  forgotPassword,
  verifyForgotPasswordOtp,
  resetPassword,
};
module.exports = AuthController;

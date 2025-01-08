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

const login = asyncHandler(async (req, res) => {
  validate(req.body, authValidation.login);

  const userDataWithTokens = await authService.login(req.body);

  res.status(200).json({
    success: true,
    message: "Login Successfully",
    data: userDataWithTokens,
  });
});

const logout = asyncHandler(async (req, res) => {
  validate(req.body, authValidation.logout);

  await authService.logout(req.body.refreshToken);

  res.status(200).json({ success: true, message: "Logout Successfully" });
});

const refreshToken = asyncHandler(async (req, res) => {
  validate(req.body, authValidation.refreshToken);

  const tokens = await authService.refreshToken(req.body.refreshToken);

  res
    .status(200)
    .json({ success: true, message: "Refresh Tokens", data: tokens });
});

const forgotPassword = asyncHandler(async (req, res) => {
  validate(req.body, authValidation.forgotPassword);

  await authService.forgotPassword(req.body);

  res.status(200).json({ success: true, message: "Code Sent Successfully" });
});

const verifyResetToken = asyncHandler(async (req, res) => {
  // validate(req.body, authValidation.)

  const tokenDoc = await authService.verifyResetToken(req.body);

  res
    .status(200)
    .json({ success: true, message: "Token Verified", data: tokenDoc });
});

const resetPassword = asyncHandler(async (req, res) => {
  validate(req.body, authValidation.resetPassword);

  await authService.resetPassword(req.body);

  res
    .status(200)
    .json({ success: true, message: "Password Reset Successfully" });
});

const sendVerificationEmail = asyncHandler(async (req, res) => {
  validate(req.body, authValidation.sendVerificationEmail);

  await authService.sendVerificationEmail(req.body);

  res.status(200).json({ success: true, message: "Verification Email Sent" });
});

const verifyEmail = asyncHandler(async (req, res) => {
  validate(req.body, authValidation.verifyEmail);

  await authService.verifyEmail(req.body);

  res.status(200).json({ success: true, message: "Email Verified" });
});

const AuthController = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
module.exports = AuthController;

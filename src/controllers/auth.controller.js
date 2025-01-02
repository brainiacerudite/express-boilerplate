const asyncHandler = require("../utils/asyncHandler");

const register = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: "Register" });
});

const login = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: "Login" });
});

const logout = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: "Logout" });
});

const refreshToken = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: "Refresh Token" });
});

const forgotPassword = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: "Forgot Password" });
});

const resetPassword = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: "Reset Password" });
});

const sendVerificationEmail = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: "Send Verification Email" });
});

const AuthController = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
};
module.exports = AuthController;

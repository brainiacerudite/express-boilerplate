const {
  REFRESH,
  RESET_PASSWORD,
  VERIFY_EMAIL,
} = require("../config/tokenTypes");
const ValidationException = require("../exceptions/ValidationException");
const Token = require("../models/token.model");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const emailService = require("./email.service");
const tokenService = require("./token.service");
const config = require("../config");

const register = async (data) => {
  const { name, email, password, confirmPassword } = data;

  const checkEmail = await User.findOne({ email });
  if (checkEmail) {
    throw new ValidationException(400, "Email already taken");
  }

  if (password !== confirmPassword) {
    throw new ValidationException(400, "Passwords do not match");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const verificationOtp = await tokenService.generateVerificationOtp(user.id);

  await emailService.sendVerificationEmail(
    email,
    verificationOtp.otp,
    verificationOtp.expiresIn
  );

  const tokens = await tokenService.generateAuthToken(user.id);

  return { user, tokens };
};

const resendOtp = async (data) => {
  const { email } = data;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ValidationException(400, "User not found");
  }

  const verificationOtp = await tokenService.generateVerificationOtp(user.id);

  await emailService.sendVerificationEmail(
    email,
    verificationOtp.otp,
    verificationOtp.expiresIn
  );
};

const verifyOtp = async (data) => {
  const { email, otp } = data;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ValidationException(400, "User not found");
  }

  const verifyOtp = await tokenService.verifyOtp(otp, VERIFY_EMAIL, user.id);

  await user.updateOne({ isVerified: true });

  await tokenService.deleteToken(verifyOtp.token);
};

const login = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ValidationException(
      400,
      "These credentials do not match our records."
    );
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new ValidationException(
      400,
      "These credentials do not match our records."
    );
  }

  const tokens = await tokenService.generateAuthToken(user.id);

  return { user, tokens };
};

const refreshToken = async (data) => {
  const { refreshToken } = data;

  const tokenDoc = await Token.findOne({
    token: refreshToken,
    type: REFRESH,
  });
  console.log(tokenDoc);

  if (!tokenDoc) {
    throw new ValidationException(400, "Invalid token");
  }

  const userData = await User.findById(tokenDoc.user);

  if (!userData) {
    throw new ValidationException(400, "Invalid token");
  }

  await tokenDoc.deleteOne();

  const tokens = await tokenService.generateAuthToken(userData.id);

  return tokens;
};

const logout = async (refreshToken) => {
  const token = await Token.findOne({
    token: refreshToken,
    type: REFRESH,
    blacklisted: false,
  });

  if (!token) {
    throw new ValidationException(400, "Invalid token");
  }

  await token.deleteOne();
};

const forgotPassword = async (data) => {
  const { email } = data;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ValidationException(400, "User not found");
  }

  const passwordResetToken = await tokenService.generateResetPasswordOtp(
    user.id
  );

  await emailService.sendResetPasswordEmail(
    email,
    passwordResetToken.token,
    passwordResetToken.expiresIn
  );
};

const verifyForgotPasswordOtp = async (data) => {
  const { email, otp } = data;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ValidationException(400, "User not found");
  }

  const resetPasswordToken = await tokenService.verifyOtp(
    otp,
    RESET_PASSWORD,
    user.id
  );

  const tempToken = await tokenService.generateToken(
    email,
    config.jwt.resetPassword.expiresIn + "m",
    RESET_PASSWORD
  );

  await tokenService.deleteToken(resetPasswordToken.token);

  return { reset_token: tempToken };
};

const resetPassword = async (data) => {
  const { email, password, token } = data;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ValidationException(400, "User not found");
  }

  const resetPasswordToken = await tokenService.verifyToken(
    token,
    RESET_PASSWORD
  );

  const hashedPassword = await bcrypt.hash(password, 10);

  await user.updateOne({ password: hashedPassword });
};

const authService = {
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
module.exports = authService;

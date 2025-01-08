const { REFRESH, RESET_PASSWORD } = require("../config/tokenTypes");
const ValidationException = require("../exceptions/ValidationException");
const Token = require("../models/token.model");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const emailService = require("./email.service");
const tokenService = require("./token.service");

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

  const verificationToken = await tokenService.generateVerificationToken(
    user.id
  );

  await emailService.sendVerificationEmail(
    email,
    verificationToken.token,
    verificationToken.expiresIn
  );

  const tokens = await tokenService.generateAuthToken(user.id);

  return { user, tokens };
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

  const tokens = await tokenService.generateAuthToken(userData.id);

  return { user, tokens };
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

const refreshToken = async (data) => {
  const { refreshToken } = data;

  const tokenDoc = await Token.findOne({
    token: refreshToken,
    type: REFRESH,
  });

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

const forgotPassword = async (data) => {
  const { email } = data;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ValidationException(400, "User not found");
  }

  const passwordResetToken = await tokenService.generateResetPasswordToken(
    user.id
  );

  await emailService.sendResetPasswordEmail(
    email,
    passwordResetToken.token,
    passwordResetToken.expiresIn
  );
};

const verifyResetToken = async (data) => {
  const { token } = data;

  const tokenDoc = await tokenService.verifyToken(token, RESET_PASSWORD);

  if (!tokenDoc) {
    throw new ValidationException(400, "Invalid or expired token");
  }

  return tokenDoc;
};

const resetPassword = async (data) => {
  const { token, password, confirmPassword } = data;

  if (password !== confirmPassword) {
    throw new ValidationException(400, "Passwords do not match");
  }

  // const tokenDoc = await Token.findOne({
  //   token,
  //   type: RESET_PASSWORD,
  // });
  const tokenDoc = await tokenService.verifyToken(token, RESET_PASSWORD);

  // if (!tokenDoc) {
  //   throw new ValidationException(400, "Invalid token");
  // }

  const user = await User.findById(tokenDoc.user);

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  await user.save();

  await tokenDoc.deleteOne();
};

const sendVerificationEmail = async (email, token, expiresIn) => {
  // Implementation of sending the verification email
  await emailService.sendEmail({
    to: email,
    subject: "Verify your account",
    text: `Your OTP for account verification is ${token}. It will expire in ${expiresIn} minutes.`,
  });
};

const verifyEmail = async (data) => {
  const { token } = data;

  const tokenDoc = await tokenService.verifyToken(token, VERIFY_EMAIL);

  const user = await User.findById(tokenDoc.user);
  if (!user) {
    throw new ValidationException(400, "Invalid token");
  }

  user.isVerified = true;
  await user.save();

  await tokenDoc.deleteOne();
};

const authService = {
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
module.exports = authService;

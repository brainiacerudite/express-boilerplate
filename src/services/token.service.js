const config = require("../config");
const {
  ACCESS,
  REFRESH,
  RESET_PASSWORD,
  VERIFY_EMAIL,
} = require("../config/tokenTypes");
const ValidationException = require("../exceptions/ValidationException");
const Token = require("../models/token.model");
const jwt = require("jsonwebtoken");

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  return jwt.sign({ sub: userId, type }, secret, { expiresIn: expires });
};

const generateOtp = (length) => {
  return Math.floor(
    Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - 1)
  );
};

const saveToken = async (token, user, expiresAt, type, blacklisted = false) => {
  const tokenData = await Token.create({
    token,
    user,
    expiresAt,
    type,
    blacklisted,
  });

  return tokenData;
};

const deleteToken = async (token) => {
  await Token.deleteOne({ token });
};

const verifyToken = async (token, type, secret = config.jwt.secret) => {
  const payload = jwt.verify(token, secret);

  const tokenData = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });

  if (!tokenData) {
    throw new ValidationException(400, "Invalid token");
  }

  return tokenData;
};

const verifyOtp = async (otp, type, userId) => {
  const tokenData = await Token.findOne({
    token: otp,
    type,
    blacklisted: false,
  });

  if (!tokenData) {
    throw new ValidationException(400, "Invalid OTP");
  }

  if (tokenData.expiresAt < Date.now()) {
    throw new ValidationException(400, "OTP expired");
  }

  if (tokenData.user.toString() !== userId) {
    throw new ValidationException(400, "Invalid OTP");
  }

  return tokenData;
};

const generateAuthToken = async (userId) => {
  // convert config.jwt.access.expiresIn in minutes to milliseconds
  const expiresIn = config.jwt.access.expiresIn * 60000;
  const accessToken = generateToken(userId, expiresIn, ACCESS);

  // convert config.jwt.refresh.expiresIn in days to milliseconds
  const refreshExpiresIn = config.jwt.refresh.expiresIn * 86400000;
  const refreshToken = generateToken(userId, refreshExpiresIn, REFRESH);

  await saveToken(
    refreshToken,
    userId,
    new Date(Date.now() + refreshExpiresIn),
    REFRESH
  );

  return {
    access: {
      token: accessToken,
      expiresIn: expiresIn,
    },
    refresh: {
      token: refreshToken,
      expiresIn: refreshExpiresIn,
    },
  };
};

const generateResetPasswordOtp = async (userId) => {
  let otp = null;
  let expiresIn = null;

  const tokenData = await Token.findOne({
    user: userId,
    type: RESET_PASSWORD,
  });

  if (tokenData) {
    otp = tokenData.token;
    expiresIn = tokenData.expiresAt;
  } else {
    otp = generateOtp(4);
    // convert config.jwt.resetPassword.expiresIn in minutes to milliseconds
    expiresIn = new Date(
      Date.now() + config.jwt.resetPassword.expiresIn * 60000
    );
    await saveToken(otp, userId, expiresIn, RESET_PASSWORD);
  }

  return { otp, expiresIn: expiresIn };
};

const generateVerificationOtp = async (userId) => {
  let otp = null;
  let expiresIn = null;

  const tokenData = await Token.findOne({ user: userId, type: VERIFY_EMAIL });

  if (tokenData) {
    otp = tokenData.token;
    expiresIn = tokenData.expiresAt;
  } else {
    otp = generateOtp(4);
    // convert config.jwt.resetPassword.expiresIn in minutes to milliseconds
    expiresIn = new Date(
      Date.now() + config.jwt.resetPassword.expiresIn * 60000
    );
    await saveToken(otp, userId, expiresIn, VERIFY_EMAIL);
  }

  return { otp, expiresIn: expiresIn };
};

const tokenService = {
  generateToken,
  generateAuthToken,
  generateResetPasswordOtp,
  generateVerificationOtp,
  verifyToken,
  verifyOtp,
  deleteToken,
};
module.exports = tokenService;

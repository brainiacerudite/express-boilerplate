const config = require("../config");
const {
  ACCESS,
  REFRESH,
  RESET_PASSWORD,
  VERIFY_EMAIL,
} = require("../config/tokenTypes");
const ValidationException = require("../exceptions/ValidationException");
const Token = require("../models/token.model");

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  return jwt.sign({ sub: userId, type }, secret, { expiresIn: expires });
};

const generateOtp = (length) => {
  return Math.floor(
    Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - 1)
  );
};

const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenData = await Token.create({
    token,
    userId,
    expires,
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

  if (tokenData.user.toString() !== userId) {
    throw new ValidationException(400, "Invalid OTP");
  }

  return tokenData;
};

const generateAuthToken = async (userId) => {
  const accessToken = generateToken(
    userId,
    config.jwt.access.expiresIn,
    ACCESS
  );

  const refreshToken = generateToken(
    userId,
    config.jwt.refresh.expiresIn,
    REFRESH
  );

  await saveToken(refreshToken, userId, config.jwt.refresh.expiresIn, REFRESH);

  return {
    access: {
      token: accessToken,
      expiresIn: config.jwt.access.expiresIn,
    },
    refresh: {
      token: refreshToken,
      expiresIn: config.jwt.refresh.expiresIn,
    },
  };
};

const generateResetPasswordOtp = async (userId) => {
  const otp = generateOtp(4);
  const expiresIn = new Date(
    Date.now() + config.jwt.resetPassword.expiresIn * 60 * 1000
  );

  await saveToken(otp, userId, expiresIn, RESET_PASSWORD);

  return { otp, expiresIn: expiresIn };
};

const generateVerificationOtp = async (userId) => {
  const otp = generateOtp(4);
  const expiresIn = new Date(
    Date.now() + config.jwt.resetPassword.expiresIn * 60 * 1000
  );

  await saveToken(otp, userId, expiresIn, VERIFY_EMAIL);

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

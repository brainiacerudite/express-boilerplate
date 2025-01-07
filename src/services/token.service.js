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

const generateNumericToken = (length) => {
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

const generateResetPasswordToken = async (userId) => {
  const token = generateNumericToken(4);

  await saveToken(
    token,
    userId,
    config.jwt.resetPassword.expiresIn,
    RESET_PASSWORD
  );

  return { token, expiresIn: config.jwt.resetPassword.expiresIn };
};

const generateVerificationToken = async (userId) => {
  const token = generateNumericToken(4);

  await saveToken(
    token,
    userId,
    config.jwt.verifyEmail.expiresIn,
    VERIFY_EMAIL
  );

  return { token, expiresIn: config.jwt.verifyEmail.expiresIn };
};

const tokenService = {
  generateAuthToken,
  generateResetPasswordToken,
  generateVerificationToken,
  verifyToken,
};
module.exports = tokenService;

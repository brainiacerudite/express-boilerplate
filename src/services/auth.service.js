const ValidationException = require("../exceptions/ValidationException");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

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

  return user;
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

  return user;
};

const logout = async () => {};

const forgotPassword = async (data) => {};

const resetPassword = async (data) => {};

const verifyEmail = async (data) => {};

const authService = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
module.exports = authService;

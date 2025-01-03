const asyncHandler = require("../utils/asyncHandler");

const getAllUsers = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: "Get all users" });
});

const getUser = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: "Get user" });
});

const createUser = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: "Create user" });
});

const updateUser = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: "Update user" });
});

const deleteUser = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: "Delete user" });
});

const UserController = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
module.exports = UserController;

const express = require("express");
const UserController = require("../controllers/user.controller");

const router = express.Router();

router.get("/users", UserController.getAllUsers);
router.get("/users/:id", UserController.getUser);
router.post("/users", UserController.createUser);
router.put("/users/:id", UserController.updateUser);
router.delete("/users/:id", UserController.deleteUser);

module.exports = router;

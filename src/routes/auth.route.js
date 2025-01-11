const express = require("express");
const AuthController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/otp/resend", AuthController.resendOtp);
router.post("/otp/verify", AuthController.verifyOtp);

router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", AuthController.logout);

router.post("/forgot-password", AuthController.forgotPassword);
router.post("/forgot-password/verify", AuthController.verifyForgotPasswordOtp);
router.post("/reset-password/:token", AuthController.resetPassword);

module.exports = router;

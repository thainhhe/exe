const express = require("express");
const router = express.Router();

const controller = require("../../controller/client/user.controller");
const validateUser = require("../../validate/Client/user.validate");
router.get("/", controller.index);
router.get("/info/:userId", controller.getUserById);
router.get("/:tokenUser", controller.verifyTokenByToken);
router.post("/register", validateUser.registerPost, controller.registerPost);
router.post("/login",controller.loginPost);
router.post("/google-login", controller.googleLoginPost);
router.post("/password/forgot",controller.forgotpassword);
router.post("/password/otp",controller.OTPPassword);
router.post("/password/reset",controller.resetPassword);
module.exports = router;

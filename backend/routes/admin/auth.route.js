const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/auth.controller");

// router.get("/login", controller.login);
router.post("/loginPost", controller.loginPost);
router.get("/account/:accountId", controller.getAccountById);
// New route for token verification
router.get("/:token", controller.verifyTokenByToken); // Add this line
router.post("/verify-token", controller.verifyToken)
module.exports = router;
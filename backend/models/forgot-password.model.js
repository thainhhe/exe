const mongoose = require("mongoose");

const generate = require("../helpers/generateToken");

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expireAt: {
      type: Date,
      expires: 300,
    },
  },
);
// Tham số thứ 3 trongt phần này là tên của collection trong database product-management
const User = mongoose.model(
  "FprgotPassword",
  forgotPasswordSchema,
  "forgot-password"
);
module.exports = User;

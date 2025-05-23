const mongoose = require("mongoose");

const giftSchema = new mongoose.Schema(
  {
    name: String,
    status: Boolean,
  },
  {
    // B24 phút 44 trở đi
    timestamps: true,
  }
);
// Tham số thứ 3 trongt phần này là tên của collection trong database product-management
const gift = mongoose.model("Gift", giftSchema, "gift");
module.exports = gift;

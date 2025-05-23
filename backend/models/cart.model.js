const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user_id: String,
    products: [
      {
        product_id: String,
        quantity: Number,
      },
    ],
  },
  {
    // B24 phút 44 trở đi
    timestamps: true,
  }
);
// Tham số thứ 3 trongt phần này là tên của collection trong database product-management
const Cart = mongoose.model("Cart", cartSchema, "Carts");
module.exports = Cart;

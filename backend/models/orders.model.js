const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user_id: String,
    userInfo: {
      email: String,
      fullname: String,
      phone: String,
      address: String,
    },

    products: [
      {
        product_id: String,
        quantity: Number,
        price: Number,
        discountPercentage: Number,
      },
    ],
    paymentMethod: String,
    statusPayment: String,
    statusOrders:String,
    total: Number,
    updatedBy: [
      {
        account_id: String,
        updatedAt: Date,
        changes: Object, // To store changes made during the update
      },
    ],
  },
  
  {
    // B24 phút 44 trở đi
    timestamps: true,
  }
);
// Tham số thứ 3 trongt phần này là tên của collection trong database product-management
const Order = mongoose.model("Order", orderSchema, "orders");
module.exports = Order;

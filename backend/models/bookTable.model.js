const mongoose = require("mongoose");

const bookTableSchema = new mongoose.Schema(
  {
    table_id: String,
    user_id: String,
    timeBook: String,
    dateBook: String,
    quantityUser: Number,
    gift: String,
    status: Boolean,
  },
  {
    // B24 phút 44 trở đi
    timestamps: true,
  }
);
// Tham số thứ 3 trongt phần này là tên của collection trong database product-management
const bookTable = mongoose.model("BookTable", bookTableSchema, "bookTable");
module.exports = bookTable;

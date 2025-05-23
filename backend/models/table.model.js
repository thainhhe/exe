const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
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
const table = mongoose.model("Table", tableSchema, "table");
module.exports = table;

const mongoose = require("mongoose");


const generate = require('../helpers/generateToken')

const accountSchema = new mongoose.Schema({
  fullName: String,
  email:String,
  password: String,
  token: {
    type: String,
    default: generate.generateToken(20)
  },
  phone:String,
  avatar:String,
  role_id: String,
  status:String,
  deleted: {
    type: Boolean,
    default: false
  },
  deleteAt:Date
}, {
  // B24 phút 44 trở đi
  timestamps: true
});
// Tham số thứ 3 trongt phần này là tên của collection trong database product-management
const Product = mongoose.model("Account", accountSchema, "accounts");
module.exports = Product;

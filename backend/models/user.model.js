const mongoose = require("mongoose");


const generate = require('../helpers/generateToken')

const userSchema = new mongoose.Schema({
  fullName: String,
  email:String,
  password: String,
  tokenUser: {
    type: String,
    default: generate.generateToken(20)
  },
  phone:String,
  avatar:String,
  status:{
    type:String,
    default:"active"
  },
  address:String,
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
const User = mongoose.model("Users", userSchema, "users");
module.exports = User;

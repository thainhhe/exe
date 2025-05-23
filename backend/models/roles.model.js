const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  title: String,
  description: String,
  permission: {
    type: Array,
    default: []
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedBy: {
    account_id: String,
    deletedAt: Date,
  },
  updatedBy: [
    {
      account_id: String,
      updatedAt: Date,
      changes: Object, // To store changes made during the update
    },
  ],
  createdBy: {
    account_id: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
 
}, 
)
// Tham số thứ 3 trongt phần này là tên của collection trong database product-management
const Role = mongoose.model("Role", roleSchema, "roles");
module.exports = Role;

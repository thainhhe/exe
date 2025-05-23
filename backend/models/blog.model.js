const mongoose = require("mongoose");
var slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const blogSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    // B24 phút 44 trở đi
    timestamps: true
  }

);
// Tham số thứ 3 trongt phần này là tên của collection trong database product-management
const Blog = mongoose.model("Blog", blogSchema, "blogs");
module.exports = Blog;

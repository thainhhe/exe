const Blog = require("../../models/blog.model");

module.exports.index = async (req, res) => {
  try {
    const allBlog = await Blog.find({ 
      deleted: false, 
      status: "active" 
    });
    res.json({
      recordBlog: allBlog
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving blogs" });
  }
};

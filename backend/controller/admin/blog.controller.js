const Blog = require("../../models/blog.model");


// module.exports.createBlog = async (req, res) => {
//     const{
//         title,
//         description,
//         thumbnail,
//         status,
//         position,
//         deleted}
//         = req.body;
//   try {
//     const blog = new Blog(req.body);
//   // console.log(product);

//   await blog.save();
//     res.json("success"); // Gửi kết quả về client (nếu cần)
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error retrieving blog" });
//   }
// };

module.exports.createBlog = async (req, res) => {

  if (req.body.position === "") {
    const x = await Blog.countDocuments();
    req.body.position = x + 1; // Tự động tăng vị trí
  } else {
    req.body.position = Number(req.body.position);
  }

  // Xử lý thumbnail
  if (req.file) {
    // Đường dẫn đến file đã upload
    req.body.thumbnail = `/uploads/${req.file.filename}`; // Lưu trữ đường dẫn vào req.body
  }

  try {
    const blog = new Blog(req.body);
    // console.log(product);

    await blog.save();
    res.json("success"); // Gửi kết quả về client (nếu cần)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving blog" });
  }
};

module.exports.listBlog = async (req, res) => {
  try {
    const allBlog = await Blog.find({deleted: false});
    res.json({
      recordBlog: allBlog
    }); // Gửi kết quả về client (nếu cần)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving orders" });
  }
};

module.exports.editPatch = async (req, res) => {
  console.log("req.body:", req.body);

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Chuẩn bị dữ liệu cập nhật
    const updatedData = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      position: req.body.position === "" ? 
        (await Blog.countDocuments()) + 1 : 
        Number(req.body.position)
    };

    // Xử lý thumbnail nếu có file mới upload
    if (req.file) {
      updatedData.thumbnail = `/uploads/${req.file.filename}`;
    }

    // Chuẩn bị thông tin cập nhật
    const updatedBy = {
      updatedAt: new Date(),
      changes: {}
    };

    // Theo dõi những thay đổi
    for (const key in updatedData) {
      if (updatedData[key] !== blog[key]) {
        updatedBy.changes[key] = {
          from: blog[key],
          to: updatedData[key]
        };
      }
    }

    // Cập nhật blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        $set: updatedData,
        $push: { updatedBy: updatedBy }
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Blog updated successfully",
      data: updatedBlog
    });

  } catch (error) {
    console.error("Error in editPatch:", error);
    return res.status(500).json({
      message: "Error updating blog",
      error: error.message
    });
  }
};


// Xử lý thay đổi trạng thái
module.exports.changeStatusBlog = async (req, res) => {
  const { status, id } = req.params;

  try {
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    // Cập nhật trạng thái
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        $set: { status: status },
        $push: {
          updatedBy: {
            updatedAt: new Date(),
            changes: {
              status: {
                from: blog.status,
                to: status
              }
            }
          }
        }
      },
      { new: true }
    );

    return res.json({
      message: "Update status successfully",
      data: updatedBlog
    });

  } catch (error) {
    console.error("Error in changeStatusBlog:", error);
    return res.status(500).json({
      message: "Error changing blog status",
      error: error.message
    });
  }
};

// Xử lý xóa blog
module.exports.deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    // Tìm blog cần xóa
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found" 
      });
    }

    console.log("Updating blog with deleted status..."); // Log để debug

    // Cập nhật trạng thái deleted
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        $set: { deleted: true },
        $push: {
          updatedBy: {
            updatedAt: new Date(),
            changes: {
              deleted: {
                from: false,
                to: true
              }
            }
          }
        }
      },
      { new: true }
    );

    console.log("Updated blog:", updatedBlog); // Log để debug

    return res.json({
      message: "Delete blog successfully",
      data: updatedBlog
    });

  } catch (error) {
    console.error("Error in deleteItem:", error);
    return res.status(500).json({
      message: "Error deleting blog",
      error: error.message 
    });
  }
};
const ProductCategory = require("../../models/product-category.model");
const systemconfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");
const Account = require("../../models/account.model");
module.exports.index = async (req, res) => {
  const records = await ProductCategory.find({});
  console.log(records);

  // const newRecords = createTreeHelper.tree(records);
  const newRecords = createTreeHelper.tree(
    records.map((record) => record.toObject({ virtuals: true }))
  );
  for (const product of newRecords) {
    const account = await Account.findOne({
      _id: product.createdBy.account_id,
    });
    console.log(account);
    if (account) {
      product.accountFullName = account.fullName;
    }
  }

  console.log(newRecords);
  res.json({
    recordsCategory: newRecords,
  });
};

module.exports.createUsePost = async (req, res) => {
  console.log(res.locals.role.permission);
  const permission = res.locals.role.permission;
  const thumbnail = req.file ? req.file.filename : "";
  console.log("req.body", req.body);
  console.log(req.file);
  console.log(thumbnail);
  if (permission.includes("products-category_create")) {
    // Cài đặt vị trí nếu chưa được cung cấp
    if (req.body.position === "") {
      const x = await ProductCategory.countDocuments();
      req.body.position = x + 1; // Tự động tăng vị trí
    } else {
      req.body.position = Number(req.body.position);
    }

    // Xử lý thumbnail
    if (req.file) {
      // Đường dẫn đến file đã upload
      req.body.thumbnail = `/uploads/${req.file.filename}`; // Lưu trữ đường dẫn vào req.body
    }

    console.log(req.body.thumbnail);

    req.body.createdBy = {
      account_id: res.locals.user.id,
      createdAt: new Date(),
    };
    // Tạo danh mục
    const category = new ProductCategory(req.body);
    console.log(category);
    await category.save();
    req.flash("success", "Create products successfully");
    res.redirect(`${systemconfig.prefixAdmin}/products-category`);
  } else {
    res.json({
      message: "Error",
    });
    return;
  }
};

module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  try {
    // Update the parent category
    const result = await ProductCategory.updateOne(
      { _id: id },
      { status: status }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Product not found or status unchanged." });
    }

    // Find child categories and update their status
    const children = await ProductCategory.find({ parent_id: id }); // Assuming you have a `parentId` field to identify child categories
    console.log(children);
    await ProductCategory.updateMany(
      { parent_id: id },
      { status: status } // Update status for all children
    );
 
    // Optionally, fetch the updated parent category to send back
    const updatedParentCategory = await ProductCategory.findById(id);
    const updatedChildren = await ProductCategory.find({ parent_id: id });
    console.log(updatedParentCategory)
    console.log(updatedChildren)

    res.json({
      message: "Cập nhật trạng thái thành công!",
      recordsCategory: {
        recordsCategory: updatedParentCategory,
      },
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi cập nhật trạng thái." });
  }
};

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const find = {
      deleted: false,
      _id: id,
    };
    const product = await ProductCategory.findOne(find).exec();
    console.log("productById: ", product);

    const records = await ProductCategory.find({
      deleted: false,
    });

    const newRecords = createTreeHelper.tree(
      records.map((record) => record.toObject({ virtuals: true }))
    );
    res.render("admin/pages/products-category/edit.pug", {
      pageTitle: "Edit danh mục sản phẩm",
      product: product,
      recordsCategory: newRecords,
    });
  } catch (error) {
    res.redirect(`${systemconfig.prefixAdmin}/products-category`);
  }
};

module.exports.editUsePost = async (req, res) => {
  console.log("req.body:", req.body);

  if (req.body.position == "") {
    const x = await ProductCategory.countDocuments();
    // console.log(x)
    req.body.position = x + 1;
  } else {
    req.body.position = Number(req.body.position);
  }
  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  try {
    await ProductCategory.updateOne({ _id: req.params.id }, req.body);
    console.log("Success");
  } catch (error) {
    console.log(error);
  }

  res.redirect(`${systemconfig.prefixAdmin}/products-category`);
};

module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const find = {
      deleted: false,
      _id: id,
    };
    // const product = await Product.findById(id).exec();
    const category = await ProductCategory.findOne(find).exec();
    console.log("productById: ", category);
    //  res.send("ok")
    res.json({
      detailCategory: category,
    });
  } catch (error) {
    res.redirect(`${systemconfig.prefixAdmin}/products-category`);
  }
};

module.exports.deleteItem = async (req, res) => {
  // console.log("req.params", req.params);
  const id = req.params.id;
  console.log("id: ", id);

  // -----------Xoá vĩnh viễn------------
  // await Product.deleteOne({ _id: id }, { deleted: "true" });

  // ----------Xoá mềm---------------
  // await Product.updateOne(
  //   { _id: id },
  //   {
  //     deleted: !(Product.deleted),
  //     deleteAt: new Date(),
  //   }
  // );
  // req.flash("success", `Update products successfully `);
  // res.redirect("back");

  try {
    // Tìm sản phẩm trước để lấy trạng thái hiện tại
    const category = await ProductCategory.findById(id);

    console.log(category.deleted);
    if (!category) {
      req.flash("error", "Product not found");
      return res.redirect("back");
    }

    // Cập nhật trạng thái deleted và deleteAt
    await ProductCategory.updateOne(
      { _id: id },
      {
        deleted: !category.deleted,
        status: "inactive",
        deleteAt: new Date(),
      }
    );

    res.json({
      message: "Deleted sản phẩm thành công!",
      recordsCategory: category, // Send the updated product details
    });
  } catch (error) {
    console.error("Error updating deleted:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi deleted trạng thái." });
  }
};

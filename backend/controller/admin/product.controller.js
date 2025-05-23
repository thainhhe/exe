const Product = require("../../models/product.model");
const systemconfig = require("../../config/system");
const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree");
const Account = require("../../models/account.model");

// [GET]: /admin/products-
module.exports.index = async (req, res) => {
  // const products = await Product.find();
  const products = await Product.find();

  console.log(products);

  for (const product of products) {
    const account = await Account.findOne({
      _id: product.createdBy.account_id,
    });
    if (account) {
      product._doc.accountFullName = account.fullName;
    }
  }

  res.json({
    pageTitle: "Danh sách sản phẩm",
    recordsProduct: products,
  });

  // -----------------------END Phần sort--------------------------
};

// --------------------------/admin/change-status/:status/:id-------------------------------------------
module.exports.changeStatus = async (req, res) => {
  const { status, id } = req.params;

  console.log(id);
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  try {
    // Find the product first to check if it is deleted
    const product = await Product.findById(id);

    // If the product does not exist or is deleted, return an error response
    if (!product || product.deleted) {
      return res.status(400).json({
        message:
          "Product not found or has been deleted. Status cannot be changed.",
      });
    }

    // Proceed with updating the status
    const result = await Product.updateOne(
      { _id: id },
      {
        status: status,
        $push: { updatedBy: updatedBy },
      }
    );

    // Check if any documents were modified
    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Product not found or status unchanged." });
    }

    // Fetch the updated product to send back to the frontend
    // const updatedProduct = await Product.findById(id);
    const updatedProduct = await Product.find();

    res.json({
      recordsProduct: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi cập nhật trạng thái." });
  }
};

// -----------------------------------[DELETE]: /admin/products/delete:id-------------------
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
    const product = await Product.findById(id);

    console.log(product);
    console.log(product.deleted);
    if (!product) {
      req.flash("error", "Product not found");
      return res.redirect("back");
    }

    // Cập nhật trạng thái deleted và deleteAt
    await Product.updateOne(
      { _id: id },
      {
        deleted: !product.deleted, // Đảo trạng thái deleted
        status: "inactive",
        deletedBy: {
          account_id: res.locals.user.id,
          deletedAt: new Date(),
        }, // Cập nhật thời gian xóa
      }
    );

    res.json({
      message: "Deleted sản phẩm thành công!",
      recordsProduct: product, // Send the updated product details
    });
  } catch (error) {
    console.error("Error updating deleted:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi deleted trạng thái." });
  }
};

// -------------------------[POST]/admin/producs/create----------------

module.exports.createUsePost = async (req, res) => {
  // console.log("req.body:", req.body);
  // console.log(req.file);
  // Cài đặt vị trí nếu chưa được cung cấp
  if (req.body.position === "") {
    const x = await Product.countDocuments();
    req.body.position = x + 1; // Tự động tăng vị trí
  } else {
    req.body.position = Number(req.body.position);
  }

  // Xử lý thumbnail
  if (req.file) {
    // Đường dẫn đến file đã upload
    req.body.thumbnail = `/uploads/${req.file.filename}`; // Lưu trữ đường dẫn vào req.body
  }

  console.log("res.locals.user", res.locals.user);

  req.body.createdBy = {
    account_id: res.locals.user.id,
    createdAt: new Date(),
  };

  // Tạo danh mục
  const product = new Product(req.body);
  // console.log(product);

  await product.save();
  req.flash("success", "Create products successfully");
  res.redirect(`${systemconfig.prefixAdmin}/products-category`);
};

// -------------------------[PATCH]/admin/producs/edit/:id----------------

// module.exports.editPatch = async (req, res) => {
//   console.log("req.body:", req.body);

//   // Convert necessary fields to numbers
//   const {
//     price,
//     discountPercentage,
//     stock,
//     position,
//     title,
//     description,
//     product_category_id,
//     slug,
//     status,
//     featured,
//   } = req.body;

//   const updatedData = {
//     price: Number(price),
//     discountPercentage: Number(discountPercentage),
//     stock: Number(stock),
//     position:
//       position === "" ? (await Product.countDocuments()) + 1 : Number(position),
//     title,
//     description,
//     product_category_id,
//     slug,
//     status,
//     featured,
//   };

//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     // Prepare the updatedBy object
//     const updatedBy = {
//       account_id: res.locals.user.id,
//       updatedAt: new Date(), // Current timestamp
//       changes: {}, // To track the specific changes
//     };

//     // Check and assign thumbnail only if a new file is uploaded
//     if (req.file) {
//       updatedData.thumbnail = `/uploads/${req.file.filename}`;
//     } else {
//       updatedData.thumbnail = product.thumbnail; // Retain the existing thumbnail if no new file is uploaded
//     }

//     // Track changes
//     for (const key in updatedData) {
//       if (updatedData[key] !== product[key]) {
//         updatedBy.changes[key] = { from: product[key], to: updatedData[key] };
//       }
//     }

//     await Product.updateOne(
//       { _id: req.params.id },
//       {
//         $set: { ...updatedData, createdBy: product.createdBy }, // Keep original createdBy
//         $push: { updatedBy: updatedBy }, // Push the update details
//       }
//     );

//     req.flash("success", "Update products successfully");
//     return res.status(200).json({ message: "Product updated successfully" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Error updating product" });
//   }
// };

// --------------[GET]: /admin/producs/detail/:id-----------
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const find = {
      deleted: false,
      _id: id,
    };
    // const product = await Product.findById(id).exec();
    const product = await Product.findOne(find).exec();
    console.log("productById: ", product);
    //  res.send("ok")
    res.json({
      pageTitle: "Detail sản phẩm",
      detailProduct: product,
    });
  } catch (error) {
    res.redirect(`admin/products`);
  }
};

module.exports.editPatch = async (req, res) => {
  const {
    price,
    discountPercentage,
    stock,
    position,
    title,
    description,
    product_category_id,
    slug,
    status,
    featured,
    flashSaleStart,
    flashSaleEnd,
  } = req.body;

  const updatedData = {
    price: Number(price),
    discountPercentage: Number(discountPercentage),
    stock: Number(stock),
    position:
      position === "" ? (await Product.countDocuments()) + 1 : Number(position),
    title,
    description,
    product_category_id,
    slug,
    status,
    featured,
    flashSaleStart,
    flashSaleEnd,
  };

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
      changes: {},
    };

    if (req.file) {
      updatedData.thumbnail = `/uploads/${req.file.filename}`;
    } else {
      updatedData.thumbnail = product.thumbnail;
    }

    // Track changes
    for (const key in updatedData) {
      if (updatedData[key] !== product[key]) {
        updatedBy.changes[key] = { from: product[key], to: updatedData[key] };
      }
    }

    await Product.updateOne(
      { _id: req.params.id },
      {
        $set: { ...updatedData, createdBy: product.createdBy },
        $push: { updatedBy: updatedBy },
      }
    );

    req.flash("success", "Update products successfully");
    return res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating product" });
  }
};

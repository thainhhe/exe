const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree");

// -------------------------[GET]: /admin/products-------------------------------
module.exports.index = async (req, res) => {
  try {
    const products = await Product.find({
      status: "active",
      deleted: false,
    }).sort({ position: "desc" });

    const newProducts = products.map((item) => {
      item.priceNew = (
        (item.price * (100 - item.discountPercentage)) /
        100
      ).toFixed(0);
      return item;
    });

    const productCategory = await ProductCategory.find({
      status: "active",
      deleted: false,
    });

    // const newRecords = createTreeHelper.tree(records);
    const newproductCategory = createTreeHelper.tree(
      productCategory.map((record) => record.toObject({ virtuals: true }))
    );

    res.status(200).json({
      recordsCategory: newproductCategory,
      recordsProduct: newProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
module.exports.detail = async (req, res) => {
  console.log(req.params.slugProduct);
  try {
    const find = {
      status: "active",
      deleted: false,
      slug: req.params.slugProduct,
    };

    const products = await Product.findOne(find);
    console.log("Found product:", products);

    // Check if the product exists
    if (!products) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("Product Category ID:", products.product_category_id);

    // Fetch all categories
    const records = await ProductCategory.find({
      status: "active",
      deleted: false,
    });
    console.log("All categories:", records);

    // Transform categories into a tree structure
    const newRecords = createTreeHelper.tree(
      records.map((record) => record.toObject({ virtuals: true }))
    );
    console.log("Categorized tree:", newRecords);

    // Find the category that corresponds to the product's category ID
    const findCategory = (categories, id) => {
      for (const category of categories) {
        if (category._id.toString() === id.toString()) {
          return category; // Return the category if found
        }
        // Recursively search in child categories
        if (category.children && category.children.length > 0) {
          const found = findCategory(category.children, id);
          if (found) return found; // Return found category from children
        }
      }
      return null; // If not found, return null
    };

    // Find the specific category for the product
    const category = findCategory(newRecords, products.product_category_id);
    console.log("Found category:", category);

    // Attach the found category to the product
    products.category = category ? category : null;

    res.status(200).json({
      products: products,
      category: category
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports.getProductByid = async (req, res) => {
  const {id} = req.params;
  try {
    const find = {
      status: "active",
      _id: id,
    };

    const products = await Product.findOne(find);
    console.log("Found product:", products);

    // Check if the product exists
    if (!products) {
      return res.status(404).json({ error: "Product not found" });
    }
    console.log("Product Category ID:", products.product_category_id);
    res.status(200).json({
      productById: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
module.exports.updateProductQuantity = async (req, res) => {
  const { productId, quantitySold } = req.body;

  try {
      // Find the product by its ID
      const product = await Product.findById(productId);
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      // Check if there's enough stock
      if (product.stock < quantitySold) {
          return res.status(400).json({ message: 'Not enough stock available' });
      }

      // Decrease the product stock by the quantity sold
      product.stock -= quantitySold;

      // Save the updated product
      await product.save();

      res.status(200).json({ message: 'Product quantity updated successfully', product });
  } catch (error) {
      console.error('Error updating product quantity:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};


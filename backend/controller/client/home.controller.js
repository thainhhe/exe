const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
  try {

    // Sản phẩm nổi bật
    const productFeatured = await Product.find({
      deleted: false,
      featured: "1",
      status: "active",
    }).limit(4);

    console.log(productFeatured);


    // Sản phẩm mới nhất 
    const newProductFeatured =  await Product.find({
      deleted: false,
      status: "active",
    }).limit(4). sort({position: "desc"});
    res.json({
      productFeatured: productFeatured,
      newProductFeatured: newProductFeatured,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

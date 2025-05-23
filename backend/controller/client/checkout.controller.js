const Order = require("../../models/orders.model");
module.exports.index = (req, res) => {};

module.exports.order = (req, res) => {
  try {
    const { user_id, userInfo, products,paymentMethod,statusPayment,statusOrders,total } = req.body;
    console.log({ user_id, userInfo, products });
    const order = new Order({
      user_id,
      userInfo,
      products,
      paymentMethod,
      statusPayment,
      statusOrders,
      total
    });
    order.save();
    res.status(200).json({ message: "Đơn hàng đã được tạo thành công." });
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi tạo đơn hàng." });
  }
};

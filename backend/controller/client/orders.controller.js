const Order = require("../../models/orders.model");
module.exports.index = async (req, res) => {
  try {
    const allOrder = await Order.find({});
    console.log(allOrder);
    res.json(allOrder); // Gửi kết quả về client (nếu cần)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving orders" });
  }
};

module.exports.orderByUserId = async (req, res) => {
  const { user_id } = req.params; // Lấy đúng giá trị user_id từ params

  console.log(user_id);
  try {
    const orderByUserId = await Order.find({
      user_id: user_id,
      statusOrders:"Wait"
    });
    console.log(orderByUserId);
    res.json({
      OrderByUserId: orderByUserId,
    }); // Gửi kết quả về client nếu cần
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving orders" });
  }
};

module.exports.historyOrderByUserId = async (req, res) => {
    const { user_id } = req.params; // Lấy đúng giá trị user_id từ params
  
    console.log(user_id);
    try {
      const orderByUserId = await Order.find({
        user_id: user_id, 
        statusPayment:"active",
        statusOrders:"Done"
      });
      console.log(orderByUserId);
      res.json({
        OrderByUserId: orderByUserId,
      }); // Gửi kết quả về client nếu cần
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving orders" });
    }
  };

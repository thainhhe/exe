const Order = require("../../models/orders.model");
module.exports.index = async (req, res) => {
  try {
    const allOrder = await Order.find({});
    console.log(allOrder);
    res.json({
      recordOrders: allOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving orders" });
  }
};
module.exports.changePayment = async (req, res) => {
  const { status, id } = req.params;

  console.log({status,id})
  console.log(res.locals.user.id)
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };
  console.log(updatedBy)
  try {

    const result = await Order.updateOne(
      {
        _id: id,
      },
      {
        statusPayment: status,
        $push: { updatedBy: updatedBy },
      }
    );
    console.log(result)
   // Check if any documents were modified
   if (result.modifiedCount === 0) {
    return res
      .status(404)
      .json({ message: "Product not found or status unchanged." });
  }

  // Fetch the updated product to send back to the frontend
  const updatedOrder = await Order.find();
  console.log(updatedOrder)
    res.json({
      recordOrders: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving orders" });
  }
};
module.exports.changeOrder = async (req, res) => {
  const { status, id } = req.params;

  console.log({status,id})
  console.log(res.locals.user.id)
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };
  console.log(updatedBy)
  try {

    const result = await Order.updateOne(
      {
        _id: id,
      },
      {
        statusOrders: status,
        $push: { updatedBy: updatedBy },
      }
    );
    console.log(result)
   // Check if any documents were modified
   if (result.modifiedCount === 0) {
    return res
      .status(404)
      .json({ message: "Product not found or status unchanged." });
  }

  // Fetch the updated product to send back to the frontend
  const updatedOrder = await Order.find();
  console.log(updatedOrder)
    res.json({
      recordOrders: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving orders" });
  }
};

// module.exports.orderByUserId = async (req, res) => {
//   const { user_id } = req.params; // Lấy đúng giá trị user_id từ params

//   console.log(user_id);
//   try {
//     const orderByUserId = await Order.find({
//       user_id: user_id,
//       status: "pending",
//     });
//     console.log(orderByUserId);
//     res.json({
//       OrderByUserId: orderByUserId,
//     }); // Gửi kết quả về client nếu cần
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error retrieving orders" });
//   }
// };

// module.exports.historyOrderByUserId = async (req, res) => {
//     const { user_id } = req.params; // Lấy đúng giá trị user_id từ params

//     console.log(user_id);
//     try {
//       const orderByUserId = await Order.find({
//         user_id: user_id,
//         status: "active",
//       });
//       console.log(orderByUserId);
//       res.json({
//         OrderByUserId: orderByUserId,
//       }); // Gửi kết quả về client nếu cần
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Error retrieving orders" });
//     }
//   };

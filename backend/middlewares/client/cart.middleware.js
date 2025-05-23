const Cart = require("../../models/cart.model");
const User = require("../../models/user.model");

module.exports.cartId = async (req, res, next) => {
  if (res.locals.cart) {
    return next(); // Skip if the cart is already available
  }

  const tokenUser = req.cookies.tokenUser;
  if (tokenUser) {
    try {
      const user = await User.findOne({ tokenUser });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.locals.user = user;

      // Use findOneAndUpdate with upsert: true to handle the cart creation atomically
      const cart = await Cart.findOneAndUpdate(
        { user_id: user._id },
        { $setOnInsert: { user_id: user._id, products: [] } }, // Set user_id and empty products array if cart is created
        { new: true, upsert: true } // Create a new cart if it doesn't exist
      );

      res.locals.cart = cart;
    } catch (error) {
      console.error("Error finding or creating cart:", error);
      return res.status(500).json({ message: "An error occurred" });
    }
  } else {
    // console.log("No token user");
  }

  next();
};

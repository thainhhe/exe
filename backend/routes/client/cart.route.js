const express = require("express");
const router = express.Router();

const controller = require("../../controller/client/cart.controller")

router.get("/:userId", controller.getCartByUserId);
router.post("/add/:userId", controller.addToCart);

router.put("/update/:userId/:productId", controller.updateProductQuantity);

// Tăng số lượng sản phẩm
router.put("/increase/:userId/:productId", controller.increaseQuantity);

// Giảm số lượng sản phẩm
router.put("/decrease/:userId/:productId", controller.decreaseQuantity);

// Xóa một sản phẩm khỏi giỏ hàng
router.delete("/remove/:userId/:productId", controller.removeProductFromCart);

// Xóa tất cả sản phẩm khỏi giỏ hàng
router.delete("/clear/:userId", controller.clearCart);

router.post("/removeSelected/:user_id", controller.removeSelected);

module.exports = router
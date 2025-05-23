const express = require("express");
const router = express.Router();

const controller = require("../../controller/admin/orders.controller")

router.get("/",controller.index);
router.patch("/change-payment/:status/:id",controller.changePayment);
router.patch("/change-order/:status/:id",controller.changeOrder);
module.exports = router
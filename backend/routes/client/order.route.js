const express = require("express");
const router = express.Router();

const controller = require("../../controller/client/orders.controller")

router.get("/",controller.index);
router.get("/userOrder/:user_id",controller.orderByUserId);
router.get("/historyOrder/:user_id",controller.historyOrderByUserId);



module.exports = router
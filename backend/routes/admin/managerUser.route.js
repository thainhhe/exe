const express = require("express");
const router = express.Router();

const controller = require("../../controller/admin/managerUser.controller")

router.get("/",controller.index);

router.patch("/change-status/:status/:id", controller.changeStatusUser);


module.exports = router
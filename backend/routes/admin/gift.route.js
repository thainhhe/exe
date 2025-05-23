const express = require("express");
const router = express.Router();

const controller = require("../../controller/admin/gift.controller")

router.get('/', controller.getListGift);

router.post(
    "/create",
    controller.createGift
  );
router.patch('/:id', controller.updateGift);
router.patch('/status/:id', controller.updateGiftStatus);
module.exports = router
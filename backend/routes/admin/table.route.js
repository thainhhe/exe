const express = require("express");
const router = express.Router();

const controller = require("../../controller/admin/table.controller")

router.get('/', controller.getTables);

router.post(
    "/create",
    controller.createTable
  );
  
router.get('/:id', controller.getTableById);
router.patch('/:id', controller.updateTable);
router.patch('/status/:id', controller.updateTableStatus);

router.get('/getBooking/:id', controller.getBookingByTableId);
router.patch('/getBooking/status/:id', controller.updateBookingStatus);
module.exports = router
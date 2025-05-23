const express = require("express");
const router = express.Router();

const controller = require("../../controller/client/message.controller")


router.post('/', controller.addMessage);

router.get('/:chatId', controller.getMessages);


module.exports = router;
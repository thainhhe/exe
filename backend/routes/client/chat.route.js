const express = require("express");
const router = express.Router();

const controller = require("../../controller/client/chat.controller")

// router.get("/", controller.listChat);
router.post('/', controller.createChat);
router.get('/:userId', controller.userChats);
router.get('/find/:firstId/:secondId',controller.findChat);


module.exports = router;
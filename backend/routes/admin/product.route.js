const express = require("express");
const router = express.Router();

const multer = require("multer");
const storageMulter = require("../../helpers/storageMulter");
const upload = multer({ storage: storageMulter() }); // Use the storage configuration
console.log(upload)
const controller = require("../../controller/admin/product.controller");
const validate = require("../../validate/admin/productvalidate");


router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.delete("/delete/:id", controller.deleteItem);


router.post(
  "/create",
  upload.single("thumbnail"),
  validate.createPost,
  controller.createUsePost
);



router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  validate.createPost,
  controller.editPatch
);

router.get("/detail/:id", controller.detail);
module.exports = router;

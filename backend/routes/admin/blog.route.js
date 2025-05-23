const express = require("express");
const router = express.Router();

const multer = require("multer");
const storageMulter = require("../../helpers/storageMulter");
const upload = multer({ storage: storageMulter() }); // Use the storage configuration
console.log(upload)
const validate = require("../../validate/admin/productvalidate");
const controller = require("../../controller/admin/blog.controller")

router.get("/listBlog",controller.listBlog);

router.patch("/change-status/:status/:id", controller.changeStatusBlog);

router.delete("/delete/:id", controller.deleteItem);


router.post(
  "/create",
  upload.single("thumbnail"),
  validate.createPost,
  controller.createBlog
);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  validate.createPost,
  controller.editPatch
);

module.exports = router
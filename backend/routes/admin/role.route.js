// const express = require("express");
// const router = express.Router();

// const multer = require("multer");
// const storageMulter = require("../../helpers/storageMulter");
// const upload = multer({ storage: storageMulter() }); // Use the storage configuration

// const controller = require("../../controller/admin/role.controller");
// const validate = require("../../validate/admin/productvalidate");

// router.get("/", controller.index);
// router.get("/create", controller.create);
// router.post("/create", controller.createPost);
// // edit....

// // --end edit

// router.get("/permissions", controller.permissions);
// router.patch("/permissions", controller.permissionsPatch);
// module.exports = router;

const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/role.controller");

router.get("/", controller.index);
router.post("/create", controller.createPost);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", controller.editPatch);
router.delete("/delete/:id", controller.deleteItem);


router.get("/permissions", controller.permissions);
router.patch("/permissions", controller.permissionsPatch);


module.exports = router;


const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const productCategoryRoutes = require("./product-category.route");
const rolesRoutes = require("./role.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route")
const orderRoutes = require("./order.route")
const blogRoutes = require("./blog.route")
const managerUserRoutes = require("./managerUser.route")


const orderRoute = require("./order.route")
const tableRoute = require("./table.route")
const giftRoute = require("./gift.route")
const authMiddleware = require("../../middlewares/admin/auth.middleware")
const systemConfig = require("../../config/system")
module.exports = (app) => {

  const PATH_ADMIN =systemConfig.prefixAdmin;
  // app.use(PATH_ADMIN+"/dashboard", dashboardRoutes);
  // app.use(PATH_ADMIN+"/products-category",productCategoryRoutes);
  // app.use(PATH_ADMIN+"/products",productRoutes);
  // app.use(PATH_ADMIN+"/roles",rolesRoutes);
  // app.use(PATH_ADMIN+"/accounts",accountRoutes);
  // app.use(PATH_ADMIN+"/auth", authRoutes);

  app.use(PATH_ADMIN+"/dashboard",authMiddleware.requireAuth, dashboardRoutes);
  app.use(PATH_ADMIN+"/products-category", authMiddleware.requireAuth,productCategoryRoutes);
  app.use(PATH_ADMIN+"/products", authMiddleware.requireAuth,productRoutes);
  app.use(PATH_ADMIN+"/roles", authMiddleware.requireAuth,rolesRoutes);
  app.use(PATH_ADMIN+"/accounts", authMiddleware.requireAuth,accountRoutes);
  app.use(PATH_ADMIN+"/orders", authMiddleware.requireAuth,orderRoute);
  app.use(PATH_ADMIN+"/table",tableRoute);
  app.use(PATH_ADMIN+"/gift",giftRoute);

  app.use(PATH_ADMIN+"/auth", authRoutes);
  app.use(PATH_ADMIN+"/order", authMiddleware.requireAuth,orderRoutes);
  app.use(PATH_ADMIN+"/blog",blogRoutes);
  app.use(PATH_ADMIN+"/managerUser",managerUserRoutes);


};

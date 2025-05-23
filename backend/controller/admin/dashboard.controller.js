// [GET]: /admin/dashboard

module.exports.dashboard = (req, res) => {
    // res.send("Trang tổng quan")
    // Lấy thông tin từ middleware
  const user = res.locals.user;
  const role = res.locals.role;
    res.json({
      pageTitle:"Trang tổng quan",
    });
  }
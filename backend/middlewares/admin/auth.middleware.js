const Account = require("../../models/account.model");
const Role = require("../../models/roles.model");
module.exports.requireAuth = async (req, res, next) => {
  
  console.log(req);
  console.log(req.headers);
  console.log("Cookies from request:", req.headers.cookie);

  console.log(req.cookies);
  console.log(req.cookies.token);
  const token = req.cookies.token;
  console.log(token);
  if (!req.cookies.token) {
    return res.status(401).json({ message: "Unauthorized. Không có token" });
  } else {
    console.log("req.cookies.token in page auth: ", req.cookies.token);
    const user = await Account.findOne({ token: req.cookies.token });
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized. Không có user" });
    } else {
      const role = await Role.findOne({
        _id: user.role_id,
      }).select("title permission");
      console.log(role);
      res.locals.user = user;
      res.locals.role = role;
      next();
    }
  }
};

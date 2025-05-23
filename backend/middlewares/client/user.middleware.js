const User = require("../../models/user.model");
module.exports.requireAuth = async (req, res, next) => {
  
  console.log(req);
  console.log(req.headers);
  console.log("Cookies from request:", req.headers.cookie);

  console.log(req.cookies);
  console.log(req.cookies.tokenUser);
  const token = req.cookies.tokenUser;
  console.log(token);
  if (!req.cookies.tokenUser) {
    return res.status(401).json({ message: "Unauthorized. Không có token" });
  } else {
    console.log("req.cookies.token in page auth: ", req.cookies.tokenUser);
    const user = await User.findOne({ tokenUser: req.cookies.tokenUser });
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized. Không có user" });
    } else{
      res.locals.user = user;
      next();
    }
     
    }
  }

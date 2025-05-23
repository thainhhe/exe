const md5 = require("md5");
const Account = require("../../models/account.model");
const Role = require("../../models/roles.model");
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log({ email, password });

  const accountInAdmin = await Account.findOne({
    email: email,
    deleted: false,
  });

  console.log("user", accountInAdmin);

 
  if (!accountInAdmin) {
    return res.status(404).json({ status: false, message: "User not found" });
  }
  // If the user exists, you can check the password and proceed with login logic
  const hashedPassword = md5(password); // Assuming you're hashing the password with md5
  console.log(hashedPassword);
  console.log(md5(password));
  console.log(accountInAdmin.password);
  if (accountInAdmin.password !== hashedPassword) {
    return res.status(401).json({ status: false, message: "Incorrect password" });
  }
  if (accountInAdmin.status == "inactive") {
    return res.status(401).json({ status: false, message: "Tài Khoản đã bị khoá" });
  }
  // Continue with login process (e.g., generating JWT token, session, etc.)
  console.log(accountInAdmin.token);
  res.cookie("token", accountInAdmin.token);
  const role = await Role.findOne({
    _id: accountInAdmin.role_id,
  });
  res
    .status(200)
    .json({
      message: "Login successful",
      token: accountInAdmin.token,
      accountInAdmin: accountInAdmin,
      role: role,
    });
};

module.exports.getAccountById = async (req, res) => {

  const accountId = req.params.accountId;
  console.log(accountId);
  const accountInAdmin = await Account.findById(accountId).select(
    "fullName _id"
  );
  // console.log(accountInAdmin);
  res.json({ detailAccount: accountInAdmin });
};
module.exports.verifyToken = async (req, res) => {
  const token = req.headers.authorization;

  console.log(token);
  if (!token) {
    return res
      .status(401)
      .json({ valid: false, message: "No token provided." });
  }

  try {
    const user = await Account.findOne({ token });

    if (!user) {
      return res.status(401).json({ valid: false, message: "Invalid token." });
    }

    return res.status(200).json({ valid: true });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res
      .status(500)
      .json({ valid: false, message: "Internal server error." });
  }
};

module.exports.verifyTokenByToken = async (req, res) => {
  const token = req.params.token; // Extract token from the route parameter

  if (!token) {
    return res
      .status(401)
      .json({ valid: false, message: "No token provided." });
  }

  try {
    const accountInAdmin = await Account.findOne({ token });

    const role = await Role.findOne({
      _id: accountInAdmin.role_id,
    }).select("title permission deleted");
    if (!accountInAdmin) {
      return res.status(401).json({ valid: false, message: "Invalid token." });
    }

    // Optionally return user information if needed
    return res.status(200).json({ valid: true, accountInAdmin, role });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res
      .status(500)
      .json({ valid: false, message: "Internal server error." });
  }
};

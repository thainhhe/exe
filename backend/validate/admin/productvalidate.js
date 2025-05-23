module.exports.createPost = (req, res, next) => {
  console.log("req.body.title", req.body.title);
  if (!req.body.title) {
    req.flash("error", `Please enter the title`);
    res.redirect("back");
    return;
  }

//   Nếu chính xác rồi thì phải dùng next() để đi tiếp
  console.log("OKKKK");
  next();
};

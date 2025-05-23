const md5 = require('md5');
const Account = require("../../models/account.model")

module.exports.index = async (req,res) =>{
    const records = await Account.find();
    res.json({
        recordsAccount: records
    })
}

module.exports.createPost = async (req, res) => {
    console.log(req.body)
    console.log(req.file); 
    req.body.password = md5(req.body.password )
    try {
      const record = new Account(req.body);
      await record.save();
      res.status(201).json({ message: "Account created successfully", record });
    } catch (error) {
      res.status(500).json({ message: "Error creating role", error });
    }
  };
module.exports.changeStatus = async (req, res) => {
    const { status, id } = req.params;
    try {         
      const result = await Account.updateOne(
        { _id: id },
        { status: status }
      );
      // Nếu modifiedCountlà 0, mã trả về phản hồi có mã trạng thái là 404(Không tìm thấy)
      if (result.modifiedCount === 0) {
        return res
          .status(404)  
          .json({ message: "Account not found or status unchanged." });
      }
      const UpdateAccount = await Account.findById(id);
      res.json({  
        message: "Status updated successfully",
        recordsAccount: UpdateAccount,  
      });
    } catch (error) {
      console.error("Error updating status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
const User = require("../../models/user.model");

module.exports.index = async (req, res) => {
    const user = await User.find({
      deleted: false,
    });
    res.json({
      recordUser: user,
    });
  };

  module.exports.changeStatusUser = async (req, res) => {
    const { status, id } = req.params;
  
    try {
      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }
  
      // Cập nhật trạng thái
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          $set: { status: status },
          $push: {
            updatedBy: {
              updatedAt: new Date(),
              changes: {
                status: {
                  from: user.status,
                  to: status
                }
              }
            }
          }
        },
        { new: true }
      );
  
      return res.json({
        message: "Update status successfully",
        data: updatedUser
      });
  
    } catch (error) {
      console.error("Error in changeStatusUser:", error);
      return res.status(500).json({
        message: "Error changing user status",
        error: error.message
      });
    }
  };
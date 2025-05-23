

const ChatModel = require("../../models/chat.model"); // Adjust the path based on your file structure
const adminId = "ADMIN_USER_ID"; // Replace with the actual admin ID

module.exports.createChat = async (req, res) => {
  const newChat = new ChatModel({
    members: [req.body.userId, "6717cb83d8d0d80006427053"], // Add the userId and adminId
  });
  try {
    const result = await newChat.save();
    res.status(200).json({ message: "Chat created successfully", ChatV3: result });
  } catch (error) {
    res.status(500).json({ message: "Error creating chat", error });
  }
};


// module.exports.createChat = async (req, res) => {
//   const newChat = new ChatModel({
//     members: [req.body.senderId, req.body.receiverId],
  
//   });
//   try {
//     const result = await newChat.save();
//     res.status(200).json({ message: "Chat created successfully",ChatV3:result });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating chat", error });
//   }
// };

module.exports.userChats = async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json({
      ChatV2:chat
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.findChat = async (req, res) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat)
  } catch (error) {
    res.status(500).json(error)
  }
};

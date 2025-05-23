const  Gift =require('../../models/gift.model')

// Lấy danh sách tất cả các bàn
module.exports.getListGift = async (req, res) => {
  try {
    const gift = await Gift.find();
    res.json({
        recordGift: gift
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.createGift = async (req, res) => {
  try {
    // Lấy dữ liệu từ body của request
    const { name, status } = req.body;
    // Kiểm tra nếu dữ liệu không hợp lệ
    if (!name) {
      return res.status(400).json({ message: "Name and status are required" });
    }
    // Tạo đối tượng bàn mới
    const newGift = new Gift({
      name,
      status,
    });
    // Lưu bàn vào cơ sở dữ liệu
    const gift = await newGift.save();
    // Trả về kết quả thành công
    res.status(201).json({recordGift: gift});
  } catch (err) {
    // Trả về lỗi nếu có
    res.status(500).json({ message: err.message });
  }
};

// Lấy thông tin chi tiết gift theo ID
module.exports.getGiftById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ message: 'Table not found' });
    res.json({
        detailTable:table
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật trạng thái của gift
module.exports.updateGift = async (req, res) => {
    try {
      const { name, status } = req.body;
      const gift = await Gift.findById(req.params.id);
  
      if (!gift) return res.status(404).json({ message: "Gift not found" });
  
      // Update name and/or status if provided
      if (name) gift.name = name;
      if (status !== undefined) gift.status = status;
  
      await gift.save();
      res.json(gift);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  // Cập nhật trạng thái của bàn
  module.exports.updateGiftStatus = async (req, res) => {
    try {
      const gift = await Gift.findById(req.params.id);
      if (!gift) return res.status(404).json({ message: "Gift not found" });
  
      console.log(req.body.status);
     await Gift.updateOne(
        {
          _id: req.params.id,
        },
        {
          status: req.body.status,
        }
      );
      res.json(gift);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
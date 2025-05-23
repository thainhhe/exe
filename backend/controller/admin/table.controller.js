const Table = require("../../models/table.model");
const BookingTable = require("../../models/bookTable.model");
const bookTable = require("../../models/bookTable.model");
// Lấy danh sách tất cả các bàn
module.exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.json({
      recordTables: tables,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.createTable = async (req, res) => {
  try {
    // Lấy dữ liệu từ body của request
    const { name, status } = req.body;
    // Kiểm tra nếu dữ liệu không hợp lệ
    if (!name || !status) {
      return res.status(400).json({ message: "Name and status are required" });
    }
    // Tạo đối tượng bàn mới
    const newTable = new Table({
      name,
      status,
    });
    // Lưu bàn vào cơ sở dữ liệu
    const savedTable = await newTable.save();
    // Trả về kết quả thành công
    res.status(201).json(savedTable);
  } catch (err) {
    // Trả về lỗi nếu có
    res.status(500).json({ message: err.message });
  }
};

// Lấy thông tin chi tiết bàn theo ID
module.exports.getTableById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ message: "Table not found" });
    res.json({
      detailTable: table,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports.updateTable = async (req, res) => {
  try {
    const { name, status } = req.body;
    const table = await Table.findById(req.params.id);

    if (!table) return res.status(404).json({ message: "Table not found" });

    // Update name and/or status if provided
    if (name) table.name = name;
    if (status !== undefined) table.status = status;

    await table.save();
    res.json(table);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật trạng thái của bàn
module.exports.updateTableStatus = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ message: "Table not found" });

    console.log(req.body.status);
   await Table.updateOne(
      {
        _id: req.params.id,
      },
      {
        status: req.body.status,
      }
    );
    res.json(table);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports.getBookingByTableId = async (req, res) => {
  try {
    const bookingTable = await BookingTable.find({ table_id: req.params.id });
    if (!bookingTable || bookingTable.length === 0) {
      return res.status(404).json({ message: "No booking found for this table" });
    }
    res.json({
      recordBookingTables: bookingTable,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports.updateBookingStatus = async (req, res) => {
  try {
    const bookingTable = await bookTable.findById(req.params.id);
    if (!bookingTable) return res.status(404).json({ message: "bookingTable not found" });

    console.log(req.body.status);
   await Table.updateOne(
      {
        _id: req.params.id,
      },
      {
        status: req.body.status,
      }
    );
    res.json(bookingTable);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

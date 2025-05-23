const  Table =require('../../models/table.model')
const bookingTable = require('../../models/bookTable.model')
// Lấy danh sách tất cả các bàn
module.exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find({
      status: true
    });
    res.json({
        recordTables: tables
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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
module.exports.bookingTable = async (req, res) => {
  const { table_id, user_id, timeBook, dateBook, quantityUser, gift, status } = req.body;
  
  try {
    // Create a new booking record
    const newBooking = new bookingTable({
      table_id,
      user_id,
      timeBook,
      dateBook,
      quantityUser,
      gift,
      status,
    });

    // Save the new booking
    await newBooking.save();

    // Send success response
    res.status(201).json({
      message: "Table booked successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error booking table" });
  }
};

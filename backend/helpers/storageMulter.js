const multer = require("multer");

// Xuất hàm cấu hình multer
module.exports = () => {
    // Khai báo cấu hình lưu trữ cho multer
    const storage = multer.diskStorage({
        // Hàm xác định thư mục lưu trữ
        destination: function (req, file, cb) {
            // Gọi callback với đường dẫn thư mục mà file sẽ được lưu
            cb(null, './public/uploads/');  // Thiết lập thư mục đích
        },
        // Hàm xác định tên file khi lưu
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now();  // Tạo tên file duy nhất bằng cách sử dụng timestamp
            // Gọi callback với tên file bao gồm timestamp và tên file gốc
            cb(null, `${uniqueSuffix}-${file.originalname}`);  // Lưu file với tên duy nhất
        }
    });

    return storage;  // Trả về đối tượng storage để có thể sử dụng trong multer
};

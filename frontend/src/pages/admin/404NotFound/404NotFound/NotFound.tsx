import React from "react";

const NotFound: React.FC = () => {
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="not-found-container">
      <div className="text-center">
        <h1 className="display-1">404</h1>
        <p className="lead">Xin lỗi, trang bạn đang tìm kiếm không tồn tại.</p>
        <button className="btn btn-primary" onClick={goBack}>
          Quay lại Trang Trước
        </button>
      </div>
    </div>
  );
};

export default NotFound;

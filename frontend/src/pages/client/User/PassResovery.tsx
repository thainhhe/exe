import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleOutlined } from '@ant-design/icons';
const PassRecovery: React.FC = () => {
  return (

    <div className="max-w-[1200px] mx-auto px-4">
      <nav aria-label="breadcrumb" style={{ padding: '5px', backgroundColor: '#f8f9fa' }}>
      <ol style={{ listStyle: 'none', display: 'flex', gap: '5px', fontSize: '14px', color: '#555' }}>
        <li>
          <Link to="/" style={{ color: 'black', textDecoration: 'none' }}>Home</Link>
        </li>
        <li style={{ color: 'black' }}> / </li>
        <li>
          <Link to="/user/PassResovery" style={{ color: 'red', textDecoration: 'none' }}>Forgot Password</Link>
        </li>
      </ol>
    </nav>

    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '900px', display: 'flex', border: '1px solid #ddd', borderRadius: '8px' }}>
        {/* Left Section with Image and Benefits */}
        <div style={{ width: '50%', padding: '20px', backgroundColor: '#f9f9f9' }}>
          <img
            src="/public/password.jpg" // Replace with the actual image path or URL
            alt="Benefits illustration"
            style={{ width: '100%', borderRadius: '8px' }}
          />
           <h2 className="text-xl font-semibold mb-6">QUYỀN LỢI THÀNH VIÊN</h2>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li className="flex items-start gap-2">
                  <CheckCircleOutlined className="text-blue-500 mt-1" />
                  <span> Mua hàng khắp thế giới cực dễ dàng, nhanh chóng</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleOutlined className="text-blue-500 mt-1" />
                  <span> Theo dõi chi tiết đơn hàng, địa chỉ thanh toán dễ dàng</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleOutlined className="text-blue-500 mt-1" />
                  <span> Nhận nhiều chương trình ưu đãi hấp dẫn từ chúng tôi</span>
                </li>
              </ul>
        </div>
        
        {/* Right Section with Form */}
        <div style={{ width: '50%', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <button style={{ fontWeight: 'bold' }}>Đăng nhập</button>
            <button style={{ color: '#ccc' }}>Đăng ký</button>
          </div>
          <p>Bạn quên mật khẩu? Nhập địa chỉ email để lấy lại mật khẩu qua email.</p>
          <form>
            <label htmlFor="email">EMAIL*</label>
            <input
              type="email"
              id="email"
              placeholder="Nhập địa chỉ Email"
              style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ddd' }}
              required
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#b71c1c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}
            >
              LẤY LẠI MẬT KHẨU
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            QUAY LẠI <a href="/user/login" style={{ color: '#b71c1c' }}>TẠI ĐÂY</a>.
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default PassRecovery;

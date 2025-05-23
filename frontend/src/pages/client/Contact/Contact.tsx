import React from 'react';
import { Form, Input, Button } from 'antd';
import { MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: ContactFormData) => {
    console.log('Form Values:', values);
    form.resetFields();
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#e30613',
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%',
      }}>
        <h2 style={{ textAlign: 'center', color: '#e30613', marginBottom: '1rem' }}>LIÊN HỆ</h2>
        <Form
          form={form}
          name="contact"
          layout="vertical"
          onFinish={onFinish}
          requiredMark="optional"
        >
          <Form.Item
            name="fullName"
            label="* Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          >
            <Input placeholder="Nhập họ và tên" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="email"
            label="* Email"
            rules={[
              { required: true, message: 'Vui lòng nhập địa chỉ Email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input placeholder="Nhập địa chỉ Email" prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            name="phone"
            label="* Điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" prefix={<PhoneOutlined />} />
          </Form.Item>

          <Form.Item
            name="message"
            label="* Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung liên hệ' }]}
          >
            <Input.TextArea placeholder="Nội dung liên hệ" rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: '#e30613', borderColor: '#e30613' }}>
              GỬI TIN NHẮN
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '1rem', color: '#333' }}>
          <p><strong>Địa chỉ:</strong> Thạch Hòa, Hòa Lạc</p>
          <p><strong>Điện thoại:</strong> 0987654321</p>
          <p><strong>Email:</strong> service@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;

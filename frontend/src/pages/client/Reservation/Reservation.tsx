import React from 'react';
import { Form, Input, DatePicker, TimePicker, Select, Button, Typography, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;

const Reservation: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Form values:', values);
  };

  return (
    <div style={{ background: '#1c1c1c', padding: '40px', maxWidth: '600px', margin: '40px auto', borderRadius: '8px', border: '1px solid #a5a5a5' }}>
      <div style={{ textAlign: 'center', color: '#f5f5f5', marginBottom: '24px' }}>
        <Text strong style={{ color: '#a5a5a5', fontSize: '16px' }}>
          TO PROMPTLY RESERVE A TABLE OR A SPECIFIC AREA OF OUR COFFEE KING STORE, PLEASE CALL US AT 931-802-2652
        </Text>
        <br />
        <Text style={{ color: '#a5a5a5', fontSize: '14px' }}>
          ONLINE RESERVATIONS ARE NOT BOOKED UNTIL CONFIRMED.
        </Text>
        <Typography.Title level={3} style={{ color: '#ffffff', marginTop: '16px' }}>
          Reservation Request
        </Typography.Title>
      </div>

      <Form
        layout="vertical"
        onFinish={onFinish}
        style={{ color: '#f5f5f5' }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="firstName" rules={[{ required: true, message: 'Please enter your first name' }]}>
              <Input placeholder=" First Name" prefix={<UserOutlined />} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="lastName" rules={[{ required: true, message: 'Please enter your last name' }]}>
              <Input placeholder=" Last Name" prefix={<UserOutlined />} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
          <Input placeholder=" Email" prefix={<MailOutlined />} />
        </Form.Item>

        <Form.Item name="phone" rules={[{ required: true, message: 'Please enter your phone number' }]}>
          <Input placeholder=" Phone" prefix={<PhoneOutlined />} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="date" rules={[{ required: true, message: 'Please select a date' }]}>
              <DatePicker style={{ width: '100%' }} placeholder=" Date" suffixIcon={<CalendarOutlined />} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="time" rules={[{ required: true, message: 'Please select a time' }]}>
              <TimePicker style={{ width: '100%' }} placeholder=" Time" suffixIcon={<ClockCircleOutlined />} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="people" rules={[{ required: true, message: 'Please select the number of people' }]}>
          <Select placeholder=" # of People">
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
            <Option value="5">5</Option>
            <Option value="6">6</Option>
            <Option value="7">7</Option>
            <Option value="8">8</Option>
            <Option value="9">9</Option>
            <Option value="10">10</Option>
          </Select>
        </Form.Item>

        <Text style={{ color: '#a5a5a5', fontSize: '12px', display: 'block', textAlign: 'center', marginTop: '16px' }}>
          So we make sure we get your information accurately, please check your answers before submitting.
        </Text>
        <Text style={{ color: '#a5a5a5', fontSize: '12px', display: 'block', textAlign: 'center' }}>
          By submitting this form you agree to our <a href="#">Privacy Policy</a> & <a href="#">Terms and Conditions</a>.
        </Text>

        <Form.Item style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button type="primary" htmlType="submit" style={{ backgroundColor: '#ff8c00', borderColor: '#ff8c00', padding: '0 24px' }}>
            SEND
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Reservation;

import React, { useState } from "react";
import { Form, Input, Button, Tabs, Card, Row, Col, message } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { post } from "../../../Helpers/API.helper";
import placeholder from "./placeholder.svg";
import { ApiResponse } from "../../../actions/types";
import axios from "axios";
import { showSuccessAlert } from "../../../Helpers/alerts";
import Header from "../../../LayoutDefault/LauoutDefaultClient/Header/Header";

const { TabPane } = Tabs;

interface FormValues {
  name: string;
  phone: string;
  email: string;
  password: string;
}

function Register() {
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onFinish = async (values: FormValues) => {
    try {
      const response: ApiResponse = await post("http://localhost:5000/user/register", {
        fullName: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
      });

      // Check if response contains success property
      if (response && response.message) {
        form.resetFields(); // Reset form fields after success
        showSuccessAlert("Success!", "You have registered in successfully.");
        setTimeout(() => {
          navigate("/user/login");
        }, 1500); 
      } else {
        throw new Error(response.message || "Registration failed. Please try again.");
      }
    } catch (error: unknown) {
      // Log the error for debugging
      console.error("Registration error:", error);

      if (axios.isAxiosError(error) && error.response) {
        // Handle errors from the backend
        const backendMessage = error.response.data?.message || "An error occurred. Please try again later.";
        message.error(backendMessage); // Optionally display error with message
      } else if (error instanceof Error) {
        message.error(error.message); // Optionally display error with message
      } else {
        message.error("An unknown error occurred."); // Optionally display error with message
      }
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  return (
    <>
    <Header/>
      <div className="container mx-auto p-6">
      <Row gutter={32} className="max-w-5xl mx-auto">
        <Col xs={24} md={12}>
          <div className="mb-8">
            <div className="relative h-80 bg-[#f5f0ff]">
              <img
                src={placeholder}
                alt="Online Shopping"
                className="w-50 h-50 object-contain"
              />
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-6">QUYỀN LỢI THÀNH VIÊN</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-2">
                  <CheckCircleOutlined className="text-blue-500 mt-1" />
                  <span>Mua hàng khắp thế giới cực dễ dàng, nhanh chóng</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleOutlined className="text-blue-500 mt-1" />
                  <span>Theo dõi chi tiết đơn hàng, địa chỉ thanh toán dễ dàng</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleOutlined className="text-blue-500 mt-1" />
                  <span>Nhận nhiều chương trình ưu đãi hấp dẫn từ chúng tôi</span>
                </li>
              </ul>
            </div>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <Card bordered={false} className="shadow-sm">
            <Tabs defaultActiveKey="register" className="auth-tabs">
              <TabPane key="register" tab="Đăng ký">
               
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  className="p-6"
                >
                  <Form.Item
                    label={<>HỌ<span className="text-red-500">*</span></>}
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                  >
                    <Input placeholder="Nhập Họ tên" />
                  </Form.Item>

                  <Form.Item
                    label={<>SỐ ĐIỆN THOẠI<span className="text-red-500">*</span></>}
                    name="phone"
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                  >
                    <Input placeholder="Nhập Số điện thoại" />
                  </Form.Item>

                  <Form.Item
                    label={<>EMAIL<span className="text-red-500">*</span></>}
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email!" },
                      { type: "email", message: "Email không hợp lệ!" },
                    ]}
                  >
                    <Input placeholder="Nhập Địa chỉ Email" />
                  </Form.Item>

                  <Form.Item
                    label={<>MẬT KHẨU<span className="text-red-500">*</span></>}
                    name="password"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                  >
                    <Input.Password placeholder="Nhập Mật khẩu" />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      danger
                      block
                      size="large"
                      loading={loading}
                    >
                      TẠO TÀI KHOẢN
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      <style>
        {`
          .auth-tabs .ant-tabs-nav::before {
            border: none;
          }
          .auth-tabs .ant-tabs-nav-list {
            width: 100%;
          }
          .auth-tabs .ant-tabs-tab {
            width: 50%;
            justify-content: center;
            margin: 0;
          }
          .auth-tabs .ant-tabs-tab-active {
            border-bottom: 2px solid #dc2626;
          }
          .auth-tabs .ant-tabs-ink-bar {
            background: #dc2626;
          }
        `}
      </style>
    </div>
    </>
  );
}

export default Register;
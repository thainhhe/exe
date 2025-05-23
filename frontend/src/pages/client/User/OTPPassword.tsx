import React, { useState } from "react";
import { Form, Input, Button, message, Row, Col } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { post } from "../../../Helpers/API.helper"; // Adjust this path as needed
import { Container } from "react-bootstrap";
import { MailOutlined } from "@ant-design/icons";

function OTPPassword() {
  const { email } = useParams();
  console.log(email);
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };
  const handleSubmit = async () => {
    if (otp.length !== 6) {
      message.error("Please enter a valid 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const response = await post("http://localhost:5000/user/password/otp", {
        email,
        otp,
      });
      if (response.message) {
        console.log(response.tokenUser);
        message.success("OTP verified successfully.");
        navigate("/user/password/reset", { state: { tokenUser: response.tokenUser } }); 
      } else {
        message.error(
          response.message || "OTP verification failed. Try again."
        );
      }
    } catch (error: unknown) {
      setLoading(false); // Stop the loading spinner
      if (axios.isAxiosError(error) && error.response) {
        // Handle errors from the backend
        const backendMessage =
          error.response.data?.message ||
          "An error occurred. Please try again later.";
        setError(backendMessage); // Set the error in the state
      } else if (error instanceof Error) {
        setError(error.message); // Set general error message
      } else {
        setError("An unknown error occurred."); // Handle unknown errors
      }
    }
    setLoading(false);
  };
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="container mx-auto p-6">
            <h2 className="text-center mt-4 mb-4">Enter OTP</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form
              layout="vertical"
              onFinish={handleSubmit}
              className="w-3/5 mx-auto shadow p-4 rounded bg-white"
            >
              <Form.Item label="Email" style={{ marginBottom: "20px" }}>
                <Input
                  prefix={<MailOutlined style={{ color: "#1890ff" }} />}
                  type="text"
                  maxLength={6}
                  value={email || ""}
                  readOnly
                  style={{
                    textAlign: "center",
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "black",
                  }}
                />
              </Form.Item>

              <Form.Item
                rules={[{ required: true, message: "Please enter the OTP." }]}
              >
                <Input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={handleChange}
                  placeholder="Enter 6-digit OTP"
                  style={{ textAlign: "center" }}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  block
                  onClick={handleSubmit}
                  loading={loading}
                >
                  Verify OTP
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default OTPPassword;

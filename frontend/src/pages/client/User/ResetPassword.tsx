import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { showSuccessAlert } from "../../../Helpers/alerts";
import { post } from "../../../Helpers/API.helper";

function ResetPassword() {
    const location = useLocation();
    const tokenUser = location.state?.tokenUser; // Access the passed tokenUser
    console.log(tokenUser)
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      // Replace this URL with your actual API endpoint for resetting passwords
      const data = await post("http://localhost:5000/user/password/reset", {
        password,tokenUser
      });

      if (data.message) {
       showSuccessAlert("Success!", "Your password has been reset successfully.");
       setTimeout(()=>{
        navigate("/user/login"); 
       },1000)
      } else {
        message.error(data.message || "Password reset failed.");
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
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2 className="text-center mb-4">Reset Password</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <Form layout="vertical" onFinish={handleSubmit}>
        {/* New Password Input */}
        <Form.Item
          label="New Password"
          name="password"
          rules={[{ required: true, message: "Please enter your new password." }]}
        >
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </Form.Item>

        {/* Confirm Password Input */}
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[{ required: true, message: "Please confirm your new password." }]}
        >
          <Input.Password
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            disabled={!password || !confirmPassword}
          >
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ResetPassword;

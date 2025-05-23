import React, { useEffect } from "react";
import { Form, Input, Button, Checkbox, Card, message, Col, Row } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getCookie } from "../../../Helpers/Cookie.helper";
import { get, post } from "../../../Helpers/API.helper";
import { ApiResponse, User } from "../../../actions/types";
import { showSuccessAlert } from "../../../Helpers/alerts";
import { userActions } from "../../../actions/UserAction";
import { AppDispatch } from "../../../store/store";
import { setCart } from "../../../actions/CartAction";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "axios";

interface LoginResponse {
  tokenUser: string;
  user: User;
}

interface LoginFormValues {
  username: string;
  password: string;
  remember: boolean;
}

const LoginUser: React.FC = () => {
  const [form] = Form.useForm<LoginFormValues>();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const tokenUser = getCookie("tokenUser");
  console.log("tokenUser", tokenUser);

  const googleClientId = import.meta.env.VITE_GG_CLIENT_ID;


  useEffect(() => {
    const fetchApi = async () => {
      try {
        const accountByToken: ApiResponse = await get(`http://localhost:5000/user/${tokenUser}`);
        console.log("accountByToken.account", accountByToken.user);

        if (accountByToken && accountByToken.user) {
          dispatch(userActions(accountByToken));
          navigate("/");
        } else {
          throw new Error("User not found in the response.");
        }
      } catch (error) {
        console.error("Error fetching account by token:", error);
        navigate("/user/login");
      }
    };

    if (tokenUser) {
      fetchApi();
    } else {
      navigate("/user/login");
    }
  }, [tokenUser, dispatch, navigate]);

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const data: LoginResponse = await post("http://localhost:5000/user/login", {
        email: values.username,
        password: values.password,
      });

      console.log(data);
      if (data.tokenUser) {
        showSuccessAlert("Success!", "You have logged in successfully.");
        document.cookie = `tokenUser=${data.tokenUser}; path=/; max-age=86400`;

        dispatch(userActions({
          user: data.user,
        }));

        const cartResponse: ApiResponse = await get(`http://localhost:5000/cart/${data.user._id}`);
        console.log(cartResponse);
        if (cartResponse.cartItems.products) {
          const total = cartResponse.cartItems.products.reduce((acc, product) => acc + product.quantity, 0);
          console.log(total);

          localStorage.setItem("cart", JSON.stringify({
            list: cartResponse.cartItems.products,
            total: total, // Use the calculated total
          }));

          dispatch(setCart({
            list: cartResponse.cartItems.products,
            total: total,
          }));
        }

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        throw new Error("Token not received. Login failed.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle errors from the backend
        const backendMessage = error.response?.data?.message || "An error occurred. Please try again later.";
        message.error(backendMessage); // Display error message from the backend
      } else if (error instanceof Error) {

        message.error(error.message);
      } else {
        message.error("An unknown error occurred.");
      }
    
    }
  };

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      // Send Google ID token to your backend for verification
      const response = await post("http://localhost:5000/user/google-login", {
        token: credentialResponse.credential, // Google ID Token
      });
      console.log(response)

      if (response.tokenUser) {
        showSuccessAlert("Success!", "You have logged in with Google.");
        document.cookie = `tokenUser=${response.tokenUser}; path=/; max-age=86400`;

        dispatch(userActions({
          user: response.user,
        }));

        const cartResponse: ApiResponse = await get(`http://localhost:5000/cart/${response.user._id}`);
        console.log(cartResponse);
        if (cartResponse.cartItems.products) {
          const total = cartResponse.cartItems.products.reduce((acc, product) => acc + product.quantity, 0);
          console.log(total);

          localStorage.setItem("cart", JSON.stringify({
            list: cartResponse.cartItems.products,
            total: total, // Use the calculated total
          }));

          dispatch(setCart({
            list: cartResponse.cartItems.products,
            total: total,
          }));
        }

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        throw new Error("Google login failed.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      message.error("Google login failed. Please try again.");
    }
  };

  const handleError = () => {
    console.error("Login failed");
    message.error("An error occurred during login. Please try again.");
  };

  if (!googleClientId) {
    console.error('Google Client ID is not defined!');
    return <div>Error: Google Client ID is not configured.</div>;
  }

  return (
    <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f0f2f5',
    }}
  >
    <Card style={{ width: '100%', maxWidth: 800, padding: '24px' }}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={12} className="text-center">
          <img
            src="/images/Login.png"
            alt="Logo"
            style={{ height: '200px', width: '200px', objectFit: 'contain' }}
          />
        </Col>
        <Col xs={24} md={12}>
          <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Sign in</h2>
          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            initialValues={{ remember: true }}
            layout="vertical"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Please input your username!" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
                size="large"
              />
            </Form.Item>
  
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>
  
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
  
            <Form.Item>
              <Button
                className="btn btn-danger"
                htmlType="submit"
                style={{ width: '100%' }}
                size="large"
              >
                Login
              </Button>
            </Form.Item>
          </Form>
  
          <div className="d-flex justify-content-between mb-3">
            <Link to={`/user/password/forgot`}>Forgot password</Link>
            <Link to="/user/register">Chưa có tài khoản: Register</Link>
          </div>
  
          <div className="d-flex mb-2">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </div>
        </Col>
      </Row>
    </Card>
  </div>
  
  );
};

export default LoginUser;

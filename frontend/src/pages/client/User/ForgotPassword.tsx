import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { post } from "../../../Helpers/API.helper"; // Adjust this path as necessary
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");  // Reset any previous messages
    setLoading(true);

    try {
      const response = await post("http://localhost:5000/user/password/forgot", { email });

      console.log(response.detailUser.email);
      if (response.message) {
        const email = response.detailUser.email;
        setMessage(`${response.message}. Password reset link has been sent to your email.`);
        navigate(`/user/password/otp/${email}`);
      } else {
        setError(response.message || "An error occurred. Please try again.");
      }
    } catch (error: unknown) {
      setLoading(false); // Stop the loading spinner

      if (axios.isAxiosError(error) && error.response) {
        // Handle errors from the backend
        const backendMessage = error.response.data?.message || "An error occurred. Please try again later.";
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
          <h2 className="text-center mb-4">Forgot Password</h2>
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          
          <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
            <Form.Group controlId="formEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="mt-4 w-100"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Password Reset Link"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default ForgotPassword;

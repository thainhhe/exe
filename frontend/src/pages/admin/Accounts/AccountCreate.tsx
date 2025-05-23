import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { get, post } from "../../../Helpers/API.helper";
import { Account, Role } from "../../../actions/types";


function AccountCreate() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [role_id, setRoleId] = useState<string>("");
  const [status, setStatus] = useState<"active" | "inactive">("inactive");
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchRoles();
    fetchAccounts();
  }, []);

  const fetchRoles = async () => {
    try {
      const data = await get("http://localhost:5000/admin/roles");
      setRoles(data.recordsRole);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const data = await get("http://localhost:5000/admin/accounts");
      setAccounts(data.recordsAccount);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Please input your E-mail!";
    if (!emailRegex.test(email)) return "The input is not valid E-mail!";
    if (accounts.some((account) => account.email === email)) return "Email already exists";
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    const phoneRegex = /^0\d{9}$/;
    if (!phone) return "Please input your Phone number!";
    if (!phoneRegex.test(phone)) return "Phone number must start with 0 and contain exactly 10 digits!";
    if (accounts.some((account) => account.phone === phone)) return "Phone number already exists";
    return null;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailInput = e.target.value;
    setEmail(emailInput);

    const emailError = validateEmail(emailInput);
    if (emailError) {
      setErrors((prevErrors) => ({ ...prevErrors, email: emailError }));
    } else {
      setErrors((prevErrors) => {
        const { email, ...rest } = prevErrors;
        console.log(email, rest);
        return rest;
      });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneInput = e.target.value;
    setPhone(phoneInput);

    const phoneError = validatePhone(phoneInput);
    if (phoneError) {
      setErrors((prevErrors) => ({ ...prevErrors, phone: phoneError }));
    } else {
      setErrors((prevErrors) => {
        const { phone, ...rest } = prevErrors;
        console.log(phone, rest);
        return rest;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const phoneError = validatePhone(phone);
    if (emailError || phoneError) {
      setErrors({ email: emailError || undefined, phone: phoneError|| undefined });

      return;
    } else {
      setErrors({});
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phone", phone);
    if (avatar) formData.append("avatar", avatar);
    formData.append("role_id", role_id);
    formData.append("status", status);

    try {
      const data = await post("http://localhost:5000/admin/accounts/create", formData);
      console.log("Account created successfully:", data);

      setTimeout(() => {
        navigate("/admin/accounts");
      }, 500);
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  return (
    <div>
      <h1>Create Account</h1>
      {/* <Notification message={message} type={type} /> */}
      {roles.length > 0 ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={handleEmailChange}
              isInvalid={!!errors.email}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              value={phone}
              onChange={handlePhoneChange}
              isInvalid={!!errors.phone}
            />
            <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formAvatar">
            <Form.Label>Avatar</Form.Label>
            <Form.Control
              type="file"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                setAvatar(file || null); // If no file is selected, set to null
              }}
              accept="image/*"
            />
          </Form.Group>


          <Form.Group controlId="formRoleId">
            <Form.Label>Role</Form.Label>
            <Form.Control
              as="select"
              value={role_id}
              onChange={(e) => setRoleId(e.target.value)}
              required
            >
              <option value="">-- Select Role --</option>
              {roles
                .filter(role => !role.deleted) // Filter out deleted roles
                .map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.title}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formStatus">
            <Form.Label>Status</Form.Label>
            <div>
              <Form.Check
                id="active"
                type="radio"
                label="Active"
                value="active"
                checked={status === "active"}
                onChange={() => setStatus("active")}
              />
              <Form.Check
                id="inactive"
                type="radio"
                label="Inactive"
                value="inactive"
                checked={status === "inactive"}
                onChange={() => setStatus("inactive")}
              />
            </div>
          </Form.Group>

          <Button variant="primary" type="submit">
            Create Account
          </Button>
        </Form>
      ) : (
        <div className="col-4">
          <span>No roles available. Please create a role 🚀 </span>
          <Link to="/admin/roles/create" className="btn btn-outline-success">
            + Create
          </Link>
        </div>
      )}
    </div>
  );
}

export default AccountCreate;

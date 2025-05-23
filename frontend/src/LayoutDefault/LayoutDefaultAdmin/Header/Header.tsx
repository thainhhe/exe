import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { UserOutlined } from '@ant-design/icons'; // Importing the UserOutlined icon from Ant Design
import "./Header.css"; // Ensure your CSS is imported for styling
import { RootState } from "../../../store/store";
import { useSelector } from "react-redux";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token from cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"; // Set expiration to the past

    // Redirect user to the login page
    navigate("auth/login");
  };

  const account = useSelector((state: RootState) => state.AccountReducer);
  
  return (
    <header className="header">
      <div className="container-fluid">
        <div className="row align-items-center">
          {/* Logo Section */}
          <div className="col-3">
            <div className="inner-logo">
              <Link to={`/dashboard`} className="logo-link">ADMIN DASHBOARD</Link>
            </div>
          </div>

          <div className="col-9">
            <div className="header-actions d-flex justify-content-end align-items-center">
              <div className="admin-avatar me-3 d-flex align-items-center">
                <UserOutlined
                  className="user-icon"
                  title="User Profile"
                />
                <span className="admin-name ms-2">
                {account?.accountInAdmin.fullName}-{account?.role.title}
                
                </span>
              </div>

              <Button onClick={handleLogout} variant="danger" className="logout-button">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

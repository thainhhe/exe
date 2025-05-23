import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCartOutlined, SearchOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { Form, Input, Button, message } from 'antd';
import logoWhite from '../../../assets/logo_white-7.png';
import './Header.css';
import { RootState } from '../../../store/store';
import { useSelector } from 'react-redux';

const Header: React.FC = () => {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  // const [total, setTotal] = useState(0); // Use state to track total quantity
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.UserReducer);
  // console.log(user?.user._id)
  // console.log("user?.user.tokenUser", user?.user.tokenUser)
  const cart = useSelector((state: RootState) => state.cartReducer);

  const [showDropdown, setShowDropdown] = useState(false);

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleDropdownToggle = () => setShowDropdown(!showDropdown);

  const handleSearchSubmit = (values: { search: string }) => {
    const trimmedSearchTerm = values.search.trim();

    // Kiểm tra nếu người dùng không nhập gì
    if (!trimmedSearchTerm) {
      // Có thể dùng thông báo từ Ant Design
      message.error('Please enter a valid search term!');
      return;
    }

    navigate(`/listProducts`, { state: { searchTerm: trimmedSearchTerm } });
    setSearchTerm('');
    setSearchVisible(false);
  };


  const handleLogout = () => {
    document.cookie = "tokenUser=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    localStorage.removeItem("cart");
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="container-header">
        {/* Logo Section */}
        <div className="logo">
          <img src={logoWhite} alt="CoffeeKing Logo" />
        </div>

        {/* Desktop Navigation Section */}
        <nav className="desktop-nav">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
            Home
          </NavLink>
          <NavLink to="/listProducts" className={({ isActive }) => isActive ? 'active' : ''}>
            Products
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
            About us
          </NavLink>
          {/* <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>
            Contact
          </NavLink> */}
          <NavLink to="/bookingTable" className={({ isActive }) => isActive ? 'active' : ''}>
            Booking Table
          </NavLink>
          <NavLink to="/blog" className={({ isActive }) => isActive ? 'active' : ''}>
            Blog
          </NavLink>

        </nav>

        {/* Icons and Buttons Section */}
        <div className="actions">
          <button onClick={toggleSearch} className="search-button">
            <SearchOutlined />
          </button>
          <div className="cart-icon">
            <Link to="/cart">
              <span className="cart-count">{cart.total}</span>
              <ShoppingCartOutlined style={{ color: "white" }} />

            </Link>

          </div>

          {user && user.user._id ? (
            <>

              <div
                className="user-greeting-container"
                onClick={isMobile ? handleDropdownToggle : undefined}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <span className="user-greeting">
                  Hello, {user.user.fullName}!
                </span>
                {showDropdown && (
                  <div className="user-dropdown">
                    <p><Link to="user/listOrders">My Orders</Link></p>
                    <p><Link to="user/historyOrder">Purchase History</Link></p>
                    <p><Link to="user/profile">Profile</Link></p>
                    <Button onClick={handleLogout} className="logout-button">
                      Logout
                    </Button>
                  </div>
                )}
              </div>

            </>
          ) : (
            <>
              <NavLink to="/user/login" className="login-link">
                Login
              </NavLink>
              <NavLink to="/user/register" className="register-link">
                Register
              </NavLink>
            </>
          )}

          {isMobile && (
            <button onClick={toggleMobileMenu} className="mobile-menu-button">
              {isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && isMobile && (
        <nav className="mobile-nav">
          <NavLink to="/" onClick={toggleMobileMenu}>Home</NavLink>
          <NavLink to="/listProducts" onClick={toggleMobileMenu}>Products</NavLink>
          <NavLink to="/about" onClick={toggleMobileMenu}>About us</NavLink>
          {/* <NavLink to="/contact" onClick={toggleMobileMenu}>Contact</NavLink> */}
          <NavLink to="/bookingTable" onClick={toggleMobileMenu}>Booking Table</NavLink>
          {user && user.user._id ? (
            <>
              <div >
                <p><Link to="user/listOrders">My Orders</Link></p>
                <p><Link to="user/historyOrder">Purchase History</Link></p>

                <NavLink to="" onClick={handleLogout}>
                  Logout
                </NavLink>
              </div>
            </>

          ) : (
            <>
              <NavLink to="/user/login" onClick={toggleMobileMenu}>
                Login
              </NavLink>
              <NavLink to="/user/register" onClick={toggleMobileMenu}>
                Register
              </NavLink>
            </>
          )}
        </nav>
      )}

      {/* Search Form */}
      {isSearchVisible && (
        <Form onFinish={handleSearchSubmit} className="search-form">
          <Form.Item
            name="search"
            rules={[
              { required: true, message: 'Please enter a search term!' },
              {
                validator: (_, value) =>
                  value && value.trim() !== ''
                    ? Promise.resolve()
                    : Promise.reject(new Error('Search term cannot be empty or whitespace!')),
              },
            ]}
          >
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form>
      )}
    </header>
  );
};

export default Header;

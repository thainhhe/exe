import React from 'react';
import { Layout, Row, Col, Typography, Input, Button, Space, Divider } from 'antd';
import { FacebookOutlined, InstagramOutlined, TwitterOutlined, MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Footer } = Layout;
const { Title, Text } = Typography;

const AppFooter: React.FC = () => {
  return (
    <Footer style={{ background: '#1a1a1a', padding: '48px 24px 24px 24px' }}>
      <div className="container mx-auto">
        <Row gutter={[48, 32]}>
          {/* About Section */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white', marginBottom: '20px' }}>
              About CoffeeKing
            </Title>
            <Text style={{ color: '#999' }}>
              Discover the finest coffee experience with CoffeeKing. We bring you premium coffee beans and accessories from around the world.
            </Text>
          </Col>

          {/* Quick Links */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white', marginBottom: '20px' }}>
              Quick Links
            </Title>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
              <Link to="/" style={{ color: '#999', textDecoration: 'none' }}>Home</Link>
              <Link to="/products" style={{ color: '#999', textDecoration: 'none' }}>Products</Link>
              <Link to="/about" style={{ color: '#999', textDecoration: 'none' }}>About us</Link>
              <Link to="/contact" style={{ color: '#999', textDecoration: 'none' }}>Contact</Link>
            </Space>
          </Col>

          {/* Newsletter */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white', marginBottom: '20px' }}>
              Newsletter
            </Title>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
              <Text style={{ color: '#999' }}>
                Subscribe to receive updates and special offers
              </Text>
              <Space.Compact style={{ width: '100%' }}>
                <Input 
                  placeholder="Your email" 
                  prefix={<MailOutlined style={{ color: '#999' }} />}
                  style={{ backgroundColor: '#2a2a2a', borderColor: '#333' }}
                />
                <Button 
                  type="primary" 
                  style={{ backgroundColor: '#d4af37', borderColor: '#d4af37' }}
                >
                  Subscribe
                </Button>
              </Space.Compact>
            </Space>
          </Col>

          {/* Contact Info */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: 'white', marginBottom: '20px' }}>
              Connect With Us
            </Title>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
              <Text style={{ color: '#999' }}>
                Follow us on social media
              </Text>
              <Space size="large">
                <FacebookOutlined style={{ color: '#999', fontSize: '24px', cursor: 'pointer' }} />
                <InstagramOutlined style={{ color: '#999', fontSize: '24px', cursor: 'pointer' }} />
                <TwitterOutlined style={{ color: '#999', fontSize: '24px', cursor: 'pointer' }} />
              </Space>
            </Space>
          </Col>
        </Row>

        <Divider style={{ borderColor: '#333', margin: '32px 0' }} />
        
        {/* Copyright */}
        <Row justify="space-between" align="middle">
          <Col>
            <Text style={{ color: '#999' }}>
              © {new Date().getFullYear()} CoffeeKing. All rights reserved.
            </Text>
          </Col>
          <Col>
            <Space size="middle">
              <Link to="/privacy" style={{ color: '#999', textDecoration: 'none' }}>
                Privacy Policy
              </Link>
              <Link to="/terms" style={{ color: '#999', textDecoration: 'none' }}>
                Terms of Service
              </Link>
            </Space>
          </Col>
        </Row>
      </div>
    </Footer>
  );
};

export default AppFooter;

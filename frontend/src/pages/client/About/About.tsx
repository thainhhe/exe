import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Row, Typography } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const About: React.FC = () => {
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  const handlePlayVideo = () => {
    setIsVideoVisible(true);
  };

  return (
    <div>
      <nav aria-label="breadcrumb" style={{ padding: '10px', backgroundColor: '#f8f9fa' }}>
        <ol style={{ listStyle: 'none', display: 'flex', gap: '5px', fontSize: '14px', color: '#555' }}>
          <li>
            <Link to="/" style={{ color: 'black', textDecoration: 'none' }}>Home</Link>
          </li>
          <li style={{ color: 'black' }}> / </li>
          <li>
            <Link to="/about" style={{ color: 'grey', textDecoration: 'none' }}>About us</Link>
          </li>
        </ol>
      </nav>
      <div style={{ padding: '40px' }}>
        <Row gutter={[16, 32]} align="middle" style={{ marginBottom: '40px' }}>
          <Col xs={24} md={16}>
            <Text style={{ color: '#D9A953', fontSize: '16px' }}>Who we are</Text>
            <Title level={1} style={{ fontSize: 'clamp(24px, 5vw, 32px)', margin: '0' }}>
              About market
            </Title>
            <Text style={{ fontSize: '16px', color: '#666' }}>
              Sed sagittis sodales lobortis. Curabitur in eleifend turpis, id vehicula odio. Donec pulvinar tellus eget magna
              aliquet ultricies. Praesent gravida hendrerit ex, nec eleifend sem convallis vitae.
            </Text>
            <div style={{ marginTop: '20px' }}>
              <Button
                style={{ marginRight: '8px', backgroundColor: '#D9A953', color: '#fff' }}
                onClick={() => window.location.href = '/listProducts'}
              >
                View products
              </Button>

              <Button
                onClick={() => window.location.href = '/listProducts'}
              >
                View products
              </Button>

            </div>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
              {isVideoVisible ? (
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/Wlirfu2IcF8?autoplay=1"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: '8px', height: '300px' }}
                ></iframe>
              ) : (
                <div style={{ position: 'relative', cursor: 'pointer' }} onClick={handlePlayVideo}>
                  <img
                    src="/public/about.png"
                    alt="Video thumbnail"
                    style={{ width: '60%', borderRadius: '8px' }}
                  />
                  <PlayCircleOutlined
                    style={{
                      fontSize: '48px',
                      color: '#fff',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      borderRadius: '50%',
                      padding: '10px',
                    }}
                  />
                </div>
              )}
            </div>
          </Col>
        </Row>
        <Row gutter={[16, 32]} justify="space-around">
          <Col xs={12} sm={12} md={6} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(24px, 5vw, 40px)' }}>🌱</div>
            <Title level={4} style={{ fontSize: 'clamp(16px, 4vw, 18px)' }}>The best World sorts</Title>
            <Text style={{ fontSize: '14px' }}>Sed sagittis sodales lobortis. Curabitur in eleifend turpis, id vehicula odio.</Text>
          </Col>
          <Col xs={12} sm={12} md={6} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(24px, 5vw, 40px)' }}>🏬</div>
            <Title level={4} style={{ fontSize: 'clamp(16px, 4vw, 18px)' }}>Many points of sale</Title>
            <Text style={{ fontSize: '14px' }}>Sed sagittis sodales lobortis. Curabitur in eleifend turpis, id vehicula odio.</Text>
          </Col>
          <Col xs={12} sm={12} md={6} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(24px, 5vw, 40px)' }}>👨‍🍳</div>
            <Title level={4} style={{ fontSize: 'clamp(16px, 4vw, 18px)' }}>Professional baristas</Title>
            <Text style={{ fontSize: '14px' }}>Sed sagittis sodales lobortis. Curabitur in eleifend turpis, id vehicula odio.</Text>
          </Col>
          <Col xs={12} sm={12} md={6} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(24px, 5vw, 40px)' }}>🚚</div>
            <Title level={4} style={{ fontSize: 'clamp(16px, 4vw, 18px)' }}>24/7 fast delivery</Title>
            <Text style={{ fontSize: '14px' }}>Sed sagittis sodales lobortis. Curabitur in eleifend turpis, id vehicula odio.</Text>
          </Col>
        </Row>
      </div>

    </div>
  );
};

export default About;

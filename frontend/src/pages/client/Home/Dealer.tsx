import React from 'react'
import { Row, Col, Typography, Button, Space } from 'antd'
import './dealer.css'
import img from '../../../assets/img.png';


const { Title, Paragraph } = Typography

function DealerSection() {
  return (
    <div className="dealer-container">
      <Row gutter={[48, 32]} align="middle">
        <Col xs={24} md={12}>
          <div className="trust-content">
            <div className="trust-header">
              <Title level={2} className="more-than">
                More than
              </Title>
              <Title level={1} className="customer-number">
                5400
              </Title>
              <Title level={2} className="trust-text">
                customers
                <br />
                trust us
              </Title>
            </div>
            <div className="coffee-image">
              <img
                src={img}
                alt="Coffee cup with latte art"
                className="coffee-cup"
              />
            </div>
          </div>
        </Col>
        
        <Col xs={24} md={12}>
          <div className="dealer-content">
            <Title level={1} className="dealer-title">
              Become our dealer
            </Title>
            <Paragraph className="dealer-description">
              Curabitur sollicitudin ultrices tortor, eget pulvinar risus cursus eu. 
              Vivamus sit amet odio massa. Vivamus dapibus elementum tellus nec 
              fermentum. Sed blandit condimentum molestie. In hac habitasse platea 
              dictumst. Etiam fringilla a elit at ornare.
            </Paragraph>
            <Space size="middle" className="button-group">
              <Button type="primary" size="large" className="dealer-button">
                Become a dealer
              </Button>
              <Button size="large" className="contact-button">
                Contact us
              </Button>
            </Space>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default DealerSection
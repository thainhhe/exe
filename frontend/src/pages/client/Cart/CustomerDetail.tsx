import React from "react";
import {
  Layout,
  Card,
  Avatar,
  Typography,
  Space,
  Button,
  Divider,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  DeleteOutlined,
  LockOutlined,
  LinkedinOutlined,
  FacebookOutlined,
  TwitterOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text, Link } = Typography;

interface CustomerDetails {
  name: string;
  joinedDate: string;
  avatar: string;
  stats: {
    following: number;
    projects: number;
    completion: number;
  };
  address: {
    street: string;
    city: string;
    province: string;
    country: string;
  };
  email: string;
  phone: string;
}

const CustomerDetailsPage: React.FC = () => {
  const customer: CustomerDetails = {
    name: "Ansolo Lazinatov",
    joinedDate: "3 months ago",
    avatar: "/placeholder.svg",
    stats: {
      following: 297,
      projects: 56,
      completion: 97,
    },
    address: {
      street: "Shatinon Mekalan",
      city: "Vancouver",
      province: "British Columbia",
      country: "Canada",
    },
    email: "shatinon@jeemail.com",
    phone: "+1234567890",
  };

  return (
    <Layout style={{ background: "#f5f5f5", padding: "24px" }}>
      <Content>
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            Customer details
          </Title>
          <Space>
            <Button icon={<DeleteOutlined />} danger>
              Delete customer
            </Button>
            <Button icon={<LockOutlined />}>Reset password</Button>
          </Space>
        </div>

        <Row gutter={24}>
          <Col span={16}>
            <Card>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "24px",
                }}
              >
                <Avatar size={120} src={customer.avatar} />
                <div style={{ flex: 1 }}>
                  <Title level={3} style={{ margin: 0 }}>
                    {customer.name}
                  </Title>
                  <Text type="secondary">Joined {customer.joinedDate}</Text>

                  <Space style={{ marginTop: 16 }}>
                    <Link>
                      <LinkedinOutlined style={{ fontSize: 20 }} />
                    </Link>
                    <Link>
                      <FacebookOutlined style={{ fontSize: 20 }} />
                    </Link>
                    <Link>
                      <TwitterOutlined style={{ fontSize: 20 }} />
                    </Link>
                  </Space>
                </div>
              </div>

              <Divider />

              <Row gutter={48}>
                <Col span={8}>
                  <Statistic
                    title="Following"
                    value={customer.stats.following}
                  />
                </Col>
                <Col span={8}>
                  <Statistic title="Projects" value={customer.stats.projects} />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Completion"
                    value={customer.stats.completion}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={8}>
            <Card>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <Title level={4} style={{ margin: 0 }}>
                  Default Address
                </Title>
                <Button type="text" icon={<EditOutlined />} />
              </div>

              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                <div>
                  <Text strong>Address</Text>
                  <div>{customer.address.street}</div>
                  <div>
                    {customer.address.city}, {customer.address.province}
                  </div>
                  <div>{customer.address.country}</div>
                </div>

                <div>
                  <Text strong>Email</Text>
                  <div>
                    <Link href={`mailto:${customer.email}`}>
                      {customer.email}
                    </Link>
                  </div>
                </div>

                <div>
                  <Text strong>Phone</Text>
                  <div>{customer.phone}</div>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default CustomerDetailsPage;

import React from "react";
import {
  Layout,
  Table,
  Card,
  Space,
  Button,
  Select,
  Typography,
  Image,
} from "antd";
import type { ColumnsType } from "antd/es/table";

import img from "../../../assets/img.png";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

interface Product {
  key: string;
  image: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  total: number;
}

const OrderDetails: React.FC = () => {
  const products: Product[] = [
    {
      key: "1",
      image: img,
      name: "Coffee",
      size: "XL",
      price: 57,
      quantity: 4,
      total: 228,
    },
    {
      key: "2",
      image: img,
      name: "Coffee",
      size: "XL",
      price: 199,
      quantity: 2,
      total: 398,
    },
    {
      key: "3",
      image: img,
      name: "Coffee",
      size: "L",
      price: 600,
      quantity: 1,
      total: 600,
    },
    {
      key: "4",
      image: img,
      name: "Coffee",
      size: "XL",
      price: 250,
      quantity: 2,
      total: 500,
    },
    {
      key: "5",
      image: img,
      name: "Coffee",
      size: "XL",
      price: 49,
      quantity: 3,
      total: 147,
    },
    {
      key: "6",
      image: img,
      name: "Coffee",
      size: "XL",
      price: 65,
      quantity: 2,
      total: 130,
    },
  ];

  const columns: ColumnsType<Product> = [
    {
      title: "PRODUCTS",
      dataIndex: "name",
      key: "name",
      width: "50%",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Image
            src={record.image}
            width={60}
            height={60}
            style={{ flexShrink: 0 }}
            preview={false}
          />
          <Text
            style={{
              width: "calc(100% - 76px)",
              whiteSpace: "normal",
              wordBreak: "break-word",
              lineHeight: "1.5",
            }}
          >
            {text}
          </Text>
        </div>
      ),
    },
    {
      title: "SIZE",
      dataIndex: "size",
      key: "size",
      width: "10%",
    },
    {
      title: "PRICE",
      dataIndex: "price",
      key: "price",
      width: "15%",
      render: (price: number) => `$${price}`,
    },
    {
      title: "QUANTITY",
      dataIndex: "quantity",
      key: "quantity",
      width: "10%",
    },
    {
      title: "TOTAL",
      dataIndex: "total",
      key: "total",
      width: "15%",
      render: (total: number) => `$${total}`,
    },
  ];

  return (
    <Layout>
      <Content style={{ padding: "24px" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Space style={{ justifyContent: "space-between", width: "100%" }}>
            <div>
              <Title level={3} style={{ margin: 0 }}>
                Order #349
              </Title>
              <Text>Customer ID : 2364847</Text>
            </div>
            <Space>
              <Button>Print</Button>
              <Button>Refund</Button>
              <Button>More action</Button>
            </Space>
          </Space>

          <Layout>
            <Content style={{ paddingRight: "24px" }}>
              <Table
                columns={columns}
                dataSource={products}
                pagination={false}
                summary={() => (
                  <Table.Summary>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={4}>
                        <Text strong>Items subtotal :</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>
                        <Text strong>$2003</Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            </Content>
            <Sider width={300} theme="light">
              <Card title="Summary" style={{ marginBottom: "24px" }}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Text>Items subtotal :</Text>
                    <Text>$2003</Text>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Text>Discount :</Text>
                    <Text type="danger">-$59</Text>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Text>Tax :</Text>
                    <Text>$126.20</Text>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Text>Subtotal :</Text>
                    <Text>$2070.20</Text>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Text>Shipping Cost :</Text>
                    <Text>$30</Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderTop: "1px solid #f0f0f0",
                      paddingTop: "8px",
                    }}
                  >
                    <Text strong>Total :</Text>
                    <Text strong>$2100.20</Text>
                  </div>
                </Space>
              </Card>
              <Card title="Order Status">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Text>Payment status</Text>
                  <Select
                    defaultValue="processing"
                    style={{ width: "100%" }}
                    options={[
                      { value: "processing", label: "Processing" },
                      { value: "completed", label: "Completed" },
                      { value: "cancelled", label: "Cancelled" },
                    ]}
                  />
                </Space>
              </Card>
            </Sider>
          </Layout>
        </Space>
      </Content>
    </Layout>
  );
};

export default OrderDetails;

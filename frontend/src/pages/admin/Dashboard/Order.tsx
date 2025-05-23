import React from 'react';
import { Table, Tag, Space, Button, Input, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ExportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

interface Order {
  key: string;
  orderNumber: string;
  total: string;
  customer: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  deliveryType: string;
  date: string;
}

const columns: ColumnsType<Order> = [
  {
    title: 'Order',
    dataIndex: 'orderNumber',
    key: 'orderNumber',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
  },
  {
    title: 'Customer',
    dataIndex: 'customer',
    key: 'customer',
  },
  {
    title: 'Payment Status',
    dataIndex: 'paymentStatus',
    key: 'paymentStatus',
    render: (status) => {
      let color;
      switch (status) {
        case 'Complete':
          color = 'green';
          break;
        case 'Cancelled':
          color = 'volcano';
          break;
        case 'Pending':
          color = 'orange';
          break;
        case 'Failed':
          color = 'red';
          break;
        case 'Paid':
          color = 'blue';
          break;
        default:
          color = 'gray';
      }
      return <Tag color={color}>{status.toUpperCase()}</Tag>;
    },
  },
  {
    title: 'Fulfillment Status',
    dataIndex: 'fulfillmentStatus',
    key: 'fulfillmentStatus',
    render: (status) => {
      let color;
      switch (status) {
        case 'Completed':
          color = 'green';
          break;
        case 'Ready to Pickup':
          color = 'blue';
          break;
        case 'Partially Fulfilled':
          color = 'orange';
          break;
        case 'Unfulfilled':
          color = 'red';
          break;
        case 'Cancelled':
          color = 'volcano';
          break;
        default:
          color = 'gray';
      }
      return <Tag color={color}>{status.toUpperCase()}</Tag>;
    },
  },
  {
    title: 'Delivery Type',
    dataIndex: 'deliveryType',
    key: 'deliveryType',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
];

const data: Order[] = [
  {
    key: '1',
    orderNumber: '#2453',
    total: '$87',
    customer: 'Carry Anna',
    paymentStatus: 'Complete',
    fulfillmentStatus: 'Cancelled',
    deliveryType: 'Cash on delivery',
    date: 'Dec 12, 12:56 PM',
  },
  // Add other rows similarly
  {
    key: '2',
    orderNumber: '#2454',
    total: '$87',
    customer: 'Carry Anna',
    paymentStatus: 'Cancelled',
    fulfillmentStatus: 'Ready to Pickup',
    deliveryType: 'Free shipping',
    date: 'Dec 9, 2:28PM',
  },
  {
    key: '3',
    orderNumber: '#2455',
    total: '$87',
    customer: 'Carry Anna',
    paymentStatus: 'Complete',
    fulfillmentStatus: 'Cancelled',
    deliveryType: 'Cash on delivery',
    date: 'Dec 12, 12:58 PM',
  },
  {
    key: '4',
    orderNumber: '#2456',
    total: '$87',
    customer: 'Carry Anna',
    paymentStatus: 'Complete',
    fulfillmentStatus: 'Cancelled',
    deliveryType: 'Cash on delivery',
    date: 'Dec 12, 13:56 PM',
  },
];

const OrderTable: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Space>
          <Button icon={<ExportOutlined />}>Export</Button>
          <Button type="primary" icon={<PlusOutlined />}>
            Add order
          </Button>
        </Space>
      </div>
      <Space className="w-full" direction="vertical">
        <Space className="w-full" wrap>
          <Input
            placeholder="Search orders"
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
          <Select
            defaultValue="payment_status"
            style={{ width: 200 }}
            options={[
              { value: 'payment_status', label: 'Payment status' },
              { value: 'complete', label: 'Complete' },
              { value: 'pending', label: 'Pending' },
              { value: 'failed', label: 'Failed' },
            ]}
          />
          <Select
            defaultValue="fulfillment_status"
            style={{ width: 200 }}
            options={[
              { value: 'fulfillment_status', label: 'Fulfillment status' },
              { value: 'fulfilled', label: 'Fulfilled' },
              { value: 'unfulfilled', label: 'Unfulfilled' },
              { value: 'partially', label: 'Partially Fulfilled' },
            ]}
          />
          <Button>More filters</Button>
        </Space>
      </Space>
  <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
  </div>
); 
};

export default OrderTable;

import React from 'react';
import { Table, Tag, Space, Button, Input, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ExportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

interface Customer {
  key: string;
  customerName: string;
  email: string;
  orders: number;
  totalSpent: string;
  city: string;
  lastSeen: string;
  lastOrder: string;
}

const columns: ColumnsType<Customer> = [
  {
    title: 'Customer',
    dataIndex: 'customerName',
    key: 'customerName',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Orders',
    dataIndex: 'orders',
    key: 'orders',
  },
  {
    title: 'Total Spent',
    dataIndex: 'totalSpent',
    key: 'totalSpent',
  },
  {
    title: 'City',
    dataIndex: 'city',
    key: 'city',
  },
  {
    title: 'Last Seen',
    dataIndex: 'lastSeen',
    key: 'lastSeen',
  },
  {
    title: 'Last Order',
    dataIndex: 'lastOrder',
    key: 'lastOrder',
  },
];

const data: Customer[] = [
  {
    key: '1',
    customerName: 'Carry Anna',
    email: 'carry.anna@example.com',
    orders: 5,
    totalSpent: '$450',
    city: 'New York',
    lastSeen: 'Dec 10, 11:00 AM',
    lastOrder: 'Dec 9, 2:28 PM',
  },
  {
    key: '2',
    customerName: 'John Doe',
    email: 'john.doe@example.com',
    orders: 8,
    totalSpent: '$870',
    city: 'Los Angeles',
    lastSeen: 'Dec 11, 1:15 PM',
    lastOrder: 'Dec 8, 5:00 PM',
  },
  // Add other rows similarly
  {
    key: '3',
    customerName: 'John Doe',
    email: 'john.doe@example.com',
    orders: 8,
    totalSpent: '$870',
    city: 'Los Angeles',
    lastSeen: 'Dec 11, 1:15 PM',
    lastOrder: 'Dec 8, 5:00 PM',
  },
  {
    key: '4',
    customerName: 'John Doe',
    email: 'john.doe@example.com',
    orders: 8,
    totalSpent: '$870',
    city: 'Los Angeles',
    lastSeen: 'Dec 11, 1:15 PM',
    lastOrder: 'Dec 8, 5:00 PM',
  },
  {
    key: '5',
    customerName: 'John Doe',
    email: 'john.doe@example.com',
    orders: 8,
    totalSpent: '$870',
    city: 'Los Angeles',
    lastSeen: 'Dec 11, 1:15 PM',
    lastOrder: 'Dec 8, 5:00 PM',
  },
];

const CustomerTable: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Space>
          <Button icon={<ExportOutlined />}>Export</Button>
          <Button type="primary" icon={<PlusOutlined />}>
            Add customer
          </Button>
        </Space>
      </div>
      <Space className="w-full" direction="vertical">
        <Space className="w-full" wrap>
          <Input
            placeholder="Search customers"
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
          <Select
            defaultValue="city"
            style={{ width: 200 }}
            options={[
              { value: 'city', label: 'City' },
              { value: 'new_york', label: 'New York' },
              { value: 'los_angeles', label: 'Los Angeles' },
              { value: 'chicago', label: 'Chicago' },
            ]}
          />
          <Button>More filters</Button>
        </Space>
      </Space>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default CustomerTable;

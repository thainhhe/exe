

import React, { useState, useEffect } from 'react';
import { Table, Button, Card, message, Popconfirm, Switch, Input, Select, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Search } = Input;
const { Option } = Select;

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/admin/managerUser');
      setUsers(response.data.recordUser);
      setFilteredUsers(response.data.recordUser); // Initially show all users
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await axios.patch(`http://localhost:5000/admin/managerUser/change-status/${newStatus}/${userId}`);
      message.success(`User status changed to ${newStatus}`);
      fetchUsers();
    } catch (error) {
      message.error('Failed to change user status');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value.toLowerCase());
    filterUsers(value.toLowerCase(), statusFilter);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    filterUsers(searchTerm, value);
  };

  const filterUsers = (search: string, status: string) => {
    let filtered = users;

    if (search) {
      filtered = filtered.filter(
        (user) =>
          user.fullName.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          user.phone?.toLowerCase().includes(search)
      );
    }

    if (status) {
      filtered = filtered.filter((user) => user.status === status);
    }

    setFilteredUsers(filtered);
  };

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone?: string) => phone || 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: User) => (
        <Switch
          checked={status === 'active'}
          onChange={() => handleStatusChange(record._id, status)}
        />
      ),
    },
    // {
    //   title: 'Actions',
    //   key: 'actions',
    //   render: (_: any, record: User) => (
    //     <>
    //       <Button
    //         icon={<EditOutlined />}
    //         onClick={() => console.log('Edit user:', record)}
    //         style={{ marginRight: 8 }}
    //       />
    //       <Popconfirm
    //         title="Are you sure to delete this user?"
    //         onConfirm={() => console.log('Delete user:', record._id)}
    //         okText="Yes"
    //         cancelText="No"
    //       >
    //         <Button icon={<DeleteOutlined />} danger />
    //       </Popconfirm>
    //     </>
    //   ),
    // },
  ];

  return (
    <Card
      title="User Management"
      extra={
        <Button type="primary" icon={<UserAddOutlined />}>
          Add New User
        </Button>
      }
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Search
            placeholder="Search by name, email, or phone"
            onSearch={handleSearch}
            enterButton
          />
        </Col>
        <Col span={6}>
          <Select
            placeholder="Filter by status"
            style={{ width: '100%' }}
            onChange={handleStatusFilter}
            allowClear
          >
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        rowKey="_id"
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </Card>
  );
};

export default UserManagement;

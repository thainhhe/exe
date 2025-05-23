import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table, Statistic, Button, Divider, DatePicker, Radio, Space } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import type { RadioChangeEvent } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { Link } from 'react-router-dom';

const { RangePicker } = DatePicker;

interface Order {
  _id: string;
  user_id: string;
  userInfo: {
    email: string;
    fullname: string;
    phone: string;
    address: string;
  };
  products: {
    product_id: string;
    quantity: number;
    price: number;
    discountPercentage: number;
  }[];
  paymentMethod: string;
  status: string;
  total: number;
  createdAt: string;
}

interface User {
  _id: string;
  status: string;
  deleted: boolean;
  createdAt: string;
}



const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [pendingOrders, setPendingOrders] = useState<number>(0);
  const [filterType, setFilterType] = useState<'week' | 'month' | 'custom'>('week');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [inactiveUsers, setInactiveUsers] = useState<number>(0);
  const [newUsers, setNewUsers] = useState<number>(0);
  const [deletedUsers, setDeletedUsers] = useState<number>(0);

  // Get current date and start of week/month
  const getCurrentDateRange = (type: 'week' | 'month'): [Dayjs, Dayjs] => {
    const now = dayjs();
    const start = type === 'week' ? now.startOf('week') : now.startOf('month');
    return [start, now];
  };

  const [customerSpending, setCustomerSpending] = useState<
    { name: string; totalSpent: number; email: string }[]
  >([]);

  useEffect(() => {
    const calculateCustomerSpending = () => {
      const spendingData: { [key: string]: { name: string; email: string; totalSpent: number } } = {};

      orders.forEach(order => {
        const customerEmail = order.userInfo.email;
        if (!spendingData[customerEmail]) {
          spendingData[customerEmail] = {
            name: order.userInfo.fullname,
            email: customerEmail,
            totalSpent: 0,
          };
        }
        spendingData[customerEmail].totalSpent += order.total;
      });

      const sortedData = Object.values(spendingData).sort((a, b) => b.totalSpent - a.totalSpent);
      setCustomerSpending(sortedData);
    };

    if (orders.length > 0) {
      calculateCustomerSpending();
    }
  }, [orders]);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/order", { withCredentials: true });
        console.log(response.data.recordOrders
        );
        const ordersData = response.data.recordOrders;
        setOrders(ordersData);

        // Set initial date range to current week
        const [start, end] = getCurrentDateRange('week');
        setDateRange([start, end]);
        filterOrdersByDate(ordersData, [start, end]);

        // Calculate total stats from all orders
        const totalRev = ordersData.reduce((sum: number, order: Order) => sum + order.total, 0);
        const pendingCount = ordersData.filter((order: Order) => order.status === 'pending').length;

        setTotalRevenue(totalRev);
        setPendingOrders(pendingCount);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user", { withCredentials: true });
        const usersData = Array.isArray(response.data.recordUser) ? response.data.recordUser : [];

        if (usersData.length === 0) {
          console.log("No users found or incorrect data structure.");
        }

        // Calculate statistics
        const total = usersData.filter((user: User) => !user.deleted).length;
        const active = usersData.filter((user: User) => user.status === 'active').length;
        const inactive = usersData.filter((user: User) => user.status === 'inactive').length;
        const deleted = usersData.filter((user: User) => user.deleted).length;

        const currentDate = new Date();
        const oneMonthAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        const newUsersCount = usersData.filter((user: User) => new Date(user.createdAt) > oneMonthAgo).length;

        setTotalUsers(total);
        setActiveUsers(active);
        setInactiveUsers(inactive);
        setDeletedUsers(deleted);
        setNewUsers(newUsersCount);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchOrders();
    fetchUsers();
  }, []);

  const filterOrdersByDate = (ordersData: Order[], range: [Dayjs, Dayjs]) => {
    const filteredData = ordersData.filter(order => {
      const orderDate = dayjs(order.createdAt);
      return orderDate.isAfter(range[0]) && orderDate.isBefore(range[1]);
    });
    setFilteredOrders(filteredData);
  };

  const handleFilterChange = (e: RadioChangeEvent) => {
    const type = e.target.value as 'week' | 'month' | 'custom';
    setFilterType(type);

    if (type !== 'custom') {
      const range = getCurrentDateRange(type);
      setDateRange(range);
      filterOrdersByDate(orders, range);
    }
  };

  const handleDateRangeChange = (range: [Dayjs, Dayjs] | null) => {
    if (range) {
      setDateRange(range);
      filterOrdersByDate(orders, range);
    }
  };

  // Transform filtered orders data for the chart
  const chartData = filteredOrders.map(order => ({
    name: order.userInfo.fullname,
    total: order.total,
    date: dayjs(order.createdAt).format('YYYY-MM-DD')
  }));

  const columns = [
    {
      title: 'Customer Name',
      dataIndex: ['userInfo', 'fullname'],
      key: 'fullname',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `${total} VND`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span style={{
          color: status === 'pending' ? 'red' : 'green',
          textTransform: 'capitalize'
        }}>
          {status || 'Done'}
        </span>
      ),
    },
    // {
    //   title: 'Actions',
    //   key: 'actions',
    //   render: () => (
    //     <div>
    //       <Button type="primary" size="small">
    //         View Order
    //       </Button>
    //       <Divider type="vertical" />
    //     </div>
    //   ),
    // },
  ];

  return (
    <div>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="Total Revenue" value={totalRevenue} prefix="VND" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Total Orders" value={orders.length} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Pending Orders" value={pendingOrders} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Total Users" value={totalUsers} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic title="Active Users" value={activeUsers} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Inactive Users" value={inactiveUsers} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="New Users (Last Month)" value={newUsers} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Deleted Users" value={deletedUsers} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card
            title="Revenue Chart"
            extra={
              <Space>
                <Radio.Group value={filterType} onChange={handleFilterChange}>
                  <Radio.Button value="week">Tuần này</Radio.Button>
                  <Radio.Button value="month">Tháng này</Radio.Button>
                  <Radio.Button value="custom">Tùy chọn</Radio.Button>
                </Radio.Group>
                {filterType === 'custom' && (
                  <RangePicker
                    value={dateRange}
                    onChange={handleDateRangeChange}
                  />
                )}
              </Space>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                {/* <XAxis dataKey="name" /> */}
                <YAxis />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
                          <p style={{ margin: 0, fontWeight: 'bold' }}>Customer: {data.name}</p>
                          <p style={{ margin: 0 }}>Total: {data.total.toFixed(2)} VND</p>
                          <p style={{ margin: 0 }}>Date: {data.date}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>

          </Card>
        </Col>
        <Col span={12}>
          <Card title="Recent Orders">
            <Table
              dataSource={orders.slice(-5)}
              columns={columns}
              rowKey="_id"
              pagination={false}
            />
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              {/* <Button type="primary" >View All Orders</Button> */}
              <Link to="/admin/orders" className="btn btn-primary">View All Orders</Link>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Top Customers by Spending">
            <Table
              dataSource={customerSpending}
              columns={[
                {
                  title: 'Customer Name',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: 'Email',
                  dataIndex: 'email',
                  key: 'email',
                },
                {
                  title: 'Total Spent',
                  dataIndex: 'totalSpent',
                  key: 'totalSpent',
                  render: (value: number) => `$${value.toFixed(2)}`,
                },
              ]}
              rowKey="email"
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
      </Row>

    </div>
  );
};

export default Dashboard;
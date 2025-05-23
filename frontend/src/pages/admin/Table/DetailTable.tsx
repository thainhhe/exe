import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { get } from '../../../Helpers/API.helper';
import { bookingTable, User } from '../../../actions/types';
import { Button, Switch, Table } from 'antd';

function DetailTable() {
  const { id } = useParams();  // Using useParams to get the `id` from URL
  const [listBooking, setListBooking] = useState<bookingTable[]>([]);
  const [listUser, setListUser] = useState<User[]>([]);
  const navigate = useNavigate();

  // Fetch booking details
  useEffect(() => {
    const fetchBookingTable = async () => {
      try {
        console.log(`Fetching details for table ID: ${id}`);
        const response = await get(`http://localhost:5000/admin/table/getBooking/${id}`);
        console.log(response)
        setListBooking(response.recordBookingTables);
      } catch (error) {
        console.error('Error fetching table details:', error);
      }
    };
    fetchBookingTable();
  }, [id]);

  // Fetch list of users
  useEffect(() => {
    const fetchListUser = async () => {
      try {
        const response = await get(`http://localhost:5000/user/`);
        setListUser(response.recordUser);
      } catch (error) {
        console.log(error);
      }
    };
    fetchListUser();
  }, []);

  // Function to get the user's full name by user ID
  const getNameUserById = (userId: string) => {
    const user = listUser.find(user => user._id === userId);
    return user?.fullName || 'Unknown';
  };
  console.log(listBooking)

  // if(response){
  //   console.log("VÔ ĐÂY")
  //   await patch(`http://localhost:5000/admin/table/getBooking/status/${record._id}`, { status: updatedStatus });
  //   message.success('Table status updated successfully');
  //  } 
  
  // Define columns for the table
  const columns = [
    { title: 'User Name', dataIndex: 'user_id', key: 'user_id', render: (userId: string) => getNameUserById(userId) },  // Fetch user name
    { title: 'Date Booked', dataIndex: 'dateBook', key: 'dateBook' },
    { title: 'Time Booked', dataIndex: 'timeBook', key: 'timeBook' },
    { title: 'Quantity People', dataIndex: 'quantityUser', key: 'quantityUser' },
    { title: 'Gift', dataIndex: 'gift', key: 'gift' },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => {
        const date = new Date(createdAt);
        return `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
          <Switch
              checked={status}
              checkedChildren="Hoàn thành"
              unCheckedChildren="Đang dùng"
              // onChange={() => handleStatusChange(record)} 
          />
      ),
  },
    
    

  ];

  return (
    <>
      {/* Back button */}
      <Button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
        Back
      </Button>
    <Table
      dataSource={listBooking}
      columns={columns}
      pagination={{ pageSize: 10 }}
      rowKey="_id"
    />
    </>
  );
}

export default DetailTable;

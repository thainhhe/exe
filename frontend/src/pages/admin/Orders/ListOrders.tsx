import React, { useEffect, useState } from 'react';
import { ApiResponse, Order, Product } from '../../../actions/types';
import { get, patch } from '../../../Helpers/API.helper';
import { Button, Form, InputGroup, Row } from 'react-bootstrap';
import { RootState } from '../../../store/store';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Col } from 'antd';
import { showConfirmationAlert, showSuccessAlert } from '../../../Helpers/alerts';

function ListOrders() {
    const [orders, setOrders] = useState<Order[]>([]); // Orders data
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]); // Filtered orders
    const [products, setProducts] = useState<Product[]>([]); // Products data
    const account = useSelector((state: RootState) => state.AccountReducer);

    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending'>('all');
    const [filterPayment, setFilterPayment] = useState<'all' | '1' | '2'>('all'); // 1 = direct, 2 = QR
    const [filterProgress, setFilterProgress] = useState<'all' | 'Done' | 'Wait'>('all'); // 1 = direct, 2 = QR
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    interface ProductInOrder {
        product_id: string;
        quantity: number;
        price: number;
    }
    const fetchOrders = async () => {
        try {
            const data: ApiResponse = await get('http://localhost:5000/admin/orders');
            setOrders(data.recordOrders);
            setFilteredOrders(data.recordOrders); // Initialize filtered orders
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };
    useEffect(() => {
      
        fetchOrders();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await get('http://localhost:5000/products');
                setProducts(data.recordsProduct);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };
        fetchProducts();
    }, []);

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const status = event.target.value as 'all' | 'active' | 'pending';
        setFilterStatus(status);
        applyFilters(status, filterPayment, searchKeyword,filterProgress);
    };

    const handlePaymentFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const payment = event.target.value as 'all' | '1' | '2';
        setFilterPayment(payment);
        applyFilters(filterStatus, payment, searchKeyword,filterProgress);
    };
    const handleProgressFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const progress = event.target.value as 'all' | 'Done' | 'Wait';
        console.log(progress)
        setFilterProgress(progress);
        applyFilters(filterStatus, filterPayment, searchKeyword,progress);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = event.target.value;
        setSearchKeyword(keyword);
        applyFilters(filterStatus, filterPayment, keyword,filterProgress);
    };

    const applyFilters = (status: 'all' | 'active' | 'pending', payment: 'all' | '1' | '2', keyword: string,progress: 'all' | 'Done' | 'Wait') => {
        const filtered = orders.filter(order => {
            console.log(order.statusOrders)
            const matchesStatus = status === 'all' || order.statusPayment === status;
            const matchesPayment = payment === 'all' || order.paymentMethod === payment;
            const matchesProgress = progress === 'all' || order.statusOrders === progress;
            const matchesKeyword = order.userInfo.fullname.toLowerCase().includes(keyword.toLowerCase());
            return matchesStatus && matchesPayment && matchesKeyword && matchesProgress;
        });
        setFilteredOrders(filtered);
    };
    const handleStatusChange = async (productId: string, currentStatus: string) => {
        const newStatus = currentStatus === "active" ? "pending" : "active";
        console.log(newStatus)
        const isConfirmed = await showConfirmationAlert("Are you sure?", `Change status to "${newStatus}"?`, "Yes change it!");
    
        if (isConfirmed) {
          try {
            await patch(
              `http://localhost:5000/admin/orders/change-payment/${newStatus}/${productId}`,
              { status: newStatus }
            );
            showSuccessAlert("Success", `Trạng thái đã được cập nhật thành "${newStatus}".`);
            fetchOrders();
          } catch (error) {
            console.error("Error changing status:", error);
          }
        }
      };
      const handleStatusOrdersChange = async (productId: string, currentStatus: string) => {
        const newStatus = currentStatus === "Done" ? "Wait" : "Done";
        console.log(newStatus)
        const isConfirmed = await showConfirmationAlert("Are you sure?", `Change status to "${newStatus}"?`, "Yes change it!");
    
        if (isConfirmed) {
          try {
            await patch(
              `http://localhost:5000/admin/orders/change-order/${newStatus}/${productId}`,
              { status: newStatus }
            );
            showSuccessAlert("Success", `Trạng thái đã được cập nhật thành "${newStatus}".`);
            fetchOrders();
          } catch (error) {
            console.error("Error changing status:", error);
          }
        }
      };
      console.log(orders)

    const columns = [
        // { title: 'Id', dataIndex: [ '_id'], key: '_id' },
        { title: 'Tên', dataIndex: ['userInfo', 'fullname'], key: 'fullname' },
        { title: 'Email', dataIndex: ['userInfo', 'email'], key: 'email' },
        { title: 'Số điện thoại', dataIndex: ['userInfo', 'phone'], key: 'phone' },
        { title: 'Địa chỉ', dataIndex: ['userInfo', 'address'], key: 'address' },
        {
            title: 'Sản phẩm',
            dataIndex: 'products',
            key: 'products',
            render: (productsInOrder: ProductInOrder[]) => (
                <ul>
                    {productsInOrder.map((productInOrder: ProductInOrder, index: number) => {
                        const productDetail = products.find(product => product._id === productInOrder.product_id);
                        return productDetail ? (
                            <li key={index}>
                                {productDetail.title} - Số lượng: {productInOrder.quantity}- Giá: {productInOrder.price}
                            </li>
                        ) : (
                            <li key={index}>Sản phẩm không tìm thấy</li>
                        );
                    })}
                </ul>
            ),
        },
        { title: 'Phương thức thanh toán', dataIndex: 'paymentMethod', key: 'paymentMethod', render: (paymentMethod: string) => (paymentMethod === '1' ? 'Thanh toán trực tiếp' : 'QR') },
        { title: 'Tổng tiền', dataIndex: 'total', key: 'total', render: (total: number) => `${total.toLocaleString('vi-VN')}đ` },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (order: Order) => (
                account?.role.permission.includes('orders_update') && (
                    <Button variant={order.statusPayment === 'active' ? 'success' : 'danger'}
                    onClick={() => handleStatusChange(order._id, order.statusPayment)}
                    >
                        {order.statusPayment === 'active' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </Button>
                )
            ),
        },
        {
            title: 'Tình Trạng',
            key: 'status',
            render: (order: Order) => (
                account?.role.permission.includes('orders_update') && (
                    <Button variant={order.statusOrders === 'Done' ? 'success' : 'danger'}
                    onClick={() => handleStatusOrdersChange(order._id, order.statusOrders)}
                    >
                        {order.statusOrders === 'Done' ? 'Đã Giao' : 'Đang giao'}
                    </Button>
                )
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (order: Order) => (
                <Link to={`detail/${order._id}`} className="btn btn-primary">
                    Detail
                </Link>
            ),
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: string) =>
                new Date(createdAt).toLocaleString('vi-VN'),
            sorter: (a: Order, b: Order) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            
        },
        
    ];

    return (
        <div>
            <h2 className="text-center mb-4">Order Management</h2>
            <Row className="mb-3">
                <Col>
                    <h5>Search</h5>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Enter keyword"
                            value={searchKeyword}
                            onChange={handleSearchChange}
                        />
                    </InputGroup>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col md={6}>
                    <h5>Filter status</h5>
                    <Form.Select value={filterStatus} onChange={handleFilterChange}>
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                    </Form.Select>
                </Col>
                <Col md={6}>
                    <h5>Filter Progress</h5>
                    <Form.Select value={filterProgress} onChange={handleProgressFilterChange}>
                        <option value="all">All</option>
                        <option value="Done">Done</option>
                        <option value="Wait">Wait</option>
                    </Form.Select>
                </Col>
                <Col md={6}>
                    <h5>Filter Payment</h5>
                    <Form.Select value={filterPayment} onChange={handlePaymentFilterChange}>
                        <option value="all">All</option>
                        <option value="1">Thanh toán trực tiếp</option>
                        <option value="2">QR</option>
                    </Form.Select>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={filteredOrders}
                rowKey="_id"
                pagination={{ pageSize: 5 }} // Add pagination
            />
        </div>
    );
}

export default ListOrders;

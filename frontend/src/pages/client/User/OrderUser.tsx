import React, { useEffect, useState } from 'react';
import { ApiResponse, Order, Product } from '../../../actions/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { get } from '../../../Helpers/API.helper';
import { Button } from 'react-bootstrap';
import { Table } from 'antd';
function OrderUser() {
    const [orders, setOrders] = React.useState<Order[]>([]); // Initialize as an empty array
    const [products, setProducts] = useState<Product[]>([]); // Store products details

    const user = useSelector((state: RootState) => state.UserReducer);
    const user_id = user?.user._id;

    useEffect(() => {
        const fetchApiOrderByUserId = async () => {
            try {
                const data: ApiResponse = await get(`http://localhost:5000/orders/userOrder/${user_id}`);
                setOrders(data.OrderByUserId);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        if (user_id) {
            fetchApiOrderByUserId();
        }
    }, [user_id]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await get(`http://localhost:5000/products`);
                console.log(data.recordsProduct);
                setProducts(data.recordsProduct);
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };

        fetchProduct();
    }, []);
    console.log(orders)
    const columns = [
        {
            title: 'Tên',
            dataIndex: ['userInfo', 'fullname'],
            key: 'fullname',
        },
        {
            title: 'Email',
            dataIndex: ['userInfo', 'email'],
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: ['userInfo', 'phone'],
            key: 'phone',
        },
        {
            title: 'Địa chỉ',
            dataIndex: ['userInfo', 'address'],
            key: 'address',
        },
        {
            title: 'Sản phẩm',
            key: 'products',
            render: ( order: Order) => (
                <ul>
                    {order.products.map((productInOrder, index) => {
                        const productDetail = products.find((product) => product._id === productInOrder.product_id);
                        return productDetail ? (
                            <li key={index}>
                                 <strong> {productDetail.title}</strong> - 
                                 Số lượng: <strong>{productInOrder.quantity}</strong>- 
                                 Giá: <strong>{productInOrder.price}</strong>
                              
                            </li>
                        ) : (
                            <li key={index}>Sản phẩm không tìm thấy</li>
                        );
                    })}
                </ul>
            ),
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            render: (paymentMethod: string) => (paymentMethod === '1' ? 'Thanh toán trực tiếp' : 'Thanh toán trên QR'),
        },
        {
            title: 'Tổng tiền',
            key: 'total',
            render: ( order: Order) => (
                <Button>{order.total.toLocaleString('vi-VN')}đ</Button>
            ),
        },
        {
            title: 'Trạng thái thanh toán',
            key: 'statusPayment',
            render: ( order: Order) => (
                <Button variant={order.statusPayment === 'pending' ? 'danger' : 'success'}>
                    {order.statusPayment === 'pending' ? 'Chưa thanh toán' : 'Đã thanh toán'}
                </Button>
            ),
        },
        {
            title: 'Tình trạng đơn hàng',
            key: 'statusOrders',
            render: (order: Order) => (
                <Button variant={order.statusOrders === 'Done' ? 'success' : 'danger'}>
                    {order.statusOrders === 'Done' ? 'Đã Giao' : 'Đang giao'}
                </Button>
            ),
        },
        {
            title: 'Thời gian',
            dataIndex: ['createdAt'],
            key: 'createdAt',
            render: (createdAt: string) => new Date(createdAt).toLocaleString('vi-VN'),
        },
    ];

    return (
        <div>
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <Button variant="primary">Đơn hàng của tôi</Button>
        </div>

        {orders && orders.length > 0 ? (
            <Table
                dataSource={orders}
                columns={columns}
                rowKey={(record) => record._id}
                pagination={{ pageSize: 5 }} // Add pagination
                style={{ width: '80%', margin: '0 auto' }}
            />
        ) : (
            <p style={{ textAlign: 'center' }}>Bạn chưa có đơn hàng nào.</p>
        )}
    </div>
    );
}

export default OrderUser;

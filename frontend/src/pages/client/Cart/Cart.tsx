import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Card, Row, Col, Button, InputNumber, Typography, Space, Divider, Spin, message, Checkbox } from 'antd';
import { DeleteOutlined, PhoneOutlined, FacebookOutlined, ClockCircleOutlined, CheckOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { AppDispatch, RootState } from '../../../store/store';
import { useSelector, useDispatch } from 'react-redux';
// import { removeFromCart, updateQuantity } from '../../../actions/cartActions';
import axios from 'axios';
import { get } from '../../../Helpers/API.helper';
import { ApiResponse, Product } from '../../../actions/types';
import { removeItem, setCart, updateQuantity } from '../../../actions/CartAction';

const { Title, Text } = Typography;

const Breadcrumb: React.FC = () => {
  return (
    <nav aria-label="breadcrumb" style={{ padding: '10px', backgroundColor: '#f8f9fa' }}>
      <ol style={{ listStyle: 'none', display: 'flex', gap: '5px', fontSize: '14px', color: '#555' }}>
        <li>
          <Link to="/" style={{ color: 'black', textDecoration: 'none' }}>Home</Link>
        </li>
        <li style={{ color: 'black' }}> / </li>
        <li>
          <Link to="/cart" style={{ color: 'red', textDecoration: 'none' }}>Cart</Link>
        </li>
      </ol>
    </nav>
  );
};

export default function Cart() {
  const cart = useSelector((state: RootState) => state.cartReducer);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch: AppDispatch = useDispatch();

  const [selectedItems, setSelectedItems] = useState<string[]>([]); // Trạng thái để lưu các sản phẩm được chọn
  const navigate = useNavigate(); // Hook điều hướng
  const user = useSelector((state: RootState) => state.UserReducer);
  console.log(user?.user._id)
  const user_id = user?.user._id
  useEffect(() => {
    // Sử dụng hàm get để gọi API
    const fetchProducts = async () => {
      try {
        const response: ApiResponse = await get('http://localhost:5000/products');
        setProducts(response.recordsProduct);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  console.log(products)

  // Tính tổng tiền
  const totalPrice = cart.list.reduce((total, cartItem) => {
    const product = products.find((p) => p._id === cartItem.product_id);
    return product ? total + product.price * cartItem.quantity : total;
  }, 0);

  const handleQuantityChange = async (id: string, quantity: number) => {
    try {
      const userId = user_id;
      const currentItem = cart.list.find((item) => item.product_id === id);

      if (currentItem && quantity !== currentItem.quantity) {
        // Call API to update quantity directly
        await axios.put(`http://localhost:5000/cart/update/${userId}/${id}`, { quantity });

        // Update the quantity in Redux store
        dispatch(updateQuantity(id, quantity));

      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("An error occurred. Please try again later.");
      }
    }
  };
  const handleRemoveProduct = async (id: string) => {
    try {
      const userId = user_id;
      await axios.delete(`http://localhost:5000/cart/remove/${userId}/${id}`);
      // Remove the item from the Redux store
      dispatch(removeItem(id));
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };
  const removeAllItems = async () => {
    try {
      const userId = user_id;
      await axios.delete(`http://localhost:5000/cart/clear/${userId}`);
      // Clear the cart in Redux store
      dispatch(setCart({
        list: [],
        total: 0,
      }));
      localStorage.removeItem('cart'); // Clear cart from localStorage
    } catch (error) {
      console.error("Lỗi khi xóa toàn bộ giỏ hàng:", error);
    }
  };
  const handleCheckboxChange = (productId: string) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(productId)
        ? prevSelectedItems.filter((id) => id !== productId)
        : [...prevSelectedItems, productId]
    );
  };
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      message.warning("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
      return;
    }
    // Điều hướng sang trang thanh toán với danh sách sản phẩm được chọn
    navigate('checkout', { state: { selectedItems } });
  };
  console.log(selectedItems)


  return (
    <Layout.Content className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <Breadcrumb />

      {loading ? (
        <div className="text-center">
          <Spin tip="Đang tải sản phẩm..." />
        </div>
      ) : (

        <Row gutter={[32, 32]}>
          <Col xs={24} lg={16}>
            <Card title={<Title level={4}>Giỏ hàng ({cart.list.length} sản phẩm)</Title>}>
              {cart.list.length > 0 ? <>
                <Button onClick={removeAllItems} icon={<DeleteOutlined />}>
                  Delete All
                </Button>
              </> : <>
                <Button onClick={removeAllItems} icon={<ShoppingCartOutlined />} style={{ marginBottom: 10 }}>
                  Tiếp tục mua sắm
                </Button>
              </>}

              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {cart.list.length === 0 ? (
                  <Row justify="center">
                    <Col>
                      <Text>Giỏ hàng của bạn đang trống.</Text>
                    </Col>
                  </Row>

                ) : (

                  cart.list.map((cartItem) => {
                    const product = products.find((p) => p._id === cartItem.product_id);
                    if (!product) return null; // Nếu không tìm thấy sản phẩm, bỏ qua
                    return (

                      <Card key={cartItem.product_id} bordered={false} style={{ position: 'relative' }}>
                        <Row align="middle">
                          <Col xs={24}>
                            <Checkbox
                              checked={selectedItems.includes(cartItem.product_id)}
                              onChange={() => handleCheckboxChange(cartItem.product_id)}
                            >
                            </Checkbox>
                          </Col>
                          <Col xs={24} lg={6}>
                            <img
                              src={
                                product.thumbnail
                                  ? product.thumbnail.startsWith("http")
                                    ? product.thumbnail
                                    : `http://localhost:5000${product.thumbnail}`
                                  : "http://localhost:5000/path-to-placeholder-image.png"
                              }
                              alt={product.title}
                              style={{ width: '100px' }} />
                          </Col>

                          {/* Delete Button positioned at the top-right */}
                          <Col xs={6} lg={24} style={{ position: 'absolute', top: 10, right: 10 }}>
                            <Button
                              type="text"
                              icon={<DeleteOutlined />}
                              onClick={() => handleRemoveProduct(cartItem.product_id)}
                            >
                              Xóa
                            </Button>
                          </Col>

                          <Col xs={6} sm={12} md={16} lg={6}>
                            <Space direction="vertical">
                              <Title level={5}>{product.title}</Title>
                              <Text>Giá: {product.price.toLocaleString()}đ * {cartItem.quantity}</Text>
                            </Space>
                          </Col>

                          <Col xs={12} md={8} lg={6}>
                            <Button
                              onClick={() => handleQuantityChange(cartItem.product_id, cartItem.quantity - 1)}
                              disabled={cartItem.quantity <= 1} // Disable if quantity is 1
                            >
                              -
                            </Button>
                            <InputNumber
                              type="number"
                              min={1}
                              max={product.stock} // Set the max value based on the product stock
                              value={cartItem.quantity}
                              onChange={(value) => handleQuantityChange(cartItem.product_id, value && value > 0 ? value : 1)}
                            />
                            <Button
                              onClick={() => handleQuantityChange(cartItem.product_id, cartItem.quantity + 1)}
                              disabled={cartItem.quantity >= product.stock} // Disable if quantity is at stock limit
                            >
                              +
                            </Button>
                          </Col>

                          <Col xs={12} sm={8} md={12} lg={6}>
                            <Row>
                              <strong style={{ color: 'green', marginRight: "5px" }}>Total: </strong>
                              <Text strong>{(product.price * cartItem.quantity).toLocaleString()}đ</Text>
                            </Row>
                          </Col>
                        </Row>
                      </Card>

                    );
                  })
                )}
              </Space>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Thông tin khách hàng */}
              <Card title={<Title level={4}>Dịch vụ khách hàng</Title>}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Text>Bạn cần sự hỗ trợ từ chúng tôi? Hãy liên hệ ngay</Text>
                  <Space>
                    <PhoneOutlined />
                    <Text strong>0385 XXX XXX</Text>
                  </Space>
                  <Space>
                    <FacebookOutlined />
                    <Text strong>Chúng tôi trên Facebook</Text>
                  </Space>
                  <Space>
                    <ClockCircleOutlined />
                    <Text>Giờ mở cửa (07:00 - 22:00)</Text>
                  </Space>
                </Space>
              </Card>

              {/* Thông tin mua sắm */}
              <Card title={<Title level={4}>Mua sắm cùng CoffeeKing store</Title>}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Space>
                    <CheckOutlined className="text-green-500" />
                    <Text>Sản phẩm đẹp, thân thiện với môi trường</Text>
                  </Space>
                  <Space>
                    <CheckOutlined className="text-green-500" />
                    <Text>Không lo về giá</Text>
                  </Space>
                  <Space>
                    <CheckOutlined className="text-green-500" />
                    <Text>Miễn phí vận chuyển cho đơn hàng từ 1.500.000 VNĐ</Text>
                  </Space>
                </Space>
              </Card>

              {/* Tổng tiền */}
              <Card>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Row justify="space-between">
                    <Text>Tạm tính:</Text>
                    <Text strong>{totalPrice.toLocaleString()}đ</Text>
                  </Row>
                  <Divider style={{ margin: '12px 0' }} />
                  <Row justify="space-between">
                    <Text strong>Thành tiền:</Text>
                    <Text strong className="text-xl text-red-600">
                      {totalPrice.toLocaleString()}đ
                    </Text>
                  </Row>
                  <Button type="primary" onClick={handleCheckout} disabled={cart.list.length === 0}>
                   Mua hàng
                  </Button>
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>
      )}
    </Layout.Content>
  );
}

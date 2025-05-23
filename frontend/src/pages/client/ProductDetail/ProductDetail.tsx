import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Typography,
  Button,
  Layout,
  Breadcrumb,
  Row,
  Col,
  Tag,
  Divider,
  InputNumber,
  Image,
} from "antd";
import { ThunderboltOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { CartActionTypes, Product } from "../../../actions/types";
import { RootState } from "../../../store/store";
import { post } from "../../../Helpers/API.helper";
import { addToCart } from "../../../actions/CartAction";
import { Dispatch } from "redux";

const { Title, Text } = Typography;
const { Content } = Layout;

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);

  const user = useSelector((state: RootState) => state.UserReducer);

  const dispatch = useDispatch<Dispatch<CartActionTypes>>(); // Explicitly type the dispatch
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      // Nếu chưa đăng nhập, điều hướng đến trang login
      navigate("/user/login");
    }
    if (!product) return;
    // Lấy giỏ hàng từ localStorage
    const cartData = localStorage.getItem("cart");
    const cart = cartData ? JSON.parse(cartData) : { list: [] };

    // Tìm sản phẩm trong giỏ hàng
    const existingProduct = cart.list.find(
      (item: { product_id: string }) => item.product_id === product._id
    );
    console.log(existingProduct);
    const existingQuantity = existingProduct ? existingProduct.quantity : 0;

    console.log(existingQuantity);
    // Tính số lượng sau khi thêm
    const totalQuantity = existingQuantity + quantity;
    console.log(product.stock);
    if (totalQuantity > product.stock) {
      alert(
        `Không thể thêm sản phẩm. Chỉ còn ${product.stock} sản phẩm trong kho.`
      );
      return;
    }
    try {
      const data = await post(
        `http://localhost:5000/cart/add/${user?.user._id}`,
        {
          productId: product._id,
          quantity: quantity,
        }
      );

      if (data.message) {
        console.log("Product ID:", product._id, "Quantity:", quantity);
        console.log("Cart updated:", data.cartItems);
        dispatch(addToCart({ product_id: product._id, quantity }));
      } else {
        console.error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Helper function to save cart to local storage

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/products/detail/${slug}`
        );
        const data = await response.json();
        setProduct(data.products);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  const originalPrice =
    product.price / (1 - (product.discountPercentage || 0) / 100);

  return (
    <Layout>
      <Content style={{ padding: "0 50px", background: "white" }}>
        <Breadcrumb style={{ marginTop: "16px" }}>
          <Breadcrumb.Item>
            <a href="/">Home</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{product.title}</Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={[24, 24]}>
          <Col span={10}>
            <Card bordered={false}>
              <Image
                src={
                  product.thumbnail
                    ? product.thumbnail.startsWith("http")
                      ? product.thumbnail
                      : `http://localhost:5000${product.thumbnail}`
                    : "http://localhost:5000/path-to-placeholder-image.png"
                }
                alt={product.title}
              />
            </Card>
          </Col>

          <Col span={14}>
            <Card bordered={false}>
              <Tag color="red">TOP DEAL</Tag>
              <Tag color="blue">30 NGÀY ĐỔI TRẢ</Tag>
              <Tag color="blue">CHÍNH HÃNG</Tag>

              <Text type="secondary">Thương hiệu: {product.featured}</Text>
              <Title level={3}>{product.title}</Title>
              <Text type="secondary">Đã bán 10</Text>

              <Title level={2} style={{ color: "#ff424e" }}>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.price)}
              </Title>
              <Text delete type="secondary">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(originalPrice)}
              </Text>
              <Text type="secondary"> -{product.discountPercentage}%</Text>

              <Divider />
              <Title level={5}>{product.description}</Title>
              
              <br />
              <Text type="success">
                <ThunderboltOutlined /> Giao siêu tốc 2h
              </Text>
              <br />
              <Text type="success">Trước 10h ngày mai: Miễn phí</Text>
              <Text delete type="secondary">
                {" "}
                25.000đ
              </Text>

              <Divider />

              <Row align="middle" gutter={16}>
                <Col>
                  <Text>Số Lượng</Text>
                </Col>
                <Col>
                  <InputNumber
                    min={1}
                    max={product.stock}
                    value={quantity}
                    onChange={(value) => setQuantity(value as number)}
                  />
                </Col>
                <Col>
                  <Text type="secondary">{product.stock} sản phẩm có sẵn</Text>
                </Col>
              </Row>


             
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}>
                  <Button
                    block
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    onClick={handleAddToCart}
                  >
                    
                    Thêm vào giỏ
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ProductDetail;

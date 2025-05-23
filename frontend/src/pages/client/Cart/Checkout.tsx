import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  message,
  Input,
  Select,
  Modal,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { ApiResponse, Product } from "../../../actions/types";
import { get, post } from "../../../Helpers/API.helper";
import { Option } from "antd/es/mentions";
import axios from "axios";
import { removeSelectedProductsFromCart } from "../../../actions/CartAction";
import CheckPayment from "./CheckPayment";

const { Title, Text } = Typography;

interface Ward {
  code: string;
  name: string;
}

interface DistrictResponse {
  data: {
    wards: Ward[];
  };
}
// interface OrderData {
//     user_id: string | undefined;
//     userInfo: { email: string; fullname: string; phone: string; address: string; }[];
//     products: { product_id: string; quantity: number | undefined; price: number; discountPercentage: number; }[];
//     paymentMethod: string;
//     status: string;
//     total: number;
// }

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const [products, setProducts] = useState<Product[]>([]);
  const [productsInCart, setProductsInCart] = useState<Product[]>([]);

  const cart = useSelector((state: RootState) => state.cartReducer);
  const user = useSelector((state: RootState) => state.UserReducer);

  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const user_id = user?.user._id;
  const selectedItems = location.state?.selectedItems || [];

  const [selectedDistrict] = useState(276);
  const [wards, setWards] = useState<Ward[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("1"); // '1' is Direct Payment by default
  const [showQRCode, setShowQRCode] = useState<boolean>(false); // To control QR Code visibility
  const [totalAmount, setTotalAmount] = useState<number>(0); // For QR Code amount calculation
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [paymentCheckText, setPaymentCheckText] = useState("");

  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        try {
          const response: DistrictResponse = await axios.get(
            `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`
          );
          setWards(response.data.wards);
        } catch (error) {
          console.error("Error fetching wards:", error);
          message.error("Lỗi khi tải dữ liệu phường xã.");
        }
      };

      fetchWards();
    }
  }, [selectedDistrict]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response: ApiResponse = await get(
          "http://localhost:5000/products"
        );
        setProducts(response.recordsProduct);
      } catch (error) {
        console.error("Error fetching products:", error);
        message.error("Không thể tải sản phẩm.");
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await get(
          `http://localhost:5000/user/info/${user_id}`
        );
        setUserData({
          fullName: userInfo.detailUser.fullName,
          email: userInfo.detailUser.email,
          phone: userInfo.detailUser.phone as string,
          address: userInfo.detailUser.address,
        });
      } catch (error) {
        console.error("Error fetching user information:", error);
        message.error("Lỗi khi tải thông tin người dùng.");
      }
    };

    fetchUserInfo();
  }, [user_id]);

  useEffect(() => {
    if (selectedItems.length === 0) {
      message.warning("Không có sản phẩm nào được chọn. Quay lại giỏ hàng.");
      navigate("/cart");
    } else {
      const fetchCart = async () => {
        try {
          const data = await get(`http://localhost:5000/cart/${user_id}`);
          const filterProductInCart = data.cartItems.products.filter(
            (product) => selectedItems.includes(product.product_id)
          );
          const product = products.filter((productItem) =>
            filterProductInCart.find(
              (item) => item.product_id === productItem._id
            )
          );
          setProductsInCart(product);
        } catch (error) {
          console.error("Error fetching cart:", error);
          message.error("Lỗi khi tải giỏ hàng.");
        }
      };

      fetchCart();
    }
  }, [selectedItems, navigate, user_id, products]);

  const totalPrice = productsInCart.reduce((total, product) => {
    const cartItem = cart.list.find((item) => item.product_id === product._id);
    if (cartItem) {
      return total + product.price * cartItem.quantity;
    }
    return total;
  }, 0);

  const handleSaveUserInfo = () => {
    if (!userData.fullName || !userData.phone || !userData.address) {
      message.error(
        "Vui lòng điền đầy đủ thông tin giao hàng trước khi đặt hàng."
      );
      return;
    }
    setIsEditing(false);
    message.success("Thông tin giao hàng đã được lưu.");
  };
  const generateRandomText = (length: number) => {
    const allowedCharacters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomChar = allowedCharacters.charAt(
        Math.floor(Math.random() * allowedCharacters.length)
      );
      result += randomChar;
    }
    return result;
  };
  const generateQRCodeUrl = (amount: number, message: string) => {
    return `https://img.vietqr.io/image/ICB-102874686355-compact2.png?amount=${amount}&addInfo=${message}`;
  };

  const orderData = {
    user_id: user_id,
    userInfo: {
      email: userData.email,
      fullname: userData.fullName,
      phone: userData.phone,
      address: userData.address,
    },

    products: productsInCart.map((product) => {
      const cartItem = cart.list.find(
        (item) => item.product_id === product._id
      );
      return {
        product_id: product._id,
        quantity: cartItem?.quantity,
        price: product.price,
        discountPercentage: product.discountPercentage || 0,
      };
    }),
    paymentMethod: paymentMethod,
    statusPayment: paymentMethod === "2" ? "active" : "pending",
    statusOrders: "Wait",
    total: totalPrice,
  };

  const unitTexts = [
    "",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];
  const hundredsTexts = [
    "",
    "nghìn",
    "triệu",
    "tỷ",
    "nghìn tỷ",
    "triệu tỷ",
    "tỷ ty",
  ];
  function read3Number(number: number, checkNumber = false) {
    const absNumber = Math.abs(number);
    const hundreds = Math.floor(absNumber / 100);
    const remainder = absNumber % 100;
    const tens = Math.floor(remainder / 10);
    const units = remainder % 10;

    let result = "";

    if (hundreds > 0) {
      result += unitTexts[hundreds] + " trăm ";
    } else if (checkNumber && (tens > 0 || units > 0)) {
      result += " không trăm ";
    }

    if (tens > 1) {
      result += unitTexts[tens] + " mươi ";
    } else if (tens === 1) {
      result += "mười ";
    } else if (checkNumber && units > 0) {
      result += "lẻ ";
    }

    if (tens > 1 && units === 1) {
      result += "mốt";
    } else if (tens > 0 && units === 5) {
      result += "lăm";
    } else if (units > 0) {
      result += unitTexts[units];
    }
    return result.trim();
  }

  function readNumber(number: number) {
    let result = "";
    let index = 0;
    let absNumber = Math.abs(number);
    const lastIndex = Math.floor(String(absNumber).length / 3);

    if (!absNumber) return "Không đồng";

    do {
      const hashScale = index !== lastIndex;

      const threeDigits = read3Number(absNumber % 1000, hashScale);

      if (threeDigits) {
        result = `${threeDigits} ${hundredsTexts[index]} ${result}`;
      }

      absNumber = Math.floor(absNumber / 1000);
      index++;
    } while (absNumber > 0);

    return result.trim() + " đồng";
  }
  const handleCheckout = async (paymentMethod: string) => {
    if (!userData.fullName || !userData.phone || !userData.address) {
      message.error(
        "Vui lòng điền đầy đủ thông tin giao hàng trước khi đặt hàng."
      );
      const utterance = new SpeechSynthesisUtterance(
        `Vui lòng điền đầy đủ thông tin giao hàng trước khi đặt hàng.`
      );
      utterance.lang = "vi-VN";
      window.speechSynthesis.speak(utterance);
      return;
    }

    const textToRead = readNumber(totalPrice);
    const utterance = new SpeechSynthesisUtterance(
      `Số tiền cần thanh toán là:${textToRead}`
    );
    utterance.lang = "vi-VN";
    window.speechSynthesis.speak(utterance);

    // Show QR Code if payment method is QR code
    if (paymentMethod === "2") {
      await handleQRCodePayment();
    } else {
      await handleDirectPayment();
    }
  };
  const handleQRCodePayment = async () => {
    console.log(orderData);
    setTotalAmount(totalPrice); // Set totalAmount for QR code
    const randomText = generateRandomText(10);
    setPaymentCheckText(randomText);
    setQrCodeValue(generateQRCodeUrl(totalPrice, randomText));
    setShowQRCode(true); // Show QR code modal
  };
  const handleOrderPlacement = async () => {
    try {
      const responseAddOrder: ApiResponse = await post(
        "http://localhost:5000/checkout/order",
        orderData
      );
      if (!responseAddOrder.message) {
        message.success(responseAddOrder.message);
        return;
      }

      // Remove selected items from the cart
      const responseRemoveItem: ApiResponse = await post(
        `http://localhost:5000/cart/removeSelected/${user_id}`,
        { selectedItems }
      );
      console.log(responseRemoveItem);
      dispatch(removeSelectedProductsFromCart(selectedItems));

      message.info("You will be redirected to the homepage in 3 seconds...");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Error placing order:", error);
      message.error("An error occurred while placing your order.");
    }
  };

  const handleDirectPayment = async () => {
    console.log(orderData);

    try {
      const updateResponse = await updateProductQuantities();

      // Check if product quantity update was successful
      if (!updateResponse.success) {
        message.error(
          `Quá nhiều người mua cùng lúc nên số lượng hiện tại không đủ. Hãy kiểm tra lại`
        );
        return; // Stop further execution if there's an error in quantity update
      }
      const responseAddOrder: ApiResponse = await post(
        "http://localhost:5000/checkout/order",
        orderData
      );
      if (responseAddOrder.message) {
        message.success(responseAddOrder.message);
      }
      const responseRemoveItem: ApiResponse = await post(
        `http://localhost:5000/cart/removeSelected/${user_id}`,
        { selectedItems }
      );
      console.log(responseRemoveItem);
      dispatch(removeSelectedProductsFromCart(selectedItems));
      // await updateProductQuantities();
      message.info("You will be redirected to the homepage in 3 seconds...");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Lỗi khi xử lý đơn hàng:", error);
      message.error("Có lỗi xảy ra trong quá trình thanh toán.");
    }
  };

  const updateProductQuantities = async () => {
    try {
      const promises = productsInCart.map(async (product) => {
        const cartItem = cart.list.find(
          (item) => item.product_id === product._id
        );
        if (cartItem) {
          // Prepare the data to update the product quantity
          const updateData = {
            productId: product._id,
            quantitySold: cartItem.quantity, // Subtract this from the stock
          };

          console.log(updateData);
          // Send an API request to update the product quantity
          const response = await post(
            "http://localhost:5000/products/update-quantity",
            updateData
          );
          if (response.message === "Product out of stock") {
            throw new Error("Product out of stock");
          }
        }
      });

      // Wait for all product quantity updates to complete
      await Promise.all(promises);

      return { success: true };
    } catch (error) {
      console.error("Error updating product quantities:", error);
      message.error("Failed to update product quantities.");
      return { success: false, message: error };
    }
  };

  const handleModalClose = () => {
    setShowQRCode(false);
  };
  return (
    <div className="container mx-auto py-8 px-4">
      <Row>
        <Col span={24}>
          <Card title={<Title level={4}>Xác nhận thanh toán.</Title>}>
            <Card style={{ marginBottom: 16 }}>
              <Title level={5}>
                Thông tin người nhận. Vui lòng kiểm tra lại thông tin địa chỉ
              </Title>
              {isEditing ? (
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Input
                    placeholder="Tên đầy đủ"
                    value={userData.fullName}
                    onChange={(e) =>
                      setUserData({ ...userData, fullName: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Số điện thoại"
                    value={userData.phone}
                    onChange={(e) =>
                      setUserData({ ...userData, phone: e.target.value })
                    }
                  />
                  <Select
                    style={{ width: "15%" }}
                    placeholder="Chọn Xã/Phường"
                    value={userData.address}
                    onChange={(value) =>
                      setUserData({ ...userData, address: value })
                    }
                  >
                    {wards.map((ward) => (
                      <Option key={ward.code} value={ward.name}>
                        {ward.name}
                      </Option>
                    ))}
                  </Select>
                  <Button type="primary" onClick={handleSaveUserInfo}>
                    Lưu thông tin
                  </Button>
                </Space>
              ) : (
                <Space direction="vertical">
                  <Text>
                    <strong>Tên:</strong> {userData.fullName}
                  </Text>
                  <Text>
                    <strong>Email:</strong> {userData.email}
                  </Text>
                  <Text>
                    <strong>Số điện thoại:</strong> {userData.phone}
                  </Text>
                  <Text>
                    <strong>Địa chỉ:</strong> {userData.address}
                  </Text>
                  <Button type="link" onClick={() => setIsEditing(true)}>
                    Sửa thông tin giao hàng
                  </Button>
                </Space>
              )}
            </Card>

            {/* Cart items display */}
            {productsInCart.length === 0 ? (
              <Text>Không có sản phẩm nào trong giỏ hàng của bạn.</Text>
            ) : (
              productsInCart.map((product) => {
                const cartItem = cart.list.find(
                  (item) => item.product_id === product._id
                );
                if (!cartItem) return null;

                return (
                  <Card
                    key={product._id}
                    bordered={false}
                    style={{ position: "relative" }}
                  >
                    <Row align="middle">
                      <Col xs={12} sm={8} md={6} lg={6}>
                        <img
                          src={
                            product.thumbnail
                              ? `http://localhost:5000${product.thumbnail}`
                              : "http://localhost:5000/path-to-placeholder-image.png"
                          }
                          alt={product.title}
                          style={{ width: "100px" }}
                        />
                      </Col>
                      <Col xs={12} sm={10} md={12} lg={12}>
                        <Space direction="vertical">
                          <Title level={5}>{product.title}</Title>
                          <Text>
                            Giá: {product.price.toLocaleString()}đ *{" "}
                            {cartItem.quantity}
                          </Text>
                        </Space>
                      </Col>
                      <Col xs={12} sm={6} md={6} lg={6}>
                        <Row>
                          <strong
                            style={{ color: "green", marginRight: "5px" }}
                          >
                            Total:{" "}
                          </strong>
                          <Text strong>
                            {(
                              product.price * cartItem.quantity
                            ).toLocaleString()}
                            đ
                          </Text>
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                );
              })
            )}

            {/* Total amount and payment method */}
            <Card style={{ marginTop: "20px" }}>
              <Row justify="space-between">
                <Text>
                  <strong>Tổng tiền:</strong>
                </Text>
                <Text>{totalPrice.toLocaleString()}đ</Text>
              </Row>
              <Row justify="space-between" style={{ marginTop: "10px" }}>
                <Text>
                  <strong>Phương thức thanh toán</strong>
                </Text>
                <Select
                  value={paymentMethod}
                  onChange={(value) => setPaymentMethod(value)}
                  style={{ width: "200px" }}
                >
                  <Option value="1">Thanh toán trực tiếp</Option>
                  <Option value="2">QR Code</Option>
                </Select>
              </Row>

              <Button
                type="primary"
                style={{ marginTop: "10px" }}
                onClick={() => handleCheckout(paymentMethod)}
              >
                Tiến hành thanh toán
              </Button>
              {/* QR Code Modal */}
              <Modal
                visible={showQRCode}
                onCancel={handleModalClose}
                footer={null}
                maskClosable={false} // Không cho phép người dùng đóng Modal bằng cách nhấn vào nền
                closable={true} // Cho phép người dùng đóng Modal bằng dấu "X"
              >
                <h6 style={{ textAlign: "center" }}>
                  Vui Lòng chuyển khoản đúng số tiền. Mọi lỗi về chuyển thiếu or
                  thừa chúng tôi không hỗ trợ
                </h6>
                <img
                  src={qrCodeValue}
                  alt="QR Code"
                  style={{ maxWidth: "100%" }}
                />
                <p style={{ textAlign: "center" }}>
                  <strong>Quét mã để thanh toán</strong>
                </p>
                <CheckPayment
                  totalMoney={totalAmount}
                  txt={paymentCheckText}
                  onPaymentSuccess={handleOrderPlacement}
                />
              </Modal>
            </Card>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

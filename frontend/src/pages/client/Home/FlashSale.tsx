import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Carousel } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { CarouselRef } from "antd/lib/carousel";
import "./flashSale.css";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  stock: number;
  thumbnail: string;
  status: string;
  featured: string;
  position: number;
  deleted: boolean;
  slug: string;
  flashSaleStart?: string;
  flashSaleEnd?: string;
}

const FlashSale = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const carouselRef = useRef<CarouselRef>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/products");
        const data = await response.json();

        // Debug logs
        // console.log("All products:", data.recordsProduct);

        // Filter featured products and log the process
        const featuredProducts = data.recordsProduct.filter(
          (product: Product) => {
            // console.log(`Product ${product.title} - featured status:`, product.featured);
            return (
              product.featured === "1" &&
              !product.deleted &&
              product.discountPercentage &&
              product.discountPercentage > 0 &&
              product.flashSaleEnd &&
              new Date(product.flashSaleEnd) > new Date()
            );
          }
        );

        // console.log("Filtered featured products:", featuredProducts);

        setProducts(featuredProducts);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Debug log when products state changes
  useEffect(() => {
    // console.log("Products state updated:", products);
  }, [products]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Debug log before render
  // console.log("Current products length:", products.length);

  const CountdownTimer: React.FC<{ endTime: string; productId: string }> = ({
    endTime,
    productId,
  }) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
      const calculateTimeLeft = () => {
        const difference = +new Date(endTime) - +new Date();
        setTimeLeft(difference > 0 ? difference : 0);

        // Ẩn sản phẩm khi hết thời gian
        if (difference <= 0) {
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product._id !== productId)
          );
        }
      };

      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);

      return () => clearInterval(timer);
    }, [endTime, productId]);

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    if (timeLeft === 0) {
      return null; // Không hiển thị gì khi hết thời gian
    }

    return (
      <div className="countdown-timer">
        <ClockCircleOutlined /> Còn lại: {days}d {hours}h {minutes}m {seconds}s
      </div>
    );
  };

  return (
    <div className="flash-sale-container">
      <div className="flash-sale-header">
        <div className="flash-sale-title">
          <span className="flash-sale-text">
            ⚡ Flash Sale ({products.length})
          </span>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="carousel-container">
          <Button
            icon={<LeftOutlined />}
            className="carousel-arrow carousel-arrow-left"
            shape="circle"
            onClick={() => carouselRef.current?.prev()}
          />
          <Button
            icon={<RightOutlined />}
            className="carousel-arrow carousel-arrow-right"
            shape="circle"
            onClick={() => carouselRef.current?.next()}
          />
          <Carousel ref={carouselRef} slidesToShow={4} dots={false}>
            {products.map((product) => (
              <div key={product._id} className="product-card-wrapper">
                <div className="product-overlay">
                  <Link to={`/listProducts/detail/${product.slug}`}>
                    <Button
                      type="primary"
                      danger
                      className="buy-button"
                      disabled={product.stock === 0}
                    >
                      <ShoppingCartOutlined />
                      {product.stock > 0 ? "Chọn mua" : "Hết hàng"}
                    </Button>
                  </Link>
                </div>
                <Card
                  cover={
                    <div className="product-image-container">
                      <img
                        src={
                          product.thumbnail
                            ? product.thumbnail.startsWith("http")
                              ? product.thumbnail
                              : `http://localhost:5000${product.thumbnail}`
                            : "http://localhost:5000/path-to-placeholder-image.png"
                        }
                        alt={product.title}
                        className="product-image"
                        style={{
                          width: "100%",
                          height: "300px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  }
                  className="product-card"
                >
                  <h3 className="product-name text-center">{product.title}</h3>
                  <div className="product-price d-flex justify-content-center align-items-center">
                    <span className="discount">
                      {product.discountPercentage}%
                    </span>

                    {product.discountPercentage &&
                    product.discountPercentage > 0 ? (
                      <span className="original-price">
                        {formatPrice(
                          product.price * (1 + product.discountPercentage / 100)
                        )}
                      </span>
                    ) : null}

                    <span className="sale-price">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  {product.flashSaleStart && product.flashSaleEnd && (
                    <CountdownTimer
                      endTime={product.flashSaleEnd}
                      productId={product._id}
                    />
                  )}
                  <div className="stock-status text-center">
                    Còn lại: {product.stock}
                  </div>
                </Card>
              </div>
            ))}
          </Carousel>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "20px" }}>
          Không có sản phẩm giảm giá
        </div>
      )}
    </div>
  );
};

export default FlashSale;



import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button, Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import type { CarouselRef } from "antd/lib/carousel";
import "./featured.css"; // Import the CSS file

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
}

const FeaturedProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const carouselRef = useRef<CarouselRef>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/products");
        const data = await response.json();

        const featuredProducts = data.recordsProduct.filter(
          (product: Product) => {
            return (
              product.featured === "1" &&
              !product.deleted &&
              !product.discountPercentage
            );
          }
        );

        setProducts(featuredProducts);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="flash-sale-container">
      <div className="flash-sale-header">
        <div className="flash-sale-title">
          <span className="flash-sale-text">
            ⚡ SẢN PHẨM NỔI BẬT ({products.length})
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
                <div className="product-card">
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
                  <h3 className="product-name">{product.title}</h3>
                  <div className="price" style={{ textAlign: "center" }}>
                            {formatPrice(product.price)}
                          </div>
                  <div className="stock-status">Còn lại: {product.stock}</div>
                  <div className="card-overlay">
                    <Link to={`/listProducts/detail/${product.slug}`}>
                      <div className="purchase-container">
                        <button className="purchase-button">
                          Chọn mua{" "}
                        </button>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "20px" }}>
          Không có sản phẩm nổi bật
        </div>
      )}
    </div>
  );
};

export default FeaturedProduct;

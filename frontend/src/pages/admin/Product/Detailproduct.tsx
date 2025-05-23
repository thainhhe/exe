import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { get } from "../../../Helpers/API.helper";
import { Account, Product } from "../../../actions/types";

function DetailProduct(): JSX.Element {
  const { id } = useParams<{ id: string }>(); // Get the product ID from the URL
  const [product, setProduct] = useState<Product | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]); // State to store account list
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product details when the component mounts
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const data = await get(
          `http://localhost:5000/admin/products/detail/${id}`
        );
        console.log(data);
        setProduct(data.detailProduct);
        setLoading(false);
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]); // Dependency array includes id to refetch if it changes

  console.log(product);
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await get("http://localhost:5000/admin/accounts");
        setAccounts(data.recordsAccount);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);
  console.log(accounts);

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Handle case where no product is found
  if (!product) {
    return <div>No product found</div>;
  }

  // const getAccountNameById = (accountId: string): string => {
  //   const account = accounts.find((acc) => acc._id === accountId);
  //   return account ? account.fullName : "Not found";
  // };

  // Render the product details
  return (
    <div className="container mt-5">
      <div className="row">
        {/* Page Title */}
        <div className="col-md-12 text-center mb-4">
          <h1>Detail sản phẩm</h1>
        </div>
      </div>

      <div className="row">
        {/* Product Thumbnail */}
        <div className="col-md-6">
          <div className="card">
            <div
              className="d-flex justify-content-center align-items-center mt-3"
              style={{ height: "400px" }}
            >
              <img
                src={
                  product.thumbnail
                    ? product.thumbnail.startsWith("http")
                      ? product.thumbnail
                      : `http://localhost:5000${product.thumbnail}`
                    : "http://localhost:5000/path-to-placeholder-image.png" // Placeholder image URL
                }
                alt={product.title || "Placeholder Image"}
                className="img-fluid" // Use Bootstrap class for responsiveness
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  borderRadius: "10px",
                }} // Ensures the image does not exceed the card dimensions
              />
            </div>
            <div className="card-body text-center">
              <h5 className="card-title">Ảnh sản phẩm</h5>
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              {/* Title */}
              <div className="mb-3">
                <label className="fw-bold">Tiêu đề:</label>
                <p>{product.title}</p>
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="fw-bold">Mô tả:</label>
                <p>{product.description}</p>
              </div>

              {/* Price */}
              <div className="mb-3">
                <label className="fw-bold">Giá:</label>
                <p>{product.price} VND</p>
              </div>

              {/* Discount Percentage */}
              <div className="mb-3">
                <label className="fw-bold">Phần trăm giảm giá:</label>
                <p>{product.discountPercentage}%</p>
              </div>

              {/* Stock */}
              <div className="mb-3">
                <label className="fw-bold">Số lượng trong kho:</label>
                <p>{product.stock}</p>
              </div>

              {/* Position */}
              <div className="mb-3">
                <label className="fw-bold">Vị trí:</label>
                <p>{product.position}</p>
              </div>

              {/* Status */}
              <div className="mb-3">
                <label className="fw-bold">Trạng thái:</label>
                <p>
                  {product.status === "active" ? "Hoạt động" : "Dừng hoạt động"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Updated By Accounts List */}
      {/* <div style={{ border: "3px solid", marginTop: "10px", padding: "10px" }}>
        <h5>Cập nhật bởi:</h5>
        <ul>
          {product.updatedBy.map((item) => (
            <li key={item._id}>
              {getAccountNameById(item.account_id)} - Time:{" "}
              {new Date(item.updatedAt).toLocaleString("vi-VN")}
              <ul>
                {item.changes &&
                  Object.keys(item.changes).map((key) => (
                    <li key={key}>
                      {key}: From "{item.changes[key].from}" To "
                      {item.changes[key].to}"
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </div> */}

      {/* Back Button */}
      <div className="row mt-4">
        <div className="col-md-12 text-center">
          <Link to="/admin/products">
            <button className="btn btn-secondary btn-lg">Quay lại</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DetailProduct;

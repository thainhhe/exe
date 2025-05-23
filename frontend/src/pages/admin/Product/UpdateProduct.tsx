import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { get, patch } from "../../../Helpers/API.helper";
import { ApiResponse, Product, ProductCategory } from "../../../actions/types";
import { showErrorAlert, showSuccessAlert } from "../../../Helpers/alerts";
import { Button } from "react-bootstrap";


function UpdateProduct() {
  const { id } = useParams<{ id: string }>(); // Type params
  const [product, setProduct] = useState<Product>();
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch product details when the component mounts
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const data: ApiResponse = await get(`http://localhost:5000/admin/products/detail/${id}`);
        setProduct(data.detailProduct);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data: ApiResponse = await get("http://localhost:5000/admin/products-category");
        setCategories(data.recordsCategory);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Render categories as a tree
  const renderSelectTree = (records: ProductCategory[], level: number = 0) => {
    return records.filter(item => !item.deleted && item.status === "active")
      .map((item) => {
        const prefix = Array(level + 1).join("-- ");
        return (
          <React.Fragment key={item._id}>
            <option value={item._id}>
              {prefix} {item.title}
            </option>
            {item.children &&
              item.children.length > 0 &&
              renderSelectTree(item.children.filter((child) => !child.deleted && child.status === "active"), level + 1)}
          </React.Fragment>
        );
      });
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    // Ensure product is defined
    if (product) {
      // Append product fields to formData
      Object.keys(product).forEach((key) => {
        const value = product[key as keyof Product];
        if (value !== null && value !== undefined) {
          formData.append(key, value as string | Blob);
        }
      });

      // If a new file is selected, append it to the formData
      const fileInput = document.getElementById("thumbnail") as HTMLInputElement;
      if (fileInput?.files && fileInput.files.length > 0) {
        formData.append("thumbnail", fileInput.files[0]);
      }

    } else {
      console.error("Product is not defined");
      showErrorAlert("Failed", "File update was not successful!");
      return;
    }

    // Handle submission
    try {
      await patch(`http://localhost:5000/admin/products/edit/${id}?_method=PATCH`, formData);
      showSuccessAlert("Success!", "Product updated successfully!");

      // Navigate after a success notification delay
      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);
    } catch (error) {
      showErrorAlert("Failed", "Product update was not successful!");
      console.error("Error during product update:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Update Product</h1>
      <Link to="/admin/products" className="btn btn-primary ml-2 mb-3" >
        Back
      </Link>
      {product ? (
        <>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Title */}
            <div className="form-group mb-3">
              <label htmlFor="title">Tiêu đề</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={product.title}
                onChange={(e) => setProduct({ ...product, title: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group mb-3">
              <label htmlFor="description">Mô tả</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows={4}
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
              />
            </div>

            {/* Product Category */}
            <div className="form-group mb-3">
              <label htmlFor="product_category_id">Danh mục cha</label>
              <select
                name="product_category_id"
                id="product_category_id"
                className="form-control"
                value={product.product_category_id}
                onChange={(e) => setProduct({ ...product, product_category_id: e.target.value })}
              >
                <option value="">--Chọn danh mục cha--</option>
                {renderSelectTree(categories)}
              </select>
            </div>

            {/* Price */}
            <div className="form-group mb-3">
              <label htmlFor="price">Giá</label>
              <input
                type="number"
                className="form-control"
                id="price"
                name="price"
                min="0"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: +e.target.value })}
              />
            </div>

            {/* Discount Percentage */}
            <div className="form-group mb-3">
              <label htmlFor="discountPercentage">Phần trăm giảm giá</label>
              <input
                type="number"
                className="form-control"
                id="discountPercentage"
                name="discountPercentage"
                step="0.01"
                min="0"
                value={product.discountPercentage}
                onChange={(e) => setProduct({ ...product, discountPercentage: +e.target.value })}
              />
            </div>
            {/* Flash Sale Start */}
            <div className="form-group mb-3">
              <label htmlFor="flashSaleStart">Flash Sale Start</label>
              <input
                type="datetime-local"
                className="form-control"
                id="flashSaleStart"
                name="flashSaleStart"
                value={product.flashSaleStart || ''}
                onChange={(e) => setProduct({ ...product, flashSaleStart: e.target.value })}
              />
            </div>

            {/* Flash Sale End */}
            <div className="form-group mb-3">
              <label htmlFor="flashSaleEnd">Flash Sale End</label>
              <input
                type="datetime-local"
                className="form-control"
                id="flashSaleEnd"
                name="flashSaleEnd"
                value={product.flashSaleEnd || ''}
                onChange={(e) => setProduct({ ...product, flashSaleEnd: e.target.value })}
              />
            </div>

            {/* Stock */}
            <div className="form-group mb-3">
              <label htmlFor="stock">Số lượng trong kho</label>
              <input
                type="number"
                className="form-control"
                id="stock"
                name="stock"
                value={product.stock}
                onChange={(e) => setProduct({ ...product, stock: +e.target.value })}
              />
            </div>

            {/* Thumbnail */}
            <div className="form-group mb-3">
              <label htmlFor="thumbnail">Ảnh sản phẩm</label>
              <input
                type="file"
                className="form-control"
                id="thumbnail"
                name="thumbnail"
                accept="image/*"
                onChange={handleFileChange}
              />
              {filePreview ? (
                <img
                  src={filePreview}
                  alt="Product Preview"
                  className="upload-image-preview"
                  style={{ width: "10%", marginTop: "10px" }}
                />
              ) : (
                product.thumbnail && typeof product.thumbnail === "string" && (
                  <img
                    src={product.thumbnail.startsWith("http") ? product.thumbnail : `http://localhost:5000${product.thumbnail}`}
                    alt={product.title}
                    className="upload-image-preview"
                    style={{ width: "10%", marginTop: "10px" }}
                  />
                )
              )}
            </div>

            {/* Position */}
            <div className="form-group mb-3">
              <label htmlFor="position">Vị trí</label>
              <input
                type="number"
                className="form-control"
                id="position"
                name="position"
                value={product.position}
                onChange={(e) => setProduct({ ...product, position: +e.target.value })}
              />
            </div>

            {/* Featured */}
            <div className="form-group mb-3">
              <label>Featured:</label>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  className="form-check-input"
                  id="statusFeatured"
                  name="Featured"
                  value="1"
                  checked={product.featured === "1"}
                  onChange={(e) => setProduct({ ...product, featured: e.target.value })}
                />
                <label htmlFor="statusFeatured" className="form-check-label">
                  Featured
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  className="form-check-input"
                  id="statusInActive"
                  name="Uneatured"
                  value="0"
                  checked={product.featured === "0"}
                  onChange={(e) => setProduct({ ...product, featured: e.target.value })}
                />
                <label htmlFor="statusInActive" className="form-check-label">
                  UnFeatured
                </label>
              </div>
            </div>

            {/* Status */}
            <div className="form-group mb-3">
              <label>Trạng thái:</label>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  className="form-check-input"
                  id="statusActive"
                  name="status"
                  value="active"
                  checked={product.status === "active"}
                  onChange={(e) => setProduct({ ...product, status: e.target.value })}
                />
                <label htmlFor="statusActive" className="form-check-label">
                  Active
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  className="form-check-input"
                  id="statusInActive"
                  name="status"
                  value="inactive"
                  checked={product.status === "inactive"}
                  onChange={(e) => setProduct({ ...product, status: e.target.value })}
                />
                <label htmlFor="statusInActive" className="form-check-label">
                  Inactive
                </label>
              </div>
            </div>

            <Button type="submit" className="btn btn-primary mr-2" style={{ marginRight: "20px" }}>
              Update
            </Button>

          </form>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default UpdateProduct;

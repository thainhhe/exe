import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { get, post } from "../../../Helpers/API.helper";
import { ApiResponse, ProductCategory } from "../../../actions/types";
import { APIADMIN } from "../../../Helpers/APILink";
import { showErrorAlert, showSuccessAlert } from "../../../Helpers/alerts";

const CreateProduct: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [productCategoryId, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [position, setPosition] = useState<number | string>(""); // Adjust type if needed
  const [status, setStatus] = useState<string>("active");
  const [featured, setFeatured] = useState<string>("1");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data: ApiResponse = await get(`${APIADMIN}/products-category`);
        console.log(data);
        console.log("Categories fetched:", data.recordsCategory);
        setCategories(data.recordsCategory); // Assume the API returns an array of categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("discountPercentage", discountPercentage.toString());
    formData.append("stock", stock.toString());
    formData.append("product_category_id", selectedCategory);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    formData.append("position", position.toString());
    formData.append("status", status);
    formData.append("featured", featured);

    console.log(selectedCategory);
    try {
      await post(`${APIADMIN}/products/create`, formData);
      showSuccessAlert("Success!", "Product updated successfully!");


      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);
    } catch (error) {
      showErrorAlert("Failed!", "You can again");
      console.error("Submission error:", error);
    }
  };

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

  return (
    <div>
      <h1>Create Product</h1>
      <Form onSubmit={handleSubmit}>
        {/* Title */}
        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        {/* Description */}
        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        {/* Price */}
        <Form.Group controlId="formPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            min="0"
          />
        </Form.Group>

        {/* Discount Percentage */}
        <Form.Group controlId="formDiscountPercentage">
          <Form.Label>Discount Percentage</Form.Label>
          <Form.Control
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(Number(e.target.value))}
            min="0"
          />
        </Form.Group>

        {/* Stock */}
        <Form.Group controlId="formStock">
          <Form.Label>Stock</Form.Label>
          <Form.Control
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            required
            min="0"
          />
        </Form.Group>

        {/* Position */}
        <Form.Group controlId="formPosition">
          <Form.Label>Position</Form.Label>
          <Form.Control
            type="number"
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            placeholder="auto increase"
          />
        </Form.Group>

        {/* Category Selection */}
        <Form.Group controlId="formCategory">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">-- Choose a Category --</option>
            {renderSelectTree(productCategoryId)}
          </Form.Control>
        </Form.Group>

        {/* Featured (Radio buttons) */}
        <Form.Group>
          <Form.Label>Featured:</Form.Label>
          <div>
            <Form.Check
              type="radio"
              id="statusFeatured"
              label="Featured"
              name="featured"
              value="1"
              checked={featured === "1"}
              onChange={() => setFeatured("1")}
            />
            <Form.Check
              type="radio"
              id="statusUnfeatured"
              label="Unfeatured"
              name="featured"
              value="0"
              checked={featured === "0"}
              onChange={() => setFeatured("0")}
            />
          </div>
        </Form.Group>

        {/* Status (Radio buttons) */}
        <Form.Group>
          <Form.Label>Status:</Form.Label>
          <div>
            <Form.Check
              type="radio"
              id="statusActive"
              label="Active"
              name="status"
              value="active"
              checked={status === "active"}
              onChange={() => setStatus("active")}
            />
            <Form.Check
              type="radio"
              id="statusInactive"
              label="Inactive"
              name="status"
              value="inactive"
              checked={status === "inactive"}
              onChange={() => setStatus("inactive")}
            />
          </div>
        </Form.Group>

        {/* Thumbnail Upload */}
        <Form.Group controlId="formThumbnail">
          <Form.Label>Thumbnail</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => {
              const target = e.target as HTMLInputElement; // Cast to HTMLInputElement
              if (target.files && target.files.length > 0) {
                setThumbnail(target.files[0]);
              }
            }}
            accept="image/*"
          />
        </Form.Group>

        {/* Submit Button */}
        <Button variant="primary" type="submit">
          Create Product
        </Button>
      </Form>
    </div>
  );
};

export default CreateProduct;

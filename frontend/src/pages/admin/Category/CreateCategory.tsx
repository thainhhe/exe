import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { get, post } from "../../../Helpers/API.helper";
import { ProductCategory } from "../../../actions/types";
const CreateCategory: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [newThumbnailPreview, setNewThumbnailPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [position, setPosition] = useState<number | "">(""); // Allow position to be a number or an empty string
  const [status, setStatus] = useState<"active" | "inactive">("active"); // State for status
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await get("http://localhost:5000/admin/products-category");
        console.log("data", data.recordsCategory);
        setCategories(data.recordsCategory); 
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Render category tree as options for select input
  const renderSelectTree = (records: ProductCategory[], level: number = 0) => {
    return records.map((item) => {
      const prefix = Array(level + 1).join("-- ");
      return (
        <React.Fragment key={item._id}>
          <option value={item._id} selected={item._id === selectedCategory}>
            {prefix} {item.title}
          </option>
          {/* Render child categories if they exist */}
          {item.children && item.children.length > 0 && renderSelectTree(item.children, level + 1)}
        </React.Fragment>
      );
    });
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;
    setThumbnail(file);
    
    // Nếu người dùng chọn ảnh mới, tạo URL xem trước
    if (file) {
      setNewThumbnailPreview(URL.createObjectURL(file));
    } else {
      setNewThumbnailPreview(null); // Nếu không có file, xóa ảnh xem trước
    }
  };
  
  console.log(newThumbnailPreview)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("parent_id", selectedCategory);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail); // Append file if available
    }
    formData.append("position", position.toString()); // Convert position to string for FormData
    formData.append("status", status);

    console.log({ title, description, parent_id: selectedCategory, thumbnail, position, status });
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    console.log("categoryData", formData);

    try {
      await post("http://localhost:5000/admin/products-category/create", formData);
      
      navigate('/admin/products-category');
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <div>
      <h1>Thêm mới danh mục sản phẩm</h1>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Title */}
        <Form.Group controlId="formTitle">
          <Form.Label>Tiêu đề</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        {/* Parent Category */}
        <Form.Group controlId="formParentCategory">
          <Form.Label>Danh mục cha</Form.Label>
          <Form.Control
            as="select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">-- Chọn danh mục cha --</option>
            {renderSelectTree(categories)} {/* Call renderSelectTree */}
          </Form.Control>
        </Form.Group>

        {/* Description */}
        <Form.Group controlId="formDescription">
          <Form.Label>Mô tả</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        {/* Thumbnail Upload */}
        {/* Thumbnail Upload */}
        <Form.Group controlId="formThumbnailUpload">
          <Form.Label>Ảnh đại diện</Form.Label>
          <Form.Control
            type="file"
            onChange={handleFileChange} // Gọi hàm handleFileChange
            accept="image/*"
           
          />
          {newThumbnailPreview && (
            <div className="mt-3">
              <img src={newThumbnailPreview} alt="Thumbnail Preview" width="150px" />
            </div>
          )}
        </Form.Group>



        {/* Position */}
        <Form.Group controlId="formPosition">
          <Form.Label>Vị trí</Form.Label>
          <Form.Control
            type="number"
            value={position}
            onChange={(e) => setPosition(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="auto increase"
          />
        </Form.Group>

        {/* Status (Radio buttons) */}
        <Form.Group>
          <Form.Label>Trạng thái:</Form.Label>
          <div>
            <Form.Check
              type="radio"
              id="statusActive"
              label="Hoạt động"
              name="status"
              value="active"
              checked={status === "active"}
              onChange={() => setStatus("active")}
            />
            <Form.Check
              type="radio"
              id="statusInActive"
              label="Dừng hoạt động"
              name="status"
              value="inactive"
              checked={status === "inactive"}
              onChange={() => setStatus("inactive")}
            />
          </div>
        </Form.Group>

        {/* Submit Button */}
        <Button variant="primary" type="submit">
          Tạo mới
        </Button>
      </Form>
    </div>
  );
};

export default CreateCategory;

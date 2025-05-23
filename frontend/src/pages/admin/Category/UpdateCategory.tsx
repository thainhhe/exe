import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { get, post } from "../../../Helpers/API.helper";
import { ProductCategory } from "../../../actions/types";
import { showSuccessAlert } from "../../../Helpers/alerts";

const UpdateCategory: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [position, setPosition] = useState<number | "">("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [currentThumbnail, setCurrentThumbnail] = useState<string | null>(null); // Hiển thị hình ảnh hiện tại
  const [newThumbnailPreview, setNewThumbnailPreview] = useState<string | null>(null); // Hiển thị hình ảnh mới
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Lấy chi tiết danh mục và đổ dữ liệu vào form
    const fetchCategoryDetails = async () => {
      try {
        const data = await get(`http://localhost:5000/admin/products-category/detail/${id}`);
        const category = data.detailCategory; // Điều chỉnh dựa trên cấu trúc phản hồi API
        console.log(category);
        setTitle(category.title);
        setDescription(category.description);
        setSelectedCategory(category.parent_id || "");
        setPosition(category.position || "");
        setStatus(category.status);
        setCurrentThumbnail(category.thumbnail || null); // Đặt URL của thumbnail hiện tại
      } catch (error) {
        console.error("Error fetching category details:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await get("http://localhost:5000/admin/products-category");
        setCategories(data.recordsCategory);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategoryDetails();
    fetchCategories();
  }, [id]);

  // Xử lý chọn tệp ảnh mới
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;
    setThumbnail(file);
    
    // Nếu người dùng chọn ảnh mới, tạo URL xem trước
    if (file) {
        console.log(URL.createObjectURL(file))
      setNewThumbnailPreview(URL.createObjectURL(file));
    } else {
      setNewThumbnailPreview(null); // Nếu không có file, xóa ảnh xem trước
    }
  };

  // Render danh mục dưới dạng cây trong select
  const renderSelectTree = (records: ProductCategory[], level: number = 0) => {
    return records.map((item) => {
      const prefix = Array(level + 1).join("-- ");
      return (
        <React.Fragment key={item._id}>
          <option value={item._id} selected={item._id === selectedCategory}>
            {prefix} {item.title}
          </option>
          {item.children && item.children.length > 0 && renderSelectTree(item.children, level + 1)}
        </React.Fragment>
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("parent_id", selectedCategory);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    formData.append("position", position.toString());
    formData.append("status", status);

    try {
      await post(`http://localhost:5000/admin/products-category/edit/${id}`, formData);
      showSuccessAlert("Success!", "Category updated successfully!");
      // Quay lại danh sách danh mục
      setTimeout(() => {
        navigate("/admin/products-category");
      }, 1500);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div>
      <h1>Cập nhật danh mục sản phẩm</h1>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Tiêu đề */}
        <Form.Group controlId="formTitle">
          <Form.Label>Tiêu đề</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        {/* Danh mục cha */}
        <Form.Group controlId="formParentCategory">
          <Form.Label>Danh mục cha</Form.Label>
          <Form.Control
            as="select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">-- Chọn danh mục cha --</option>
            {renderSelectTree(categories)}
          </Form.Control>
        </Form.Group>

        {/* Mô tả */}
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

        {/* Thumbnail hiện tại */}
        {currentThumbnail && !newThumbnailPreview && (
          <div className="mb-3">
            <Form.Label>Ảnh hiện tại:</Form.Label>
            <div>
              <img
                src={`http://localhost:5000${currentThumbnail}`}
                alt="Current Thumbnail"
                width="150px"
              />
            </div>
          </div>
        )}

        {/* Ảnh mới được chọn */}
        {newThumbnailPreview && (
          <div className="mb-3">
            <Form.Label>Ảnh mới đã chọn:</Form.Label>
            <div>
              <img src={newThumbnailPreview} alt="New Thumbnail Preview" width="150px" />
            </div>
          </div>
        )}

        {/* Upload ảnh mới */}
        <Form.Control
          type="file"
          onChange={handleFileChange}
          accept="image/*"
        />

        {/* Vị trí */}
        <Form.Group controlId="formPosition">
          <Form.Label>Vị trí</Form.Label>
          <Form.Control
            type="number"
            value={position}
            onChange={(e) => setPosition(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="auto increase"
          />
        </Form.Group>

        {/* Trạng thái */}
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
              id="statusInactive"
              label="Dừng hoạt động"
              name="status"
              value="inactive"
              checked={status === "inactive"}
              onChange={() => setStatus("inactive")}
            />
          </div>
        </Form.Group>

        {/* Nút cập nhật */}
        <Button variant="primary" type="submit">
          Cập nhật
        </Button>
      </Form>
    </div>
  );
};

export default UpdateCategory;

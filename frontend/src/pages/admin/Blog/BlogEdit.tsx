
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Blog {
  _id: string;
  title: string;
  description: string;
  status: string;
  position: number;
  thumbnail: string;
}

const BlogEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Partial<Blog>>({
    title: '',
    description: '',
    status: 'active',
    position: 0,
  });
  
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formChanged, setFormChanged] = useState(false);
  const [initialFormData, setInitialFormData] = useState<Partial<Blog>>({});

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/admin/blog/listBlog`);
        const blog = response.data.recordBlog.find((blog: Blog) => blog._id === id);
        
        if (blog) {
          const blogData = {
            title: blog.title,
            description: blog.description,
            status: blog.status,
            position: blog.position,
          };
          setFormData(blogData);
          setInitialFormData(blogData);
          setPreviewImage(`http://localhost:5000${blog.thumbnail}`);
        }
      } catch (err) {
        setError('Failed to fetch blog details');
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  // Kiểm tra thay đổi form
  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialFormData) || thumbnail !== null;
    setFormChanged(hasChanges);
  }, [formData, thumbnail, initialFormData]);

  // Xử lý cảnh báo khi rời trang
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (formChanged) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formChanged]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);
    
    try {
      const submitData = new FormData();
      
      submitData.append('title', formData.title || '');
      submitData.append('description', formData.description || '');
      submitData.append('status', formData.status || 'active');
      submitData.append('position', formData.position?.toString() || '');
  
      if (thumbnail) {
        submitData.append('thumbnail', thumbnail);
      }
  
      const response = await axios.patch(
        `http://localhost:5000/admin/blog/edit/${id}`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
  
      if (response.data.message === "Blog updated successfully") {
        setSuccessMessage('Cập nhật blog thành công!');
        setFormChanged(false);
        setTimeout(() => {
          navigate('/admin/blogs');
        }, 1500);
      }
  
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật blog';
      setError(errorMessage);
      console.error('Error updating blog:', err.response?.data || err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (formChanged) {
      if (window.confirm('Bạn có chắc muốn hủy các thay đổi?')) {
        navigate('/admin/blogs');
      }
    } else {
      navigate('/admin/blogs');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Chỉnh sửa Blog</h2>

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Tiêu đề</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Mô tả</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={5}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="position" className="form-label">Vị trí</label>
          <input
            type="number"
            className="form-control"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="status" className="form-label">Trạng thái</label>
          <select
            className="form-select"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            disabled={isSubmitting}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="thumbnail" className="form-label">Hình ảnh</label>
          <input
            type="file"
            className="form-control"
            id="thumbnail"
            name="thumbnail"
            onChange={handleFileChange}
            accept="image/*"
            disabled={isSubmitting}
          />
          {previewImage && (
            <div className="mt-2 position-relative" style={{ maxWidth: '200px' }}>
              <img
                src={previewImage}
                alt="Preview"
                className="img-fluid"
              />
              {thumbnail && (
                <button
                  type="button"
                  className="btn btn-sm btn-danger position-absolute top-0 end-0"
                  onClick={() => {
                    setThumbnail(null);
                    setPreviewImage(`http://localhost:5000${initialFormData.thumbnail}`);
                  }}
                  disabled={isSubmitting}
                >
                  ×
                </button>
              )}
            </div>
          )}
        </div>

        <div className="d-flex gap-2">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting || !formChanged}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Đang cập nhật...
              </>
            ) : (
              'Cập nhật'
            )}
          </button>
          
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogEdit;
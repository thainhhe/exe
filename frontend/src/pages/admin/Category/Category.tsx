import React, { useEffect, useState } from "react";
import { Button, Col, Row, Pagination, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";
import { del, get, patch } from "../../../Helpers/API.helper";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { ProductCategory } from "../../../actions/types";
import { showConfirmationAlert, showSuccessAlert } from "../../../Helpers/alerts";

const Category: React.FC = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const itemsPerPage = 1;
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDeleted, setFilterDeleted] = useState<string>("all");

  const account = useSelector((state: RootState) => state.AccountReducer);

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      const data = await get("http://localhost:5000/admin/products-category");
      setCategories(data.recordsCategory);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleStatusChange = async (productId: string, currentStatus: "active" | "inactive") => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const isConfirmed = await showConfirmationAlert("Are you sure?", `Change status to "${newStatus}"?`, "Yes change it!");

    if (isConfirmed) {
      try {
        await patch(
          `http://localhost:5000/admin/products-category/change-status/${newStatus}/${productId}`,
          { status: newStatus }
        );
        showSuccessAlert("Success", `Trạng thái đã được cập nhật thành "${newStatus}".`);
        fetchCategory();
      } catch (error) {
        console.error("Error changing status:", error);
      }
    }
  };

  const handleDelete = async (productId: string, deleted: string) => {
    let isConfirmed;
    let actionMessage;
    if (deleted === "active") {
      isConfirmed = await showConfirmationAlert("Are you sure?", "Do you want to undelete this category?", "Yes undelete it!");
      actionMessage = "Khôi phục thành công";
    } else {
      isConfirmed = await showConfirmationAlert("Are you sure?", "Do you want to delete this category?", "Yes delete it!");
      actionMessage = "Xóa thành công";
    }

    if (isConfirmed) {
      try {
        await del(`http://localhost:5000/admin/products-category/delete/${productId}`);
        showSuccessAlert("Success", actionMessage);
        fetchCategory();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const filterCategories = (
    categories: ProductCategory[],
    searchTerm: string,
    filterStatus: string,
    filterDeleted: string
  ): ProductCategory[] => {
    return categories
      .map((category) => {
        const filteredChildren = filterCategories(category.children || [], searchTerm, filterStatus, filterDeleted);
        const matchesStatus = filterStatus === "all" || category.status === filterStatus;
        const matchesDeleted =
          filterDeleted === "all" || category.deleted === (filterDeleted === "deleted" ? true : false);
        const matchesSearchTerm = category.title.toLowerCase().includes(searchTerm.toLowerCase()) || filteredChildren.length > 0;

        if (matchesSearchTerm && matchesStatus && matchesDeleted) {
          return { ...category, children: filteredChildren };
        }
        return null;
      })
      .filter((category) => category !== null) as ProductCategory[];
  };

  const renderTableRows = (records: ProductCategory[], level: number = 1) => {
    return records.map((item, index = 0) => {
      const prefix = Array(level).join("-- ");
      return (
        <React.Fragment key={item._id}>
          <tr>
            <td>{index + 1}</td>
            <td>
              <img
                src={item.thumbnail ? (item.thumbnail.startsWith("http") ? item.thumbnail : `http://localhost:5000${item.thumbnail}`) : "http://localhost:5000/path-to-placeholder-image.png"}
                alt={item.title || "Placeholder Image"}
                width="100px"
                height="auto"
              />
            </td>
            <td>{prefix} {item.title}</td>
            <td>
              {item.accountFullName}
              <br />
              {item.createdBy.createdAt && new Date(item.createdBy.createdAt).toLocaleString("vi-VN")}
            </td>
            <td>
              {account && account.role.permission.includes("products-category_create") && (
                <Button variant={item.status === "active" ? "success" : "danger"} 
                onClick={() => handleStatusChange(item._id, item.status)}
                disabled={item.deleted}
                >
                  {item.status === "active" ? "Active" : "Inactive"}
                </Button>
              )}
            </td>
            <td>{item.deleted ? <h6 className="text-danger">Đã xóa</h6> : <h6 className="text-success">Chưa xóa</h6>}</td>
            <td>
              <Link to={`detail/${item._id}`} className={`btn btn-primary me-2 ${item.deleted ? 'disabled' : ''}`}>Detail</Link>
              {account && account.role.permission.includes("products-category_create") && (
                <Link to={`edit/${item._id}`} className={`btn btn-warning me-2 ${item.deleted ? 'disabled' : ''}`}>Update</Link>
              )}
              {account && account.role.permission.includes("products-category_delete") && (
                <Button variant={item.deleted ? "success" : "danger"} onClick={() => handleDelete(item._id, item.deleted ? "active" : "deleted")} className="ms-2">
                  {item.deleted ? "Undelete" : "Delete"}
                </Button>
              )}
            </td>
          </tr>
          {item.children && item.children.length > 0 && renderTableRows(item.children, level + 1)}
        </React.Fragment>
      );
    });
  };

  const filteredCategories = filterCategories(categories, searchTerm, filterStatus, filterDeleted);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>


      {account && account.role.permission.includes("products-category_view") && (
        <>
           <h1 className="mb-4">Category Management</h1>   
           <Row>
        <Col md={4} className="mb-3">
          <FormControl
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>

        {/* Filter by Status */}
        <Col md={4} className="mb-3">
          <FormControl as="select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </FormControl>
        </Col>

        {/* Filter by Deleted */}
        <Col md={4} className="mb-3">
          <FormControl as="select" value={filterDeleted} onChange={(e) => setFilterDeleted(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Not Deleted</option>
            <option value="deleted">Deleted</option>
          </FormControl>
        </Col>
      </Row>     
          {account.role.permission.includes("products-category_create") && (
            <Row>
              <Col md={12} className="d-flex justify-content-end mb-4">
                <Link to="/admin/products-category/create" className="btn btn-success">Create category</Link>
              </Col>
            </Row>
          )}

          <form action="" method="POST" id="form-delete-item">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Thumbnail</th>
                  <th>Title</th>
                  <th>Create By</th>
                  <th>Status</th>
                  <th>isDeleted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{renderTableRows(paginatedCategories)}</tbody>
            </table>
          </form>

          {/* Pagination controls */}
          <Pagination className="justify-content-center">
            {[...Array(totalPages)].map((_, pageIndex) => (
              <Pagination.Item key={pageIndex} active={pageIndex + 1 === currentPage} onClick={() => handlePageChange(pageIndex + 1)}>
                {pageIndex + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </div>
  );
};

export default Category;

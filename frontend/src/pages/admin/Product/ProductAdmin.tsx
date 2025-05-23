import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Row,
  Table,
  Form,
  InputGroup,
  Pagination
} from "react-bootstrap";

import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { del, get, patch } from "../../../Helpers/API.helper";
import { Product } from "../../../actions/types";
import {
  showConfirmationAlert,
  showSuccessAlert,
} from "../../../Helpers/alerts";
import { Link } from "react-router-dom";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [filterDeleted, setFilterDeleted] = useState<
    "all" | "deleted" | "undeleted"
  >("all");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("position-desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4; // Number of products per page

  const account = useSelector((state: RootState) => state.AccountReducer);
  console.log(account);
  console.log(account?.role.permission.includes("products_update"));

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await get("http://localhost:5000/admin/products");
      setProducts(data.recordsProduct);
      setFilteredProducts(data.recordsProduct);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const status = event.target.value as "all" | "active" | "inactive";
    setFilterStatus(status);
    updateFilteredProducts(status, searchKeyword, sortOrder, filterDeleted);
  };

  console.log(filterStatus);
  const handleDeletedFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const deleted = event.target.value as "all" | "deleted" | "undeleted";
    setFilterDeleted(deleted);
    updateFilteredProducts(filterStatus, searchKeyword, sortOrder, deleted);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value;
    setSearchKeyword(keyword);
    updateFilteredProducts(filterStatus, keyword, sortOrder, filterDeleted);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const order = event.target.value;
    setSortOrder(order);
    updateFilteredProducts(filterStatus, searchKeyword, order, filterDeleted);
  };

  const updateFilteredProducts = (
    status: "all" | "active" | "inactive",
    keyword: string,
    order: string,
    deletedStatus: "all" | "deleted" | "undeleted"
  ) => {
    const filtered = products.filter((product) => {
      const matchesStatus = status === "all" || product.status === status;
      const matchesKeyword = product.title
        .toLowerCase()
        .includes(keyword.toLowerCase());
      const matchesDeleted =
        deletedStatus === "all" ||
        product.deleted === (deletedStatus === "deleted");
      return matchesStatus && matchesKeyword && matchesDeleted;
    });

    const sorted = filtered.sort((a, b) => {
      switch (order) {
        case "position-asc":
          return a.position - b.position;
        case "position-desc":
          return b.position - a.position;
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    setFilteredProducts(sorted);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleStatusChange = async (
    productId: string,
    currentStatus: string
  ) => {
    const status = currentStatus === "active" ? "inactive" : "active";

    const isConfirmed = await showConfirmationAlert(
      "Are you sure?",
      `Change status to "${status}"?`,
      "Yes change it!"
    );

    if (isConfirmed) {
      try {
        const response = await patch(
          `http://localhost:5000/admin/products/change-status/${status}/${productId}`,
          { status: status }
        );
        console.log(response);
        fetchProducts();
      } catch (error) {
        console.error("Error changing status:", error);
      }
    }
  };

  const handleDelete = async (productId: string, deleted: string) => {
    let isConfirmed;
    let actionMessage;

    if (deleted === "active") {
      isConfirmed = await showConfirmationAlert(
        "Are you sure?",
        "Do you want to Undelete this category?",
        "Yes Undelete it!"
      );
      actionMessage = "Khôi phục thành công";
    } else {
      isConfirmed = await showConfirmationAlert(
        "Are you sure?",
        "Do you want to delete this category?",
        "Yes delete it!"
      );
      actionMessage = "Xóa thành công";
    }

    if (isConfirmed) {
      try {
        await del(`http://localhost:5000/admin/products/delete/${productId}`);
        showSuccessAlert("Success", actionMessage);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <Container className="my-4">
      {account?.role.permission.includes("products_view") && (
        <>
          <h1 className="text-center mb-4">Product List</h1>
          <Row className="mb-3">
            <Col>
            <h5>Search</h5>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Enter keyword"
                  value={searchKeyword}
                  onChange={handleSearchChange}
                />
              </InputGroup>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
            <h5>Filter status</h5>
              <Form.Select value={filterStatus} onChange={handleFilterChange}>
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Col>
            <Col md={6}>
            <h5>Filter deleted</h5>
              <Form.Select
                value={filterDeleted}
                onChange={handleDeletedFilterChange}
              >
                <option value="all">All</option>
                <option value="deleted">Deleted</option>
                <option value="undeleted">Undeleted</option>
              </Form.Select>
            </Col>
          </Row>

          <h5>Sort</h5>
          <Row className="mb-5">
            {/* Phần sort */}
            <Col md={8}>
              <Form.Select value={sortOrder} onChange={handleSortChange}>
                <option value="">Default</option>
                <option value="position-desc">Vị trí giảm dần</option>
                <option value="position-asc">Vị trí tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
              </Form.Select>
            </Col>
            {account.role.permission.includes("products_view") && (
              <>
                <Col md={4}>
                  <Link to="/admin/products/create" className="btn btn-success">
                    Create Product
                  </Link>
                </Col>
              </>
            )}
          </Row>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Position</th>
                <th>Thumbnail</th>
                <th>Status</th>
                <th>isDeleted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product._id}>
                  <td>{product.title}</td>
                  <td>{product.price}</td>
                  <td>{product.position}</td>
                  <td>
                    <img
                      src={
                        product.thumbnail
                          ? product.thumbnail.startsWith("http")
                            ? product.thumbnail
                            : `http://localhost:5000${product.thumbnail}`
                          : "http://localhost:5000/path-to-placeholder-image.png" // Placeholder image URL
                      }
                      alt={product.title || "Placeholder Image"}
                      width="100px"
                      height="auto"
                    />
                  </td>
                  <td>
                    {" "}
                    {account.role.permission.includes("products_update") && (
                      <>
                        <Button
                          variant={
                            product.status === "active"
                              ? "success"
                              : "danger"
                          }
                          onClick={() =>
                            handleStatusChange(product._id, product.status)
                          }
                          disabled={product.deleted}
                        >
                          {product.status === "active" ? "Active" : "Inactive"}
                        </Button>
                      </>
                    )}
                  </td>
                  <td>
                    {/* Hiển thị trạng thái đã xóa */}
                    {product.deleted ? (
                      <h6 className="text-danger">Đã xóa</h6>
                    ) : (
                      <h6 className="text-success">Chưa xóa</h6>
                    )}
                  </td>

                  <td>
                    <Link
                      to={`detail/${product._id}`}
                      className={`btn btn-primary me-2 ${
                        product.deleted ? "disabled" : ""
                      }`}
                      tabIndex={product.deleted ? -1 : 0} // Ngăn chặn việc focus vào nút
                      aria-disabled={product.deleted} // Cung cấp thông tin truy cập cho người dùng
                    >
                      Detail
                    </Link>
                    {account.role.permission.includes("products_update") && (
                      <Link
                        to={`edit/${product._id}`}
                        className={`btn btn-warning me-2 ${
                          product.deleted ? "disabled" : ""
                        }`}
                        tabIndex={product.deleted ? -1 : 0} // Ngăn chặn việc focus vào nút
                        aria-disabled={product.deleted} // Cung cấp thông tin truy cập cho người dùng
                      >
                        Update
                      </Link>
                    )}

                    {account.role.permission.includes("products_delete") && (
                      <Button
                        variant={product.deleted ? "success" : "danger"}
                        onClick={() =>
                          handleDelete(
                            product._id,
                            product.deleted ? "active" : "deleted"
                          )
                        }
                        className="ms-2"
                      >
                        {product.deleted ? "Undelete" : "Delete"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination className="justify-content-center">
            {[...Array(totalPages)].map((_, pageIndex) => (
              <Pagination.Item key={pageIndex} active={pageIndex + 1 === currentPage} onClick={() => handlePageChange(pageIndex + 1)}>
                {pageIndex + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </Container>
  );
};

export default ProductList;

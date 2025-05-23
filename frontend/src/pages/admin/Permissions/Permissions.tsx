import React, { useState, useEffect } from "react";
import { Table, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { get, patch } from "../../../Helpers/API.helper";
import { ApiResponse } from "../../../actions/types";
import { showConfirmationAlert, showErrorAlert, showSuccessAlert } from "../../../Helpers/alerts";
// Define the types
interface PermissionRecord {
  _id: string;
  title: string;
  permission: string[];
}

interface UpdatedPermission {
  id: string;
  permissionsChild: string[];
}

// Define the expected API response type


const Permissions: React.FC = () => {
  const [permissions, setPermissions] = useState<PermissionRecord[]>([]);
  const [updatedPermissions, setUpdatedPermissions] = useState<UpdatedPermission[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const data: ApiResponse = await get("http://localhost:5000/admin/roles/permissions");

      console.log(data)
      console.log(data.recordsPermission)
      if (data.recordsPermission && Array.isArray(data.recordsPermission)) {
        setPermissions(data.recordsPermission);
        const initialPermissions = data.recordsPermission.map((record: PermissionRecord) => ({
          id: record._id,
          permissionsChild: record.permission || [],
        }));
        setUpdatedPermissions(initialPermissions);
      } else {
        console.warn("No permission records found");
        setPermissions([]); // Handle empty or missing records
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };


  // Handle checkbox change
  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    permissionType: string,
    recordIndex: number
  ) => {
    const isChecked = e.target.checked;

    setUpdatedPermissions((prevPermissions) => {
      const updated = [...prevPermissions];
      const permissionsSet = new Set(updated[recordIndex].permissionsChild);

      if (isChecked) {
        permissionsSet.add(permissionType);
      } else {
        permissionsSet.delete(permissionType);
      }
      updated[recordIndex].permissionsChild = Array.from(permissionsSet);
      return updated;
    });
  };

  // Handle form submit
  const handleSubmit = async () => {
    const isConfirmed = await showConfirmationAlert("Are you sure?", "You want to update the role ?", "Yes, update it!");
    if (isConfirmed) {
      try {
        await patch("http://localhost:5000/admin/roles/permissions", updatedPermissions);
        showSuccessAlert("Updated!", "Your permissions have been updated.");
        setTimeout(() => {
          navigate("/admin/roles");
        }, 1500);
      } catch (error) {
        console.log(error)
        showErrorAlert("Failed!", "You can again")
      }
    }

  };

  return (
    <Container className="my-4">
      <h1>Phân quyền</h1>
      {/* <Notification message={message} type={type} /> */}
      <div className="d-flex justify-content-end mb-3">
        <Button onClick={handleSubmit} variant="primary">
          Update
        </Button>
      </div>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Tính năng</th>
            {permissions.map((record) => (
              <th key={record._id} className="text-center">
                {record.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* ID Row */}
          <tr style={{ display: "none" }}>
            <td>ID</td>
            {permissions.map((record) => (
              <td key={record._id} className="text-center">
                <input type="text" value={record._id} readOnly />
              </td>
            ))}
          </tr>

          {/* Permission categories */}
          <tr>
            <td colSpan={permissions.length + 1}>
              <b>Danh mục sản phẩm</b>
            </td>
          </tr>
          {[
            "products-category_view",
            "products-category_create",
            "products-category_update",
            "products-category_delete",
          ].map((permissionType) => (
            <tr key={permissionType}>
              <td>{permissionType.replace("products-category_", "").replace("_", " ")}</td>
              {permissions.map((record, index) => (
                <td key={record._id} className="text-center">
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheckboxChange(e, permissionType, index)}
                    checked={updatedPermissions[index]?.permissionsChild.includes(permissionType)}
                    style={{ transform: "scale(1.5)", cursor: "pointer" }}
                  />
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td colSpan={permissions.length + 1}>
              <b>Sản phẩm</b>
            </td>
          </tr>
          {[
            "products_view",
            "products_create",
            "products_update",
            "products_delete",
          ].map((permissionType) => (
            <tr key={permissionType}>
              <td>
                {permissionType.replace("products_", "").replace("_", " ")}
              </td>
              {permissions.map((record, index) => (
                <td key={record._id} className="text-center">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleCheckboxChange(e, permissionType, index)
                    }
                    checked={updatedPermissions[
                      index
                    ].permissionsChild.includes(permissionType)}
                    style={{ transform: "scale(1.5)", cursor: "pointer" }}
                  />
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td colSpan={permissions.length + 1}>
              <b>Gift</b>
            </td>
          </tr>
          {[
            "gift_view",
            "gift_create",
            "gift_update",
            "gift_delete",
          ].map((permissionType) => (
            <tr key={permissionType}>
              <td>
                {permissionType.replace("products_", "").replace("_", " ")}
              </td>
              {permissions.map((record, index) => (
                <td key={record._id} className="text-center">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleCheckboxChange(e, permissionType, index)
                    }
                    checked={updatedPermissions[
                      index
                    ].permissionsChild.includes(permissionType)}
                    style={{ transform: "scale(1.5)", cursor: "pointer" }}
                  />
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td colSpan={permissions.length + 1}>
              <b>Table</b>
            </td>
          </tr>
          {[
            "table_view",
            "table_create",
            "table_update",
            "table_delete",
          ].map((permissionType) => (
            <tr key={permissionType}>
              <td>
                {permissionType.replace("products_", "").replace("_", " ")}
              </td>
              {permissions.map((record, index) => (
                <td key={record._id} className="text-center">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleCheckboxChange(e, permissionType, index)
                    }
                    checked={updatedPermissions[
                      index
                    ].permissionsChild.includes(permissionType)}
                    style={{ transform: "scale(1.5)", cursor: "pointer" }}
                  />
                </td>
              ))}
            </tr>
          ))}

          {/* Thêm section mới cho Blog */}
          <tr>
            <td colSpan={permissions.length + 1}>
              <b>Blog</b>
            </td>
          </tr>
          {[
            "blogs_view",
            "blogs_create",
            "blogs_update",
            "blogs_delete",
          ].map((permissionType) => (
            <tr key={permissionType}>
              <td>
                {permissionType.replace("blogs_", "").replace("_", " ")}
              </td>
              {permissions.map((record, index) => (
                <td key={record._id} className="text-center">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleCheckboxChange(e, permissionType, index)
                    }
                    checked={updatedPermissions[
                      index
                    ].permissionsChild.includes(permissionType)}
                    style={{ transform: "scale(1.5)", cursor: "pointer" }}
                  />
                </td>
              ))}
            </tr>
          ))}

          <tr>
            <td colSpan={permissions.length + 1}>
              <b>Quản lí khách hàng</b>
            </td>
          </tr>
          {[
            "managerUsers_view",
            "managerUsers_create",
            "managerUsers_update",
            "managerUsers_delete",
          ].map((permissionType) => (
            <tr key={permissionType}>
              <td>
                {permissionType.replace("managerUsers_", "").replace("_", " ")}
              </td>
              {permissions.map((record, index) => (
                <td key={record._id} className="text-center">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleCheckboxChange(e, permissionType, index)
                    }
                    checked={updatedPermissions[
                      index
                    ].permissionsChild.includes(permissionType)}
                    style={{ transform: "scale(1.5)", cursor: "pointer" }}
                  />
                </td>
              ))}
            </tr>
          ))}

          <tr>
            <td colSpan={permissions.length + 1}>
              <b>Nhóm Quyền</b>
            </td>
          </tr>
          {["roles_view", "roles_create", "roles_update", "roles_delete"].map(
            (permissionType) => (
              <tr key={permissionType}>
                <td>
                  {permissionType.replace("products_", "").replace("_", " ")}
                </td>
                {permissions.map((record, index) => (
                  <td key={record._id} className="text-center">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleCheckboxChange(e, permissionType, index)
                      }
                      checked={updatedPermissions[
                        index
                      ].permissionsChild.includes(permissionType)}
                      style={{ transform: "scale(1.5)", cursor: "pointer" }}
                    />
                  </td>
                ))}
              </tr>
            )
          )}

          <tr>
            <td colSpan={permissions.length + 1}>
              <b>Order</b>
            </td>
          </tr>
          {[
            "orders_view",
            "orders_create",
            "orders_update",
            "orders_delete",
          ].map((permissionType) => (
            <tr key={permissionType}>
              <td>
                {permissionType.replace("products_", "").replace("_", " ")}
              </td>
              {permissions.map((record, index) => (
                <td key={record._id} className="text-center">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleCheckboxChange(e, permissionType, index)
                    }
                    checked={updatedPermissions[
                      index
                    ].permissionsChild.includes(permissionType)}
                    style={{ transform: "scale(1.5)", cursor: "pointer" }}
                  />
                </td>
              ))}
            </tr>
          ))}

          <tr>
            <td colSpan={permissions.length + 1}>
              <b>Phân Quyền</b>
            </td>
          </tr>
          {[
            "permissions_view",
            "permissions_create",
            "permissions_update",
            "permissions_delete",
          ].map((permissionType) => (
            <tr key={permissionType}>
              <td>
                {permissionType.replace("products_", "").replace("_", " ")}
              </td>
              {permissions.map((record, index) => (
                <td key={record._id} className="text-center">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleCheckboxChange(e, permissionType, index)
                    }
                    checked={updatedPermissions[
                      index
                    ].permissionsChild.includes(permissionType)}
                    style={{ transform: "scale(1.5)", cursor: "pointer" }}
                  />
                </td>
              ))}
            </tr>
          ))}

          <tr>
            <td colSpan={permissions.length + 1}>
              <b>Danh sách tài khoản</b>
            </td>
          </tr>
          {[
            "accounts_view",
            "accounts_create",
            "accounts_update",
            "accounts_delete",
          ].map((permissionType) => (
            <tr key={permissionType}>
              <td>
                {permissionType.replace("products_", "").replace("_", " ")}
              </td>
              {permissions.map((record, index) => (
                <td key={record._id} className="text-center">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleCheckboxChange(e, permissionType, index)
                    }
                    checked={updatedPermissions[
                      index
                    ].permissionsChild.includes(permissionType)}
                    style={{ transform: "scale(1.5)", cursor: "pointer" }}
                  />
                </td>
              ))}
            </tr>
          ))}

          {/* Other categories similar to above... */}
        </tbody>
      </Table>
    </Container>
  );
};

export default Permissions;

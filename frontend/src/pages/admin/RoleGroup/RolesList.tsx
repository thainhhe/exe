import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { del, get } from "../../../Helpers/API.helper";
import { Role } from "../../../actions/types";
import { APIADMIN } from "../../../Helpers/APILink";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Button } from "react-bootstrap";

const RolesList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);

  const account = useSelector((state: RootState) => state.AccountReducer);

  console.log(account?.role.deleted)
  // Fetch roles data from API
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const data = await get("http://localhost:5000/admin/roles");
      console.log(data);
      setRoles(data.recordsRole);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleDelete = async (id: string) => {
    console.log(id)
    try {
      await del(`${APIADMIN}/roles/delete/${id}`);
      fetchRoles(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  return (
    <div>

      <h1 className="mb-4">Nhóm quyền</h1>
      <div className="">
        <div className="card-header">Danh sách</div>
        <div className="card-body">
          <div className="row mb-5">
            <div className="col-4"></div>
            <div className="col-4"></div>
            {account?.role.permission.includes("roles_update") && (
              <div className="col-4">
                <Link
                  to="/admin/roles/create"
                  className="btn btn-outline-success"
                >
                  + Create
                </Link>
              </div>
            )}
          </div>

          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>STT</th>
                <th>Nhóm quyền</th>
                <th>Mô tả</th>
                <td>Is Deleted</td>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role, index) => (
                <tr key={role._id}>
                  <td>{index + 1}</td>
                  <td>{role.title}</td>
                  <td>{role.description}</td>
                  <td>
                    {role.deleted ? (
                      <h6 className="text-danger">Đã xóa</h6>
                    ) : (
                      <h6 className="text-success">Chưa xóa</h6>
                    )}
                  </td>

                  <td>
                    {account?.role.permission.includes("roles_update") && (
                      <Link
                        to={`/admin/roles/edit/${role._id}`}
                        className="btn btn-warning me-2"
                      >
                        Update
                      </Link>)}

                    {account?.role.permission.includes("roles_delete") && (
                      <Button
                        variant={role.deleted ? "success" : "danger"}
                        onClick={() =>
                          handleDelete(
                            role._id,
                          )
                        }
                        className="ms-2"
                      >
                        {role.deleted ? "Undelete" : "Delete"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RolesList;

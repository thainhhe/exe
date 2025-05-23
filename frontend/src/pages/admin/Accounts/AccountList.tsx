import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { get, patch } from "../../../Helpers/API.helper";
import { Account, Role } from "../../../actions/types";
import { showConfirmationAlert, showSuccessAlert } from "../../../Helpers/alerts";

// Define the types for roles and accounts

const AccountList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]); // State for roles
  const [accounts, setAccounts] = useState<Account[]>([]); // State for accounts
  const [loading, setLoading] = useState<boolean>(true); // State for loading

  // Function to get role name by ID
  const getRoleName = (id: string): string => {
    const roleName = roles.find((role) => role._id === id);
    return roleName ? roleName.title : "Unknown";
  };

  // Fetch roles on component mount
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

  // Fetch accounts on component mount
  const fetchAccounts = async () => {
    try {
      const data = await get("http://localhost:5000/admin/accounts");
      console.log(data);
      setAccounts(data.recordsAccount); // Assuming the API returns an array of accounts
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setLoading(false); // Set loading to false once the data is fetched
    }
  };
  useEffect(() => {
 

    fetchAccounts();
  }, []);

  const handleStatusChange = async (id:string, currentStatus:string) => {
    console.log(id, currentStatus);
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const isConfirmed = await showConfirmationAlert("Are you sure?", `Change status to "${newStatus}"?`, "Yes change it!");

    if (isConfirmed) {
      try {
        await patch(
          `http://localhost:5000/admin/accounts/change-status/${newStatus}/${id}`,
          { status: newStatus }
        );
        showSuccessAlert("Success", `Trạng thái đã được cập nhật thành "${newStatus}".`);
        fetchAccounts();
      } catch (error) {
        console.error("Error changing status:", error);
      }
    }
  }
  // Display a loading message while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Account List</h1>
      <Link to="create" className="btn btn-primary mb-3">
        Create Account
      </Link>
      {accounts.length > 0 ? (
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account._id}>
                <td>{account.fullName}</td>
                <td>{account.email}</td>
                <td>{account.phone}</td>
                <td>{getRoleName(account.role_id)}</td>
                <td>
                  <Button
                    variant={account.status === "active" ? "success" : "danger"}
                    onClick={() =>
                      handleStatusChange(account._id, account.status)
                    }
                  >
                    {account.status === "active" ? "Active" : "Inactive"}
                  </Button>
                </td>
                <td>
                  <Link to={`detail/${account._id}`} className="btn btn-primary me-2">
                    Detail
                  </Link>
                  <Link to={`edit/${account._id}`} className="btn btn-warning me-2">
                    Edit
                  </Link>
                  <Button
                    variant={account.deleted ? "success" : "danger"}
                    // onClick={() => handleDelete(account._id)}
                  >
                    {account.deleted ? "Undeleted" : "Deleted"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-warning" role="alert">
          No accounts found.
        </div>
      )}
    </div>
  );
};

export default AccountList;

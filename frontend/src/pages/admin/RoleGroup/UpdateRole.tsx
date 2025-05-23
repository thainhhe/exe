import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, patch } from '../../../Helpers/API.helper';
import { Role } from '../../../actions/types'; // Ensure this type is defined properly
import { showErrorAlert, showSuccessAlert } from '../../../Helpers/alerts';

const UpdateRole: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Extract roleId from URL params
    const navigate = useNavigate();
    const [roleData, setRoleData] = useState<Role | null>(null); // State for role data

    useEffect(() => {
      const fetchRoleDetails = async () => {
        try {
            const data = await get(`http://localhost:5000/admin/roles/edit/${id}`);
       
            if (!data.detailRole) {
              showErrorAlert("Failed!", "You can again");
                navigate('/admin/roles');
            } else {
                setRoleData( data.detailRole); // Set the role data to be edited
            }
        } catch (error) {
            console.error('Error fetching role data:', error);
            navigate('/admin/roles');
        }
    };
    fetchRoleDetails();
    }, [id]); // Added id as a dependency to refetch if id changes

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      if (roleData) {
          setRoleData((prevData) => ({
              ...prevData,
              [name]: value
          } as Role)); // Cast to Role to ensure type compatibility
      }
  };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!roleData) return; // Prevent submission if roleData is not available

        try {
            await patch(`http://localhost:5000/admin/roles/edit/${id}`, roleData);
            showSuccessAlert('Success!', 'Role updated successfully!');
            setTimeout(() => {
                navigate('/admin/roles');
            }, 1500);
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    return (
        <div className="container my-4">
            <h1>{roleData ? `Sửa Nhóm Quyền: ${roleData.title}` : 'Loading...'}</h1>
            <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Tên nhóm quyền</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={roleData?.title || ''} // Use optional chaining
                        onChange={handleInputChange} // Use handleInputChange to update roleData
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Mô tả</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        value={roleData?.description || ''} // Use optional chaining
                        onChange={handleInputChange} // Use handleInputChange to update roleData
                        rows={3}
                        required
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">Cập nhật</button>
            </form>
        </div>
    );
};

export default UpdateRole;

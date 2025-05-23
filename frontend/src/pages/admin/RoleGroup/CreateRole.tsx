import React, { useState } from 'react';
import { post } from '../../../Helpers/API.helper';
import { useNavigate } from 'react-router-dom';
import { showErrorAlert } from '../../../Helpers/alerts';

const CreateRole: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = {
            title,
            description,
        };

        try {
            const response = await post(`http://localhost:5000/admin/roles/create`, formData);
            if (response) {

                setTimeout(() => {
                    navigate('/admin/roles');
                }, 2000);
            } else {
              showErrorAlert("Failed!", "You can again");
            }
        } catch (error) {
          console.log(error)

        }
    };

    return (
        <div>
            <h1>Thêm mới quyền</h1>
            <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="form-group mb-3">
                    <label htmlFor="title">Tiêu đề</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                {/* Description */}
                <div className="form-group mb-3">
                    <label htmlFor="description">Mô tả</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                {/* Create Button */}
                <div className="form-group mt-4">
                    <button type="submit" className="btn btn-primary">
                        Tạo mới
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateRole;

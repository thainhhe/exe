import { Button, Form, Input, Switch } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { post } from "../../../Helpers/API.helper";
import { TableWebsite } from "../../../actions/types";
import { showSuccessAlert } from "../../../Helpers/alerts";
import { useNavigate } from "react-router-dom";

function CreateTable() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const handleSubmit = async (values: TableWebsite) => {
        try {
            // Sending the data to the backend
            const response = await post("http://localhost:5000/admin/table/create", values);
            console.log(response);

            if (response) {
                form.resetFields();
                showSuccessAlert("Success!", "Table created successfully!");
                navigate("/admin/table")
                
            }
        } catch (error) {
            console.error("Error creating table:", error);  // Handle any errors during the post request
        }
    };

    return (
        <>
            <h2>Thêm Bàn Mới</h2>

            <Form
                name="create-table"
                onFinish={handleSubmit}
                form={form}
                initialValues={{
                    status: true, // Default status is 'available'
                }}
            >
                {/* Table Name Field */}
                <Form.Item
                    label="Tên Bàn"
                    name="name"
                    rules={[{ required: true, message: 'Please input the table name!' }]}
                    validateTrigger="onChange"
                >
                    <Input />
                </Form.Item>

                {/* Table Status Field */}
                <Form.Item
                    name="status"
                    label="Trạng Thái"
                    valuePropName="checked"
                    initialValue={true} // Default value is 'available'
                >
                    <Switch checkedChildren="Còn bàn" unCheckedChildren="Đã được đặt bàn" />
                </Form.Item>
                {/* Submit Button */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
                        Thêm Bàn
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default CreateTable;

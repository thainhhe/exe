import { useEffect, useState } from 'react';
import { Table, Button, Spin, Modal, Form, Input, Switch, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { TableWebsite } from '../../../actions/types';
import { get, patch } from '../../../Helpers/API.helper';

function ListTable() {
    const [tables, setTables] = useState<TableWebsite[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [selectedTable, setSelectedTable] = useState<TableWebsite | null>(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    // Fetch the tables from the API
    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await get("http://localhost:5000/admin/table");
                setTables(response.recordTables);
            } catch (error) {
                console.error("Error fetching tables:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, []);

    // Open the update modal and set the selected table
    const showUpdateModal = (record: TableWebsite) => {
        setSelectedTable(record);
        setIsModalVisible(true);
        form.setFieldsValue({
            name: record.name,
            status: record.status,
        });
    };

    // Handle modal cancellation
    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedTable(null);
    };

    // Handle form submission to update the table
    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            if (selectedTable) {
                // Update both name and status
                await patch(`http://localhost:5000/admin/table/${selectedTable._id}`, values);
                message.success('Table updated successfully');
                setTables(prevTables =>
                    prevTables.map(table =>
                        table._id === selectedTable._id ? { ...table, ...values } : table
                    )
                );
                setIsModalVisible(false);
            }
        } catch (error) {
            console.error("Error updating table:", error);
            message.error('Failed to update table');
        }
    };
    
    const handleStatusChange = async (record: TableWebsite) => {
        console.log(record._id)
        try {
            const updatedStatus = !record.status; 
            console.log(updatedStatus)
            await patch(`http://localhost:5000/admin/table/status/${record._id}`, { status: updatedStatus });              
           message.success('Table status updated successfully'); 
            setTables(prevTables =>
                prevTables.map(table =>
                    table._id === record._id ? { ...table, status: updatedStatus } : table
                )
            );
        } catch (error) {
            console.error("Error updating table status:", error);
            message.error('Failed to update table status');
        }
    };
    

    // Define the columns for the table
    const columns = [
        { title: 'Table Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: boolean, record: TableWebsite) => (
                <Switch
                    checked={status}
                    checkedChildren="Còn bàn"
                    unCheckedChildren="Đã được đặt bàn"
                    onChange={() => handleStatusChange(record)} // Handle status toggle
                />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (record: TableWebsite) => (
                <>
                    <Button onClick={() => showUpdateModal(record)}>Update</Button>
                    <Button
                        style={{ marginLeft: 8 }}
                        onClick={() => navigate(`detailTable/${record._id}`)} // Navigate to the detail page
                    >
                        Detail
                    </Button>
                </>
            ),
        },
    ];

    if (loading) {
        return <Spin />;
    }

    return (
        <>
            <Button
                type="primary"
                onClick={() => navigate('createTable')} // Navigate to the create table page
                style={{ marginBottom: '20px' }}
            >
                Thêm Bàn Mới
            </Button>

            <Table
                dataSource={tables}
                columns={columns}
                pagination={{ pageSize: 10 }}
                rowKey="_id"
            />

            {/* Update Modal */}
            <Modal
                title="Update Table"
                visible={isModalVisible}
                onCancel={handleCancel}
                onOk={handleUpdate}
                okText="Update"
                cancelText="Cancel"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Table Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter the table name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Status"
                        name="status"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Còn bàn" unCheckedChildren="Đã được đặt bàn" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default ListTable;

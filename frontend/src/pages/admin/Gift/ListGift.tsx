import React, { useEffect, useState } from 'react';
import { Table, Button, Spin, Modal, Form, Input, Switch, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Gift } from '../../../actions/types';
import { get, patch } from '../../../Helpers/API.helper';

function ListGift() {
    const [gift, setGift] = useState<Gift[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await get("http://localhost:5000/admin/gift");
                setGift(response.recordGift);
            } catch (error) {
                console.error("Error fetching tables:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, []);

    // Open modal and set selected gift
    const showUpdateModal = (record: Gift) => {
        setSelectedGift(record);
        setIsModalVisible(true);
        form.setFieldsValue({
            name: record.name,
            status: record.status
        });
    };

    // Handle modal close
    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedGift(null);
    };

    // Handle form submission
    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            if (selectedGift) {
                await patch(`http://localhost:5000/admin/gift/${selectedGift._id}`, values);
                message.success('Gift updated successfully');
                setGift(prevTables =>
                    prevTables.map(gift =>
                        gift._id === selectedGift._id ? { ...gift, ...values } : gift
                    )
                );
                setIsModalVisible(false);
            }
        } catch (error) {
            console.error("Error updating gift:", error);
            message.error('Failed to update gift');
        }
    };

    const handleStatusChange = async (record: Gift) => {
        console.log(record._id)
        try {
            const updatedStatus = !record.status; 
            console.log(updatedStatus)
            console.log(    `http://localhost:5000/admin/gift/status/${record._id}`)
            await patch(`http://localhost:5000/admin/gift/status/${record._id}`, { status: updatedStatus });
            
            message.success('Gift status updated successfully');
    
            setGift(prevTables =>
                prevTables.map(gift =>
                    gift._id === record._id ? { ...gift, status: updatedStatus } : gift
                )
            );
        } catch (error) {
            console.error("Error updating gift status:", error);
            message.error('Failed to update gift status');
        }
    };

    const columns = [
        { title: 'Gift Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: boolean, record: Gift) => (
                <Switch
                    checked={status}
                    checkedChildren="Đang còn"
                    unCheckedChildren="Đã hết"
                    onChange={() => handleStatusChange(record)} // Handle status toggle
                />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (record: Gift) => (
                <Button onClick={() => showUpdateModal(record)}>Update</Button>
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
                onClick={() => navigate('createGift')} // Navigate to the CreateTable page
                style={{ marginBottom: '20px' }}
            >
                Thêm quà tặng
            </Button>

            <Table
                dataSource={gift}
                columns={columns}
                pagination={{ pageSize: 10 }}
                rowKey="_id"
            />

            {/* Update Modal */}
            <Modal
                title="Update Gift"
                visible={isModalVisible}
                onCancel={handleCancel}
                onOk={handleUpdate}
                okText="Update"
                cancelText="Cancel"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Gift Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter the gift name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Status"
                        name="status"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default ListGift;

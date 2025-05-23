import React from 'react';
import { Form, Input, Switch, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { post } from '../../../Helpers/API.helper';

function CreateGift() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Handle form submission for creating a gift
  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      await post('http://localhost:5000/admin/gift/create', values);
      message.success('Gift created successfully');
      navigate('/admin/gift'); // Navigate to the gift list after creation
    } catch (error) {
      console.error("Error creating gift:", error);
      message.error('Failed to create gift');
    }
  };

  return (
    <div>
      <h2>Create New Gift</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleCreate} // Trigger form submission
      >
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

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Gift
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateGift;

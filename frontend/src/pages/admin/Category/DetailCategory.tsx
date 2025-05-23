import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { get } from '../../../Helpers/API.helper';
import { ProductCategory, ApiResponse } from '../../../actions/types';
import { Card, Spin, Typography, Row, Col, Descriptions } from 'antd';

const { Title } = Typography;

function DetailCategory() {
    const { id } = useParams();
    console.log(id)
    const [category, setCategory] = useState<ProductCategory | null>(null);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [parentCategory, setParentCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const findParentCategory = (categories: ProductCategory[], parentId: string): ProductCategory | null => {
        for (const category of categories) {
            if (category._id === parentId) {
                return category;
            }
            if (category.children && category.children.length > 0) {
                const found = findParentCategory(category.children, parentId);
                if (found) return found;
            }
        }
        return null;
    };

    useEffect(() => {
        const fetchCategoryDetails = async () => {
            try {
                const categoryResponse: ApiResponse = await get(`http://localhost:5000/admin/products-category/detail/${id}`);
                console.log(categoryResponse)
                setCategory(categoryResponse.detailCategory);

                const categoriesResponse = await get("http://localhost:5000/admin/products-category");
                setCategories(categoriesResponse.recordsCategory);

                if (categoryResponse.detailCategory.parent_id) {
                    const parent = findParentCategory(categoriesResponse.recordsCategory, categoryResponse.detailCategory.parent_id);
                    setParentCategory(parent ? parent.title : "Parent category not found");
                }
            } catch (error) {
                console.error("Error fetching category details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryDetails();
    }, [id]);

    return (
        <div style={{ padding: '40px' }}>
            <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
                <Col xs={24} sm={16} md={12} lg={10}>
                    <Title level={2} style={{ textAlign: 'center', fontSize: '80px'}}>Detail Category</Title>
                    {loading ? (
                        <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }} />
                    ) : category ? (
                        <Card bordered style={{ marginTop: '20px' }}>
                            <Descriptions bordered column={1} size="middle">
                                <Descriptions.Item label="ID" style={{ fontSize: '30px' }}>{category._id}</Descriptions.Item>
                                <Descriptions.Item label="Title" style={{ fontSize: '30px' }}>{category.title}</Descriptions.Item>
                                <Descriptions.Item label="Parent Category" style={{ fontSize: '30px' }}>{parentCategory || "No parent category"}</Descriptions.Item>
                                <Descriptions.Item label="Description" style={{ fontSize: '30px' }}>{category.description || "No description available."}</Descriptions.Item>
                                <Descriptions.Item label="Status" style={{ fontSize: '30px' }}>{category.status}</Descriptions.Item>
                                <Descriptions.Item label="Position" style={{ fontSize: '30px' }}>{category.position}</Descriptions.Item>
                                <Descriptions.Item label="Slug" style={{ fontSize: '30px' }}>{category.slug}</Descriptions.Item>
                                <Descriptions.Item label="Deleted" style={{ fontSize: '30px' }}>{category.deleted ? "Yes" : "No"}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    ) : (
                        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '60px'  }}>Category not found.</p>
                    )}
                </Col>
            </Row>
        </div>
    );
}

export default DetailCategory;

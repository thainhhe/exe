import React from 'react';
import { Link } from 'react-router-dom';
import { List, Card, Typography, Button } from 'antd';
import { ReadOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface NewsItem {
    id: number;
    title: string;
    description: string;
    image: string;
    date: string;
}

const newsData: NewsItem[] = [
    {
        id: 1,
        title: "JOURNEY TO THE HIGHLANDS - A Gift from the Mountains",
        description: "Have you ever wondered what processes your favorite cup of coffee has gone through? When you hold the product in your hands, it is a 'gift' from a long journey that begins with choosing the right land with suitable soil, selecting and cultivating coffee varieties, caring for the plants, harvesting and preserving, processing... When you can perceive all these details, you will be amazed that hidden within each delicious cup of coffee is a truly miraculous journey.",
        image: "/News_img/journey.png",
        date: "2023-12-26",
    },
    {
        id: 2,
        title: "King Coffee would like to congratulate Vietnam Entrepreneur's Day on October 13th, 2024.",
        description: "King Coffee would like to congratulate Vietnam Entrepreneur's Day on October 13th, 2023, the day of creativity and ambition! We would like to express our gratitude to all our esteemed business partners who have been with us and supported King Coffee throughout this journey. We wish you all to stay strong, resilient, and determined to overcome any challenges, continuing to contribute to the economy, society, and the community.",
        image: "/News_img/event.png",
        date: "2024-10-13",
    },
    {
        id: 3,
        title: "Have you ever tasted the flavors of Guatamala, Ethiopia, Colombia, Brazil... in coffee?",
        description: "Did you know that each delicious cup of coffee is a miraculous gift from nature? Soil, climate, region, water, coffee varieties, cultivation practices, harvesting, storage, and processing techniques are all important factors that contribute to the distinctive and exquisite flavors of each type of coffee.",
        image: "/News_img/flavors.png",
        date: "2023-12-26",
    },
    {
        id: 4,
        title: "CEO KING COFFEE - MS. LÊ HOÀNG DIỆP THẢO INSPIRES AT VIETNAMESE TEA CULTURE GALA",
        description: "The 'Vietnamese Tea Culture Planting Foundation Journey' Gala, organized by the Tea Culture Planting Foundation, took place on Thursday morning (October 26, 2023) at Hồ Văn – Quốc Tử Giám in Hanoi. The event was attended by hundreds of tea artisans, tea houses, and tea enthusiasts from across the country.",
        image: "/News_img/CEO_img.png",
        date: "2023-10-26",
    },
    {
        id: 5,
        title: "Gift for October 20th for her: King Coffee Cappuccino Collagen Sakura Strawberry.",
        description: "Dear gentlemen, October 20th is approaching! Have you prepared a meaningful gift for that special woman? On October 20th, let KING COFFEE express your affection and care for that special woman in your life. The Cappuccino Collagen Sakura Strawberry Instant Coffee is a special way to congratulate and celebrate their beauty. With low caffeine content and enriched with Collagen and Vitamin PP, which promote beauty, anti-aging, and skin elasticity for the users, King Coffee Cappuccino Collagen in Strawberry & Cherry Blossom flavor will be a meaningful and practical gift for October 20th.",
        image: "/News_img/woman_day.png",
        date: "2024-10-20",
    },
    {
        id: 6,
        title: "Notification: King Coffee in China from November 05th to 09th, 2024",
        description: "From November 5th to 9th, 2024, King Coffee, a leading Vietnamese coffee producer and exporter, will be participating in high-level business meetings as part of the Greater Mekong Subregion Summit in China. King Coffee is seeking partnerships with leading Chinese enterprises at this forum. As part of the Vietnam Railway Workshop, we aim to explore new collaboration opportunities in tourism and transportation services. With our deep-rooted experience in the Vietnamese coffee industry, King Coffee is the perfect partner to help your business thrive in this dynamic market.",
        image: "/News_img/news.png",
        date: "2024-11-04",
    }
];

const News: React.FC = () => {
    return (
        <div style={{ background: '#f0e6d2', padding: '40px 0' }}>
            <nav aria-label="breadcrumb">
                <ol style={{ listStyle: 'none', display: 'flex', gap: '5px', fontSize: '14px', color: '#555' }}>
                    <li>
                        <Link to="/" style={{ color: 'black', textDecoration: 'none' }}>Home</Link>
                    </li>
                    <li style={{ color: 'black' }}> / </li>
                    <li>
                        <Link to="/news" style={{ color: 'grey', textDecoration: 'none' }}>News</Link>
                    </li>
                </ol>
            </nav>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                <Title level={2} style={{ textAlign: 'center', color: '#4a3f35', marginBottom: '40px' }}>
                    CoffeeKing Store News
                </Title>
                <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 3,
                        lg: 3,
                        xl: 3,
                        xxl: 3,
                    }}
                    dataSource={newsData}
                    renderItem={(item: NewsItem) => (
                        <List.Item key={item.id}>
                            <Card
                                hoverable
                                cover={<img alt={item.title} src={item.image} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
                                style={{ background: '#fff9eb', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                                bodyStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '300px' }}
                            >
                                <Title level={4} style={{ color: '#6f4e37', fontSize: '16px', margin: '0 0 10px' }}>{item.title}</Title>
                                <Paragraph
                                    type="secondary"
                                    style={{
                                        color: '#8c7b6b',
                                        height: '130px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        marginBottom: '10px'
                                    }}
                                >
                                    {item.description}
                                </Paragraph>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                    <span style={{ color: '#a18267', fontSize: '12px' }}>{item.date}</span>
                                    <Link to={`/news/${item.id}`}>
                                        <Button type="primary" icon={<ReadOutlined />} style={{ background: '#6f4e37', borderColor: '#6f4e37' }}>
                                            Read More
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};

export default News;


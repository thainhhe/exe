import { useEffect, useState } from 'react'
import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Divider,
  Row,
  Space,
  Tabs,
  Typography,
  message
} from 'antd'
import {
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  CalendarOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getCookie } from '../../../Helpers/Cookie.helper'
import { get } from '../../../Helpers/API.helper'
import moment from 'moment'
import './profile.css'


const { Title, Text } = Typography
const { TabPane } = Tabs

interface User {
  _id: string
  fullName: string
  email: string
  phone: string
  status: string
  createdAt: string
  tokenUser: string
}

interface ApiResponse {
  user: User
}

function Profile() {
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const tokenUser = getCookie('tokenUser')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!tokenUser) {
          navigate('/user/login')
          return
        }

        const response: ApiResponse = await get(`http://localhost:5000/user/${tokenUser}`)
        if (response && response.user) {
          setUserData(response.user)
        } else {
          throw new Error('User data not found')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        message.error('Failed to load user profile')
        navigate('/user/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [tokenUser, navigate])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!userData) {
    return <div>No user data available</div>
  }

  const formatDate = (date: string) => {
    return moment(date).format('DD/MM/YYYY')
  }

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <Card className="profile-header">
        <Row gutter={24} align="middle">
          <Col xs={24} sm={8} md={6} className="profile-avatar-container">
            <Avatar
              size={120}
              icon={<UserOutlined />}
              className="profile-avatar"
            />
          </Col>
          <Col xs={24} sm={16} md={18}>
            <Space direction="vertical" size="small" className="profile-info">
              <Title level={2}>{userData.fullName}</Title>
              <Space split={<Divider type="vertical" />}>
                <Text>
                  <CalendarOutlined /> Tham gia {formatDate(userData.createdAt)}
                </Text>
                <Text>
                  Trạng thái: {userData.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </Text>
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Profile Content */}
      <Card className="profile-content">
        <Tabs defaultActiveKey="info">
          <TabPane tab="Thông tin cá nhân" key="info">
            <Descriptions bordered column={{ xs: 1, sm: 2, md: 2 }}>
              <Descriptions.Item label="Họ tên">
                {userData.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <MailOutlined /> {userData.email}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                <PhoneOutlined /> {userData.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                <CalendarOutlined /> {formatDate(userData.createdAt)}
              </Descriptions.Item>
            </Descriptions>
          </TabPane>

          {/* <TabPane tab="Cài đặt" key="settings">
            <List>
              <List.Item
                actions={[<Button key="change">Thay đổi</Button>]}
              >
                <List.Item.Meta
                  avatar={<SettingOutlined />}
                  title="Mật khẩu"
                  description="Thay đổi mật khẩu đăng nhập của bạn"
                />
              </List.Item>
              <List.Item
                actions={[<Button key="manage">Quản lý</Button>]}
              >
                <List.Item.Meta
                  avatar={<EnvironmentOutlined />}
                  title="Địa chỉ"
                  description="Quản lý địa chỉ giao hàng của bạn"
                />
              </List.Item>
              <List.Item
                actions={[<Button key="preferences">Tùy chỉnh</Button>]}
              >
                <List.Item.Meta
                  avatar={<MailOutlined />}
                  title="Thông báo"
                  description="Cài đặt email và thông báo"
                />
              </List.Item>
            </List>
          </TabPane> */}
        </Tabs>
      </Card>
    </div>
  )
}

export default Profile
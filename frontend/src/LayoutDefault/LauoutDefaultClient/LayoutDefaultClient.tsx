import Footer from './Footer/Footer';
import Header from './Header/Header';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import "./LayoutDefaultClient.css";
import { getCookie } from "../../Helpers/Cookie.helper";
import { useDispatch, useSelector } from "react-redux";
import { ApiResponse } from "../../actions/types";
import { RootState } from "../../store/store";
import { get } from "../../Helpers/API.helper";
import { userActions } from '../../actions/UserAction';
import { useEffect } from 'react';
import { Button } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
function LayoutDefaultClient() {
  const tokenUser = getCookie("tokenUser"); // Lấy token từ cookie
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.UserReducer);
  const navigate = useNavigate();
  const location = useLocation();
  console.log(user)
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const accountByToken: ApiResponse = await get(`http://localhost:5000/user/${tokenUser}`);
        if (accountByToken && accountByToken.user) {
          // Nếu API trả về thông tin người dùng, cập nhật vào Redux store
          dispatch(userActions(accountByToken)); // Truyền user vào userActions
        } else {
          throw new Error("User not found in the response.");
        }
      } catch (error) {
        console.error("Error fetching account by token:", error);
        // navigate("/"); // Điều hướng nếu cần thiết khi gặp lỗi
      }
    };

    // Nếu có token thì mới gọi API để lấy thông tin người dùng
    if (tokenUser) {
      fetchApi();
    }
  }, [tokenUser, dispatch]);

  const handleChatClick = () => {
    navigate('/chat'); // Điều hướng đến trang chat với admin
  };


  return (
    <>
      <div id="app">
        <header>
          <Header />
        </header>

        <main>

          <Outlet />
        </main>

        {location.pathname !== "/chat" && (
          <div className="chat-button">
            <Button
              type="primary"
              shape="circle"
              icon={<MessageOutlined />}
              size="large"
              onClick={handleChatClick}
            />

          </div>
        )}


        <footer>
          <Footer />
        </footer>
      </div>
    </>
  );
}

export default LayoutDefaultClient;



// import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from 'react';

import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { get, post } from "../../../Helpers/API.helper";
import { ChatV2 } from "../../../actions/types";
import "./Chat.css";
import Conversation from "../../../components/Client/Conversation/Conversation";
import ChatBox from "../../../components/Client/ChatBox/ChatBox";
import { io, Socket } from 'socket.io-client';
import { Button } from 'antd';
// import EmojiPicker, { SkinTones } from "emoji-picker-react";

// interface EmojiClickData {
//   activeSkinTone: SkinTones;
//   unified: string;
//   unifiedWithoutSkinTone: string;
//   emoji: string;
//   names: string[];
// }
interface OnlineUser {
  userId: string;  // You can add more fields if needed
  socketId: string;
  lastActiveTime?: string;
}

const Chat = () => {
  const socket = useRef<Socket>();
  const user = useSelector((state: RootState) => state.UserReducer);

  const userId = user && user.user._id ? user.user._id : "";


  const [chats, setChats] = useState<ChatV2[]>();
  const [currentChat, setCurrentChat] = useState<ChatV2>();

  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  // Lấy về 1 mảng chat theo userId 
  useEffect(() => {
    const getChats = async () => {
      try {
        const response = await get(`http://localhost:5000/chat/${userId}`);
        console.log(response)
        setChats(response.ChatV2);
      } catch (error) {
        console.log(error);
      }
    };
    if (userId) {
      getChats();
    }
  }, [userId]);

  // Nếu tồn tại userId kết nối vơi socket
  useEffect(() => {
    if (userId) {
      socket.current = io("ws://localhost:5000");
      socket.current.emit("new-user-add", userId);

      socket.current.on("get-users", (users: OnlineUser[]) => {
        setOnlineUsers(users); // Update online users list
      });
    }
  }, [userId]);

  // console.log(chats);
  // console.log(currentChat);
  // console.log(onlineUsers);

  // Nếu chưa coá đoạn chat nào thì khi ấn bắt đầu sẽ đc thiết lập 1 đoạn chát với admin
  const handleStartChat = async () => {
    try {
      const response = await post('http://localhost:5000/chat', { userId });
      // console.log(response);
      if (response.ChatV3) {
        setChats((prevChats) => [...(prevChats || []), response.ChatV3]); // Update chat list
        setCurrentChat(response.ChatV3); // Set the new chat as current
        setShowSearch(false); // Close search UI if open
        console.log(showSearch)
      }
      
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };
  return (
    <div className="Chat">
      {/* Left Side */}
      <div className="Left-side-chat">
        <div className="Chat-container">
          <h2>Chats</h2>
          <div className="Chat-list">
            {chats && chats.length > 0 ? (
              chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => setCurrentChat(chat)}
                >
                  <Conversation
                    data={chat}
                    currentUser={userId}
                    onlineUsers={onlineUsers}
                  />
                </div>
              ))
            ) : (
              <div>
             
              <Button type='primary' onClick={() => handleStartChat()}>Start New Chat</Button>
            </div>
              
            )}
          </div>
        </div>
      </div>

      <div className="Right-side-chat">
        {chats && currentChat && (
          <ChatBox
            chat={currentChat}
            currentUser={userId}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;


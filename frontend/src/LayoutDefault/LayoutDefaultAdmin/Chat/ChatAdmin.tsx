

// import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from 'react';

import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { get } from "../../../Helpers/API.helper";
import { ChatV2 } from "../../../actions/types";
import Conversation from "../../../components/Client/Conversation/Conversation";
import ChatBox from "../../../components/Client/ChatBox/ChatBox";
import { io, Socket } from 'socket.io-client';

interface OnlineUser {
  userId: string;  // You can add more fields if needed
  socketId: string;
  lastActiveTime?: string;
}

const ChatAdmin = () => {
  const socket = useRef<Socket>();
  const account = useSelector((state: RootState) => state.AccountReducer);

  const accountId = account && account.accountInAdmin ? account.accountInAdmin._id : "";


  const [chats, setChats] = useState<ChatV2[]>();
  const [currentChat, setCurrentChat] = useState<ChatV2>();

  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    const getChats = async () => {
      try {
        const response = await get(`http://localhost:5000/chat/${accountId}`);
        console.log(response)
        setChats(response.ChatV2);
      } catch (error) {
        console.log(error);
      }
    };
    if (accountId) {
      getChats();
    }
  }, [accountId]);

  useEffect(() => {
    if (accountId) {
      socket.current = io("ws://localhost:5000");
      socket.current.emit("new-user-add", accountId);

      socket.current.on("get-users", (users: OnlineUser[]) => {
        setOnlineUsers(users); // Update online users list
      });
      socket.current.on("new-chat-for-admin", (newChat) => {
        // Update the chat list to include the new chat
        setChats((prevChats) => [...(prevChats || []), newChat]);
        // Optionally, set the newly created chat as the current chat
        setCurrentChat(newChat);
      });
    }
  }, [accountId]);

  console.log(chats);
  console.log(currentChat);
  console.log(onlineUsers);

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
                    currentUser={accountId}
                    onlineUsers={onlineUsers}
                  />
                </div>
              ))
            ) : (
              <p>No chats available</p>
            )}
          </div>
        </div>
      </div>

      <div className="Right-side-chat">
        {chats && currentChat && (
          <ChatBox
            currentUser={accountId}
            chat={currentChat}
          />
        )}
      </div>
    </div>
  );
};



export default ChatAdmin;

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Account, User } from '../../../actions/types';
import { get } from '../../../Helpers/API.helper';
import moment from 'moment';

interface ConversationProps {
    data: {
        members: string[];

    };
    onlineUsers: {
        userId: string,
        socketId: string;
        lastActiveTime?: string;
    }[];
    currentUser: string
}

const Conversation: React.FC<ConversationProps> = ({ data, onlineUsers, currentUser }) => {
    const user = useSelector((state: RootState) => state.UserReducer);
    console.log(data)
    console.log(currentUser)
    const account = useSelector((state: RootState) => state.AccountReducer);

    const accountId = account && account.accountInAdmin ? account.accountInAdmin._id : "";
    const userId = user && user.user._id ? user.user._id : "";
    const idMemberDifference = data?.members?.find(member => member !== currentUser);
    // Người dùng không có lastActiveTime thì online

    const [userData, setUserData] = useState<Account | User | null>(null);
    useEffect(() => {
        const getUserData = async () => {
            const otherMember = data?.members?.find(member => member !== currentUser); // Get the other user in the chat
            try {
                if (accountId) {

                    const response = await get(`http://localhost:5000/user/info/${otherMember}`)

                    setUserData(response.detailUser)
                } else {

                    const response = await get(`http://localhost:5000/admin/auth/account/${otherMember}`)

                    setUserData(response.detailAccount)

                }

            }
            catch (error) {
                console.log(error)
            }
        }

        getUserData();
    }, [userId || accountId])

    const isOnline = onlineUsers.some(user => user.userId === idMemberDifference && !user.lastActiveTime);
    
    const otherMemberData = onlineUsers.find(user => user.userId === idMemberDifference);
    console.log(idMemberDifference)

    console.log(onlineUsers)
    console.log(isOnline)
    console.log(otherMemberData)
    return (
        <>
            <div className="follower conversation">
                <div className="d-flex align-items-center">
                    <div className="avatar-container"
                        style={{ backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdo_otMFZfKfkFiOxZZyCyNnBblvng6bO-7w&s')` }}>
                        {isOnline && (
                            <span className="online-dot" />
                        )}
                    </div>
                    <div className="name" style={{ fontSize: '0.8rem', marginLeft: "10px" }}>
                        <span>{userData?.fullName}</span>
                        <br />
                        {/* <div>{otherMemberData?.lastActiveTime}</div> */}
                        <span style={{ color: isOnline ? "#51e200" : "#ccc" }}>
                            {isOnline ? "Online" : (otherMemberData?.lastActiveTime ? <>
                               Online  {moment(otherMemberData?.lastActiveTime).fromNow()}</> : "Offline")} 
                        </span>
                    </div>

                </div>
            </div>

            <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
        </>
    );
};

export default Conversation
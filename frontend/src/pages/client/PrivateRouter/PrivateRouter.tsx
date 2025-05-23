import React, { useEffect, useState } from 'react';
import { AppDispatch } from '../../../store/store';
import { useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { userActions } from '../../../actions/UserAction';
import { ApiResponse } from '../../../actions/types';
import { getCookie } from '../../../Helpers/Cookie.helper';
import { get } from '../../../Helpers/API.helper';

function PrivateRouter() {
    const tokenUser = getCookie("tokenUser");
    const dispatch: AppDispatch = useDispatch();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const accountByToken: ApiResponse = await get(`http://localhost:5000/user/${tokenUser}`);
                console.log("accountByToken.account", accountByToken.user);

                if (accountByToken && accountByToken.user) {
                    dispatch(userActions(accountByToken));
                    setIsAuthenticated(true);
                } else {
                    throw new Error("User not found in the response.");
                }
            } catch (error) {
                console.error("Error fetching account by token:", error);
                setIsAuthenticated(false); // Set authentication to false if error occurs
            }
        };

        if (tokenUser) {
            fetchApi();
        } else {
            setIsAuthenticated(false); // If no token is found, mark as not authenticated
        }
    }, [tokenUser, dispatch]);

    // If authentication is null (loading), show a loader or nothing
    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    // If the user is authenticated, render the protected component (Outlet)
    // Otherwise, navigate to the login page
    return isAuthenticated ? <Outlet /> : <Navigate to="/user/login" replace />;
}

export default PrivateRouter;

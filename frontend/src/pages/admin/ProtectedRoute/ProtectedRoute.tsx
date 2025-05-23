import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // State can be boolean or null

    // Safely get the token from cookies
    // const getTokenFromCookies = (): string | null => {
    //     const tokenString = document.cookie.split('; ').find(row => row.startsWith('token='));
    //     return tokenString ? tokenString.split('=')[1] : null;
    // };

    // useEffect(() => {
    //     const checkToken = async () => {
    //         const token = getTokenFromCookies(); // Get token safely
    //         console.log(token);

    //         if (!token) {
    //             setIsAuthenticated(false); // No token, not authenticated
    //             return;
    //         }

    //         try {
    //             const response = await verifyToken(token); // Make an API call to verify the token
    //             console.log(response.valid);
    //             setIsAuthenticated(response.valid); // Set authentication state based on token validity
    //         } catch (error) {
    //             console.error("Token verification error:", error);
    //             setIsAuthenticated(false); // On error, treat as not authenticated
    //         }
    //     };

    //     checkToken();
    // }, []); 
    useEffect(() => {
        setIsAuthenticated(true);
    })

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/admin/auth/login" replace />;
};

export default ProtectedRoute;

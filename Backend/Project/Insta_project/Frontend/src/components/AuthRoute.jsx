import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../features/Auth/hooks/useAuth";

const AuthRoute = ({ children }) => {
    const { currentUser, currentUserData } = useAuth();
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const verifyAuth = async () => {
            try {
                if (!currentUser) {
                    const user = await currentUserData();
                    if (user || currentUser) {
                        if (isMounted) setIsAuthenticated(true);
                    } else {
                        if (isMounted) setIsAuthenticated(false);
                    }
                } else {
                    if (isMounted) setIsAuthenticated(true);
                }
            } catch (error) {
                if (isMounted) setIsAuthenticated(false);
            } finally {
                if (isMounted) setIsAuthChecked(true);
            }
        };

        verifyAuth();

        return () => {
            isMounted = false;
        };
    }, []);

    if (!isAuthChecked) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children ? children : <Outlet />;
};

export default AuthRoute;

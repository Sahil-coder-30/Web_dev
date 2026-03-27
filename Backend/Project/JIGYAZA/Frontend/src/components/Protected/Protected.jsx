import React, { use } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router';

const Protected = ({children}) => {
    const user = useSelector(state => state.auth.user);
    const loading = useSelector(state => state.auth.loading);

    if (loading) {
        return <div>Loading...</div>;
    }

    const unwrappedUser = user?.user || user;

    if (!unwrappedUser) {
        return <Navigate to="/login" replace />;
    }

    if (!unwrappedUser.verified) {
        return <Navigate to="/register" replace />;
    }
  return (
    children
  )
}

export default Protected

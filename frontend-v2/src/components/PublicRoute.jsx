import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = () => {
  const { user } = useAuth();

  if (user) {
    if (user.userType === 'DRIVER') return <Navigate to="/driver" replace />;
    if (user.userType === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;

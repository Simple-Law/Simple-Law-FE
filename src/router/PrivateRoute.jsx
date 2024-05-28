// PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { authToken } = useAuth();

  return authToken ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

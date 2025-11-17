import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom";

const AuthHOC = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />; // Not logged in → Register page

  return children; // Logged in → show content
};

export default AuthHOC;

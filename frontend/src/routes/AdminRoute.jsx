import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if(!userInfo) {
    return <Navigate to="/" replace />;
  }
  if(userInfo && userInfo.role === 2) {
    return <Outlet />;
  }
  if(userInfo && userInfo.role === 0) {
    return <Navigate to="/dashboard" />;
  }

};

export default AdminRoute;
import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const PrivateRoute = () =>{
  const { userInfo } = useSelector((state) => state.auth);
  
  if(!userInfo) {
    return <Navigate to={"/"} replace />
  }
  if(userInfo.role === 0) {
    return <Outlet />;
  } else if(userInfo.role === 1) {
    return <Navigate to={"/adminDashboard"} />
  }
};

export default PrivateRoute;
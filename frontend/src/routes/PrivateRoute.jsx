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
  } else if(userInfo.role === 2) {
    return <Navigate to={"/adminDashboard"} />
  }
};

export default PrivateRoute;
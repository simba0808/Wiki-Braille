import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const PrivateRoute = () =>{
  useEffect(() => {

  }, []);
  
  return(
    <Outlet />
  );
};

export default PrivateRoute;
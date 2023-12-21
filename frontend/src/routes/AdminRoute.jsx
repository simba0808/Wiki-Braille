import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate, Outlet } from "react-router-dom";
import axios from "axios";

const AdminRoute = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
      try {
        const response = await axios.get("/api/user/");
        console.log(response.data);
      } catch(error) {
        console.log(error);
      }
    };
    fetchData(); 
  }, []);

  if(!userInfo) {
    return <Navigate to="/" replace />;
  }
  if(userInfo && userInfo.role === 1) {
    return <Outlet />;
  }
  if(userInfo && userInfo.role === 0) {
    return <Navigate to="/dashboard" />;
  }

};

export default AdminRoute;
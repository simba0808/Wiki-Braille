import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const EditorRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

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

export default EditorRoute;
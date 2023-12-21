import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useEffect } from "react";
const UserLayout = () => {
  useEffect(() => {
  }, []);
  return (
    <>
      <div className="w-full h-[100vh] flex bg-slate-100"> 
        <Sidebar />
        <div className="w-full flex flex-col flex-1">
          <Navbar />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default UserLayout;
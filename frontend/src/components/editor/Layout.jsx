import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

const EditLayout = () => {
  const [isChecked, setChecked] = useState(false);

  const handleChecked = () => {
    setChecked(!isChecked);
  };

  return (
    <>
      <input type="checkbox" id="side-open" checked={isChecked} onChange={handleChecked} className="hidden" />
      <Navbar handleSlide={handleChecked}/>
      <Sidebar handleSlide={handleChecked}/>
      <div className="main-container flex flex-col  overflow-y-auto bg-cover bg-[url('/src/assets/img/background.png')]">
        <Outlet />
        <ToastContainer />
      </div>
    </>
  );
};

export default EditLayout;
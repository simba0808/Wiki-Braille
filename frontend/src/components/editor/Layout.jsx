import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";

const EditLayout = () => {
  const [isChecked, setChecked] = useState(false);

  useEffect(() => {
    const handleScroll = (event) => {
      if(isChecked){
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isChecked]);

  const handleChecked = () => {
    setChecked(!isChecked);
  };

  return (
    <>
      <div className="w-full min-h-screen relative bg-slate-100 bg-[url('/src/assets/img/background.png')]">
        <input className="hidden" type="checkbox" id="side-open"  checked={isChecked} onChange={handleChecked} />
        <Navbar handleSlide={handleChecked} />
        <Sidebar  handleSlide={handleChecked} />
        <div className="main-container h-auto flex flex-col flex-1 xs:bg-transparent xs:bg-none bg-gradient-to-tr from-sky-50 via-violet-100 to-blue-50">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default EditLayout;
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { setFilterGroup } from "../../slices/dashboardSlice";
import { logout } from "../../slices/authSlice";

import { defaultUserIcon } from "../../assets";
import { LogoImage } from "../../assets";

const Navbar = ({ handleSlide }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logoutShow, setLogoutShow] = useState(false);
  const [fetchedAvatar, setFetchedAvatar] = useState();
  const { userInfo } = useSelector((state) => state.auth);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsieClick = (e) => {
      if (!menuRef.current || !menuRef.current.contains(e.target)) {
        setLogoutShow(false);
      }
    };
    document.addEventListener("mousedown", handleOutsieClick);
    return () => document.removeEventListener("mousedown", handleOutsieClick);
  }, []);

  useEffect(() => {
    const getAvatar = async () => {
      if (userInfo.avatar !== undefined && userInfo.avatar !== "") {
        try {
          const response = await axios.get(
            `/api/user/avatar/${userInfo.avatar}`
          );
          if (response.status === 200) {
            setFetchedAvatar(response.data);
          }
        } catch (err) {
          setFetchedAvatar(defaultUserIcon);
        }
      }
    };
    getAvatar();
  }, [userInfo.avatar]);

  const logoutHandle = () => {
    dispatch(logout({}));
    dispatch(
      setFilterGroup({
        word: "",
        advance: "Descrição",
        searchin: 0,
        pageIndex: 1,
        viewMode: 0,
        numberPerPage: 12,
        filteredCount: null,
        sortMode: true,
      })
    );
    navigate("/");
  };

  return (
    <header className="fixed navbar-container z-20 bg-white shadow-md">
      <div className="flex items-center justify-between h-full px-6 mx-auto text-purple-600"> 
        <Link to={"/editorDashboard"}>
          <img
            className="max-w-[200px] sm:max-w-[250px]"
            src={LogoImage}
            alt=""
          />
        </Link>

        <ul className="flex items-center flex-shrink-0 gap-2 cursor-pointer">
          <li>
            <label
              className="p-1 mr-5 ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-purple"
              aria-label="Menu"
              onClick={handleSlide}
            >
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </label>
          </li>
          <li className="relative">
            <div
              className="flex text-gray-700 gap-4"
              onClick={() => setLogoutShow(!logoutShow)}
            >
              <div className="flex items-center">
                <button
                  className="rounded-md focus:outline-none focus:shadow-outline-purple"
                >
                  <img
                    className="object-cover w-12 h-12 rounded-full"
                    src={
                      fetchedAvatar
                        ? `data: image/jpeg;base64, ${fetchedAvatar}`
                        : defaultUserIcon
                    }
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div className="flex-col hidden md:block">
                <p className="text-left text-lg font-medium">{userInfo.name}</p>
                <p className="text-sm">
                  {userInfo.role === 2
                    ? "Administrator"
                    : userInfo.role === 1
                    ? "Editor"
                    : "Usuário"}
                </p>
              </div>
            </div>
            {logoutShow && (
              <ul className="z-10 absolute right-0 w-56 px-2 divide-y divide-gray-100 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md" ref={menuRef}>
                <li className="px-3 py-3 flex flex-col items-start text-sm">
                  <span className="block text-[16px] font-semibold text-gray-900 truncate dark:text-gray-400">
                    {userInfo.name}
                  </span>
                  <span className="block text-gray-500 dark:text-white">
                    {userInfo.email}
                  </span>
                </li>
                <li className="flex py-2" onClick={logoutHandle}>
                  <div className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800">
                    <svg
                      className="w-6 h-6 mr-3"
                      aria-hidden="true"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                    </svg>
                    <span className="text-md">Fazer logout</span>
                  </div>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;

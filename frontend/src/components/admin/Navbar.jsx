import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";

const Navbar = () => {
  const [logoutShow, setLogoutShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandle =  () => {
    dispatch(logout({}));
    navigate("/");
  }

  return (
    <header className="z-10 py-4 bg-white shadow-md dark:bg-grey-800">
      <div className="container flex items-center justify-end h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        <button
          className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
          aria-label="Menu"
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
        </button>
        <ul className="flex items-center flex-shrink-0 space-x-6">
          <li className="flex">
            <button
              className="rounded-md focus:outline-none focus:shadow-outline-purple"
              //@click="toggleTheme"
              aria-label="Toggle color mode"
            >
              <img
                className="object-cover w-12 h-12 rounded-full"
                src="/src/assets/img/avatar.jpg"
                onClick={() => setLogoutShow(!logoutShow)}
                aria-hidden="true"
              />
            </button>
          </li>
        </ul>
      </div>
      <ul 
        className={`${!logoutShow?"hidden":"block"} absolute top-16 right-16 px-4 py-1 text-lg font-medium rounded-md border border-purple-200 bg-white hover:cursor-pointer`}
        
      >
        <li className="py-1" onClick={logoutHandle}>Log out</li>
      </ul>
    </header>
  );
}

export default Navbar;
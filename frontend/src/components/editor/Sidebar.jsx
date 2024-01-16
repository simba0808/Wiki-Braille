import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { LogoImage } from "../../assets";

const Sidebar = ({ handleSlide }) => {
  const [slideShow, setSlideShow] = useState(0);
  const currentLocation = useLocation().pathname.toString().toLowerCase();
  useEffect(() => {
    if(currentLocation.includes("dashboard")) {
      setSlideShow(0);
    } else if(currentLocation.includes("setting")) {
      setSlideShow(2);
    } else if(currentLocation.includes("data")) {
      setSlideShow(1);
    }
  }, [currentLocation]);

  return (
    <>
      <aside 
        id="sidebar" 
        className={`z-20 w-[230px] shadow-md xs:w-[250px] absolute h-[100vh] top-0 overflow-y-auto bg-white -translate-x-full lg:block lg:translate-x-0 transition duration-200 ease-in-out flex-shrink-0 `}
      >
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <Link
            to={"/editorDashboard"}
            className="ml-2 mt-4 text-lg font-bold text-gray-800 flex items-center justify-center"
          >
            <img className="w-[80%]" src={LogoImage} alt="" />
          </Link>
          <ul className="mt-14">
            <li className={`relative px-6 py-3  ${slideShow===0 ? "bg-purple-100 rounded-lg":""}`} onClick={handleSlide}>
              { slideShow === 0 ? (
                <span
                  className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                  aria-hidden="true"
                ></span>
              ) : (
                <></>
              )}
              <Link
                to={"/editorDashboard"}
                className="inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-400 dark:hover:text-gray-200 dark:text-gray-100"
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span className="ml-4 text-md">Painel de controle</span>
              </Link>
            </li>
          </ul>
          <ul>
            <li className={`relative px-6 py-3  ${slideShow===1 ? "bg-purple-100 rounded-lg":""}`} onClick={handleSlide}>
              { slideShow === 1 ? (
                <span
                  className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                  aria-hidden="true"
                ></span>
                ) : (
                  <></>
              )}
              <Link
                to={"/editorAddData"}
                className="inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-400 dark:hover:text-gray-200 dark:text-gray-100"
              >
                <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                      ></path>
                </svg>
                <span className="ml-4 text-md">Adicionar dados</span>
              </Link>
            </li>
          </ul>
          <ul>
            <li className={`relative px-6 py-3  ${slideShow===2 ? "bg-purple-100 rounded-lg":""}`} onClick={handleSlide}>
              {slideShow === 2 ? (
                <span
                  className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                  aria-hidden="true"
                ></span>
              ) : (
                <></>
              )}
              <Link
                to={"/editorSetting"}
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 text-gray-800 hover:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
                <span className="ml-4 text-md">Configuração</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

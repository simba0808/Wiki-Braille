import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Sidebar = ({ handleSlide }) => {
  const [slideShow, setSlideShow] = useState(0);
  const currentLocation = useLocation().pathname.toString().toLowerCase();
  useEffect(() => {
    if(currentLocation.includes("guide")) {
      setSlideShow(0);
    } else if(currentLocation.includes("dashboard")) {
      setSlideShow(1);
    } else if(currentLocation.includes("setting")) {
      setSlideShow(2);
    }
  }, [currentLocation]);

  return (
    <>
      <aside 
        id="sidebar"
        className={`z-10 w-[230px] shadow-md xs:w-[250px] fixed h-[100%] top-0 overflow-y-auto bg-white -translate-x-full lg:block lg:translate-x-0 transition duration-200 ease-in-out flex-shrink-0 `}
      >
        <div className="py-4 text-gray-500">
          <ul className="mt-20">
            <li className={`relative px-6 py-3  ${slideShow === 0 ? "bg-purple-100 rounded-lg" : ""}`} onClick={handleSlide}>
              {slideShow === 0 ? (
                <span
                  className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                  aria-hidden="true"
                ></span>
              ) : (
                <></>
              )}
              <Link
                to={"/guide"}
                className="inline-flex items-center w-full text-[16px] font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-400"
              >
                <svg className="w-[22px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 9H5a1 1 0 0 0-1 1v4c0 .6.4 1 1 1h6m0-6v6m0-6 5.4-3.9A1 1 0 0 1 18 6v12.2a1 1 0 0 1-1.6.8L11 15m7 0a3 3 0 0 0 0-6M6 15h3v5H6v-5Z" />
                </svg>
                <span className="ml-4">Orientações</span>
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
                to={"/dashboard"}
                className="inline-flex items-center w-full text-[16px] font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-400"
                onClick={() => setSlideShow(0)}
              >
                <svg
                  className="w-[22px]"
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
                <span className="ml-4">Banco de dados</span>
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
                to={"/setting"}
                className="inline-flex items-center w-full text-[16px] font-semibold transition-colors duration-150 text-gray-800 hover:text-gray-400"
              >
                <svg
                  className="w-[22px]"
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
                <span className="ml-4">Configuração</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
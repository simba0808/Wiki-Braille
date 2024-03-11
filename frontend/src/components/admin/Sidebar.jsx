import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Sidebar = ({ handleSlide }) => {
  const [slideShow, setSlideShow] = useState(0);
  const [userExpaned, setUserExpanded] = useState(false);
  const [dataExpanded, setDataExpanded] = useState(false);
  const currentLocation = useLocation().pathname.toString().toLowerCase();
  useEffect(() => {
    if (currentLocation.includes("dashboard")) {
      setSlideShow(1);
    } else if (currentLocation.includes("guide")) {
      setSlideShow(0)
    } else if (currentLocation.includes("setting")) {
      setSlideShow(5)
    } else if (currentLocation.includes("activit")) {
      setSlideShow(4);
    } else if (currentLocation.includes("manage")) {
      setSlideShow(3);
    } else if (currentLocation.includes("data")) {
      setSlideShow(2);
    } else if (currentLocation.includes("addin")) {
      setSlideShow(6);
    }
  }, [currentLocation]);

  return (
    <>
      <aside
        id="sidebar"
        className={`z-10 w-[230px] shadow-md xs:w-[250px] fixed h-[100%] top-0 overflow-y-auto bg-white -translate-x-full lg:block lg:translate-x-0 transition duration-200 ease-in-out flex-shrink-0 `}
      >
        <div className="py-4 text-gray-500">
          <ul className="mt-24">
            <li className={`relative px-6 py-3  ${slideShow === 0 ? "bg-purple-100 rounded-lg" : ""}`} onClick={handleSlide}>
              {
                slideShow === 0 &&
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span>
              }
              <Link
                to={"/adminGuide"}
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
            <li className={`relative px-6 py-3  ${slideShow === 1 ? "bg-purple-100 rounded-lg" : ""}`} onClick={handleSlide}>
              {
                slideShow === 1 &&
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span>
              }
              <Link
                to={"/adminDashboard"}
                className="inline-flex items-center w-full text-[16px] font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-400"
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
          <ul className="relative">
            <li className={`px-6 ${dataExpanded ? "pt-3":"py-3"}`}>
              <button
                className="inline-flex items-center justify-between w-full text-[16px] font-semibold transition-colors duration-150 hover:text-gray-800"
                onClick={() => setDataExpanded(!dataExpanded)}
              >
                <span className="flex">
                  <svg
                    className="w-[22px]"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                    ></path>
                  </svg>
                  <span className="ml-4">Gestão de dados</span>
                </span>
                <svg
                  className="w-[22px]"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </li>
            <ul className={`${dataExpanded ? "transition ease-in-out duration-300 block" : "hidden transition ease-in-out duration-300"}`}>
              <li className={`relative pl-14 py-3 ${slideShow === 2 ? "bg-purple-100 rounded-lg" : ""}`} onClick={handleSlide}>
                {
                  slideShow === 2 &&
                    <span
                      className="absolute inset-y-0 left-0 w-1 h-full bg-purple-600 rounded-tr-lg rounded-br-lg"
                      aria-hidden="true"
                    ></span>
                }
                <Link
                  to={"/adminAddData"}
                  className="inline-flex items-center w-full text-[16px] font-semibold transition-colors duration-150 text-gray-800 hover:text-gray-400"
                >
                  <span className="ml-4">Adicionar dados</span>
                </Link>
              </li>
              <li className={`relative pl-14 py-3 ${slideShow === 6 ? "bg-purple-100 rounded-lg" : ""}`} onClick={handleSlide}>
                {
                  slideShow === 6 &&
                    <span
                      className="absolute inset-y-0 left-0 w-1 h-full bg-purple-600 rounded-tr-lg rounded-br-lg"
                      aria-hidden="true"
                    ></span>
                }
                <Link
                  to={"/adminAddin"}
                  className="inline-flex items-center w-full text-[16px] font-semibold transition-colors duration-150 text-gray-800 hover:text-gray-400"
                >
                  <span className="ml-4">Generate New</span>
                </Link>
              </li>
            </ul>
          </ul>
          <ul className={`relative`}>
            <li className={`px-6 ${userExpaned ? "pt-3":"py-3"}`}>
              <button
                className="inline-flex items-center justify-between w-full text-[16px] font-semibold transition-colors duration-150 hover:text-gray-800"
                onClick={() => setUserExpanded(!userExpaned)}
              >
                <span className="flex">
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
                    <path
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  <span className="ml-4">Gerenciamento</span>
                </span>
                <svg
                  className="w-[22px]"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </li>
            <ul className={`${userExpaned ? "transition ease-in-out duration-300 block" : "hidden transition ease-in-out duration-300"}`}>
              <li className={`relative pl-14 py-3 ${slideShow === 3 ? "bg-purple-100 rounded-lg" : ""}`} onClick={handleSlide}>
                {
                  slideShow === 3 &&
                    <span
                      className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                      aria-hidden="true"
                    ></span>
                }
                <Link
                  to={"/adminManage"}
                  className="inline-flex items-center w-full text-[16px] font-semibold transition-colors duration-150 text-gray-800 hover:text-gray-400"
                >
                  <span className="ml-4">Usuários</span>
                </Link>
              </li>
              <li className={`relative pl-14 py-3 ${slideShow === 4 ? "bg-purple-100 rounded-lg" : ""}`} onClick={handleSlide}>
                {
                  slideShow === 4 &&
                    <span
                      className="absolute inset-y-0 left-0 w-1 h-full bg-purple-600 rounded-tr-lg rounded-br-lg"
                      aria-hidden="true"
                    ></span>
                }
                <Link
                  to={"/adminActivities"}
                  className="inline-flex items-center w-full text-[16px] font-semibold transition-colors duration-150 text-gray-800 hover:text-gray-400"
                >
                  <span className="ml-4">Atividades</span>
                </Link>
              </li>
            </ul>
          </ul>
          <ul>
            <li className={`relative px-6 py-3  ${slideShow === 5 ? "bg-purple-100 rounded-lg" : ""}`} onClick={handleSlide}>
              {
                slideShow === 5 &&
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span>
              }
              <Link
                to={"/adminSetting"}
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

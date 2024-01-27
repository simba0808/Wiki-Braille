import Loading from "../../components/Loading";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import DatePicker from "react-tailwindcss-datepicker";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const ActivityManage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("");

  const [filteredData, setFilteredData] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [startPageIndex, setStartPageIndex] = useState(1);
  const [filteredCount, setFilteredCount] = useState(0);

  const textRef = useRef(null);
  const typeRef = useRef(null);

  useEffect(() => {
    // const fetchLogData = async () => {
    //   try {
    //     axios.defaults.headers.common["Authorization"] = `Beaer ${userInfo.token}`;
    //     const response = await axios.post("/api/log/getlogs", {
    //       pagePerNumber: 15,
    //     });
    //     if (response.data.data) {
    //       setFilteredData(response.data.data);
    //       setFilteredCount(response.data.totalCount);
    //     }
    //   } catch (err) {
    //     toast.error("Failed to fetch logs", { autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark" });
    //   }
    // };
    // fetchLogData();
  }, []);

  useEffect(() => {
    fetchData(dateRange, searchType, searchText);
  }, [currentPageIndex]);

  const fetchData = async (dateRange, searchType, searchText) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
    const response = await axios.post("/api/log/getlogs", {
      dateRange: dateRange,
      searchType: searchType,
      searchText: searchText,
      pagePerNumber: 20,
      pageIndex: currentPageIndex,
    });
    if (response.data.data) {
      setFilteredData(response.data.data);
      console.log(response.data.totalCount)
      setFilteredCount(response.data.totalCount);
    }
  };

  useEffect(() => {
    console.log(filteredCount)
  }, [filteredCount])

  const handleChangeDate = (newVal) => {
    setDateRange(newVal);
  };

  const backButtonHandle = () => {
    if(currentPageIndex < 2) {
      return;
    }
    if(currentPageIndex === startPageIndex) {
      setStartPageIndex(startPageIndex-1);
    } 
    setCurrentPageIndex(currentPageIndex-1);
  };

  const forwardButtonHandle = () => {
    if(currentPageIndex > filteredCount/20) {
      return;
    }
    if(currentPageIndex === startPageIndex+4) {
      setStartPageIndex(startPageIndex+1);
    }
    
    setCurrentPageIndex(currentPageIndex+1);
  };

  const handleSearchClick = () => {
    setSearchText(textRef.current.value);
    setSearchType(typeRef.current.value);
    setStartPageIndex(1);
    setCurrentPageIndex(1);
    fetchData(dateRange, typeRef.current.value, textRef.current.value);
  };

  const handleShowAllClick = () => {
    setDateRange({
      startDate: null,
      endDate: null,
    });
    handleChangeDate({
      startDate: null,
      endDate: null,
    });
    setSearchText("");
    textRef.current.value = "";
    setSearchType("name");
    typeRef.current.value = "name";
    setCurrentPageIndex(1);
    setStartPageIndex(1);
  };

  return (
    <main className="flex item-center justify-center">
      {isLoading && <Loading />}
      <div className="container xs:px-6 pb-4">
        <div className="flex justify-between">
          <h2 className="my-6 text-2xl text-left font-semibold text-gray-700">
            Registro de atividades
          </h2>
        </div>
        <ToastContainer />
        <div className="w-full py-4 shadow-xs">
          <div className="flex xl:flex-row flex-col xl:items-center items-start mb-4 gap-4 text-sm">
            <button 
              className="w-[150px] py-2 border border-purple-600 border-purple-600 rounded-md bg-white text-purple-600 text-sm hover:bg-purple-600 hover:text-white active:bg-purple-900 transition:colors duration-500"
              onClick={handleShowAllClick}
            >
              Show all logs
            </button>
            <div className="w-full xl:w-[40%] flex items-center">
              <label>Date:&nbsp;&nbsp;</label>
              <DatePicker
                inputClassName="w-full focus:outline-none border border-slate-300 py-2 px-2 rounded-md"
                value={dateRange}
                onChange={handleChangeDate}
                showShortcuts={true}
              />
            </div>
            <div className="w-full flex md:flex-row flex-col gap-4">
              <div className="flex items-center">
                <label>Search type:&nbsp;&nbsp;</label>
                <select className="w-[200px] py-2 border border-slate-300 rounded-md outline-none" ref={typeRef}>
                  <option value="name">Activity Name</option>
                  <option value="status">Activity Status</option>
                  <option value="user">User Name</option>
                  <option value="detail">Activity Information</option>
                </select>
              </div>
              <div className="grow flex gap-4 justify-between">
                <input
                  type="text"
                  className="xs:w-[300px] grow px-2 py-2 border border-slate-300 rounded-md focus:outline-none"
                  placeholder="Search text..."
                  ref={textRef}
                />
                <button
                  className="px-6 py-2 border border-purple-600 border-purple-600 rounded-md bg-white text-purple-600 text-sm hover:bg-purple-600 hover:text-white active:bg-purple-900 transition:colors duration-500"
                  onClick={handleSearchClick}
                >
                  Search
                </button>
              </div>
            </div>

          </div>
          <div className="overflow-auto">
            <table className="w-full overflow-x-auto whitespace-no-wrap border">
              <thead>
                <tr className="py-2 text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                  <td className="xs:px-4 px-2 py-3 text-center">Activity Name</td>
                  <td className="xs:px-4 px-2 py-3 text-center">Activity Status</td>
                  <td className="xs:px-4 px-2 py-3 text-center">User</td>
                  <td className="xs:px-4 px-2 py-3 text-center">Time</td>
                  <td className="xs:px-4 px-2 py-3 text-center">Activity Information</td>
                </tr>
              </thead>
              <tbody>
                {
                  filteredData.map((item, index) => {
                    return (
                      <tr key={index} className={`overflow-x-auto text-sm ${index % 2 ? "bg-slate-100" : "bg-white"}`}>
                        <td className="px-4 py-1">
                          {item.name}
                        </td>
                        <td className="px-4 py-1">
                          {item.status}
                        </td>
                        <td className="px-4 py-1">
                          {item.user}
                        </td>
                        <td className="px-4 py-1">
                          {item.time.split("T")[0]+" "+item.time.split("T")[1].split(".")[0]}
                        </td>
                        <td className="px-4 py-1">
                          {item.detail}
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>
          <div className="float-right mt-4">
            <ul className="inline-flex sm:items-center">
              <li className="flex items-center">
                <button
                  aria-label="Previous"
                  onClick={backButtonHandle}
                >
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </li>
              {
                [1, 2, 3, 4, 5].map((item, index) => {
                  return <li key={index} className="mx-1">
                    <button
                      className={`xs:w-8 xs:h-8 w-8 h-8 rounded-md text-purple-600 focus:outline-none focus:shadow-outline-purple border border-purple-600 focus:outline-none focus:shadow-outline-purple ${currentPageIndex === startPageIndex + index ? "bg-purple-600 text-white" : ""} ${(startPageIndex + index) > (filteredCount % 20 ? filteredCount / 20 + 1 : filteredCount / 20) ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => setCurrentPageIndex(startPageIndex + index)}
                      disabled={(startPageIndex + index) > (filteredCount % 20 ? filteredCount / 20 + 1 : filteredCount / 20) ? true : false}
                    >
                      {startPageIndex + index}
                    </button>
                  </li>
                })
              }
              <li className="flex items-center">
                <button
                  aria-label="Next"
                  onClick={ forwardButtonHandle}
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ActivityManage;
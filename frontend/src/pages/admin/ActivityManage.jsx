import Loading from "../../components/Loading";
import Pagination from "../../components/pagination/Pagination";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useToast from "../../hook/useToast";
import DatePicker from "react-tailwindcss-datepicker";
import axios from "axios";

const ActivityManage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const customToast = useToast();

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
    if (userInfo.role !== 2) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    fetchData(dateRange, searchType, searchText);
  }, [currentPageIndex]);

  const fetchData = async (dateRange, searchType, searchText) => {
    setIsLoading(true);
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
      const response = await axios.post("/api/log/getlogs", {
        dateRange: dateRange,
        searchType: searchType,
        searchText: searchText,
        pagePerNumber: 20,
        pageIndex: currentPageIndex,
      });
      setIsLoading(false);
      if (response.data.data) {
        setFilteredData(response.data.data);
        setFilteredCount(response.data.totalCount);
      }
    } catch (err) {
      setIsLoading(false);
      customToast("failed", "Falha ao buscar os registros");
    }
  };

  const handleChangeDate = (newVal) => {
    setDateRange(newVal);
  };

  const goToFirstHandle = () => {
    setCurrentPageIndex(1);
    setStartPageIndex(1);
  }

  const goToLastHandle = () => {
    const numOfPages = filteredCount % 20
      ? Math.floor(filteredCount / 20) + 1
      : Math.floor(filteredCount / 20)
    setCurrentPageIndex(numOfPages);
    setStartPageIndex(numOfPages >= 5 ? numOfPages-4 : 1);
  }

  const backButtonHandle = () => {
    if (currentPageIndex < 2) {
      return;
    }
    if (currentPageIndex === startPageIndex) {
      setStartPageIndex(startPageIndex - 1);
    }
    setCurrentPageIndex(currentPageIndex - 1);
  };

  const forwardButtonHandle = () => {
    const numOfPages = filteredCount % 20
      ? Math.floor(filteredCount / 20) + 1
      : Math.floor(filteredCount / 20)
    
    if (currentPageIndex >= numOfPages) {
      return;
    }
    if (currentPageIndex === startPageIndex + 4) {
      setStartPageIndex(startPageIndex + 1);
    }

    setCurrentPageIndex(currentPageIndex + 1);
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
    fetchData({ startDate: null, endDate: null }, "name", "");
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
        <div className="w-full py-4 shadow-xs">
          <div className="flex xl:flex-row flex-col xl:items-center items-start mb-4 gap-4 text-sm">
            <button
              className="w-[150px] py-2 border border-purple-600 rounded-md bg-white text-purple-600 text-sm hover:bg-purple-600 hover:text-white active:bg-purple-900 transition:colors duration-500"
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
                  className="xs:w-[300px] grow px-2 py-2 border border-slate-300 focus:border focus:border-purple-400 focus:ring-2 focus:ring-purple-200 rounded-md focus:outline-none"
                  placeholder="Pesquisar texto aqui"
                  ref={textRef}
                  onKeyDown={(e) => {
                    if(e.keyCode === 13) {
                      handleSearchClick()
                    }
                  }}
                />
                <button
                  className="px-6 py-2 border border-purple-600 rounded-md bg-white text-purple-600 text-sm hover:bg-purple-600 hover:text-white active:bg-purple-900 transition:colors duration-500"
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
                          {
                            new Date(new Date(item.time).toLocaleString("en-US", { timeZone: "America/Sao_Paulo", timeZoneName: "short" })).toLocaleString("en-GB", {
                              day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
                            })
                          }
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
            <Pagination 
              currentPageIndex={currentPageIndex}
              startPageIndex={startPageIndex}
              filteredCount={filteredCount}
              numberPerPage={20}
              backButtonHandle={backButtonHandle}
              forwardButtonHandle={forwardButtonHandle}
              goToFirstHandle={goToFirstHandle}
              goToLastHandle={goToLastHandle}
              handlePageClick={setCurrentPageIndex}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ActivityManage;
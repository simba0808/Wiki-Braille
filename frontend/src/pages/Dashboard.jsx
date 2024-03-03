import Loading from "../components/Loading";
import DetailModal from "../components/modals/detailModal";
import { emptyImage, NotExistIcon, ArrowUp, ArrowDown } from "../assets";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../slices/authSlice";
import { setFilterGroup } from "../slices/searchSlice";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import { useTheme, useMediaQuery } from "@mui/material";

const Dashboard = () => {
  const theme = useTheme();
  const screenSize = {
    isSmall: useMediaQuery(theme.breakpoints.down("md")),
    isMedium: useMediaQuery(theme.breakpoints.between("md", "xl")),
    isLarge: useMediaQuery(theme.breakpoints.up("xl")),
  };

  const { userInfo } = useSelector((state) => state.auth);
  const { filterGroup } = useSelector((state) => state.search);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [modalShow, setModalShow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [startPageIndex, setStartPageIndex] = useState(1);
  const [currentPageIndex, setCurrentPageIndex] = useState(filterGroup.pageIndex);
  const [numberPerPage, setNumberPerPage] = useState(filterGroup.numberPerPage);
  const [searchWord, setSearchWord] = useState(filterGroup.word);
  const [filteredCount, setFilteredCount] = useState(filterGroup.filteredCount !== null ? filterGroup.filteredCount : 0);
  const [filteredData, setFilteredData] = useState([]);
  const [sortMethod, setSortMethod] = useState(filterGroup.sortMode);
  const [isDescending, setDescending] = useState([true, true]);
  const [viewMode, setViewMode] = useState(filterGroup.numberPerPage === 12 ? true : false);
  const [updateDescription, setUpdateDescription] = useState({});
  const [isLoading, setLoading] = useState(false);

  const refAdvance = useRef(null);
  const refSearchIn = useRef(null);

  useEffect(() => {
    const fetchAuthData = async () => {
      if (!userInfo) {
        navigate("/");
      } else {
        axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
        try {
          const res = await axios.get("/api/user/");
          dispatch(setCredentials({ ...res.data }));
        } catch (err) {
          toast.error("Falha ao buscar dados", { autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: 'dark' });
          navigate("/");
        }
      }
    };
    fetchAuthData();
  }, []);

  useEffect(() => {
    fetchFilteredData(searchWord, refAdvance.current.value, refSearchIn.current.value, currentPageIndex, numberPerPage, sortMethod);
  }, [currentPageIndex]);

  useEffect(() => {
    fetchFilteredData(searchWord, refAdvance.current.value, refSearchIn.current.value, currentPageIndex, numberPerPage, sortMethod);
  }, [numberPerPage])

  useEffect(() => {
    if (filteredCount !== 0) {
      fetchFilteredData(searchWord, refAdvance.current.value, refSearchIn.current.value, currentPageIndex, numberPerPage, sortMethod);
    }
  }, [sortMethod, isDescending]);

  useEffect(() => {
    if (Object.keys(updateDescription).length !== 0 && filteredData) {
      filteredData[selectedIndex].description = updateDescription.text;
      filteredData[selectedIndex].tag = updateDescription.tag;
      if (updateDescription.image !== null) {
        filteredData[selectedIndex].image = updateDescription.image;
      }
    }
  }, [updateDescription]);

  const fetchFilteredData = async (word, advance, searchin, pageIndex, numberPerPage, sortMethod) => {
    setFilteredData([]);
    setLoading(true);
    try {
      const searcher = {
        word,
        advance,
        searchin,
        pageIndex: pageIndex,
        numberPerPage,
        sortMethod,
        descending: isDescending[sortMethod ? 0 : 1]
      };

      const response = await axios.post("/api/data/getdata", searcher);
      dispatch(setFilterGroup({
        ...filterGroup, word, advance, searchin, pageIndex, filteredCount:response.data.count,
      }));

      setFilteredCount(response.data.count);
      setFilteredData(response.data.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Falha ao buscar dados", { autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: 'dark' })
    }
  };

  const handleClick = (index) => {
    setSelectedIndex(index);
    setModalShow(true);
  };

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
    if ((currentPageIndex + 1) >= (filteredCount % numberPerPage ? filteredCount / numberPerPage + 1 : filteredCount / numberPerPage)) {
      return;
    }
    if (currentPageIndex === startPageIndex + 4) {
      setStartPageIndex(startPageIndex + 1);
    }
    setCurrentPageIndex(currentPageIndex + 1);
  };

  const handleSearchInput = (e) => {
    setSearchWord(e.target.value);
  };

  const handleSearchEntered = (e) => {
    if (e.keyCode === 13) {
      setCurrentPageIndex(1);
      setStartPageIndex(1);
      setSelectedIndex(-1);
      fetchFilteredData(searchWord, refAdvance.current.value, refSearchIn.current.value, currentPageIndex, numberPerPage, sortMethod);
    }
  };

  const searchResult = filteredData.map((item, index) => {
    return (
      <div className="relative h-[190px] col-span-1 flex flex-col items-start bg-slate-100 p-2 border-2 shadow-md rounded-md hover:cursor-pointer" onClick={() => handleClick(index)} key={index}>
        <span className="absolute right-2 xs:w-20 xs:px-4 py-1 px-2 rounded-xl xs:text-md text-sm bg-purple-200 text-purple-600">{item.title_id}</span>
        <h2 className="p-0 pl-2 my-0 lg:text-[22px] md:text-lg sm:text-[22px] text-[18px] font-semibold">{item.title}</h2>
        <div className="flex w-full items-center justify-center flex-1">
          <div className="w-full h-full flex flex-col justify-between pl-2 pt-4">
            {
              item.catagory !== "Descrição" ? <p className="xl:text-lg text-sm text-left font-semibold">{`Tag: ${item.tag}`}</p> : <></>
            }
            <div className="flex-1 flex items-center">
              <p className="pt-2 text-md text-left 2xl:block hidden">{item.description.length > 150 ? item.description.substring(0, 150) + "..." : item.description}</p>
              <p className="pt-2 text-sm text-left xl:block 2xl:hidden hidden">{item.description.length > 130 ? item.description.substring(0, 130) + "..." : item.description}</p>
              <p className="pt-2 text-sm text-left lg:block xl:hidden hidden">{item.description.length > 80 ? item.description.substring(0, 80) + "..." : item.description}</p>
              <p className="pt-2 text-sm text-left md:block lg:hidden hidden">{item.description.length > 80 ? item.description.substring(0, 80) + "..." : item.description}</p>
              <p className="pt-2 text-md text-left sm:block md:hidden hidden">{item.description.length > 150 ? item.description.substring(0, 150) + "..." : item.description}</p>
              <p className=" pt-2 text-sm text-left sm:hidden block">{item.description.length > 100 ? item.description.substring(0, 100) + "..." : item.description}</p>
            </div>
          </div>
          <img
            className="max-h-[140px] max-w-[50%]"
            src={item.image ? item.image : NotExistIcon}
            alt=""
          />
        </div>
      </div>
    );
  });

  return (
    <main className="w-full">
      {isLoading && <Loading />}
      <div className="container mx-auto">
        <h2 className="my-6 text-2xl text-left font-semibold text-gray-700">
          Banco de dados
        </h2>
        <ToastContainer />
        <div className="h-[40px] relative my-2 text-gray-500 focus-within:text-purple-600">
          <input
            className="block w-full h-[100%] pl-14 pr-20 text-md text-black border-2 rounded-md focus:border focus:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:outline-none form-input"
            placeholder="apple"
            autoFocus
            defaultValue={filterGroup.word}
            onKeyDown={handleSearchEntered}
            onChange={handleSearchInput}
          />
          <div className="absolute border-r-2 inset-y-0 flex items-center px-3">
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <button
            className="absolute inset-y-0 right-0 xs:px-4 px-2 my-0 text-sm font-medium leading5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-r-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
            onClick={() => {
              setCurrentPageIndex(1);
              setStartPageIndex(1);
              setSelectedIndex(-1);
              fetchFilteredData(searchWord, refAdvance.current.value, refSearchIn.current.value, currentPageIndex, numberPerPage, sortMethod)
            }}
          >
            Pesquisar
          </button>
        </div>
        <div className="md:flex md:justify-between">
          <div className="md:w-[48%] w-full relative my-2 px-2 text-gray-500 flex bg-white rounded-md border-2 border-slate-200">
            <label className="px-2 xs:pr-4 border-r-2 md:text-md text-sm flex items-center">
              Pesquisa avançada:
            </label>
            <select
              data-te-select-init
              className="grow py-2 pl-2 focus:outline-none focus:border-none text-slate-900"
              defaultValue={filterGroup.advance}
              ref={refAdvance}
            >
              <option value="Descrição">Descrição</option>
              <option value="Desenhos em braille">Desenhos em braille</option>
              <option value="Grafias em braille">Grafias em braille</option>
              <option value="Exemplos da grafia braille">Exemplos da grafia braille</option>
            </select>
          </div>
          <div className="md:w-[48%] w-full relative my-2 px-2 text-gray-500 flex bg-white rounded-md border-2 border-slate-200">
            <label className="px-2 pr-4 border-r-2 md:text-md text-sm flex items-center">
              Pesquisar em
            </label>
            <select
              data-te-select-init
              className="grow py-2 pl-2 focus:outline-none focus:border-none text-slate-900"
              defaultValue={filterGroup.searchin}
              ref={refSearchIn}
            >
              <option value="0">Tudo</option>
              <option value="1">Pesquisar por título</option>
              <option value="2">Pesquisar por tag</option>
              <option value="3">Pesquisar por estrela</option>
            </select>
          </div>
        </div>
        <div className="px-2 py-2 rounded-t-xl">
          <div className="w-full flex xl:flex-row flex-col items-center justify-between">
            <p className="w-full text-lg text-left">
              <b className="text-xl">{filteredCount}</b>&nbsp;registros pesquisados
            </p>
            <div className="w-full flex md:p-1 md:flex-row flex-col gap-4 justify-end items-end">
              <div className="flex items-center gap-2 mt-2">
                <div className="bg-gray-200 text-sm text-gray-500 leading-none border-2 border-gray-200 rounded-full inline-flex">
                  <button
                    className={`${!screenSize.isSmall?"w-[120px]":""} px-2 relative inline-flex items-center justify-center transition-colors duration-300 ease-in focus:outline-none hover:text-blue-400 focus:text-blue-400 rounded-r-full py-2 ${sortMethod ? "active" : ""}`}
                    id="list"
                    onClick={() => {
                      if (sortMethod) setDescending([!isDescending[0], isDescending[1]]);
                      setSortMethod(true);
                      dispatch(setFilterGroup({ ...filterGroup, sortMode: true }));
                    }}
                  >
                    <span className="w-[80%]">numérica</span>
                    { !screenSize.isSmall && <img className="absolute right-0" src={isDescending[0] ? ArrowDown : ArrowUp} />}
                  </button>
                  <button
                    className={`${!screenSize.isSmall?"w-[120px]":""} px-2 relative inline-flex items-center  transition-colors duration-300 ease-in focus:outline-none hover:text-blue-400 focus:text-blue-400 rounded-r-full  py-2 ${!sortMethod ? "active" : ""}`}
                    id="grid"
                    onClick={() => {
                      if (!sortMethod) setDescending([isDescending[0], !isDescending[1]]);
                      setSortMethod(false);
                      dispatch(setFilterGroup({ ...filterGroup, sortMode: false }));
                    }}
                  >
                    <span className="w-[80%]">Avaliação</span>
                    { !screenSize.isSmall && <img className="absolute right-1" src={isDescending[1] ? ArrowDown : ArrowUp} /> }
                  </button>
                </div>
                <div className="bg-gray-200 text-sm text-gray-500 leading-none border-2 border-gray-200 rounded-full inline-flex">
                  <button className={`inline-flex items-center transition-colors duration-300 ease-in focus:outline-none hover:text-blue-400 focus:text-blue-400 rounded-r-full px-4 py-2 ${!viewMode ? "active" : ""}`} id="list" onClick={() => { setViewMode(false); setNumberPerPage(10) }}>
                    { !screenSize.isSmall &&  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fill-current w-4 h-4 mr-2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg> }
                    <span>Lista</span>
                  </button>
                  <button className={`inline-flex items-center transition-colors duration-300 ease-in focus:outline-none hover:text-blue-400 focus:text-blue-400 rounded-l-full px-4 py-2 ${viewMode ? "active" : ""}`} id="grid" onClick={() => { setViewMode(true); setNumberPerPage(12); }}>
                    { !screenSize.isSmall && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fill-current w-4 h-4 mr-2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> }
                    <span>Grade</span>
                  </button>
                </div>
              </div>
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
                        className={`xs:w-10 xs:h-10 w-8 h-8 rounded-md text-purple-600 focus:shadow-outline-purple border border-purple-600 focus:outline-none focus:shadow-outline-purple ${currentPageIndex === startPageIndex + index ? "bg-purple-600 text-white" : ""} ${(startPageIndex + index) > (filteredCount % numberPerPage ? filteredCount / numberPerPage + 1 : filteredCount / numberPerPage) ? "opacity-50 cursor-not-allowed" : ""}}`}
                        onClick={() => setCurrentPageIndex(startPageIndex + index)}
                        disabled={(startPageIndex + index) > (filteredCount % numberPerPage ? filteredCount / numberPerPage + 1 : filteredCount / numberPerPage) ? true : false}
                      >
                        {startPageIndex + index}
                      </button>
                    </li>
                  })
                }
                <li className="flex items-center">
                  <button
                    aria-label="Next"
                    onClick={forwardButtonHandle}
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
        {
          viewMode ?
            <Box sx={{ width: "100%", overflowY: 'none', py: 2 }}>
              <ImageList variant={screenSize.isSmall ? "masonry" : ""} cols={screenSize.isSmall ? 2 : 4} gap={10}>
                {
                  filteredData.map((item, index) => {
                    return (
                      <div className="sm:h-[260px] h-auto relative flex flex-col justify-center my-2 border-2 border-t-0 shadow-md bg-white rounded-lg  hover:cursor-pointer" key={item.image} onClick={() => handleClick(index)}>
                        <span className="absolute xs:right-2 xs:top-2 right-1 top-1 xs:w-20 xs:px-4 py-1 px-2 rounded-xl text-xs md:text-sm bg-purple-200 text-purple-600">{item.title_id}</span>
                        <div key={item.image} className="p-2 pt-8 mx-auto">
                          <img
                            srcSet={`${item.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            src={`${item.image ? item.image : emptyImage}?w=248&fit=crop&auto=format`}
                            className="sm:max-h-[200px]"
                            alt={item.title}
                            loading="lazy"
                          />
                        </div>
                        <div className="px-2 py-2">
                          <p className="absolute bottom-0 w-[90%] text-center overflow-hidden whitespace-nowrap text-overflow-ellipsis text-sm sm:text-md sm:font-semibold ">{item.title}</p>
                        </div>
                      </div>
                    );
                  })
                }
              </ImageList>
            </Box> :
            <div className={`p-2 pt-0 ${filteredData.length ? `grid gap-2 md:grid-cols-2 grid-cols-1 rounded-b-xl` : ""}`}>
              {
                filteredData.length ? searchResult : <img src={emptyImage} className="mx-auto py-4 sm:py-14 2xl:py-24" />
              }
            </div>
        }
        {
          modalShow && selectedIndex !== -1 ? <DetailModal descData={{ ...filteredData[selectedIndex] }} handleClick={setModalShow} updateHandle={setUpdateDescription} /> : ""
        }
      </div>
    </main>
  );
};

export default Dashboard;
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useToast from "../hook/useToast";
import { useTheme, useMediaQuery } from "@mui/material";
import axios from "axios";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";

import Loading from "../components/Loading";
import DetailModal from "../components/modals/DetailModal";
import Pagination from "../components/pagination/Pagination";
import DescriptionCard from "../components/cards/DescriptionCard";
import ImageCard from "../components/cards/ImageCard";

import { ArrowUp, ArrowDown, emptyImage } from "../assets";
import { setCredentials } from "../slices/authSlice";
import { setFilterGroup, setIndexesToDelete } from "../slices/dashboardSlice";

const Dashboard = () => {
  const theme = useTheme();
  const screenSize = {
    isSmall: useMediaQuery(theme.breakpoints.down("md")),
    isMedium: useMediaQuery(theme.breakpoints.between("md", "xl")),
    isLarge: useMediaQuery(theme.breakpoints.up("xl")),
  };
  const customToast = useToast();

  const { userInfo } = useSelector((state) => state.auth);
  const { filterGroup } = useSelector((state) => state.search);
  const { indexesToDelete } = useSelector((state) => state.delete);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [modalShow, setModalShow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [startPageIndex, setStartPageIndex] = useState(
    filterGroup.pageIndex >= 5 ? filterGroup.pageIndex - 4 : 1
  );
  const [currentPageIndex, setCurrentPageIndex] = useState(
    filterGroup.pageIndex
  );
  const [numberPerPage, setNumberPerPage] = useState(filterGroup.numberPerPage);
  const [searchWord, setSearchWord] = useState(filterGroup.word);
  const [filteredCount, setFilteredCount] = useState(
    filterGroup.filteredCount !== null ? filterGroup.filteredCount : 0
  );
  const [filteredData, setFilteredData] = useState([]);
  const [sortMethod, setSortMethod] = useState(filterGroup.sortMode);
  const [isDescending, setDescending] = useState([true, true]);
  const [viewMode, setViewMode] = useState(filterGroup.viewMode ? true : false);
  const [updateDescription, setUpdateDescription] = useState({});
  const [isLoading, setLoading] = useState(false);

  const [isPossibleDelete, setPossibleDelete] = useState(false);

  const refAdvance = useRef(null);
  const refSearchIn = useRef(null);
  const refNumberPerPage = useRef(null);

  useEffect(() => {
    const fetchAuthData = async () => {
      if (!userInfo) {
        navigate("/");
      } else {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${userInfo.token}`;
        try {
          const res = await axios.get("/api/user/");
          dispatch(setCredentials({ ...res.data }));
        } catch (err) {
          customToast("failed", "Falha ao buscar dados");
          navigate("/");
        }
      }
    };
    fetchAuthData();
  }, []);

  useEffect(() => {
    fetchFilteredData(
      searchWord,
      refAdvance.current.value,
      refSearchIn.current.value,
      currentPageIndex,
      parseInt(refNumberPerPage.current.value),
      sortMethod
    );
  }, [currentPageIndex, numberPerPage, sortMethod, isDescending]);

  useEffect(() => {
    if (Object.keys(updateDescription).length !== 0 && filteredData) {
      filteredData[selectedIndex].description = updateDescription.text;
      filteredData[selectedIndex].tag = updateDescription.tag;
      if (updateDescription.image !== null) {
        filteredData[selectedIndex].image = updateDescription.image;
      }
    }
  }, [updateDescription]);

  const fetchFilteredData = async (
    word,
    advance,
    searchin,
    pageIndex,
    numberPerPage,
    sortMethod
  ) => {
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
        descending: isDescending[sortMethod ? 0 : 1],
      };

      const response = await axios.post("/api/data/getdata", searcher);
      dispatch(
        setFilterGroup({
          ...filterGroup,
          word,
          advance,
          searchin,
          pageIndex,
          numberPerPage,
          filteredCount: response.data.count,
        })
      );
      setNumberPerPage(numberPerPage);
      setFilteredCount(response.data.count);
      setFilteredData(response.data.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      customToast("failed", "Falha ao buscar dados");
    }
  };

  const handleClick = (index) => {
    setSelectedIndex(index);
    setModalShow(true);
  };

  const goToFirstHandle = () => {
    setCurrentPageIndex(1);
    setStartPageIndex(1);
  };

  const goToLastHandle = () => {
    const numOfPages =
      filteredCount % numberPerPage
        ? Math.floor(filteredCount / numberPerPage) + 1
        : Math.floor(filteredCount / numberPerPage);
    setCurrentPageIndex(numOfPages);
    setStartPageIndex(numOfPages >= 5 ? numOfPages - 4 : 1);
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
    if (
      currentPageIndex + 1 >=
      (filteredCount % numberPerPage
        ? filteredCount / numberPerPage + 1
        : filteredCount / numberPerPage)
    ) {
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

  const handleDeleteConfirmClick = async () => {
    if (indexesToDelete.length === 0) {
      customToast("failed", "Selecione os itens a serem excluídos");
      return;
    }
    try {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${userInfo.token}`;
      const response = await axios.post("/api/data/batchdelete", {
        user: userInfo.name,
        indexesToDelete,
      });
      if (response.data.message === "success") {
        customToast("success", "Excluído com sucesso.");
        fetchFilteredData(
          searchWord,
          refAdvance.current.value,
          refSearchIn.current.value,
          currentPageIndex,
          parseInt(refNumberPerPage.current.value),
          sortMethod
        );
      }
    } catch (err) {
      customToast("failed", "Falha ao excluir descrições");
    }
    setPossibleDelete(false);
    dispatch(setIndexesToDelete([]));
  };

  const handleDeleteCancelClick = () => {
    setPossibleDelete(false);
    dispatch(setIndexesToDelete([]));
    
    fetchFilteredData(
      searchWord,
      refAdvance.current.value,
      refSearchIn.current.value,
      currentPageIndex,
      parseInt(refNumberPerPage.current.value),
      sortMethod
    );
  };

  const handleSearchEntered = (e) => {
    if (e.keyCode === 13) {
      setCurrentPageIndex(1);
      setStartPageIndex(1);
      setSelectedIndex(-1);
      fetchFilteredData(
        searchWord,
        refAdvance.current.value,
        refSearchIn.current.value,
        currentPageIndex,
        parseInt(refNumberPerPage.current.value),
        sortMethod
      );
    }
  };

  return (
    <main className="w-full py-4">
      {isLoading && <Loading />}
      <div className="container mx-auto">
        <h2 className="mt-2 mb-6 text-2xl text-left font-semibold text-gray-700">
          Banco de dados
        </h2>
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
              fetchFilteredData(
                searchWord,
                refAdvance.current.value,
                refSearchIn.current.value,
                currentPageIndex,
                parseInt(refNumberPerPage.current.value),
                sortMethod
              );
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
              <option value="Exemplos da grafia braille">
                Exemplos da grafia braille
              </option>
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
          <div className="w-full flex 2xl:flex-row flex-col items-start 2xl:items-center justify-between gap-y-4 gap-x-2">
            <div className="flex items-center gap-2">
              <div className="bg-gray-200 text-sm text-gray-500 leading-none border-2 border-gray-200 rounded-full inline-flex">
                <button
                  className={`${
                    !screenSize.isSmall ? "w-[100px]" : ""
                  } px-2 relative inline-flex items-center justify-between transition-colors duration-300 ease-in focus:outline-none hover:text-blue-400 focus:text-blue-400 rounded-r-full py-2 ${
                    sortMethod ? "active" : ""
                  }`}
                  id="list"
                  onClick={() => {
                    if (sortMethod)
                      setDescending([!isDescending[0], isDescending[1]]);
                    setSortMethod(true);
                    dispatch(
                      setFilterGroup({ ...filterGroup, sortMode: true })
                    );
                  }}
                >
                  <span className="w-[80%]">Numérica</span>
                  {!screenSize.isSmall && (
                    <img
                      className="absolute right-0"
                      src={isDescending[0] ? ArrowDown : ArrowUp}
                    />
                  )}
                </button>
                <button
                  className={`${
                    !screenSize.isSmall ? "w-[100px]" : ""
                  } px-2 relative inline-flex items-center justify-between transition-colors duration-300 ease-in focus:outline-none hover:text-blue-400 focus:text-blue-400 rounded-r-full  py-2 ${
                    !sortMethod ? "active" : ""
                  }`}
                  id="grid"
                  onClick={() => {
                    if (!sortMethod)
                      setDescending([isDescending[0], !isDescending[1]]);
                    setSortMethod(false);
                    dispatch(
                      setFilterGroup({ ...filterGroup, sortMode: false })
                    );
                  }}
                >
                  <span className="w-[80%]">Avaliação</span>
                  {!screenSize.isSmall && (
                    <img
                      className="absolute right-1"
                      src={isDescending[1] ? ArrowDown : ArrowUp}
                    />
                  )}
                </button>
              </div>
              <div className="bg-gray-200 text-sm text-gray-500 leading-none border-2 border-gray-200 rounded-full inline-flex">
                <button
                  className={`inline-flex items-center transition-colors duration-300 ease-in focus:outline-none hover:text-blue-400 focus:text-blue-400 rounded-r-full px-4 py-2 ${
                    !viewMode ? "active" : ""
                  }`}
                  id="list"
                  onClick={() => {
                    setViewMode(false);
                    setNumberPerPage(12);
                  }}
                >
                  {!screenSize.isSmall && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="fill-current w-4 h-4 mr-2"
                    >
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                  )}
                  <span>Lista</span>
                </button>
                <button
                  className={`inline-flex items-center transition-colors duration-300 ease-in focus:outline-none hover:text-blue-400 focus:text-blue-400 rounded-l-full px-4 py-2 ${
                    viewMode ? "active" : ""
                  }`}
                  id="grid"
                  onClick={() => {
                    setViewMode(true);
                    setNumberPerPage(12);
                  }}
                >
                  {!screenSize.isSmall && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="fill-current w-4 h-4 mr-2"
                    >
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                  )}
                  <span>Grade</span>
                </button>
              </div>
            </div>
            <div className="w-full flex md:p-1 md:flex-row flex-col gap-x-4 gap-y-2 justify-end md:items-center items-end">
              <div className="grow w-full text-lg flex gap-x-4 items-center sm:justify-end  justify-between">
                {userInfo.role === 2 && (
                  <div className="">
                    {!isPossibleDelete ? (
                      <button
                        className="border-2 border-red-500 rounded-full p-2 "
                        onClick={() => setPossibleDelete(true)}
                      >
                        <svg
                          className="w-6 hover:scale-110 transition-transform duration-200"
                          fill="#f05252"
                          xmlns="http://www.w3.org/2000/svg"
                          id="Layer_1"
                          data-name="Layer 1"
                          viewBox="0 0 24 24"
                        >
                          <path d="m23,12h-6c-.553,0-1-.447-1-1s.447-1,1-1h6c.553,0,1,.447,1,1s-.447,1-1,1Zm-1,4c0-.553-.447-1-1-1h-4c-.553,0-1,.447-1,1s.447,1,1,1h4c.553,0,1-.447,1-1Zm-2,5c0-.553-.447-1-1-1h-2c-.553,0-1,.447-1,1s.447,1,1,1h2c.553,0,1-.447,1-1Zm-4.344,2.668c-.558.213-1.162.332-1.795.332h-5.728c-2.589,0-4.729-1.943-4.977-4.521L1.86,6h-.86c-.552,0-1-.447-1-1s.448-1,1-1h4.101C5.566,1.721,7.586,0,10,0h2c2.414,0,4.434,1.721,4.899,4h4.101c.553,0,1,.447,1,1s-.447,1-1,1h-.886l-.19,2h-2.925c-1.654,0-3,1.346-3,3,0,1.044.537,1.962,1.348,2.5-.811.538-1.348,1.456-1.348,2.5s.537,1.962,1.348,2.5c-.811.538-1.348,1.456-1.348,2.5,0,1.169.678,2.173,1.656,2.668Zm-.84-19.668c-.414-1.161-1.514-2-2.816-2h-2c-1.302,0-2.402.839-2.816,2h7.631Z" />
                        </svg>
                      </button>
                    ) : (
                      <div className="flex xs:text-md text-sm">
                        <button
                          className="px-2 py-2 flex items-center bg-purple-500 text-white rounded-l-xl hover:scale-105 active:ring-offset-1 active:ring-2 active:ring-purple-500"
                          onClick={handleDeleteCancelClick}
                        >
                          <svg
                            className="inline pr-1"
                            fill="white"
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="20"
                            height="20"
                            viewBox="0 0 30 30"
                          >
                            <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path>
                          </svg>
                          Cancelar
                        </button>
                        <button
                          className="px-2 py-2 flex items-center  bg-red-600 text-white rounded-r-xl hover:scale-105 active:ring-offset-1 active:ring-2 active:ring-red-500"
                          onClick={handleDeleteConfirmClick}
                        >
                          <svg
                            className="inline"
                            fill="white"
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="20"
                            height="20"
                            viewBox="0 0 26 26"
                          >
                            <path d="M 22.566406 4.730469 L 20.773438 3.511719 C 20.277344 3.175781 19.597656 3.304688 19.265625 3.796875 L 10.476563 16.757813 L 6.4375 12.71875 C 6.015625 12.296875 5.328125 12.296875 4.90625 12.71875 L 3.371094 14.253906 C 2.949219 14.675781 2.949219 15.363281 3.371094 15.789063 L 9.582031 22 C 9.929688 22.347656 10.476563 22.613281 10.96875 22.613281 C 11.460938 22.613281 11.957031 22.304688 12.277344 21.839844 L 22.855469 6.234375 C 23.191406 5.742188 23.0625 5.066406 22.566406 4.730469 Z"></path>
                          </svg>
                          Confirmar
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex gap-x-4">
                  <span className="text-left font-semibold">
                    {`${(currentPageIndex - 1) * numberPerPage + 1}-${
                      (currentPageIndex - 1) * numberPerPage + numberPerPage >
                      filteredCount
                        ? filteredCount
                        : (currentPageIndex - 1) * numberPerPage + numberPerPage
                    }`}
                    &nbsp;DE&nbsp;
                    {filteredCount}
                  </span>
                  <span className="font-semibold">
                    <select
                      className="outline-none border-spacing-2 border px-2"
                      ref={refNumberPerPage}
                      defaultValue={numberPerPage}
                    >
                      <option value={4}>4</option>
                      <option value={8}>8</option>
                      <option value={12}>12</option>
                    </select>
                  </span>
                </div>
              </div>
              <Pagination
                currentPageIndex={currentPageIndex}
                startPageIndex={startPageIndex}
                filteredCount={filteredCount}
                numberPerPage={numberPerPage}
                backButtonHandle={backButtonHandle}
                forwardButtonHandle={forwardButtonHandle}
                goToFirstHandle={goToFirstHandle}
                goToLastHandle={goToLastHandle}
                handlePageClick={setCurrentPageIndex}
              />
            </div>
          </div>
        </div>
        <div className="relative">
          {viewMode ? (
            <Box sx={{ width: "100%", overflowY: "none", py: 2 }}>
              <ImageList
                variant={screenSize.isSmall ? "masonry" : ""}
                cols={ screenSize.isLarge ? 4 : (screenSize.isMedium ? 3 : 2)}
                gap={10}
              >
                {filteredData.map((item, index) => {
                  return (
                    <ImageCard 
                      onClick={handleClick}
                      item={item}
                      key={index}
                      index={index}
                      isPossibleDelete={isPossibleDelete}
                    />
                  );
                })}
              </ImageList>
            </Box>
          ) : (
            <div
              className={`p-2 pt-0 ${
                filteredData.length
                  ? `grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 grid-cols-1 rounded-b-xl`
                  : ""
              }`}
            >
              {filteredData.length ? (
                filteredData.map((item, index) => {
                  return (
                    <DescriptionCard
                      onClick={handleClick}
                      item={item}
                      key={index}
                      index={index}
                      isPossibleDelete={isPossibleDelete}
                    />
                  );
                })
              ) : (
                <img
                  src={emptyImage}
                  className="mx-auto py-4 sm:py-14 2xl:py-24"
                />
              )}
            </div>
          )}
        </div>
        {modalShow && selectedIndex !== -1 && (
          <DetailModal
            descData={{ ...filteredData[selectedIndex] }}
            handleClick={setModalShow}
            updateHandle={setUpdateDescription}
          />
        )}
      </div>
    </main>
  );
};

export default Dashboard;
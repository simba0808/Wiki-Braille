import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useToast from "../../hook/useToast";

import Pagination from "../../components/pagination/Pagination";
import { defaultUserIcon } from "../../assets";
import Loading from "../../components/Loading";

const UserManage  = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const customToast = useToast();

  const [searchWord, setSearchWord] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [avatars, setAvatars] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [startPageIndex, setStartPageIndex] = useState(1);
  const [updatedRole, setUpdatedRole] = useState([]);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [deleteUserIndex, setDeleteUserIndex] = useState(-1);
  const [isLoading, setLoading] = useState(false);
  
  useEffect(() => {
    if (userInfo.role !== 2) {
      navigate("/");
    }

    const fetchUserData = async () => {
      setLoading(true);
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
        const response = await axios.post("/api/user/getallusers", { email: userInfo.email });
        setFilteredData(response.data.users);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchAvatars = async () => {
      filteredData.map(async (item, index) => {
        if(item.avatar !== "") {
          const response = await axios.get(`/api/user/avatar/${item.avatar}`);
          setAvatars((prev) => {
            const newArray = [...prev];
            newArray[index] = response.data;
            return newArray;
          });
        } else {
          setAvatars((prev) => {
            const newArray = [...prev];
            newArray[index] = "";
            return newArray;  
          })
        }
      });
    };

    if(filteredData.length >= 1) {
      fetchAvatars();
      setUpdatedRole(filteredData.map(item => item.role));
    }
  }, [filteredData]);

  const goToFirstHandle = () => {
    setCurrentPageIndex(1);
    setStartPageIndex(1);
  }

  const goToLastHandle = () => {
    const numOfPages = filteredData.length % 10
      ? Math.floor(filteredData.length / 10) + 1
      : Math.floor(filteredData.length / 10)
    setCurrentPageIndex(numOfPages);
    setStartPageIndex(numOfPages >= 5 ? numOfPages-4 : 1);
  }

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
    const numOfPages = filteredData.length % 10
      ? Math.floor(filteredData.length / 10) + 1
      : Math.floor(filteredData.length / 10)
    
    if (currentPageIndex >= numOfPages) {
      return;
    }
    if(currentPageIndex === startPageIndex+4) {
      setStartPageIndex(startPageIndex+1);
    }
    setCurrentPageIndex(currentPageIndex+1);
  };

  const handleSearchInputChange = async (e) => {
    setSearchWord(e.target.value);
    const response = await axios.post("/api/user/getuserbysearch", { searchWord: e.target.value });
    setFilteredData(response.data.users);
  }

  const updateUserRole = async () => {
    const data = [];
    updatedRole.map((item, index) => {
      if(item !== filteredData[index].role) {
        data.push({
          email: filteredData[index].email,
          role: item,
        });
      }
    });
    if(data.length === 0) {
      setLoading(false);
      customToast("failed", "Não foram feitas alterações");
      return;
    }
    setLoading(true);
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
      const response = await axios.post("/api/user/updateRole",  data);
      if(response.data.message === "success") {
        setFilteredData((prev) => {
          const newData = [...prev];
          updatedRole.map((item, index) => {
            newData[index].role = item;
          });
          return newData;
        });
        setLoading(false);
        customToast("success", "Função de usuário atualizada com sucesso");
      }
    } catch (err) {
      setLoading(false);
      customToast("failed", "Falha ao atualizar a função do usuário. Tente novamente");
    }
  };

  const deleteUserAccount = async () => {
    setLoading(true);
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
      const response = await axios.post("/api/user/deleteUserByAdmin", { email: filteredData[deleteUserIndex].email });
      setLoading(false);
      if(response.data.message === "success") {
        customToast("success", "Conta de usuário excluída com sucesso");
        filteredData.splice(deleteUserIndex, 1);
        setDeleteModalShow(false);
        setDeleteUserIndex(-1);
      }
    } catch (err) {
      setLoading(false);
      customToast("failed", "Falha ao excluir a conta do usuário");
    }
  };

  return (
    <main className="flex items-start justify-center md:overflow-hidden">
      { isLoading && <Loading /> }
      <div className="container xs:px-6">
        <div className="flex justify-between">
          <h2 className="my-6 text-2xl text-left font-semibold text-gray-700">
            Gerenciamento de usuários
          </h2>
          <div className="flex items-center">
            <button 
              className="px-6 py-2 bg-purple-600 hover:bg-white hover:text-purple-900 border border-purple-600  rounded-lg text-white transition-colors duration-300" 
              onClick={updateUserRole}
            >
              Salvar
            </button>
          </div>
        </div>
        <div className="w-full overflow-hidden shadow-xs">
          <div className="w-full overflow-x-hidden">
            <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t bg-gray-50 sm:grid-cols-9">
              <span className="col-span-3 flex items-center">
                <input 
                  type="text"
                  className="w-full px-2 py-2 border border-gray-400 text-[16px] font-normal rounded-md focus:border focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none"
                  placeholder="Pesquisar nome aqui"
                  value={searchWord}
                  onChange={handleSearchInputChange}
                />
              </span>
              <span className="col-span-2"></span>
              <span className="flex justify-center col-span-4 mt-2 sm:mt-auto sm:justify-end">
                <Pagination 
                  currentPageIndex={currentPageIndex}
                  startPageIndex={startPageIndex}
                  filteredCount={filteredData.length}
                  numberPerPage={10}
                  backButtonHandle={backButtonHandle}
                  forwardButtonHandle={forwardButtonHandle}
                  goToFirstHandle={goToFirstHandle}
                  goToLastHandle={goToLastHandle}
                  handlePageClick={setCurrentPageIndex}
                />
              </span>
            </div>
            <table className="w-full border whitespace-no-wrap">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                  <th className="xs:px-4 px-2 py-3 text-center">Usuário</th>
                  <th className="xs:px-4 px-2 py-3 text-center">Nome</th>
                  <th className="xs:px-4 px-2 py-3 text-center sm:table-cell hidden">E-mail</th>
                  <th className="xs:px-4 px-2 py-3 text-center lg:table-cell hidden">Data de registro</th>
                  <th className="xs:px-4 px-2 py-3 text-center">Função</th>
                  <th className="xs:px-4 px-2 py-3 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {
                  filteredData.length > 0 &&
                  filteredData.slice(10*(currentPageIndex-1), 10*currentPageIndex).map((item, index) => {
                    const curIndex = 10*(currentPageIndex-1)+index;
                    return (
                      <tr key={index} className={`text-gray-700 ${filteredData[curIndex].role<0 ? "bg-slate-200":""}`}>
                        <td className="xs:px-4 px-2 py-2.5 flex justify-center">
                          <img src={avatars[curIndex]!==""&&avatars[curIndex]!==undefined? `data: image/jpeg;base64, ${avatars[curIndex]}`:defaultUserIcon  } className="w-[40px] rounded-full" alt={`user${index+1}`} />
                        </td>
                        <td className="xs:px-4 px-2 py-3 text-sm">
                          { item.name }
                        </td>
                        <td className="xs:px-4 px-2 py-3 text-sm sm:table-cell hidden">
                          { item.email }
                        </td>
                        <td className="xs:px-4 px-2 py-3 text-sm lg:table-cell hidden">
                          { item.createdAt.split("T")[0] }
                        </td>
                        <td className="xs:px-4 px-2 py-3 text-sm">
                          <div className="flex justify-center relative">
                            <select 
                              className={`w-20 border-0 cursor-pointer rounded-full text-center font-semibold ${filteredData[curIndex].role<0?"":filteredData[curIndex].role==2?"bg-red-100 text-red-700 hover:bg-red-300":(filteredData[curIndex].role?"bg-blue-100 text-blue-700 hover:bg-blue-300":"bg-purple-100 text-purple-700 hover:bg-purple-300")} duration-300 focus:text-black focus:bg-white focus:outline-none`}
                              value={updatedRole[curIndex]} 
                              onChange={(e) => 
                                setUpdatedRole(prev => {
                                  const newRoles = [...prev];
                                  newRoles[curIndex] = parseInt(e.target.value);
                                  return newRoles;
                                }
                              )}
                            >
                              <option value={0}>Usuário</option>
                              <option value={1}>Editor</option>
                              <option value={2}>Admin</option>
                              <option value={-1}>Disable</option>
                            </select>
                          </div>

                        </td>
                        <td className="xs:px-4 px-2 text-sm mx">
                          <button
                            className="flex items-center mx-auto justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg focus:outline-none focus:shadow-outline-gray"
                            aria-label="Delete"
                            onClick={() => {
                              setDeleteUserIndex(curIndex);
                              setDeleteModalShow(true);
                            }}
                          >
                            <svg
                              className="w-5 h-5"
                              aria-hidden="true"
                              fill="#f98080"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {
        deleteModalShow ? 
          <div className="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover" id="modal-id">
            <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
            <div className="w-full  max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">
      
            <div className="">
              <div className="text-center p-5 flex-auto justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 -m-1 flex items-center text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 flex items-center text-red-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <h2 className="text-2xl font-bold py-4 ">Tem certeza?</h2>
                <p className="text-md text-gray-700 px-8">Você realmente deseja excluir <span className="font-semibold text-md">{filteredData[deleteUserIndex].name} </span>&apos;conta? Esse processo não pode ser desfeito</p>    
              </div>
              <div className="p-3  mt-2 text-center space-x-4 md:block">
                <button 
                  className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"
                  onClick={() => setDeleteModalShow(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="mb-2 md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600"
                  onClick={deleteUserAccount}
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div> : ""
      }   
    </main>
  );
}

export default UserManage;
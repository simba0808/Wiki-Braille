import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setCredentials, logout } from "../slices/authSlice";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { defaultUserIcon } from "../assets";
import Loading from "../components/Loading";

const AccountSetting = () => {
  const {userInfo} = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUserName] = useState(userInfo.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState();
  const [uploadFile, setUploadFile] = useState();
  const [fetchedAvatar, setFetchedAvatar] = useState();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if(!userInfo) {
        navigate("/");
      } else {
        axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
        try {
          const res = await axios.get("/api/user/");
          dispatch(setCredentials({...res.data}));
        } catch (err) {
          navigate("/");
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const getAvatar = async () => {
      if(userInfo.avatar !== undefined && userInfo.avatar !== "") {
        try {
          const response = await axios.get(`/api/user/avatar/${userInfo.avatar}`);
          if(response.status === 200) {
            setFetchedAvatar(response.data);
          }
        } catch (err) {
          
        }
      }
    };
    getAvatar();
  }, [userInfo.avatar]);

  const checkPassword = ( passwordForCheck, confirmPasswordForCheck ) => {
    if(passwordForCheck.length < 6) {
      return -1;
    }
    if(passwordForCheck !== confirmPasswordForCheck) {
      return 0;
    }
    return 1;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader(file);
    reader.onload = () => {
      setSelectedAvatar(reader.result);
      setUploadFile(file);
    }
    if(file) {
      reader.readAsDataURL(file);
    }
  }

  const updateAvatar = async () => {
    if(uploadFile === "" || uploadFile === undefined) {
      toast.error("Selecione uma imagem", { autoClose: 1000, hideProgressBar: true, pauseOnHover: false, theme: "dark" }); 
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      if(userInfo.avatar !== "") {
        formData.append("currentAvatar", userInfo.avatar);
      }
      formData.append("email", userInfo.email);
      formData.append("file", uploadFile);

      const response = await axios.post("/api/user/avatar", formData);
      if(response.data.message === "uploaded") {
        dispatch(setCredentials({...userInfo, avatar: response.data.id}));
        setLoading(false);
        toast.success("Atualizado com sucesso", { autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark" });
        setSelectedAvatar("");
        setUploadFile("");
      }
      
    } catch (err) {
      setLoading(false);
      toast.err('Falha na atualização do Avatar', {autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark",});
    }
  }

  const updateUserInfo = async () => {
    setLoading(true);
    try {
      axios.defaults.headers.common["Authorization"] =`Bearer ${userInfo.token}`;
      const response = await axios.post("/api/user/updateinfo", { username, email: userInfo.email });
      if(response.data.message === "success") {
        dispatch(setCredentials({...userInfo, name: username }));
        setLoading(false);
        toast.success('Atualizado com sucesso', {autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark",});
      }
    } catch (err) {
      setLoading(false);
      toast.error('Falha na atualização', {autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark",});
    }
  }

  const updatePassword = async () => {
    const isPassword = checkPassword(newPassword, confirmPassword);
    if(isPassword < 0) {
      toast.error("A senha deve ter pelo menos 6 caracteres", {autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark",});
      return;
    } else {
      if(isPassword == 0) {
        toast.error("As senhas não são correspondentes", {autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark",});
        return;
      }
      setNewPassword("");
      setCurrentPassword("");
      setConfirmPassword("");
    }
    setLoading(true);
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
      const response = await axios.post("/api/user/updatepassword", { email:userInfo.email, currentPassword, newPassword });
      if(response.data.message === "success") {
        setLoading(false);
         toast.success("Senha atualizada com sucesso", {autoClose:100, hideProgressBar:true, pauseOnHover:false, closeOnClick:true, theme:"dark"})
      }
    } catch (err) {
      setLoading(false);
      toast.error("A senha está incorreta", {autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark",});
    }
  }

  const deleteAccount = async () => {
    setLoading(true);
    try{
      axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
      const response = await axios.post("/api/user/delete", { email: userInfo.email, password: deletePassword });
      if(response.data.message === "success") {
        setLoading(false);
        toast.success("Conta excluída", {autoClose:100, hideProgressBar:true, pauseOnHover:false, closeOnClick:true, theme:"dark"});
        dispatch(logout({}));
        navigate("/");
      } else {
        setLoading(false);
        toast.error("A senha está incorreta", {autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark",});
      }
    } catch (err) {
      setLoading(false);
      toast.error("A senha está incorreta", {autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark",});
    }
  }

  return (
    <main>
      { isLoading && <Loading /> }
      <ToastContainer  />
      <div className="container xs:px-6 mx-auto grid divide divide-y-2 divide-slate-300">
        <h2 className="my-6 text-2xl text-left font-semibold text-gray-700">
          Configuração da conta
        </h2>
        <div className="flex flex-col md:flex-row 2xl:flex-col divide 2xl:divide-y-2 md:divide-y-0 divide-y-2 divide-slate-300">
          <div className="flex-1 flex flex-col 2xl:flex-row">
            <div className="2xl:w-[30%] md:flex md:flex-col justify-center">
              <p className="text-lg xs:font-bold font-semibold p-2">Informações pessoais</p>
              <p className="md:py-2 md:block hidden">Atualize suas configurações de conta</p>
            </div>
            <div className="grow lg:px-8 2xl:py-4 py-2">
              <div className="flex p-2">
                <div className="flex">
                  <div className="flex items-center">
                    <input type="file" accept="image/*" id="avatar-image-upload" hidden onChange={handleFileChange}/>
                    <label htmlFor="avatar-image-upload" className="relative hover:cursor-pointer">
                      <img src={selectedAvatar  ? selectedAvatar : (fetchedAvatar!==undefined  && fetchedAvatar!=="" ? `data: image/jpeg;base64,${fetchedAvatar}`:defaultUserIcon) } className="w-[100px] h-[100px] rounded-full" />
                      <div className="z-10 absolute left-0 top-0 w-[100px] h-[100px] flex items-center justify-center">
                        <AiOutlineCloudUpload className="w-10 h-10 text-white"/>
                      </div>
                    </label>
                  </div>
                  <div className="flex items-center ml-4">
                    <button 
                      className="px-2 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                      onClick={updateAvatar}
                    >
                      Alterar
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <label className="float-left">Seu nome</label>
                <input
                  className="block w-full p-2 text-md text-black border-2 rounded-md focus:ring-2 focus:ring-purple-300 focus:outline-none form-input"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="p-2">
                <label className="float-left">Seu E-mail</label>
                <input
                  className="block w-full p-2 text-md text-black border-2 rounded-md focus:ring-2 focus:ring-purple-300 focus:outline-none disabled:bg-slate-100 cursor-not-allowed form-input"
                  value={userInfo.email}
                  disabled={true}
                />
              </div>
              <button 
                className="float-right mr-2 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                onClick={updateUserInfo}
              >
                Salvar
              </button>
            </div>
          </div>
          <div className="flex-1 flex flex-col 2xl:flex-row">
            <div className="2xl:w-[30%] md:flex md:flex-col justify-center">
              <p className="text-lg xs:font-bold font-semibold p-2">Alterar a senha</p>
              <p className="md:py-2 md:block hidden">Atualizar a senha associada à sua conta.</p>
            </div>
            <div className="grow lg:px-8 px-2 flex flex-col justify-between">
              <div className="my-auto">
                <div className="px-2 py-1">
                  <label className="float-left py-1">Senha atual</label>
                  <input
                    className="block w-full p-2 text-md text-black border-2 rounded-md focus:ring-2 focus:ring-purple-300 focus:outline-none form-input"
                    type="password"
                    placeholder="******"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="px-2 py-1">
                  <label className="float-left py-1">Nova senha</label>
                  <input
                    className="block w-full p-2 text-md text-black border-2 rounded-md focus:ring-2 focus:ring-purple-300 focus:outline-none form-input"
                    type="password"
                    placeholder="******"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="px-2 py-1">
                  <label className="float-left py-1">Confirmar senha</label>
                  <input
                    className="block w-full p-2 text-md text-black border-2 rounded-md focus:ring-2 focus:ring-purple-300 focus:outline-none form-input"
                    type="password"
                    placeholder="******"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <button 
                  className="float-right mr-2 mt-2 mb-2 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                  onClick={updatePassword}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-center">
          <div className="xs:w-[30%] py-4 flex flex-col justify-center">
            <p className="text-lg xs:font-bold font-semibold p-2">Excluir conta</p>
          </div>
          <div className="grow xs:px-8 px-2 py-6">
            <button 
              className="float-left ml-2 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-700 hover:bg-red-500 focus:outline-none focus:shadow-outline-purple"
              onClick={() => setDeleteModalShow(true)}
            >
              Excluir conta
            </button>
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
                <p className="text-md font-medium text-gray-700 px-8 pb-4">Você realmente deseja excluir a conta? Esse processo não pode ser desfeito</p>
                <div className="mt sm:flex-1 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-md leading-6 text-gray-900">
                    Digite sua senha
                  </h3>
                  <div className="my-4 mt-2">
                    <input 
                      className="w-[100%] py-1 px-2 border-2 rounded-xl focus:ring-2 focus:ring-purple-300 focus:outline-none" 
                      type="password"
                      autoFocus={true}
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      onKeyDown={(e) => {
                        if(e.keyCode === 13) {
                          deleteAccount();
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="p-3 pt-0 text-center space-x-4 md:block">
                <button 
                  className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"
                  onClick={() => setDeleteModalShow(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="mb-2 md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600"
                  onClick={deleteAccount}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
          </div> : ""
      }
      
    </main>
  );
};

export default AccountSetting;
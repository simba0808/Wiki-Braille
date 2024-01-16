import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCredentials } from "../../slices/authSlice";
import { GoogleIcon } from "../../assets";
import { ToastContainer, toast } from "react-toastify";
import Loading from "../../components/Loading";

const AddData  = () => {
  const {userInfo} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showUploadResult, setShowUploadResult] = useState(false);
  const [file, setFile] = useState();
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if(userInfo.role !== 1 && userInfo.role !== 2) {
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
    if(file !== undefined ) {
      setShowUploadResult(true);
    } else{
      setShowUploadResult(false);
    }
  }, [file]);

  const parseData = async () => {
    const sendData = async () => {
      setLoading(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
      const formdata = new FormData();
      formdata.append("file", file);
      
      const res = await axios.post("/api/data/parsedata", formdata);
      if(res.data.message === "success") {
        toast.success("Documentos salvos com sucesso", { autoClose:1000, hideProgressBar:true, pauseOnHover: false, closeOnClick: true, theme: "dark"});
        setFile(undefined);
      } else {
        toast.error("Falha ao salvar documentos", { autoClose:1000, hideProgressBar:true, pauseOnHover: false, closeOnClick: true, theme: "dark"});
        setFile(undefined);
      }
      setLoading(false);
    }
    sendData();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const allowedExtensions = ["docx", "doc"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const isAllowedExtension = allowedExtensions.includes(fileExtension);
    if(isAllowedExtension) {
      setFile(file);
      setUploadedFileName(file.name);
    } else {
      toast.error("Arquivo inválido", { autoClose:1000, hideProgressBar:true, pauseOnHover: false, closeOnClick: true, theme: "dark"});
      return;
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileUpload = (event) => {
    
    const file = event.target.files[0]
    const allowedExtensions = ["doc", "docx"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const isAllowedExtension = allowedExtensions.includes(fileExtension);
    if(isAllowedExtension) {
      setFile(file);
      setUploadedFileName(file.name);
    } else {
      toast.error("Arquivo inválido", { autoClose:1000, hideProgressBar:true, pauseOnHover: false, closeOnClick: true, theme: "dark"});
      return;
    }
    /* multiple upload
    const files = Array.from(event.target.files);
    const allowedExtensions = ["html", "htm", "docx"];
    const filteredFiles = files.filter((file) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const isAllowedExtension = allowedExtensions.includes(fileExtension);
      return isAllowedExtension;
    });
  
    setSelectedFiles((prev) => {
      const uniqueFiles = filteredFiles.filter((file) => {
        return !prev.some((item) => item.name === file.name);
      });
      return [...prev, ...uniqueFiles];
    });*/
  };
  
  
  return (
    <main className="md:h-full h-[100vh] flex item-center justify-center overflow-y-hidden">
      { isLoading && <Loading /> }
      <div className="container px-6">
        <h2 className="my-6 text-2xl text-left font-semibold text-gray-700 dark:text-gray-200">
          Adicionar novos dados
        </h2>
        <ToastContainer />
        <div className="flex flex-col items-center justify-center mt-40" onDrop={handleDrop} onDragOver={handleDragOver}>
            <label
              htmlFor="dropzone-file"
              className="md:w-[60%] py-2 w-full flex flex-col items-center justify-center w-full border border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50   hover:bg-gray-200"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-xl text-gray-500">
                  <span className="font-semibold">Clique para fazer upload</span> ou arrastar e soltar
                </p>
                <p className="text-md text-gray-500">Doc, Docx</p>
                 <p className="text-md font-semibold text-red-600 p-2">Você deve carregar apenas o arquivo Docx</p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                multiple
                onChange={handleFileUpload}
              />
            </label>

            {
              showUploadResult ?
                <div className="md:w-[60%] w-full p-4 mt-4 flex items-center">
                  <div className="flex flex-col justify-center items-center flex-1">
                    <img className="w-[100px]" src={GoogleIcon} alt="html"></img>
                    <p className="m-4"><span className="font-bold text-lg">{uploadedFileName}</span> Carregado com sucesso!</p>
                  </div>
                  <div className="flex flex-col gap-4 flex-1">
                    <button 
                      className="float-left ml-2 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                      onClick={parseData}
                    >
                      Converter agora
                    </button>
                    <button className="float-left ml-2 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-700 hover:bg-red-500 focus:outline-none focus:shadow-outline-purple"
                      onClick={() => {
                        setShowUploadResult(false);
                        setFile(undefined);
                      }}
                    >
                      Cancelar conversão
                    </button>
                  </div>
                </div> :
                <></>
            }
        </div>
        
      </div>
    </main>
  );
};

export default AddData;
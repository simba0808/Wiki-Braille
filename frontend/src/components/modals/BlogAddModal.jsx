import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

const BlogAddModal = ({closeHandle}) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isInvalidInput, setInvalidInput] = useState(false);

  const handleModalClose = () => {
    closeHandle(false);
  };

  const handleTitleChange = (e) => {
    setInvalidInput(false);
    setTitle(e.target.value);
  };

  const handleTextChange = (e) => {
    setInvalidInput(false);
    setText(e.target.value);
  };

  const handleChangeFile = (e) => {
    setInvalidInput(false);
    setSelectedImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if(title === "" || text === "" || selectedImage === null) {
      setInvalidInput(true);
      return;
    }

    const formData = new FormData();
    formData.append("blog", "blog");
    formData.append("image", selectedImage);
    formData.append("title", title);
    formData.append("text", text);

    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
      const response  = await axios.post("/api/blog/add", formData);
      if(response.data.message === "success") {
        toast.success("Blog adicionado com sucesso", { autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark" });
        window.location.reload(false);
      }
    } catch (err) {
      toast.error("Erro ao adicionar blog", { autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark" });
    }
  };

  return (
    <div
      className="main-modal fixed w-full h-100 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster"
    >
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <ToastContainer />
      <div className="relative bg-white rounded-md shadow-xl p-6 w-full h-[70%] md:w-2/3 xl:w-1/2 z-50">
        <p className="text-xl font-semibold text-left">Add New Blog</p>
        <div className="mb-2">
          <label className="block mt-4 text-sm text-left">
            <span className="text-lg text-gray-700">Título: </span>
            <input
              className={`block w-full mt-1 text-sm border px-2 py-3 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-600 focus:outline-none focus:shadow-outline-purple form-input `}
              placeholder="Insira o título do artigo"
              autoFocus={true}
              value={title}
              onChange={handleTitleChange}
            />
          </label>
        </div>
        <div className="mb-2">
          <label className="block  text-sm text-left">
            <span className="text-lg text-gray-700">Descrição: </span>
            <textarea
              className={`block w-full min-h-[100px] max-h-[250px] mt-1 text-sm border px-2 py-3 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-600 focus:outline-none focus:shadow-outline-purple form-input `}
              placeholder="Inserir detalhes do artigo"
              value={text}
              onChange={handleTextChange}
            >
            </textarea>
          </label>
        </div>
        <div className="mb-4">
          <p className="py-1 text-lg text-gray-700 text-left">Adicionar imagens:</p>
          <label
            htmlFor="dropzone-file"
            className="py-2 w-full flex flex-col items-center justify-center border border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-1  00"
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
              <p className="mb-2 px-4 text-xl text-gray-500">
                <span className="font-semibold">Faça upload de sua imagem</span>
              </p>
              <p className="text-md text-gray-500">( JPEG, PNG )</p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleChangeFile}
            />
          </label>
        </div>
        <div>
          <span className="text-red-400">{isInvalidInput ? "Entrada inválida. Verifique se sua entrada está correta":""}</span>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-4 justify-end">
          <button 
            className="bg-white rounded-md px-3 py-2 text-purple-600 text-md border border-purple-600 rounded-lg transition:colors duration-500 hover:bg-purple-500 hover:text-white active:bg-purple-700 "
            onClick={handleModalClose}
          >
            Cancelar
          </button>
          <button 
            className="bg-purple-600 rounded-md px-6 py-2 text-white text-md transition:colors duration-500 border rounded-lg hover:border-purple-600 hover:bg-white hover:text-purple-600 active:bg-purple-700"
            onClick={handleSubmit}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogAddModal;
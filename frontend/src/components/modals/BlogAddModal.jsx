import { useState } from "react";
import { useSelector } from "react-redux";
import useToast from "../../hook/useToast";
import axios from "axios";

import Loading from "../Loading";

const BlogAddModal = ({closeHandle}) => {
  const { userInfo } = useSelector((state) => state.auth);
  const customToast = useToast();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [isInvalidInput, setInvalidInput] = useState(false);
  const [isLoading, setLoading] = useState(false);

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

  const handleSubmit = async () => {
    if(title === "" || text === "") {
      setInvalidInput(true);
      return;
    }

    setLoading(true);
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
      const response  = await axios.post("/api/blog/add", { title, text });
      if(response.data.message === "success") {
        setLoading(false);
        customToast("success", "Blog adicionado com sucesso");
        window.location.reload(false);
      }
    } catch (err) {
      setLoading(false);
      customToast("failed", "Erro ao adicionar blog");
    }
  };

  return (
    <div
      className="main-modal fixed w-full h-100 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster"
    >
      {isLoading && <Loading />}
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="relative bg-white rounded-md shadow-xl p-6 w-full  md:w-2/3 xl:w-1/2 z-50">
        <p className="text-xl font-semibold text-left">Adicionar novo blog</p>
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
          <label className="block text-sm text-left">
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
        <div>
          <span className="text-red-400">{isInvalidInput ? "Entrada inválida. Verifique se sua entrada está correta":""}</span>
        </div>
        <div className="flex gap-4 justify-end">
          <button 
            className="bg-white px-3 py-2 text-purple-600 text-md border border-purple-600 rounded-lg transition:colors duration-500 hover:bg-purple-500 hover:text-white active:bg-purple-700 "
            onClick={handleModalClose}
          >
            Cancelar
          </button>
          <button 
            className="bg-purple-600 px-6 py-2 text-white text-md transition:colors duration-500 border rounded-lg hover:border-purple-600 hover:bg-white hover:text-purple-600 active:bg-purple-700"
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
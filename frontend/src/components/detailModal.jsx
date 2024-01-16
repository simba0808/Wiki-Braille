import Loading from "../components/Loading";
import { NotExistIcon } from "../assets";
import React, { useEffect, useState, useCallback } from "react";
//import { Controlled as ControlledZoom } from "react-medium-image-zoom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "react-medium-image-zoom/dist/styles.css";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const detailModal = ( {descData, handleClick, updateHandle} ) => {

  const {title_id, title, description, tag, image } = descData;
  const { userInfo } = useSelector((state) => state.auth);
  const [editable, setEditable] = useState(false);
  const [text, setText] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setText(description);
  }, []);

  const handleCloseClick = () => {
    handleClick(false);
  };

  const editConfirm = async () => {
    setEditable(false);
    setLoading(true);
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
      const response = await axios.post("/api/data/edit", {text, title_id});
      if(response.data.message === "success") {
        updateHandle(text);
        setLoading(false);
        toast.success('Atualizado com sucesso!', {autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark"});
      }
    } catch (err) {
      setLoading(false);
      toast.error('Falha ao atualizar a descrição', {autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark"});
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <>
    {isLoading && <Loading />}
    <div
      className="main-modal fixed w-full h-100 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster"
    >
        <ToastContainer />
        <div className=" overflow-y-hidden xs:h-[700px] h-[90%] border border-teal-500 shadow-lg modal-container bg-white w-11/12 md:w-[60%] mx-auto rounded shadow-lg z-50 overflow-y-auto">
          <div className="modal-content xs:h-[700px] h-[100%] py-4 text-left px-6 flex flex-col overflow-y-hidden">
            <div className="flex justify-end items-center pb-3">
              <div className="modal-close cursor-pointer z-50 " onClick={handleCloseClick}>
                <svg
                  className="fill-current text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                >
                  <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                </svg>
              </div>
            </div>
            <div className="flex justify-between items-center xs:pb-8 relative">
              <span className="text-xl xs:text-[30px] font-semibold underline" href={`https://en/wikipedia.org/wiki/${title}`}>{` ${title}`}</span>
              <p
                className="xs:py-2 xs:px-4 py-2 px-3 xs:text-xl text-lg font-semibold rounded-xl bg-purple-200 text-purple-600"
              >
                {` ${title_id}`}
              </p>

            </div>
            {
              tag ?
                <p className="py-1 xs:text-xl text-lg font-semibold">{`Tags: ${tag}`}</p>:<></>
            }
            <div className="xs:flex xs:flex-row flex flex-col grow">
              <div className="flex-1 flex items-center justify-center hover:cursor-zoom-in">
                <TransformWrapper initialScale={1} initialPositionX={0} initialPositionY={0} smooth={true}>
                  <TransformComponent>
                    <img 
                      className="min-h-[200px] max-h-[350px] md:max-h-[450px] w-full mx-auto my-auto py-4" 
                      src={image ? image : NotExistIcon}
                    />
                  </TransformComponent>
                </TransformWrapper>
              </div>
              <textarea 
                className={`w-full grow xs:flex-1 flex p-2 justify-center items-center overflow-y-auto ${editable?"rounded-md border border-purple-300 ring-4 ring-purple-100 outline-none":""}`} 
                disabled={editable?false:true}
                value={text}
                onChange={handleTextChange}
              >
              </textarea>
            </div>
            { 
              userInfo.role !== 0 ? (
                <div className="flex justify-end pt-2">
                  <button 
                    className="w-[90px] focus:outline-none modal-close px-4 p-3 rounded-lg text-black border border-purple-700 hover:bg-purple-300 active:bg-purple-600 active:text-white"
                    onClick={() => setEditable(true)}
                  >
                    Editar
                  </button>
                  <button 
                    className="w-[90px] focus:outline-none bg-purple-800 py-1 px-auto ml-3 rounded-lg text-white  hover:bg-purple-400 active:border active:border-purple-700 active:bg-white active:text-purple-900"
                    onClick={editConfirm}
                    disabled={editable?false:true}
                  >
                    Confirmar
                  </button>
                </div>
              ) : <></>
            }
          </div>
        </div>
    </div>
    </>
  );
};

export default detailModal;
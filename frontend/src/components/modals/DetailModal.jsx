import Loading from "../Loading";
import { NotExistIcon } from "../../assets";
import RatingModal from "./RatingModal";
import ReviewModal from "./ReviewModal";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useToast from "../../hook/useToast";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import axios from "axios";
import copy from "copy-to-clipboard";
import { AiOutlineCloudUpload } from "react-icons/ai";
import "react-medium-image-zoom/dist/styles.css";

const DetailModal = ({ descData, handleClick, updateHandle }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const customToast = useToast();

  const { title_id, title, catagory, tag, description, image, rate, ratedCount } = descData;

  const [editable, setEditable] = useState(false);
  const [text, setText] = useState(description);
  const [newTag, setNewTag] = useState(tag);
  const [newCategory, setNewCategory] = useState(catagory);
  const [isCopy, setIsCopy] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [ratingModalShow, setRatingModalShow] = useState(false);
  const [reviewModalShow, setReviewModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);

  useEffect(() => {
    const createLog = async () => {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
      await axios.post("/api/log/createlogs", {
        type: "Consult",
        user: userInfo.name,
        title_id
      });
    };
    createLog();
  }, []);

  const handleCloseClick = () => {
    handleClick(false);
  };

  const editConfirm = async () => {
    if ((tag === newTag && text === description && catagory === newCategory) && selectedImage === null) {
      customToast("failed", "Nenhuma atualização");
      return;
    }
    setEditable(false);
    setLoading(true);
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
      let response = null;
      if (selectedImage === null) {
        response = await axios.post("/api/data/edit", { user: userInfo.name, category: newCategory, text, newTag, title_id });
      } else {
        const formData = new FormData();
        formData.append("image", selectedImage);
        formData.append("user", userInfo.name);
        formData.append("text", text);
        formData.append("category", newCategory);
        formData.append("tag", newTag);
        formData.append("title_id", title_id);
        response = await axios.post("/api/data/editimage", formData);
      }
      setLoading(false);
      if (response.data.message === "success") {
        updateHandle({ text, tag: newTag, image: selectedImage ? response.data.path : null });
        customToast("success", "Atualizado com sucesso");
      }
    } catch (err) {
      setLoading(false);
      customToast("failed", "Falha ao atualizar a descrição");
    }
  };

  const handleTagChange = (e) => {
    setNewTag(e.target.value);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleChangeImage = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleCopyToClipboard = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
    await axios.post("/api/log/createlogs", {
      type: "Copy",
      user: userInfo.name,
      title_id,
    });

    const isCopied = copy(text);
    if (isCopied) {
      setIsCopy(isCopied);
      setRatingModalShow(true);
    }
  };

  const deleteDescription = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
    setLoading(true);
    try {
      const response = await axios.post(`/api/data/delete/${title_id}`, { user: userInfo.name });
      setLoading(false)
      if (response.data.message === "success") {
        customToast("success", "Excluído com sucesso");
        setTimeout(() => {
          window.location.reload(false);
        }, 200);
      }
    } catch (err) {
      setLoading(false);
      customToast("failed", "Falha ao excluir a descrição");
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <div
        className="main-modal fixed w-full h-100 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster"
      >
        <div className="w-[96%] md:w-[80%] xl:w-[60%] mx-auto xs:h-[700px] h-[95%] border border-teal-500 modal-container bg-white rounded shadow-lg z-50 overflow-y-hidden">
          <div className="modal-content xs:h-[700px] h-[100%] py-6 text-left px-6 flex flex-col justify-around overflow-y-hidden">
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
            <div className="flex justify-between items-center relative">
              <span className="text-xl xs:text-[30px] font-semibold">{` ${title}`}</span>
              <p
                className="xs:py-2 xs:px-4 py-2 px-3 xs:text-xl text-lg font-semibold rounded-xl bg-purple-200 text-purple-600"
              >
                {` ${title_id}`}
              </p>

            </div>
            <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center sm:gap-4 gap-0">
              <p className="lg:text-xl sm:text-md text-sm font-normal">
                Categoria:
                <select
                  className={`ml-2 px-2 bg-white border-2 rounded-md ${editable ? "rounded-md border border-purple-300 ring-2 ring-purple-100 outline-none" : ""}`}
                  defaultValue={catagory}
                  disabled={editable ? false : true}
                  onChange={handleCategoryChange}
                >
                  <option value="Descrição">Descrição</option>
                  <option value="Desenhos em braille">Desenhos em braille</option>
                  <option value="Grafias em braille">Grafias em braille</option>
                  <option value="Exemplos da grafia braille">Exemplos da grafia braille</option>
                </select>
              </p>
              {
                catagory !== "Descrição" ?
                  <p className="grow w-full sm:w-auto py-1 flex lg:text-xl sm:text-md text-sm font-normal">
                    Tag:
                    <input
                      type="text"
                      className={`w-full px-2 bg-white ${editable ? "rounded-md border border-purple-300 ring-2 ring-purple-100 outline-none" : ""}`}
                      value={newTag}
                      disabled={editable ? false : true}
                      onChange={handleTagChange}
                    />
                  </p> : <></>
              }
            </div>
            <div className="flex pt-2 items-center">
              {
                [1, 2, 3].map((item) => {
                  return (
                    <svg
                      className="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill={item <= parseInt(rate) ? "#ffd500" : "grey"}
                      key={item}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  )
                })
              }
              <span className="flex items-center pl-2">{rate}</span>
              <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full"></span>
              <span className="hover:cursor-pointer" onClick={() => setReviewModalShow(true)}>{ratedCount} reviews</span>
            </div>
            <div className="xs:flex xs:flex-row flex flex-col grow">
              <div className="xs:flex-1 flex px-2 items-center justify-center hover:cursor-zoom-in">
                {
                  <div className="flex items-center">
                    <input type="file" accept="image/*" id="avatar-image-upload" hidden disabled={editable ? false : true} onChange={handleChangeImage} />
                    <label htmlFor="avatar-image-upload" className="relative hover:cursor-pointer">
                      <TransformWrapper initialScale={1} initialPositionX={0} initialPositionY={0} smooth={true}>
                        <TransformComponent>
                          <img
                            className="max-h-[280px] md:max-h-[450px] w-full mx-auto my-auto py-4"
                            src={selectedImage === null ? (image ? image : NotExistIcon) : URL.createObjectURL(selectedImage)}
                          />
                        </TransformComponent>
                      </TransformWrapper>
                      {
                        editable ?
                          <div className="bg-gray-700 border-dotted border-2 z-10 absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%] w-[100px] h-[100px] flex items-center justify-center rounded-full">
                            <AiOutlineCloudUpload className="w-10 h-10 text-white" />
                          </div> : <></>
                      }
                    </label>
                  </div>
                }
              </div>
              <div className="relative xs:flex-1 grow w-full p-2 flex flex-col justify-start items-end gap-2">
                <div className="absolute right-4 top-4 inline-block group">
                  <button onClick={handleCopyToClipboard}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={`w-6 h-6 bi bi-clipboard ${isCopy ? "text-red-500" : ""}`} viewBox="0 0 16 16">
                      <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
                      <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
                    </svg>
                  </button>
                  <div className="bg-purple-600 text-white text-sm rounded-md py-1 px-2 absolute bottom-full left-1/2 transform -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {isCopy ? "copied!" : "copy"}
                  </div>
                </div>
                <textarea
                  className={`w-full grow overflow-y-auto bg-gray-100 p-2 pt-10 rounded-md text-sm lg:text-lg ${editable ? "rounded-md border border-purple-300 ring-4 ring-purple-100 outline-none" : ""}`}
                  disabled={editable ? false : true}
                  value={text}
                  onChange={handleTextChange}
                >
                </textarea>
              </div>
            </div>
            {
              userInfo.role !== 0 ? (
                <div className="flex justify-end pt-2">
                  <button
                    className="w-[90px] focus:outline-none modal-close px-auto py-3 rounded-lg text-purple-700 border border-purple-700 hover:bg-purple-300 active:bg-purple-600 active:text-white"
                    onClick={() => {
                      if (editable) setSelectedImage(null);
                      setEditable(editable ? false : true);
                    }
                    }
                  >
                    {
                      editable ? "Cancelar" : "Editar"
                    }
                  </button>
                  {
                    editable ?
                      <button
                        className="w-[90px] focus:outline-none bg-purple-800 py-3 px-auto ml-3 rounded-lg text-white  hover:bg-purple-400 active:border active:border-purple-700 active:bg-white active:text-purple-900"
                        onClick={editConfirm}
                        disabled={editable ? false : true}
                      >
                        Confirmar
                      </button> :
                      <>
                        {
                          userInfo.role === 2 ?
                            <button
                              className="w-[90px] focus:outline-none bg-purple-800 py-3 px-auto ml-3 rounded-lg text-white  hover:bg-purple-400 active:border active:border-purple-700 active:bg-white active:text-purple-900"
                              onClick={() => setDeleteModalShow(true)}
                            >
                              Excluir
                            </button> : <></>
                        }
                      </>
                  }
                </div>
              ) : <></>
            }
          </div>
        </div>
      </div>
      {
        deleteModalShow &&
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
                  <p className="text-md text-gray-700 px-8">Tem certeza de que deseja excluir esse conteúdo? Esse processo não pode ser desfeito</p>
                </div>
                <div className="p-3  mt-2 text-center space-x-4 md:block">
                  <button
                    className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100 active:bg-gray-900"
                    onClick={() => setDeleteModalShow(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="mb-2 md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600 active:bg-red-900"
                    onClick={deleteDescription}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
      }
      {
        ratingModalShow &&
          <RatingModal onClick={setRatingModalShow} title_id={title_id} />
      }
      {
        reviewModalShow &&
          <ReviewModal data={descData} closeHandle={setReviewModalShow} userInfo={userInfo} />
      }
    </>
  );
};

export default DetailModal;

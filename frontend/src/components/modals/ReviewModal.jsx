import { defaultUserIcon } from "../../assets";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const ReviewModal = ({ data, closeHandle, userInfo }) => {
  const handleCloseClick = () => {
    closeHandle(false);
  };

  const handleDeleteComment = async (index) => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
      const response = await axios.post("/api/data/deletecomment", { title_id: data.title_id, comment_id: data.comments[index]._id });
      if (response.data.message === "removed") {
        toast.success("Comentário removido com sucesso", { autoClose: 1000, hideProgressBar: true, pauseOnHover: false, theme: "dark" });
        window.location.reload(false);
      }
    } catch (err) {
      toast.error("Falha ao excluir o comentário", { autoClose: 1000, hideProgressBar: true, pauseOnHover: false, theme: "dark" });
    }
  };

  return (
    <div
      className="main-modal fixed w-full px-2 h-100 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster"
    >
      <ToastContainer />
      <div className="absolute inset-0 bg-black bg-opacity-80 transition-opacity"></div>
      <div className="relative w-full md:w-2/3 xl:w-1/2 max-h-[80%] bg-white rounded-md shadow-xl p-6 overflow-y-auto">
        <p className="text-[25px] font-semibold text-left">Comentários</p>
        <span className="fixed xs:right-4 xs:top-4 top-2 right-2 rounded-full p-1  hover:cursor-pointer" onClick={handleCloseClick}>
          <svg
            className="fill-white hover:fill-black"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 18 18"
          >
            <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
          </svg>
        </span>
        <div className="flex flex-col  text-left gap-2">
          <p className="py-2 font-semibold underline">{`${data.ratedCount}  reviews`}</p>
          {
            data.comments.map((comment, index) => {
              return (
                <div key={index} className="w-full rounded-xl border shadow-md">
                  <div className="w-full bg-slate-100 flex items-center rounded-t-xl">
                    <div className="w-full relative px-2 sm:px-10 py-1 flex items-center gap-2 sm:gap-6">
                      <img className="w-10 sm:w-14 rounded-full" src={defaultUserIcon} />
                      <div className="relative flex items-center divide-x-2 divide-slate-300 text-md sm:text-lg font-semibold">
                        <p className="px-2 sm:px-6">{comment.user}</p>
                        <div className="flex px-2 sm:px-6 gap-1 sm:gap-4">
                          <span>{parseFloat(comment.rate).toFixed(1)}</span>
                          <span className="flex items-center">
                            {
                              [1, 2, 3].map((item) => {
                                return (
                                  <svg
                                    className="w-6 h-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill={item <= parseInt(comment.rate) ? "#ffd500" : "grey"}
                                    key={item}
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                )
                              })
                            }
                          </span>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <button className="" onClick={() => handleDeleteComment(index)}>
                          <svg className="w-[24px] h-[24px] text-[#6c2bd9] hover:text-[#ff699d]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex bg-white rounded-b-xl px-4 text-sm sm:text-md sm:px-10 py-4">
                    <p className="w-[70%]  text-left">{comment.comment}</p>
                    <p className="w-[30%] text-right">{`${comment.date.toString().split("T")[0].split("-")[2]}/${comment.date.toString().split("T")[0].split("-")[1]}/${comment.date.toString().split("T")[0].split("-")[0]}`}</p>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
};

export default ReviewModal;
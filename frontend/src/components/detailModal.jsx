import { useSelector } from "react-redux";

const detailModal = ( {descData, handleClick} ) => {

  const {title, description, image } = descData;
  const { userInfo } = useSelector((state) => state.auth);

  const handleCloseClick = () => {
    handleClick(false);
  };
  
  return (
    <>
    <div
        className="main-modal fixed w-full h-100 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster"
    >
        <div className="border border-teal-500 shadow-lg modal-container bg-white w-11/12 md:w-[60%] mx-auto rounded shadow-lg z-50 overflow-y-auto">
          <div className="modal-content py-4 text-left px-6">
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
            <p className="py-2 text-2xl font-bold">{`Título: ${title}`}</p>
            <p className="py-1 text-xl font-semibold">{`Categoria: `}</p>
            <img className="h-[200px] py-4" src={`/src/assets/img/${parseInt(image)+1}.jpg`} alt="image" />
            <div className="overflow-y-auto">
              <p className="my-5">
                  {description}
              </p>
            </div>
          
            { 
              userInfo.role === 1 ? (
                <div className="flex justify-end pt-2">
                  <button className="w-[90px] focus:outline-none modal-close px-4 p-3 rounded-lg text-black border border-purple-700 hover:bg-purple-300 active:bg-purple-600 active:text-white">
                    Edit
                  </button>
                  <button className="w-[90px] focus:outline-none px-4 bg-purple-800 p-3 ml-3 rounded-lg text-white  hover:bg-purple-400 active:border active:border-purple-700 active:bg-white active:text-purple-900">
                    Confirm
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
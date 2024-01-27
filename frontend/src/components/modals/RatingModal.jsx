import FaStar from "../star/FaStar";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const RatingModal = ({ onClick, title_id }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [currentScore, setCurrentScore] = useState([false, false, false]);

  const handleClickClose = () => {
    onClick(false);
  };

  const handleClickRate =  async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
      const response = await axios.post("/api/data/rate", {
        title_id: title_id,
        rate: currentScore.filter((item) => item === true).length,
      });
      console.log(response.data);
      if(response.data === "success") {
        toast.success("Classificado com sucesso", { autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark" });
        onClick(false)
      }
    } catch (err) {
      toast.error("Classificação de reprovação", { autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark" });
    }
  };

  return (
    <div className="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover" id="modal-id">
      <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
      <ToastContainer />
      <div className="w-full  max-w-sm relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">
        <div className="px-12 py-5">
          <h2 className="text-gray-800 text-xl font-semibold">Your opinion matters to us!</h2>
        </div>
        <div className="bg-gray-200 w-full flex flex-col items-center">
          <div className="flex flex-col items-center py-6 space-y-3">
            <span className="text-lg text-gray-800">Is this helpful for you?</span>
            <FaStar  handleRate={setCurrentScore} />
          </div>
          <div className="w-3/4 flex flex-col">
            <textarea rows="3" className="p-4 text-gray-500 rounded-xl resize-none outline-none border focus:border-purple-300 focus:ring-2 focus:ring-purple-200"></textarea>
            <button className="py-3 my-8 text-lg bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white" onClick={handleClickRate}>Rate now</button>
          </div>
        </div>
        <div className="py-4 flex items-center justify-center">
          <button className="text-gray-600" onClick={handleClickClose}>Maybe later</button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
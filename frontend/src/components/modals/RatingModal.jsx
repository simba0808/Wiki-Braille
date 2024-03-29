import FaStar from "../star/FaStar";
import Loading from "../Loading";

import { useState } from "react";
import { useSelector } from "react-redux";
import useToast from "../../hook/useToast";
import axios from "axios";

const RatingModal = ({ onClick, title_id }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const customToast = useToast();

  const [currentScore, setCurrentScore] = useState([false, false, false]);
  const [comment, setComment] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleClickClose = () => {
    onClick(false);
  };

  const handleClickRate =  async () => {
    setLoading(true);
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
      const response = await axios.post("/api/data/rate", {
        title_id: title_id,
        comment: comment,
        rate: currentScore.filter((item) => item === true).length,
        user: userInfo.name,
      });
      setLoading(false);
      if(response.data === "success") {
        customToast("success", "Classificado com sucesso");
        onClick(false);
        setTimeout(() => {
          window.location.reload(false);
        }, 200);
      }
    } catch (err) {
      setLoading(false);
      customToast("failed", "Classificação de reprovação");
    }
  };

  return (
    <div className="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover" id="modal-id">
      { isLoading && <Loading />}
      <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
      <div className="w-full  max-w-md relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">
        <div className="px-12 py-5">
          <h2 className="text-gray-800 text-xl font-semibold">Sua opinião é importante para nós!</h2>
        </div>
        <div className="bg-gray-200 w-full flex flex-col items-center">
          <div className="flex flex-col items-center py-6 space-y-3">
            <span className="text-lg text-gray-800">Isso é útil para você?</span>
            <FaStar  handleRate={setCurrentScore} />
          </div>
          <div className="w-3/4 flex flex-col">
          <textarea 
              className="p-4 text-gray-500 rounded-xl resize-none outline-none border focus:border-purple-300 focus:ring-2 focus:ring-purple-200"
              maxLength={200}
              rows="3"
              placeholder="Digite aqui sua observação"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            >
            </textarea>
            <button className="py-3 my-8 text-lg bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white" onClick={handleClickRate}>Avalie agora</button>
          </div>
        </div>
        <div className="py-4 flex items-center justify-center">
          <button className="text-gray-600" onClick={handleClickClose}>Talvez mais tarde</button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
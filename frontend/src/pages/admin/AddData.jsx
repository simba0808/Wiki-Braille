import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCredentials } from "../../slices/authSlice";

const AddData  = () => {
  const {userInfo} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if(userInfo.role !== 1) {
        navigate("/");
      } else {
        axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
        try {
          const res = await axios.get("/api/user/");
          dispatch(setCredentials({...res.data}));
        } catch (err) {
          console.log(err.message);
          navigate("/");
        }
      }
    };
    fetchData();
  }, []);

  const handleClick = async () => {
    const res = await axios.post("/api/user/parsedata", {filePath: "D:/BancodedadosdesenhosBrailleTinta_v1.htm", type:"braille"});
  };
  
  return (
    <main className="h-full">
      <div className="container px-6 mx-auto grid">
        <button onClick={ handleClick }>
          add
        </button>
      </div>
    </main>
  );
};

export default AddData;
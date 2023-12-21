import axios from "axios";

const AddData  = () => {
  const handleClick = async () => {
    const res = await axios.post("/api/user/parsedata", {filePath: "D:/2.docx"});
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
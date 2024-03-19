import CustomSelect from "../selects/CustomSelect";
import { useState } from "react";
import useToast from "../../hook/useToast";
import copy from "copy-to-clipboard";
import axios from "axios";

const ViewDescriptionModal = ({imageUrl, description, closeClick}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Descrição");
  const [newDescription, setNewDescription] = useState(description);
  const [copiedText, setCopiedText] = useState(false);

  const customToast = useToast();

  const saveDescriptionToDB = async () => {
    try {
      const res = await axios.post("/api/office/savedescription", {
        description: {
          title,
          category,
          newDescription,
          image: imageUrl
        }
      });
      if(res.data.message === "success") {
        customToast("success", "Descrição salva com sucesso");
      }
    } catch(err) {
      customToast("failed", "Falha ao salvar a descrição");
    }
  }

  return (
    <div className="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover" id="modal-id">
      <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
      <div className="w-full max-w-screen-md relative mx-auto my-auto rounded-md shadow-lg bg-white">
        <div className="p-4 text-left">
          <div className="flex justify-end">
            <button onClick={() => closeClick(false)}>
              <svg
                className="fill-current w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </button>
          </div>
          <h2 className="pb-2 text-xl text-gray-800 font-bold">Inserir uma nova Descrição</h2>
          <div className="w-full flex gap-4">
            <div className="max-w-[50%]  flex items-center justify-center">
              <img src={`http://localhost:3000/${imageUrl}`} alt="Product" />
            </div>
            <div className="w-full  text-gray-800">
              <div className="flex flex-col mb-4">
                <label className="mb-1 text-lg font-semibold">Title</label>
                <input 
                  type="text" 
                  className="px-2 py-1 text-md border border-purple-600 rounded-md focus:ring-2 focus:ring-purple-300 outline-none" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="mb-1 text-lg font-semibold">Category</label>
                <CustomSelect
                  type={false}
                  values={["Descrição", "Desenhos em braille", "Grafias em braille", "Exemplos da grafia braille"]} 
                  selectedPrompt={category}
                  changeSelect={setCategory}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="mb-1 text-lg font-semibold">Description</label>
                <textarea 
                  className="min-h-[150px] px-2 py-1 text-sm border border-purple-600 rounded-md outline-none"
                  value={newDescription} 
                  onChange={(e) => setNewDescription(e.target.value)}
                >
                </textarea>
              </div>
              <div className="flex justify-between text-white text-md">
                <button 
                  className={`px-2.5 py-1.5 bg-purple-600 rounded-md ${copiedText?"":""}`}
                  onClick={() => {
                    setCopiedText(copy(newDescription));
                    setTimeout(() => {
                      navigator.clipboard.writeText("");
                      setCopiedText(false);
                    }, 10000);
                  }}
                >
                  { copiedText?"Copied":"Copy" }
                </button>
                <button className="px-3 py-1.5 bg-purple-600 rounded-md" onClick={saveDescriptionToDB}>Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewDescriptionModal;
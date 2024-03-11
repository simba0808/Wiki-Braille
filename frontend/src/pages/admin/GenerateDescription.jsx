import CustomSelect from "../../components/selects/CustomSelect";
import Loading from "../../components/Loading";

import { SettingIcon } from "../../assets";

import { useState, useEffect, useRef } from "react";
import { Document, Packer, Paragraph, TextRun, Media } from "docx"

const GenerateDescription = () => {
  const menuRef = useRef(null);
  const promptRef = useRef(null);
  const bookTypeRef = useRef(null);
  const targetRef = useRef(null);
  const languageRef = useRef(null);

  const [isLoading, setLoading] = useState(false);
  const [isVisibleMenu, setVisibleMenu] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [isSelectAll, setSelectAll] = useState(true);
  const [selectedBookType, setSelectedBookType] = useState("");
  const [selectedTargetAge, setSelectedTargetAge] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    const handleOutsieClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setVisibleMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutsieClick);
    return () => document.removeEventListener("mousedown", handleOutsieClick);
  }, []);

  const savedPrompts = ["I love apple", "I dislike apple", "I have apple"];
  const bookTypes = ["Matemática", "Geografia", "Histórico", "Física"];
  const clientAges = ["0 a 6 anos", "7 a 12 anos", "13 a 17 anos", "Adulto"];
  const languages = ["português", "Inglês", "Espanhol", "Alemão", "Italian","Chinese"];

  const handleChange = async  (e) => {
    const tempArr = Object.values(e.target.files);

    tempArr.forEach((item) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImages(prev => [...prev, { file: item, data: e.target.result }]);
      }      
      reader.readAsDataURL(item);
    });
  }

  useEffect(() => {
    console.log(selectedImages)
  }, [selectedImages])

  const handleConfirmClick = async () => {

  }

  return (
    <main className="overflow">
      <div className="container xs:px-6">
        <h2 className="my-6 text-2xl text-left font-semibold text-gray-700">
          Generate New Description
        </h2>
        <div>
          <div className="w-full grid grid-cols-6">
            
          </div>
        </div>
      </div>
      { isLoading && <Loading />}
      <div className="fixed top-34 right-1">
        <button onClick={() => setVisibleMenu(true)}>
          <img className="animate-spin w-10" src={SettingIcon} />
        </button>
      </div>
      {
        isVisibleMenu &&
          <div 
            className="fixed top-[80px] w-[350px] px-4 py-4 text-left font-semibold text-gray-800 bg-white border right-0 shadow-md ease-out transition-transform duration-200 overflow-auto" 
            style={{height:"var(--mainHeight)"}}
            ref={menuRef}
          >
            <h3 className="pb-4 text-xl">Setting</h3>
            <div className="flex flex-col gap-y-2">
              <label htmlFor="input-prompt">Insert your prompt</label>
              <textarea 
                id="input-prompt"
                className="w-full px-2 py-2 rounded-md border border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
              >
              </textarea>
              <button className="float-right px-2 py-2 text-sm text-white font-semibold hover:text-purple-600 bg-purple-600 hover:bg-white active:bg-purple-700 active:text-white border border-purple-600 transition-colors duration-300 rounded-md">
                Save Prompt
              </button>
            </div>
            <div className="mt-4 flex flex-col" ref={promptRef}>
              <label className="mb-2">Saved Prompts</label>
              <CustomSelect type={true} values={savedPrompts} selectedPrompt={selectedPrompt} changeSelect={setSelectedPrompt} />
            </div>
            <div className="mt-4 flex flex-col text-sm">
              <label className="mb-2 text-base">Select Image</label>
              <div className="w-full flex justify-between gap-2">
                <span 
                  className={`basis-1/2 px-2 py-2 text-center rounded-full hover:cursor-pointer ${isSelectAll?"bg-purple-600 text-white scale-105":"bg-slate-200"}`}
                  onClick={() => setSelectAll(true)}
                >
                  Select All
                </span>
                <span 
                  className={`basis-1/2 px-2 py-2 text-center rounded-full hover:cursor-pointer ${!isSelectAll?"bg-purple-600 text-white scale-105":"bg-slate-200"}`}
                  onClick={() => setSelectAll(false)}
                >
                  Select Manual
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-col" ref={bookTypeRef}>
              <label className="mb-2">Types of books</label>
              <CustomSelect type={false} values={bookTypes}  selectedPrompt={selectedBookType} changeSelect={setSelectedBookType} />
            </div>
            <div className="mt-4 flex flex-col" ref={targetRef}>
              <label className="mb-2">Target client&apos;s age</label>
              <CustomSelect type={false} values={clientAges} selectedPrompt={selectedTargetAge} changeSelect={setSelectedTargetAge} />
            </div>
            <div className="mt-4 flex flex-col" ref={languageRef}>
              <label className="mb-2">Idiomas</label>
              <CustomSelect type={false} values={languages} selectedPrompt={selectedLanguage} changeSelect={setSelectedLanguage} />
            </div>
            <button className="mt-8 w-full px-2 py-2 bg-purple-600 text-white rounded-md">Generate Now</button>
          </div>
      }
    </main>
  );
}

export default GenerateDescription;
import CustomSelect from "../../components/selects/CustomSelect";
import Loading from "../../components/Loading";
import ProgressModal from "../../components/modals/ProgressModal";
import { SettingIcon } from "../../assets";

import { useState, useEffect, useRef } from "react";
import useToast from "../../hook/useToast";

import WebViewer from "@pdftron/webviewer";
import axios from "axios";
import copy from "copy-to-clipboard";

const GenerateDescription = () => {
  const menuRef = useRef(null);
  const promptRef = useRef(null);
  const bookTypeRef = useRef(null);
  const targetRef = useRef(null);
  const languageRef = useRef(null);
  const viewer = useRef(null);
  const customToast = useToast();

  const savedPrompts = ["I love apple", "I dislike apple", "I have apple"];
  const bookTypes = ["No", "Matemática", "Geografia", "Histórico", "Física"];
  const clientAges = ["0 a 6 anos", "7 a 12 anos", "13 a 17 anos", "Adulto"];
  const languages = [
    "português",
    "Inglês",
    "Espanhol",
    "Alemão",
    "Italian",
    "Chinese",
  ];

  const [uploadingProgress, setUploadingProgress] = useState(0);
  const [pathToExtract, setPathToExtract] = useState("");
  const [selectedDocxFile, setSelectedDocxFile] = useState("");
  const [instance, setInstance] = useState(null);
  const [extractedImages, setExtractedImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [succeedImages, setSucceedImages] = useState([]);
  const [failedImages, setFailedImages] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [descriptionProgress, setDescriptionProgress] = useState(0);
  const [progressModalShow, setProgressModalShow] = useState(false);

  const [isLoading, setLoading] = useState(false);
  const [isVisibleMenu, setVisibleMenu] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [isSelectAll, setSelectAll] = useState(true);
  const [selectedBookType, setSelectedBookType] = useState(bookTypes[0]);
  const [selectedTargetAge, setSelectedTargetAge] = useState(clientAges[0]);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  useEffect(() => {
    const handleOutsieClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setVisibleMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutsieClick);
    return () => document.removeEventListener("mousedown", handleOutsieClick);
  }, []);

  useEffect(() => {
    console.log(succeedImages)
  }, [succeedImages])

  const handleUploadDocClick = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("doc", file);

    const res = await axios.post("/api/office/uploaddoc", formData, {
      onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        setUploadingProgress(progress);
      },
    });
    setPathToExtract(res.data.path);

    const callView = async () => {
      WebViewer(
        {
          path: "/webviewer/lib",
          enableOfficeEditing: "true",
          initialDoc: `http://localhost:3000/${res.data.filename}`,
          licenseKey:
            "7f385de70300000000d398edfc4c9af6c0b00fdaf3642865f9aa601f7a", // sign up to get a free trial key at https://dev.apryse.com
        },
        viewer.current
      ).then((instance) => {
        const { documentViewer, annotationManager, Annotations } =
          instance.Core;
        setInstance(instance);

        documentViewer.addEventListener("documentLoaded", () => {
          const rectangleAnnot = new Annotations.RectangleAnnotation({
            PageNumber: 1,
            // values are in page coordinates with (0, 0) in the top left
            X: 100,
            Y: 150,
            Width: 200,
            Height: 50,
            Author: annotationManager.getCurrentUser(),
          });

          annotationManager.addAnnotation(rectangleAnnot);
          // need to draw the annotation otherwise it won't show up until the page is refreshed
          annotationManager.redrawAnnotation(rectangleAnnot);
        });
      });
    };
    if (instance) {
      instance.UI.loadDocument(`http://localhost:3000/${res.data.filename}`);
    } else {
      callView();
    }
    setSelectedDocxFile(res.data.filename);
  };

  const handleExtractImages = async () => {
    setLoading(true);
    const res = await axios.post("/api/office/extractimages", {
      path: pathToExtract,
    });
    setExtractedImages(res.data);
    setLoading(false);
  };

  const handleCloseDoc = async () => {
    try{
      await axios.post("/api/office/closedocument", {
        documentPath: selectedDocxFile,
        imagePath: extractedImages,
      });
      alert("Arquivo fechado com sucesso");
      setExtractedImages([]);
      setSelectedImages([]);
      setUploadingProgress(0);
      const { documentViewer } = instance.Core;
      documentViewer.closeDocument();
    } catch(err) {
      console.log(err);
    }
  };

  const handleGenerateDescription = async () => {
    const imageUrls = [];
    selectedImages.forEach((image) => {
      imageUrls.push(extractedImages[image]);
    });
    if(imageUrls.length === 0) {
      alert("select images")
      return;
    }
    setProgressModalShow(true);
    const promise = imageUrls.map(async (image) => {
      try {
        const res = await axios.post("/api/office/generatedescription", {
          promptText: createPrompt(),
          image: image
        });
        if(res.data.message === "success") {
          setDescriptions(prev => {
            let temp = [...prev];
            temp[extractedImages.indexOf(image)] = res.data.data;
            return temp;
          });
          setSucceedImages(prev => {
            let temp = [...prev];
            temp.push(image);
            return temp;
          });
        }
        setDescriptionProgress(prev => prev+1);
      } catch(err) {
        setFailedImages(prev => {
          let temp = [...prev];
          temp.push(image);
          return temp;
        });
        setDescriptionProgress(prev => prev+1);
      }
    });
    Promise.all(promise).then(() => {
      console.log("here")
      setSelectedImages([]);
      setProgressModalShow(false);
    });
  };

  const createPrompt = () => {
    let prompt = promptText;
    if (selectedBookType !== "No")
      prompt = prompt + " In the aspect of " + selectedBookType + ".";
    if (selectedTargetAge === "0 a 6 anos")
      prompt = prompt + " with very simple and little words.";
    else if (selectedTargetAge === "7 a 12 anos")
      prompt = prompt + " with simple words.";
    else if (selectedTargetAge === "13 a 17 anos")
      prompt = prompt + " with middle-level words.";
    else prompt = prompt + " with senior words.";
      prompt = prompt + " In " + selectedLanguage;

    return prompt;
  };

  return (
    <main className="overflow relative">
      <div className="container xs:px-6">
        <h2 className="my-6 text-2xl text-left font-semibold text-gray-700">
          Generate New Description
        </h2>
        <div className="w-full">
          <div className="flex justify-end py-2 gap-2">
            {
              extractedImages.length > 0 ?
                <button className="relative bg-purple-600 px-4 py-2 rounded-md text-white" onClick={handleCloseDoc}>
                  Close Document
                </button> :
                <>
                  <input
                    type="file"
                    className="hidden"
                    id="doc-upload"
                    onChange={(e) => {
                      handleUploadDocClick(e);
                    }}
                  />
                  <label
                    htmlFor={uploadingProgress === 0 ? "doc-upload" : ""}
                    className="relative bg-purple-600 px-4 py-2 rounded-md text-white hover:cursor-pointer"
                    onClick={() => {
                      if (uploadingProgress === 100) handleExtractImages();
                    }}
                  >
                    {uploadingProgress == "100" ? "Extract Now" : (
                      uploadingProgress !== 0 ? 
                        <>
                          <svg className="inline animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading
                        </>:"Upload File"
                      
                      
                    )}
                    {uploadingProgress !== 0 && uploadingProgress !== 100 && (
                      <div className="absolute left-0 bottom-0 w-full h-[3px] bg-slate-200 rounded-b-md">
                        <div className="w-full h-full bg-blue-400 "></div>
                      </div>
                    )}
                  </label>
                </>
            }
          </div>
          <div className="w-full flex gap-x-4">
            <div
              className="grow webviewer"
              ref={viewer}
              style={{ height: "100vh" }}
            ></div>
            <div className="min-w-[200px]">
              <div className="grid grid-cols-2 gap-2 hover:cursor-pointer">
                {extractedImages.map((image, index) => {
                  return (
                    <div
                      key={index}
                      className={`relative p-2 border flex items-center min-h-[100px] overflow-hidden ${
                        selectedImages.includes(index) ? "border-green-600":"border-gray-200"
                      }`}
                      onClick={() => {
                        if(succeedImages.includes(image)) {
                          copy(descriptions[index]);
                          return;
                        }
                        let fetchedImages = [...selectedImages];
                        if(fetchedImages.includes(index)) {
                          fetchedImages.splice(fetchedImages.indexOf(index), 1)
                        } else {
                          fetchedImages.push(index);
                        }
                        setSelectedImages(fetchedImages);
                      }}
                    >
                      <img
                        className="max-w-[100px] max-h-[100px]"
                        src={`http://localhost:3000/${image}`}
                      />
                      <div className="absolute right-0 top-0 h-6 w-6">
                        <div
                          className={`absolute transform rotate-45 text-[10px] text-center text-white font-semibold right-[-22px] top-[8px] w-[70px] ${failedImages.includes(image)?"bg-red-600":"bg-green-600"}`}>
                          {
                            succeedImages.includes(image) ? "success":""
                          }
                          {
                            failedImages.includes(image) ? "failed":""
                          }
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed top-32 right-1">
        <button onClick={() => setVisibleMenu(true)}>
          <img className="animate-spin w-10" src={SettingIcon} />
        </button>
      </div>
      {isLoading && <Loading />}
      {
        progressModalShow && 
          <ProgressModal current={descriptionProgress} total={selectedImages.length} />
      }
      {isVisibleMenu && (
        <div
          className="fixed top-[80px] w-[350px] px-4 py-4 text-left font-semibold text-gray-800 bg-white border right-0 shadow-md ease-out transition-transform duration-200 overflow-auto"
          style={{ height: "var(--mainHeight)" }}
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
            ></textarea>
            <button className="float-right px-2 py-2 text-sm text-white font-semibold hover:text-purple-600 bg-purple-600 hover:bg-white active:bg-purple-700 active:text-white border border-purple-600 transition-colors duration-300 rounded-md">
              Save Prompt
            </button>
          </div>
          <div className="mt-4 flex flex-col" ref={promptRef}>
            <label className="mb-2">Saved Prompts</label>
            <CustomSelect
              type={true}
              values={savedPrompts}
              selectedPrompt={selectedPrompt}
              changeSelect={setSelectedPrompt}
            />
          </div>
          <div className="mt-4 flex flex-col text-sm">
            <label className="mb-2 text-base">Select Image</label>
            <div className="w-full flex justify-between gap-2">
              <span
                className={`basis-1/2 px-2 py-2 text-center rounded-full hover:cursor-pointer ${
                  isSelectAll
                    ? "bg-purple-600 text-white scale-105"
                    : "bg-slate-200"
                }`}
                onClick={() => setSelectAll(true)}
              >
                Select All
              </span>
              <span
                className={`basis-1/2 px-2 py-2 text-center rounded-full hover:cursor-pointer ${
                  !isSelectAll
                    ? "bg-purple-600 text-white scale-105"
                    : "bg-slate-200"
                }`}
                onClick={() => setSelectAll(false)}
              >
                Select Manual
              </span>
            </div>
          </div>
          <div className="mt-4 flex flex-col" ref={bookTypeRef}>
            <label className="mb-2">Types of books</label>
            <CustomSelect
              type={false}
              values={bookTypes}
              selectedPrompt={selectedBookType}
              changeSelect={setSelectedBookType}
            />
          </div>
          <div className="mt-4 flex flex-col" ref={targetRef}>
            <label className="mb-2">Target client&apos;s age</label>
            <CustomSelect
              type={false}
              values={clientAges}
              selectedPrompt={selectedTargetAge}
              changeSelect={setSelectedTargetAge}
            />
          </div>
          <div className="mt-4 flex flex-col" ref={languageRef}>
            <label className="mb-2">Idiomas</label>
            <CustomSelect
              type={false}
              values={languages}
              selectedPrompt={selectedLanguage}
              changeSelect={setSelectedLanguage}
            />
          </div>
          <button className="mt-8 w-full px-2 py-2 bg-purple-600 text-white rounded-md" onClick={handleGenerateDescription}>
            Generate Now
          </button>
        </div>
      )}
    </main>
  );
};

export default GenerateDescription;
import { useState } from "react";
import BlogPost from "../../components/BlogPost";

const Guidence = () => {
  const [editable, setEditable] = useState(false);
  const [title, setTitle] = useState("Everyone can cook.");
  const [text, setText] = useState("It's important to provide accessibility, inclusion, and resources that empower them to participate fully in society and pursue their goals.");

  return (
    <main className="flex item-center justify-center md:overflow-hidden">
      <div className="container xs:px-6">
        <div className="relative flex w-full min-h-[600px] bg-no-repeat bg-cover bg-[url('/src/assets/img/blog.png')]">
          <button
            className="absolute right-4 top-4"
            onClick={() => setEditable(!editable)}
          >
            <svg className="w-[40px] h-[40px] text-white-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.3 4.8 2.9 2.9M7 7H4a1 1 0 0 0-1 1v10c0 .6.4 1 1 1h11c.6 0 1-.4 1-1v-4.5m2.4-10a2 2 0 0 1 0 3l-6.8 6.8L8 14l.7-3.6 6.9-6.8a2 2 0 0 1 2.8 0Z" />
            </svg>
          </button>
          <div className="absolute xs:top-28 xs:left-14 top-20 left-4 max-w-full sm:max-w-[900px] p-2 text-white text-left">
            <div className="relative">
              <textarea
                className={`w-full sm:max-h-[100px] text-[40px] sm:text-[45px] lg:text-[60px] font-bold bg-transparent outline-none resize-none ${editable ? "border-b-2 border-white" : ""}`}
                value={title}
                disabled={editable ? false : true}
                maxLength="20"
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.keyCode == 13) {
                    e.preventDefault()
                  }
                }}
              >
              </textarea>
              <p className={`${editable ? "block" : "hidden"} absolute bottom-2 right-2 text-gray-500 text-sm`}>{title.length} / 20</p>
            </div>
            <div className="relative">
              <textarea
                className={`w-full min-h-[300px] text-lg sm:text-[20px] lg:text-[25px] mt-4 p-2 bg-transparent rounded-md outline-none resize-none ${editable ? "border-2 border-white" : ""}`}
                value={text}
                disabled={editable ? false : true}
                maxLength={150}
                onChange={(e) => setText(e.target.value)}
              >
              </textarea>
            </div>
            <p className={`${editable ? "block" : "hidden"} absolute bottom-4 right-4 text-gray-500 text-sm`}>{text.length} / 150</p>
          </div>
        </div>
        <div className="w-full mt-4 py-4 flex flex-col">
          <div className="w-full flex justify-end py-2">
            <button onClick="">
              <svg className="w-[60px] h-[40px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="#6c2bd9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7.8v8.4M7.8 12h8.4m4.8 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </button>
          </div>
          <div className="max-w-[1000px] mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            <BlogPost />
            <BlogPost />
            <BlogPost />
            <BlogPost />
            <BlogPost />
          </div>
        </div>
      </div>
    </main>
  )
};

export default Guidence
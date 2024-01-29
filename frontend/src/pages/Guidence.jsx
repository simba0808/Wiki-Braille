import BlogPost from "../components/BlogPost";
import BlogAddModal from "../components/modals/BlogAddModal";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Guidence = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [editable, setEditable] = useState(false);
  const [title, setTitle] = useState("Everyone can cook.");
  const [text, setText] = useState("It's important to provide accessibility, inclusion, and resources that empower them to participate fully in society and pursue their goals.");
  const [isAddBlog, setAddBlog] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
        const response = await axios.get("/api/blog");
        const blogs = response.data.blogs;
        blogs.map((blog) => {
          if (blog.selected === true) {
            setSelectedBlog(blog);
            return;
          }
        });
        setBlogs(response.data.blogs);
      } catch (err) {
        toast.error("Falha ao obter blogs.", { autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark", });
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    if(selectedBlog !== null) {
      setTitle(selectedBlog.title);
      setText(selectedBlog.text);
    }
  }, [selectedBlog]);

  const selectBlog = async (id) => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
      const response = await axios.post(`/api/blog`, {id});
      if(response.data.message === "success") {
        setSelectedBlog(response.data.blog);
      }
    } catch (err) {

    }   
  };

  const updateBlog = async (id) => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
      const response = await axios.post("/api/blog/update", {id, title, text});
      if(response.data.message === "success") {
        toast.success("Blog atualizado com sucesso.", { autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark", });
        setSelectedBlog(response.data.blog);
        
      }
    } catch(err) {
      toast.error("Falha ao atualizar blog.", { autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark", });
    }
  };

  const deleteBlog = async (id) => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
      await axios.delete(`/api/blog/${id}`);
      const response = await axios.get("/api/blog");
      setBlogs(response.data.blogs);
      toast.success("Blog deletado com sucesso.", { autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark", });
    } catch (err) {
      toast.error("Falha ao deletar blog.", { autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark", });
    }
  };

  return (
    <main className="relative flex item-center justify-center md:overflow-hidden">
      <div className="container xs:px-6">
        <ToastContainer />
        <div className="relative flex w-full min-h-[600px]">
          <img className="z-0 w-full max-h-[600px] object-cover" src={selectedBlog? selectedBlog.image : "/src/assets/img/blog.png"} alt="blog" />
          {
            userInfo.role === 2 &&
            <button
              className="absolute right-4 top-4"
              onClick={() => {
                  if(editable) {
                    updateBlog(selectedBlog._id);
                  }
                  setEditable(!editable);
                }
              }
            >
              <svg className="w-[40px] h-[40px] text-white-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.3 4.8 2.9 2.9M7 7H4a1 1 0 0 0-1 1v10c0 .6.4 1 1 1h11c.6 0 1-.4 1-1v-4.5m2.4-10a2 2 0 0 1 0 3l-6.8 6.8L8 14l.7-3.6 6.9-6.8a2 2 0 0 1 2.8 0Z" />
              </svg>
            </button>
          }
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
        <div className="w-full mt-8 py-4 flex flex-col">
          <div className="max-w-[1000px] mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {
              blogs.map((blog) => (
                <BlogPost
                  key={blog._id}
                  blog={blog}
                  selectHandle={selectBlog}
                  deleteHandle={deleteBlog}
                />
              ))
            }
          </div>
        </div>
      </div>
      {
        userInfo.role === 2 &&
        <div className="fixed right-4 bottom-4 flex justify-end py-2">
          <button onClick={() => setAddBlog(true)}>
            <svg className="w-[60px] h-[60px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="#6c2bd9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7.8v8.4M7.8 12h8.4m4.8 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </button>
        </div>
      }
      {
        isAddBlog ?
          <BlogAddModal closeHandle={setAddBlog} /> : <></>
      }
    </main>
  )
};

export default Guidence
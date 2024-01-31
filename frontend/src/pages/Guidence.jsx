import BlogPost from "../components/BlogPost";
import BlogAddModal from "../components/modals/BlogAddModal";
import Loading from "../components/Loading";
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
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }

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
    console.log(selectedBlog)
    if(selectedBlog !== null) {
      setTitle(selectedBlog.title);
      setText(selectedBlog.text);
      console.log(selectedBlog.text)
    }
  }, [selectedBlog]);

  const selectBlog = async (id, index) => {
    if(userInfo.role === 2) {
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
        const response = await axios.post(`/api/blog`, {id});
        if(response.data.message === "success") {
          setSelectedBlog(response.data.blog);
        }
      } catch (err) {
  
      }   
    } else {
      setSelectedBlog(blogs[index])
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
        <div className="relative text-left w-full sm:max-w-[70%] mx-auto py-10 bg">
          <div className="mb-4">
            {
              selectedBlog ? `${months[parseInt(selectedBlog.createdAt.split("T")[0].split("-")[1])-1]} ${selectedBlog.createdAt.split("T")[0].split("-")[2]}, ${selectedBlog.createdAt.split("T")[0].split("-")[0]}`: "2022-11-11"
            }
            &nbsp; by  Elias Sperandio  
          </div>
          <div className="w-full">
            <p className="text-pretty py-2 text-2xl sm:text-[40px] font-semibold leading-[150%] text-orange-400">
              {title}
            </p>
            <p className="leading-[150%] whitespace-pre-line mt-10 font-[500] text-md sm:text-lg text-slate-800 text-pretty">
              {text}
            </p>
          </div>  
        </div>

        <div className="w-full mt-8 py-4 flex flex-col">
          <div className="max-w-[1000px] mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {
              blogs.map((blog, index) => (
                <BlogPost
                  key={blog._id}
                  blog={blog}
                  id={index}
                  selectHandle={selectBlog}
                  selectedBlog={selectedBlog._id}
                  deleteHandle={deleteBlog}
                  role={userInfo.role}
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
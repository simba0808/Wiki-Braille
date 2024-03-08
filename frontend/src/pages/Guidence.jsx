import BlogPost from "../components/BlogPost";
import BlogAddModal from "../components/modals/BlogAddModal";
import Loading from "../components/Loading";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useToast from "../hook/useToast";

import axios from "axios";

const Guidence = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const customToast = useToast();

  const [title, setTitle] = useState("Everyone can cook.");
  const [text, setText] = useState("It's important to provide accessibility, inclusion, and resources that empower them to participate fully in society and pursue their goals.");
  const [isAddBlog, setAddBlog] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
        const response = await axios.get("/api/blog");
        setLoading(false);
        const tempBlogs = response.data.blogs;
        tempBlogs.map((blog) => {
          if (blog.selected === true) {
            setSelectedBlog(blog);
            return;
          }
        });
        setBlogs(response.data.blogs);
      } catch (err) {
        setLoading(false);
        customToast("failed", "Falha ao obter blogs");
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (selectedBlog !== null) {
      setTitle(selectedBlog.title);
      setText(selectedBlog.text);
    }
  }, [selectedBlog]);

  const selectBlog = async (id, index) => {
    if (userInfo.role === 2) {
      setLoading(true);
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
        const response = await axios.post(`/api/blog`, { id });
        if (response.data.message === "success") {
          setSelectedBlog(response.data.blog);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    } else{
      setSelectedBlog(blogs[index]);
    }
  };

  const updateBlog = async (id) => {
    setLoading(true);
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
      const response = await axios.post("/api/blog/update", { id, title, text });
      if (response.data.message === "success") {
        customToast("success", "Blog atualizado com sucesso");
        setSelectedBlog(response.data.blog);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      customToast("failed", "Falha ao atualizar blog");
    }
  };

  const deleteBlog = async (id) => {
    setLoading(true);
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
      await axios.delete(`/api/blog/${id}`);
      const response = await axios.get("/api/blog");
      setBlogs(response.data.blogs);
      setLoading(false);
      customToast("success", "Blog deletado com sucesso");
    } catch (err) {
      setLoading(false);
      customToast("failed", "Falha ao deletar blog");
    }
  };

  return (
    <main className="relative flex item-center justify-center md:overflow-hidden">
      {isLoading && <Loading />}
      <div className="container xs:px-6">
        <div className="relative text-left w-full sm:max-w-[70%] mx-auto py-10 bg">
          <div className="mb-4">
            {
              selectedBlog ? `${months[parseInt(selectedBlog.createdAt.split("T")[0].split("-")[1]) - 1]} ${selectedBlog.createdAt.split("T")[0].split("-")[2]}, ${selectedBlog.createdAt.split("T")[0].split("-")[0]}` : "2022-11-11"
            }
            &nbsp; by  Elias Sperandio
          </div>
          <div className="w-full px-4">
            <p className="text-pretty py-2 text-2xl sm:text-[40px]  font-semibold leading-[150%] text-orange-400">
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
                  index={index}
                  blog={blog}
                  selectHandle={selectBlog}
                  selectedBlog={selectedBlog ? selectedBlog._id : null}
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
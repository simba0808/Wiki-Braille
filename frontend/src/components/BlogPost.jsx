const BlogPost = ({ blog, deleteHandle, selectHandle, selectedBlog, role, index }) => {

  const handleSelected = () => {
    selectHandle(blog._id, index);
  }

  const handleDeleteClick = () => {
    deleteHandle(blog._id);
  };

  return (
    <div className={`relative w-[300px] h-[290px] mx-auto bg-white border rounded-lg shadow-md hover:cursor-pointer transform transition-transform duration-200 hover:translate-y-[-10px] overflow-hidden ${selectedBlog==blog._id?"ring-4 border-2 border-purple-400 ring-purple-200":""}`} onClick={handleSelected}>
      <div className="relative h-full px-4 py-2 text-left">
        <p className="py-1 text-lg font-semibold">{blog ? blog.title : ""}</p>
        <div className="py-2">
          <p className="text-sm">{blog ? (blog.text.length>200 ? blog.text.substring(0, 200)+"...":blog.text) : ""}</p>
        </div>
        <div className="absolute bottom-2 w-[90%]">
          <p className="text-sm">{`Criado por Elias ${blog?blog.createdAt.split("T")[0]:""}`}</p>
          {
            role == 2 && 
              <div className="flex justify-end">
                <button className="" onClick={handleDeleteClick}>
                  <svg className="w-[24px] h-[24px] text-[#6c2bd9] hover:text-[#ff699d]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                  </svg>
                </button>
              </div>
          }
        </div>
      </div>
      {
        selectedBlog==blog._id &&
          <div className="absolute right-0 top-0 h-16 w-16">
            <div
              className="absolute transform rotate-45 bg-opacity-80 bg-green-600 text-center text-white text-sm font-semibold py-1 right-[-35px] top-[32px] w-[170px]">
              Selecionado
            </div>
          </div>
      }
    </div>
  );
}

export default BlogPost;
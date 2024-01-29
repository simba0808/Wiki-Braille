const BlogPost = ({ blog, deleteHandle, selectHandle }) => {

  const handleSelected = () => {
    selectHandle(blog._id);
  }

  const handleDeleteClick = () => {
    deleteHandle(blog._id);
  };

  return (
    <div className="min-w-[300px] max-w-[350px] h-[350px] mx-auto bg-white border rounded-lg shadow-md" onClick={handleSelected}>
      <div className="w-full h-[35%] rounded-t-lg">
        <img src={blog ? blog.image : ""} alt={blog ? blog.title : ""} className="w-full h-full object-cover rounded-t-lg" />
      </div>
      <div className="h-[65%] relative px-4 py-2 text-left">
        <p className="py-1 text-md font-semibold">{blog ? blog.title : ""}</p>
        <div className="py-2">
          <p className="text-sm">{blog ? (blog.text.length>200 ? blog.text.substring(0, 200)+"...":blog.text) : ""}</p>
        </div>
        <div className="absolute bottom-2 w-[90%]">
          <p className="text-sm">{`Criado por Elias ${blog?blog.createdAt.split("T")[0]:""}`}</p>
          {
            <div className="flex justify-end py-2">
              <button className="" onClick={handleDeleteClick}>
                <svg className="w-[24px] h-[24px] text-[#6c2bd9] hover:text-[#ff699d]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                </svg>
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default BlogPost;
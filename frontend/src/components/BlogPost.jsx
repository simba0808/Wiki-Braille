const BlogPost = () => {
  return (
    <div className="min-w-[300px] max-w-[350px] h-[350px] mx-auto bg-white border rounded-lg">
      <div className="w-full h-[35%] bg-cover bg-[url('/src/assets/img/login2.png')] rounded-t-lg"></div>
      <div className="h-[65%] relative px-4 py-2 text-left">
        <p className="py-1 text-md font-semibold">This is Title</p>
        <div className="py-2">
          <p className="text-sm">This is Text. sdfasdfasfasdfdasfasfasfas</p>
        </div>
        <p className="absolute bottom-2 text-sm">created by Elias</p>
      </div>
    </div>
  );
}

export default BlogPost;
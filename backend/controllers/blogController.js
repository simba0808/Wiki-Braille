import Blog from "../models/blog.js";

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.status(200).send({
      blogs,
    });
  } catch (err) {
    res.status(500);
    throw new Error("Error occured while getting all blogs");
  }
};

const addNewBlog = async (req, res) => {
  const { title, text } = req.body;
  console.log(title, text);
  try {
    const blog = await Blog.create({
      title,
      text,
      image: `http://localhost:3000/${req.file.filename}`,
    });
    res.status(200).send({
      message: "success",
      image: `http://localhost:3000/${req.file.filename}`,
    });
  } catch (err) {
    res.status(500);
    throw new Error("Error occured while adding new blog");
  }
};

const selectBlog = async (req, res) => {
  const id = req.body.id;
  try {
    const blog = await Blog.findOne({ selected: true });
    if(blog) {
      blog.selected = false;
      await blog.save();
    }

    const selectedBlog = await Blog.findById(id);
    selectedBlog.selected = true;
    await selectedBlog.save();

    res.status(200).send({
      message: "success",
      blog: selectedBlog,
    });
  } catch(err) {
    res.status(500);
    throw new Error("Error occured while selecting blog");
  }

};

const updateBlog = async (req, res) => {
  const { id, title, text } = req.body;
  console.log(id, title, text);
  try {
    const blog = await Blog.findById(id);
    blog.title = title;
    blog.text = text;
    await blog.save();
    res.status(200).send({
      message: "success",
      blog,
    });
  } catch(err) {
    res.status(500);
    throw new Error("Error occured while updating blog");
  }
};

const deleteBlog = async (req, res) => {
  const id = req.params.id;
  
  try {
    const blog = await Blog.findByIdAndDelete(id);
    if (blog) {
      res.status(200).send({
        message: "success",
      });
    }
  } catch (err) {
    res.status(500);
    throw new Error("Error occured while deleting blog");
  }
}

export {
  getAllBlogs,
  addNewBlog,
  selectBlog,
  updateBlog,
  deleteBlog,
};
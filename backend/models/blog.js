import mongoose from "mongoose";
const blogSchema = mongoose.Schema({
  title: {
    type: String,
  },
  text: {
    type: String,
  },
  image: {
    type: String,
  },
}, {
  timestamps: true
});

const Blog = mongoose.model("blog", blogSchema);

export default Blog;
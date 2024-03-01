import mongoose from "mongoose";
const blogSchema = mongoose.Schema({
  title: {
    type: String,
  },
  text: {
    type: String,
  },
  selected: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true
});

const Blog = mongoose.model("blog", blogSchema);

export default Blog;
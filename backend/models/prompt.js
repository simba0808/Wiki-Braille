import mongoose from "mongoose";
const promptSchema = mongoose.Schema({
  text: {
    type: String,
  },
  user: {
    type: String
  }
});

const Prompt = mongoose.model("prompt", promptSchema);

export default Prompt;
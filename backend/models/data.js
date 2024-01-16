import mongoose from "mongoose";

const dataSchema = mongoose.Schema(
  {
    title_id: {
      type: String,
      unique: true,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    catagory: {
      type: String,
      default: "",
    },
    tag: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
      required: true,
    }
  }
);

const Data = mongoose.model("data", dataSchema);

export default Data;
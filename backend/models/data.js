import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      default: "",
      required: true,
    },
    user: {
      type: String,
      default: "",
      required: true,
    },
    rate: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
    }
  }
);

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
    },
    totalRate: {
      type: Number,
      default: 0,
    },
    rate: {
      type: Number,
      default: 0
    },
    ratedCount: {
      type: Number,
      default: 0
    },
    comments: [commentSchema]
  }
);

const Data = mongoose.model("data", dataSchema);

export default Data;
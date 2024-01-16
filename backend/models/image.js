import mongoose from "mongoose";

const ImageSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  orignalName: {
    type: String,
    required: true,
  }
});

const ImageModel = mongoose.model("Image", ImageSchema);

export default ImageModel;
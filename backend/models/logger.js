import mongoose, { mongo } from "mongoose";

const loggerSchema = mongoose.Schema({
  name: {
    type: String,
  },
  status: {
    type: String  ,
  },
  user: {
    type: String,
  },
  time: {
    type: Date,
  },
  detail: {
    type: String
  }
});

const Logger = mongoose.model("logger", loggerSchema);

export default Logger;
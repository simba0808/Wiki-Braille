import mongoose from "mongoose";
import bCrypt from 'bcrypt';
import { func } from "prop-types";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bCrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async (next) => {
  if(!this.isModified('password')) {
    next();
  }
  const salt = await bCrypt.genSalt(10);
  this.password = await bCrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
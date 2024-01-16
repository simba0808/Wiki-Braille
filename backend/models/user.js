import mongoose from "mongoose";
import bCrypt from 'bcrypt';

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
      default: -1,
    }, 
    avatar: {
      type: String,
      default: "",
    },
    verifyCode: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bCrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if(!this.isModified('password')) {
    next();
  }
  const salt = await bCrypt.genSalt(10);
  this.password = await bCrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
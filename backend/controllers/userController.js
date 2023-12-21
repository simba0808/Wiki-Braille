import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";


const getUserInfo = async (req, res) => {
  //console.log(req);
  const { userId } = req.decoded;
};

const authWithToken = async (req, res) => {

};

const authUser = async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  console.log(user)
  if(!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const isMatch = await user.matchPassword(password);
  console.log(isMatch)
  if(!isMatch) {
    res.status(401);
    throw new Error("Invalid password");
  }

  const token = generateToken(user._id, user.role);
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  });
}

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  
  if(user) {
    res.status(401);
    throw new Error("User already exists");
  }
  const newUser = await User.create({
    name,
    email,
    password,
  });

  if(newUser) {
    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
    });
  } else {
    res.status(400);
    throw new Error("User could not be created");
  }
};

export {
  getUserInfo,
  registerUser,
  authUser,
};
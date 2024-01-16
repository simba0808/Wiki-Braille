import mongoose from "mongoose";
import { MongoClient, GridFSBucket, ObjectId } from "mongodb";
import Grid from "gridfs-stream";
import fs from "fs";
import nodemailer from "nodemailer";
import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";
import forgotTemplate from "../utils/forgotTemplate.js";
import { randomInt } from "crypto";
import dotenv from "dotenv";
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let gfs;
const conn = mongoose.connection;

conn.once('open', function () {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('photos');
});

const getUserInfo = async (req, res) => {
  const { userId } = req.decoded;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  const token = generateToken(user._id, user.role);
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: token,
    avatar: user.avatar,
  });
};

const authWithToken = async (req, res) => {

};

const authUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  if(user.role === -1) {
    res.status(401);
    throw new Error("inactive");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid password");
  }

  const token = generateToken(user._id, user.role);
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    token,
  });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    res.status(401);
    throw new Error("User already exists");
  }
  const newUser = await User.create({
    name,
    email,
    password,
  });

  if (newUser) {
    res.status(200).json({
      _id: newUser._id,
      email: newUser.email,
    });
  } else {
    res.status(500);
    throw new Error("User could not be created");
  }
};

const sendVerifyCode = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("Can't find that email");
  }
  try {
    const mailType = email.split("@")[1].split(".")[0];
    const verifyCode = generateVerifyCode();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      requireTLS: true,
      auth: {
        user: "profitteamcad@gmail.com",
        pass: "vojhaizydjtqdahe"
      }
    });
    const mailOptions = {
      from: "profitteamcad@gmail.com",
      to: email,
      subject: `Reset Password Verificatin Code ${verifyCode}`,
      text: "code",
      html: forgotTemplate(email, verifyCode),
    };

    transporter.sendMail(mailOptions, async function (err, info) {
      if (err) {
        console.log(err);
        res.status(500);
        throw new Error("Error occurred while sending email");
      } else {
        console.log("mail sent" + info.messageId);
      }
    });
    user.verifyCode = verifyCode;
    const update = await user.save();
    if (update) {
      res.status(200).send({
        message: "sent"
      });
    }
  } catch (err) {
    res.status(500);
    throw new Error("Error occurred while generating code");
  }
};

const verifyResetCode = async (req, res) => {
  const { email, verifyCode } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user.verifyCode === verifyCode) {
      res.status(200).send({
        message: "verified"
      });
    } else {
      res.status(404).send({
        message: "unverified"
      });
    }
  } catch (err) {
    res.status(500);
    throw new Error("Error occurrred while verifying code.")
  }
};

const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.password = password;
      const update = await user.save();
      if (update) {
        res.status(200).send({
          message: "success"
        });
      }
    }
  } catch (err) {
    res.status(500);
    throw new Error("Error occurred while resetting password");
  }
};

const generateVerifyCode = () => {
  const verifyCode = randomInt(999999).toString().padStart(6, "0");
  return verifyCode;
};

const updateAvatar = async (req, res) => {
  const { email, currentAvatar } = req.body;

  if (req.file === undefined) {
    return res.send('you must select a file.');
  }
  const user = await User.findOne({
    email
  });
  if (currentAvatar !== undefined && currentAvatar !== "") {
    deleteAvatar(currentAvatar);
  }
  user.avatar = req.file.id;
  user.save();

  res.send({
    message: "uploaded",
    id: req.file.id,
    name: req.file.name,
    contentType: req.file.contentType,
  });
};

const getAvatar = async (req, res) => {
  try {
    await mongoClient.connect();
    const database = mongoClient.db("wiki_braille");
    const imageBucket = new GridFSBucket(database, { bucketName: 'photos' });
    let downloadStream = imageBucket.openDownloadStream(new ObjectId(req.params.id));

    downloadStream.on('data', (data) => {
      let buffer = new Buffer(data).toString('base64');
      return res.status(200).write(buffer.toString());
    });
    downloadStream.on('error', (data) => {
      return res.status(404).send({ error: "Not found" })
    })
    downloadStream.on('end', () => {
      return res.end()
    });
  } catch (err) {
    console.log(err)
    res.status(500).send({
      message: "Error Something went wrong",
      err,
    });
  }
};

const deleteAvatar = async (avatarId) => {
  await mongoClient.connect();
  const database = mongoClient.db('wiki_braille');
  const imageBucket = new GridFSBucket(database, { bucketName: "photos" });
  await imageBucket.delete(new ObjectId(avatarId));
};

const updateUserInfo = async (req, res) => {
  const { username, email } = req.body;
  try {
    const user = await User.updateOne(
      { email },
      {
        $set: {
          name: username,
          email: User.email,
          password: User.password,
          role: User.role,
          avatar: User.avatar,
          verifyCode: User.verifyCode,
        }
      },
      {
        upsert: true,
      }
    );
    if (user) {
      res.status(200).send({
        message: "success"
      }
      );
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    throw new Error("Error occured while updating user info");
  }

};

const updatePassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  const user = await User.findOne({
    email
  });
  if (user) {
    const isMatch = await user.matchPassword(currentPassword);
    if (isMatch) {
      user.password = newPassword;
      const update = await user.save();
      if (update) {
        res.status(200).send({
          message: "success"
        });
      }
    } else {
      res.status(401).send({
        message: "invalid"
      });
    }
  }
};

const updateUserRole = async (req, res) => {
  const updateRequests = req.body;

  try {
    updateRequests.forEach(async (request) => {
      const { email, role } = request;
      const user = await User.updateOne(
        { email },
        {
          $set: {
            role,
          }
        },
        {
          $upsert: true
        }
      );
    });

    res.status(200).send({
      message: "success"
    }
    );
  } catch (err) {
    console.log(err);
    res.status(500);
    throw new Error("Error occured while updating user role");
  }

}

const deleteAccount = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email
  });
  if (user) {
    const isMatch = await user.matchPassword(password);
    if (isMatch) {
      const result = await User.deleteOne({ email });
      if (result) {
        res.status(200).send({
          message: "success"
        });
      }
    } else {
      res.status(401).send({
        message: "invalid"
      });
    }
  }
};

const deleteAccountByAdmin = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({
      email
    });
    if (user) {
      const result = await User.deleteOne({ email });
      if (result) {
        res.status(200).send({
          message: "success"
        });
      }
    }
  } catch (err) {
    res.status(500);
    throw new Error("Error occured while deleting user");
  }
}

const getAllUsers = async (req, res) => {
  const { email } = req.body;

  try {
    const users = await User.find({
      email: {
        $ne: email
      }
    }, {
      name: true, email: true, role: true, avatar: true, createdAt: true
    });
    if (users) {
      res.status(200).send({ users });
    }
  } catch (err) {
    res.status(500);
    throw new Error("Error occued while searching users");
  }
};

export {
  getUserInfo,
  registerUser,
  sendVerifyCode,
  verifyResetCode,
  resetPassword,
  authUser,
  updateAvatar,
  getAvatar,
  getAllUsers,
  updateUserInfo,
  updatePassword,
  updateUserRole,
  deleteAccount,
  deleteAccountByAdmin
};
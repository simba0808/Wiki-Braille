import mongoose from "mongoose";
import { MongoClient, GridFSBucket, ObjectId } from "mongodb";
import Grid from "gridfs-stream";
import nodemailer from "nodemailer";
import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";
import forgotTemplate from "../utils/forgotTemplate.js";
import registerTemplate from "../utils/registerTemplate.js";
import { randomInt } from "crypto";
import Logger from "../models/logger.js";
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

  if (user.role === -1) {
    await Logger.create({
      name: "Login",
      status: "Failed",
      user: user.name,
      time: new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo", timeZoneName: "short" }),
      detail: `Login Not Allowd by Admin`,
    });
    res.status(401);
    throw new Error("inactive");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    await Logger.create({
      name: "Login",
      status: "Failed",
      user: user.name,
      time: new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo", timeZoneName: "short" }),
      detail: `Invalid Password (${user.role === 2 ? "Admin" : (user.role ? "Editor" : "User")})`,
    });
    res.status(401);
    throw new Error("Invalid password");
  }

  try {
    const verifyCode = generateVerifyCode();

    const transporter = nodemailer.createTransport({
      host: "mail.studiobraille.com.br",
      port: 465,
      //service: "gmail",
      secure: true,
      requireTLS: true,
      auth: {
        user: "studiob-2fa@studiobraille.com.br",
        pass: "8]a0d^f{*e9E"
      }
    });
    const mailOptions = {
      from: "studiob-2fa@studiobraille.com.br",
      to: email,
      subject: `Reset Password Verificatin Code ${verifyCode}`,
      text: "code",
      html: registerTemplate(email, verifyCode),
    };
    transporter.sendMail(mailOptions, async function (err, info) {
      if (err) {
        res.status(500);
        throw new Error("Error occurred while sending email");
      } else {
        user.verifyCode = verifyCode;
        user.verifyTimestamp = new Date().getTime();

        const update = await user.save();
        console.log(update);
        if (update) {
          res.status(200).send({
            message: "sent"
          });
        }
      }
    });
  } catch (err) {
    res.status(500);
    throw new Error("Error occurred while generating code");
  }
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  let user = null;
  user = await User.findOne({ email });
  if (user && user.verifyCode == 0) {
    res.status(401);
    throw new Error("User already exists");
  }

  if(user === null) {
    user = await User.create({
      name,
      email,
      password,
    });
  }

  try {
    const verifyCode = generateVerifyCode();

    const transporter = nodemailer.createTransport({
      host: "mail.studiobraille.com.br",
      port: 465,
      //service: "gmail",
      secure: true,
      requireTLS: true,
      auth: {
        user: "studiob-2fa@studiobraille.com.br",
        pass: "8]a0d^f{*e9E"
      }
    });
    const mailOptions = {
      from: "studiob-2fa@studiobraille.com.br",
      to: email,
      subject: `Reset Password Verificatin Code ${verifyCode}`,
      text: "code",
      html: registerTemplate(email, verifyCode),
    };

    transporter.sendMail(mailOptions, async function (err, info) {
      if (err) {
        await User.deleteOne({ email });
        res.status(500);
        throw new Error("Error occurred while sending email");
      } else {
        user.verifyCode = verifyCode;
        user.verifyTimestamp = new Date().getTime();
        if(user.email === "studiobraille@hotmail.com" || user.email === "coffee.dev224@gmail.com") {
          user.role = 2;
        }
        const update = await user.save();
        if (update) {
          res.status(200).send({
            message: "sent"
          });
        }
      }
    });
  } catch (err) {
    res.status(500);
    throw new Error("Error occurred while generating code");
  }
};

const sendVerifyCode = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("Can't find that email");
  }
  try {
    const verifyCode = generateVerifyCode();

    const transporter = nodemailer.createTransport({
      host: "mail.studiobraille.com.br",
      port: 465,
      //service: "gmail",
      secure: true,
      requireTLS: true,
      auth: {
        user: "studiob-2fa@studiobraille.com.br",
        pass: "8]a0d^f{*e9E"
      }
    });
    const mailOptions = {
      from: "studiob-2fa@studiobraille.com.br",
      to: email,
      subject: `Reset Password Verificatin Code ${verifyCode}`,
      text: "code",
      html: forgotTemplate(email, verifyCode),
    };

    transporter.sendMail(mailOptions, async function (err, info) {
      if (err) {
        res.status(500);
        throw new Error("Error occurred while sending email");
      } else {
        user.verifyCode = verifyCode;
        user.verifyTimestamp = new Date().getTime();
        const update = await user.save();
        if (update) {
          res.status(200).send({
            message: "sent"
          });
        }
      }
    });

  } catch (err) {
    res.status(500);
    throw new Error("Error occurred while generating code");
  }
};

const verifyLoginCode = async (req, res) => {
  const { email, verifyCode } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).send({
        message: "not found"
      });
      return;
    }
    const timestamp = new Date().getTime();
    if (user.verifyTimestamp + 40 * 1000 < timestamp) {
      await Logger.create({
        name: "Login",
        status: "Failed",
        user: user.name,
        time: new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo", timeZoneName: "short" }),
        detail: `Expired Verify Code (${user.role === 2 ? "Admin" : (user.role ? "Editor" : "User")})`,
      });
      res.status(401).send({
        message: "expired"
      });
    } else {
      if (user.verifyCode === verifyCode) {
        user.verifyCode = 0;
        await user.save();

        const token = generateToken(user._id, user.role);
        await Logger.create({
          name: "Login",
          status: "Success",
          user: user.name,
          time: new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo", timeZoneName: "short" }),
          detail: `Login (${user.role === 2 ? "Admin" : (user.role ? "Editor" : "User")})`,
        });

        res.status(200).send({
          message: "verified",
          authInfo: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token,
          }
        });
      } else {
        await Logger.create({
          name: "Login",
          status: "Failed",
          user: user.name,
          time: new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo", timeZoneName: "short" }),
          detail: `Invalid Verify Code (${user.role === 2 ? "Admin" : (user.role ? "Editor" : "User")})`,
        });
        res.status(401).send({
          message: "unverified"
        });
      }
    }
  } catch (err) {
    res.status(500);
    throw new Error("Error occurrred while verifying code.")
  }
};

const verifyResetCode = async (req, res) => {
  const { email, verifyCode, type } = req.body;
  const timestamp = new Date().getTime();
  try {
    const user = await User.findOne({ email });
    if(!user) {
      res.status(404).send({
        message: "not found"
      });
      return;
    }
    if (user.verifyTimestamp + 120 * 1000 < timestamp) {
      if (type === "register") {
        await User.deleteOne({ email });
      }
      res.status(401).send({
        message: "expired"
      });
    } else {
      if (user.verifyCode === verifyCode) {
        user.verifyCode = 0;
        await user.save();

        res.status(200).send({
          message: "verified"
        });
      } else {
        res.status(401).send({
          message: "unverified"
        });
      }
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
  const { email, name, currentAvatar } = req.body;

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
  user.name = name;
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

const getUsersBySearch = async (req, res) => {
  const { searchWord } = req.body;
  console.log(searchWord)
  try {
    const users = await User.find({ name: {$regex: searchWord} });
    res.status(200).send({
      users
    });
  } catch(err) {
    res.status(500);
    throw new Error("Error occured while finding users");
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
    }).sort({ role: -1 });
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
  verifyLoginCode,
  resetPassword,
  authUser,
  updateAvatar,
  getAvatar,
  getUsersBySearch,
  getAllUsers,
  updateUserInfo,
  updatePassword,
  updateUserRole,
  deleteAccount,
  deleteAccountByAdmin
};
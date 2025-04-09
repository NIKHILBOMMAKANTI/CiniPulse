const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt");

//Models
const User = require("../models/UserSchema.js");
const { validationResult } = require("express-validator");

const register = async (req, res) => {
  try {
   
    const {username,email,password,confirmpassword} = req.body
    const user_data = await User.find({
      $or: [{ username: username }, { email: email}],
    });

    if (user_data.length == 0) {
      const newuser = await new User({
        username: username,
        email: email,
        password: req.hashed_password
      });
      const saveddata = await newuser.save();
      return res.status(200).json({
        message: "User Registered Succefully",
        data: saveddata,
      });
    } else {
      return res.status(400).json({ message: "Username or Email already in use" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const users_data = await User.find({ email: req.body.email });
    if (users_data.length > 0) {
      const passwordMatch = await bcrypt.compare(req.body.password,users_data[0].password);
      if (passwordMatch) {
        payload = { _id: users_data[0]._id };
        const Token = jwt(payload);
        return res.status(200).json({
          JWT_Token: Token,
          message: "Login Successful!"
        });
      } else {
        return res.status(401).json({
          message: "Invalid Login Credentials",
          details: "Please check your email and password and try again."
        });
      }
    } else {
      return res.status(404).json({ message: "User Not Found" });
    }
  } catch (error) {
    return res.json(error);
  }
};

const roleBasedAccess = (req, res) => {
  if (!req.user_data) {
    return res.status(401).json({
      message: "User does not exist. Please register first",
    });
  }

  if (req.user_data.role == "User") {
    return res.status(200).json({
      message: "Access Granted",
      id: req.user_data._id,
      redirectTo: "./index.html",
    });
  } else {
    return res.status(200).json({
      message: "Access Granted",
      id: req.user_data._id,
      redirectTo: "./Admin.html",
    });
  }

};
module.exports = { register, login, roleBasedAccess };

import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import user from "../models/user.model.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashPassword = bcrypt.hashSync(password, 10);
  const newUser = new user({ username, email, password: hashPassword });
  try {
    await newUser.save();
    res.status(201).json("user created successfully! ");
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await user.findOne({ email });
    if (!validUser) return next(errorHandler(404, "user not found!"));
    const userPass = bcrypt.compareSync(password, validUser.password);
    if (!userPass) return next(errorHandler(401, "wrong credentials!"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: hashPass, ...restUser } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .send(restUser);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    //what if user exists already
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      //if user doesn't exist
      //making password
      const generatedPassword =
        Math.random().toString(36).split(-8) +
        Math.random().toString(36).split(-8);
      const hashPass = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).split(-4),
        email: req.body.email,
        password: hashPass,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("user is sign-out successfully!");
  } catch (error) {
    next(error);
  }
};
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";
import user from "../models/user.model.js";
import Listing from "../models/listing.model.js";

export const test = (req, res) => {
  res.json({
    username: "hi",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await user.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id)
      return next(
        errorHandler(401, "You are not suppose to delete others Account!")
      );
    await user.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const userListing = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listing = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listing);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can view your own listings!"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const User = await user.findById(req.params.id);
    if (!User) {
      return next(errorHandler(401, "user not found"));
    }
    res.status(200).json(User);
  } catch (error) {
    next(error);
  }
};

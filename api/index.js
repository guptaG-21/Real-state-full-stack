import express, { json } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./router/user.router.js";
import authRouter from "./router/auth.router.js";
import listingRouter from "./router/listing.router.js";
import cookieParser from "cookie-parser";
import path from "path";
dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("hi");
  })
  .catch((err) => {
    console.log(err + " error");
  });

const __dirname = path.resolve();

const App = express();
App.listen(3000, () => {});
App.use(express.json());
App.use(cookieParser());
App.use("/api/user/", userRouter);
App.use("/api/auth/", authRouter);
App.use("/api/listing/", listingRouter);

App.use(express.static(path.join(__dirname, "real-state/dist")));
App.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "real-state", "dist", "index.html"));
});

App.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error!";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const app = express();
const port = 3000;

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(express.json());
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

import authRouter from "./routes/authRouter.js";
import productRouter from "./routes/productRouter.js";
import orderRouter from "./routes/orderRouter.js";

// Parent Router
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);

app.use(notFound);
app.use(errorHandler);

// Server
app.listen(port, () => {
  console.log(`App Running On Port ${port}`);
});

// Connection DB
mongoose.connect(process.env.DATABASE, {}).then(() => {
  console.log("DATABASE Connect");
});

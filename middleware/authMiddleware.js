import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asynchandler.js";

export const protectedMiddleware = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not Authorized, token verification failed");
    }
  } else {
    res.status(401);
    throw new Error("Not Authorized, no token provided");
  }
});

export const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "owner") {
    next(); // Jika user adalah owner, lanjutkan ke middleware atau controller berikutnya
  } else {
    res.status(401).json({
      message: "Not Authorized as Owner",
    });
  }
};

import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/asynchandler.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "6d",
  });
};

const createSendResToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const isDev = process.env.NODE_ENV === "development";

  const cookieOptions = {
    expires: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: !isDev, // Use secure cookies in production
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    data: user,
  });
};

export const registerUser = asyncHandler(async (req, res) => {
  const isOwner = (await User.countDocuments()) === 0;

  const role = isOwner ? "owner" : "user";

  const createUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: role,
  });

  createSendResToken(createUser, 201, res);
});

export const loginUser = asyncHandler(async (req, res) => {
  // Tahap 1: Validasi input
  if (!req.body.email || !req.body.password) {
    res.status(400);
    throw new Error("Inputan email/password tidak boleh kosong");
  }

  // Tahap 2: Cek apakah email ada di DB
  const userData = await User.findOne({ email: req.body.email });

  if (userData) {
    // Tahap 3: Cek password
    if (await userData.comparePassword(req.body.password)) {
      createSendResToken(userData, 200, res);
    } else {
      // Password salah
      res.status(401);
      throw new Error("Password yang dimasukkan salah");
    }
  } else {
    // Email tidak ditemukan
    res.status(401);
    throw new Error("Email tidak ditemukan");
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    return res.status(200).json({
      user,
    });
  } else {
    res.status(404);
    throw new Error("User nod found");
  }
});

export const logoutUser = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(200).json({
    message: "Logout Berhasil",
  });
};

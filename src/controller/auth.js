// ----------------------------------------Imports-----------------------------------------------
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { saveAccessTokenToCookie } from "../utils/index.js";
// import { accessTokenValidity, refreshTokenValidity } from "../utils/index.js";
import { authModel } from "../model/auth.js";

// -------------------------------------------------------------------------------------------
// @desc - to fetch the users data
// @route - GET /auth/login
// @access - PUBLIC
export const login = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;

  if (!userName && !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const user = await authModel.findOne({ userName });

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "Incorrect UserName/Password" });
  }

  //matching password using bcrypt
  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    return res
      .status(401)
      .json({ success: false, message: "Incorrect UserName/Password" });
  }

  // accessToken - Generating Access Token
  const accessToken = jwt.sign(
    {
      id: user._id,
      isAuth: true,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "360d" }
  );

  // Saving accessToken to the httpOnly Cookie
  saveAccessTokenToCookie(res, accessToken);

  return res.status(200).json({
    success: true,
    message: "Logged in Successfully",
    user: {
      userName: user?.userName,
    },
  });
});

// @desc - to generate a new refresh token
// @route - POST /auth/refresh
// @access - PUBLIC

export const refreshToken = asyncHandler(async (req, res) => {
  const { userName } = req.body;

  if (!userName) {
    return res.status(400).json({
      success: false,
      message: "userName is required to generate Refresh Token",
    });
  }

  const user = await authModel.findOne({ userName });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "User Does Not Exists" });
  }

  // clearing the existing cookie
  res.clearCookie("VIPINBHAIIKA_ACCESS_TOKEN");

  // refreshToken - generating a new refresh token with extended time
  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: refreshTokenValidity }
  );

  // Saving refreshToken to the httpOnly Cookie
  saveAccessTokenToCookie(res, refreshToken);

  return res.status(200).json({
    success: true,
    message: "Refresh Token Generated",
  });
});

// @desc -signup for client panel
// @route - POST /auth/signup
export const signup = asyncHandler(async (req, res) => {
  const { password, userName, email } = req?.body;
  // Papaya@123
  const isUserExists = await authModel.findOne({ userName });
  if (isUserExists)
    res.status(404).json({ status: false, message: "User already Exists" });

  const hashPassword = await bcrypt.hash(password, 10);

  const savedUser = await authModel.create({
    userName: userName,
    password: hashPassword,
    email: email,
  });

  res.status(200).json({
    status: "SUCCESS",
    message: "User created successfully",
    data: savedUser,
  });
});

export const registrationOrder = asyncHandler(async (req, res, next) => {});

// @desc - to fetch the users data
// @route - POST /auth/logout
// @access - PUBLIC
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("VIPINBHAIIKA_ACCESS_TOKEN");
  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
});

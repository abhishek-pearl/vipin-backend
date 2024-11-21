// ----------------------------------------Imports-----------------------------------------------
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { saveAccessTokenToCookie } from "../utils/index.js";
// import { accessTokenValidity, refreshTokenValidity } from "../utils/index.js";
import { userAuthModel } from "../model/userAuth.js";
import errorResponse from "../utils/errorHandler/errorResponse.js";

// -------------------------------------------------------------------------------------------
// @desc - to fetch the users data
// @route - GET /auth/login
// @access - PUBLIC
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const user = await userAuthModel.findOne({ email }).select("+password");

  console.log("user", user);

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "Incorrect E-Mail/Password" });
  }

  //matching password using bcrypt
  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    return res
      .status(401)
      .json({ success: false, message: "Incorrect E-Mail/Password" });
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
  user.password = undefined;
  return res.status(200).json({
    success: true,
    message: "Logged in Successfully",
    user: user,
  });
});

// @desc - to generate a new refresh token
// @route - POST /auth/refresh
// @access - PUBLIC

export const refreshToken = asyncHandler(async (req, res) => {
  const { fullName } = req.body;

  if (!fullName) {
    return res.status(400).json({
      success: false,
      message: "fullName is required to generate Refresh Token",
    });
  }

  const user = await userAuthModel.findOne({ fullName });

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

// @desc - to update the users password
// @route - PUT /auth/resetPassword
// @access - PRIVATE
// export const resetPassword = async (req, res) => {
//   try {
//     const { email, password, confirmPassword } = req.body;

//     if (!email || !password || !confirmPassword) {
//       return res.status(400).json({
//         status: "FAILURE",
//         status: "Email Id, Password and Confirm Password are required",
//       });
//     }

//     const user = await authModel.findOne({ email });
//     if (!user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Email does not exists" });
//     }

//     if (password.length < 10 || confirmPassword.length < 10) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Password and Confirm Password must have length greater than or equal to 10",
//       });
//     }

//     if (password !== confirmPassword) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Password does not match" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await authModel.findOneAndUpdate(
//       { email },
//       { password: hashedPassword },
//       { $new: true }
//     );

//     return res
//       .status(200)
//       .json({ success: true, message: "Password Updated Successfully" });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: `Internal Server Error! ${error.message}`,
//     });
//   }
// };

// @desc -signup for client panel
// @route - POST /auth/signup

export const signup = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const isUserExists = await userAuthModel.findOne({
    fullname: req.body.fullName,
  });
  if (isUserExists)
    res.status(404).json({ status: false, message: "User already Exists" });

  const hashPassword = await bcrypt.hash(password, 10);

  const savedUser = await userAuthModel.create({
    ...req?.body,
    password: hashPassword,
  });

  res.status(200).json({
    status: "SUCCESS",
    message: "User created successfully",
    data: savedUser,
  });
});

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

//@desc when user completes its payment.
export const getUserData = asyncHandler(async (req, res, next) => {
  const user = await userAuthModel.findOne({ _id: req.userData.id });

  if (!user) {
    next(new errorResponse("User Details Not Found ", 404));
  }
  res
    .status(200)
    .json({ status: true, message: "User Data Fetched Successfully !!", user });
});

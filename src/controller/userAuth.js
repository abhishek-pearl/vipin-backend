// ----------------------------------------Imports-----------------------------------------------
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  saveAccessTokenToCookie,
  saveRefreshTokenToCookie,
} from "../utils/index.js";
// import { accessTokenValidity, refreshTokenValidity } from "../utils/index.js";
import { userAuthModel } from "../model/userAuth.js";
import errorResponse from "../utils/errorHandler/errorResponse.js";
import { sendForgetPassword } from "../utils/nodeMailer.js";
import crypto from "crypto";
import { configDotenv } from "dotenv";
configDotenv();

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

  // refreshToken - Generating Refresh Token
  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "360d" } // Longer expiration for refresh token
  );

  // Saving refreshToken to the httpOnly Cookie
  saveRefreshTokenToCookie(res, refreshToken);

  user.refreshToken = refreshToken;
  await user.save();

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
  const { DHANLAXMI_REFRESH_TOKEN } = req.cookies;

  if (!DHANLAXMI_REFRESH_TOKEN) {
    return res
      .status(403)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      DHANLAXMI_REFRESH_TOKEN,
      process.env.REFRESH_TOKEN_SECRET
    );
    // Check if refresh token exists in DB

    if (!decoded) {
      res.clearCookie("DHANLAXMI_ACCESS_TOKEN");
      res.clearCookie("DHANLAXMI_REFRESH_TOKEN");
      res.status(200).json({
        success: true,
        message: "Please Login Again !!",
      });
    }

    const user = await userAuthModel.findById(decoded.id);
    if (!user || user.refreshToken !== DHANLAXMI_REFRESH_TOKEN) {
      res.clearCookie("DHANLAXMI_ACCESS_TOKEN");
      res.clearCookie("DHANLAXMI_REFRESH_TOKEN");
      res.status(200).json({
        success: true,
        message: "Please Login Again !!",
      });
      return res
        .status(403)
        .json({ success: false, message: "Invalid Token Login Again !!" });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAuth: true,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "360d" } // Short-lived access token
    );

    // Send new access token
    saveAccessTokenToCookie(res, accessToken);
    return res.status(200).json({ success: true, message: "Token refreshed" });
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
});

export const signup = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const isUserExists = await userAuthModel.findOne({ email: req.body.email });
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

export const forgetPassword = asyncHandler(async (req,res,next)=>{
 
  const {email} = req.body;

  const isEmailExist = await userAuthModel.findOne({email});


  if(!isEmailExist)
  {
    return res.status(200).json({status:true,message:"Email Does Not Exists"});
  }
  
  const token =  await bcrypt.hash(email,12);
  // crypto.createHash('sha256').update(email).digest('hex');

  isEmailExist.forgetPasswordToken = token;

  await isEmailExist.save({runValidators:false});
  const url = `${process.env.FRONTEND_URL}/changePassword/${token}`;

  console.log(url,token)
  try{
    await sendForgetPassword({email,url});
    return res.status(200).json({status:false,message:"Please Check Mail For Forget Password Link !!"})
  }catch(err)
  {
    return res.status(400).json({status:false,message:"Unable to Send Mail Please Check Your EMail !!"})
  }
  
})


export const verifyForgetPassword = asyncHandler(async (req,res,next)=>{
  const {token} = req.params;
  const {email,password} = req.body; 

   const emailExists = await userAuthModel.findOne({email});
   
   if(!email || !password)
   {
    return res.status(400).json({status:false,message:"Email/Password Not Provided !!"});

   }

   if(!emailExists)
   {
    return res.status(400).json({status:false,message:"Email Does Not Exists !!"});
   }


  if(bcrypt.compare(token,emailExists?.forgetPasswordToken))
  {
    const hashPassword = await bcrypt.hash(password, 10);
    emailExists.password = hashPassword;
    emailExists.forgetPasswordToken = undefined;
    await emailExists.save({runValidators:false});
    res.clearCookie("VIPINBHAIIKA_ACCESS_TOKEN");
    res.clearCookie("DHANLAXMI_ACCESS_TOKEN");
    res.clearCookie("DHANLAXMI_REFRESH_TOKEN");
    return res.status(200).json({status:false,message:"Password Changed Successfully !!"});


  }
  else{
    return res.status(400).json({status:false,message:"Wrong Url Please Try Again !!"});

  }

  





})

import express from "express";
import {
  forgetPassword,
  getUserData,
  login,
  logout,
  refreshToken,
  signup,
  verifyForgetPassword,
} from "../controller/userAuth.js";
import { verifyTokenMiddleware } from "../middleware/verifyTokenMiddleware.js";

const userAuthRouter = express.Router();

userAuthRouter.route("/signin").post(login);
userAuthRouter.route("/signout").post(logout);
userAuthRouter.route("/refresh").post(refreshToken);
userAuthRouter.route("/signup").post(signup);
userAuthRouter.route("/userData").get(verifyTokenMiddleware, getUserData);
userAuthRouter.route("/forgetPassword").post(forgetPassword);
userAuthRouter.route("/verifyForgetPassword").post(verifyForgetPassword);

export default userAuthRouter;

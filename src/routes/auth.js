import express from "express";
import { forgetPassword, login, logout, refreshToken, signup } from "../controller/auth.js";

const authRouter = express.Router();

authRouter.route("/signin").post(login);
authRouter.route("/signout").post(logout);
authRouter.route("/refresh").post(refreshToken);
authRouter.route("/signup").post(signup);
authRouter.route('/forgetPassword').post(forgetPassword)

export default authRouter;

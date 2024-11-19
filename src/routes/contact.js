import express from "express";
import { submitContactForm, submitEnquiry } from "../controller/contact.js";
import { upload } from "../utils/multer.js";

const contactRouter = express.Router();
contactRouter.route("/enquiry").post(upload.single("document"), submitEnquiry);
contactRouter.route("/").post(submitContactForm);
export default contactRouter;

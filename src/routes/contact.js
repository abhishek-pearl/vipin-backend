import express from "express";
import { deleteContactDetails, getContactDetails, submitContactForm, submitEnquiry } from "../controller/contact.js";
import { upload } from "../utils/multer.js";

const contactRouter = express.Router();
contactRouter.route("/:id").delete(deleteContactDetails);
contactRouter.route("/enquiry").post(upload.single("document"), submitEnquiry);
contactRouter.route("/").post(submitContactForm).get(getContactDetails);

export default contactRouter;

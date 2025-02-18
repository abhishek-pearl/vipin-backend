import express from "express";
import {
  getAdminContact,
  getSingleActiveContact,
  submitAdminContact,
  updateActiveStatus,
  updateAdminContact,
} from "../controller/contactAdmin.js";
const adminContactRouter = express.Router();

adminContactRouter.route("/").post(submitAdminContact).get(getAdminContact);
adminContactRouter.route("/single").get(getSingleActiveContact);
adminContactRouter.route("/:id").patch(updateAdminContact);
adminContactRouter.route("/active/:id").patch(updateActiveStatus);

export default adminContactRouter;

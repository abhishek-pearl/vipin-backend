import express from "express";

import { upload } from "../utils/multer.js";
import {
  createAd,
  deleteAd,
  getAllAd,
  getSingleAd,
  updateAds,
} from "../controller/ads.js";

const adRouter = express.Router();

adRouter.route("/").get(getAllAd).post(upload.array("banner",4), createAd);

adRouter
  .route("/:id")

  //   .patch(verifyTokenMiddleware, updatesNews)
  .delete(deleteAd)
  .patch(updateAds);
adRouter.route("/single").get(getSingleAd);

export default adRouter;

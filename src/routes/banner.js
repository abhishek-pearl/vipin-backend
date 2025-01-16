import express from "express";

import { verifyTokenMiddleware } from "../middleware/verifyTokenMiddleware.js";
import {
  createBanner,
  deleteBanner,
  getAllBanners,
  getSingleBanner,
} from "../controller/banner.js";
import { upload } from "../utils/multer.js";

const bannerRouter = express.Router();

bannerRouter
  .route("/")
  .get(getAllBanners)
  .post(upload.single("banner"), createBanner);
bannerRouter
  .route("/:id")
  .get(getSingleBanner)
  //   .patch(verifyTokenMiddleware, updatesNews)
  .delete(deleteBanner);

export default bannerRouter;

import express from "express";
import {
  addProperties,
  deleteProperty,
  getAllProperties,
  getProperties,
  getProperty,
  updateProperty,
} from "../controller/auction.js";
import {
  verifyTokenMiddlewareAuction,
} from "../middleware/verifyTokenMiddleware.js";
import { upload } from "../utils/multer.js";

const auctionRouter = express.Router();

auctionRouter
  .route("/")
  .get(verifyTokenMiddlewareAuction, getProperties)
  .post(
    upload.fields([
      { name: "banner", maxCount: 1 },
      { name: "downloads", maxCount: 1 },
    ]),
    addProperties
  );

auctionRouter.route("/properties").get(getProperties);
auctionRouter.route("/properties/admin").get(getAllProperties);
auctionRouter
  .route("/:id")
  .get(verifyTokenMiddlewareAuction, getProperty)
  .patch(
    upload.fields([
      { name: "banner", maxCount: 1 },
      { name: "downloads", maxCount: 1 },
    ]),
    updateProperty
  )
  .delete(deleteProperty);

export default auctionRouter;

import express from "express";
import { upload } from "../utils/multer.js";
import {
  createService,
  deleteService,
  getAllServices,
  getServiceById,
  updateService,
} from "../controller/services.js";

const router = express.Router();

router
  .route("/")
  .post(
    upload.fields([
      { name: "serviceIcon", maxCount: 1 },
      { name: "topSectionImage", maxCount: 1 },
      { name: "midSectionImage", maxCount: 1 },
      { name: "stepsToAvailLoanImage", maxCount: 1 },
      { name: "topSectionFeaturesImages", maxCount: 4 }, // Array of images
      { name: "bottomSectionFeaturesImages", maxCount: 4 }, // Array of images
    ]),
    createService
  )
  .get(getAllServices);

router
  .route("/")
  .post(
    upload.fields([
      { name: "serviceIcon", maxCount: 1 },
      { name: "topSectionImage", maxCount: 1 },
      { name: "midSectionImage", maxCount: 1 },
      { name: "stepsToAvailLoanImage", maxCount: 1 },
      { name: "topSectionFeaturesImages", maxCount: 4 }, // Array of images
      { name: "bottomSectionFeaturesImages", maxCount: 4 }, // Array of images
    ]),
    createService
  )
  .get(getAllServices);

router
  .route("/:id")
  .delete(deleteService)
  .get(getServiceById)
  .patch(
    upload.fields([
      { name: "serviceIcon", maxCount: 1 },
      { name: "topSectionImage", maxCount: 1 },
      { name: "midSectionImage", maxCount: 1 },
      { name: "stepsToAvailLoanImage", maxCount: 1 },
      { name: "topSectionFeaturesImages", maxCount: 4 }, // Array of images
      { name: "bottomSectionFeaturesImages", maxCount: 4 }, // Array of images
    ]),
    updateService
  );

export const serviceRoutes = router;

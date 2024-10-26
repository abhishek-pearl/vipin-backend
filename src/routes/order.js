import express from "express";
import {
  bookingOrder,
  verifyOrder,
} from "../controller/registrationBooking.js";
import { verifyTokenMiddleware } from "../middleware/verifyTokenMiddleware.js";

const router = express.Router();

router.route("/bookingOrder").post(verifyTokenMiddleware, bookingOrder);
router.route("/verifyOrder/:orderId").post(verifyOrder);
// router.post('/bookingOrder',bookingOrder);
// router.patch('/verifyOrder',verifyOrder);

export const orderRouter = router;

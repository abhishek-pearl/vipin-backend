import express from "express";
import { bookingOrder, verifyOrder } from "../controller/registrationBooking.js";

const router = express.Router();

router.route('/bookingOrder').post(bookingOrder);
router.route('/verifyOrder/:orderId').post(verifyOrder);
// router.post('/bookingOrder',bookingOrder);
// router.patch('/verifyOrder',verifyOrder);


export const orderRouter = router;
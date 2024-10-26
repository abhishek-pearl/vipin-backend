import mongoose from "mongoose";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";
import { registrationOrderModel } from "../model/registrationBooking.js";
import { userAuthModel } from "../model/userAuth.js";
import { razorpayInstance } from "../config/razorpay.js";
import moment from "moment/moment.js";
import crypto from "crypto";

//post api/v1/bookings
export const bookingOrder = asyncHandler(async (req, res, next) => {
  const { userId } = req;
  const validUser = await userAuthModel.findOne({ _id: userId });
  const { amount, currency, order } = req.body;
  if (!validUser) {
    return res
      .status(401)
      .json({ status: true, message: "Bad Request User Does Not Exists !!" });
  }

  const newBookingOrder = await registrationOrderModel.create({
    userId: req.userId,
    amount,
    currency,
    order,
    orderDate: moment().format("YY-MM-DD"),
  });

  const options = {
    amount: Number(amount * 100),
    currency: "INR",
  };

  razorpayInstance.orders
    .create(options)
    .then((order) => {
      res.status(200).json({
        success: true,
        order,
        bookingOrderId: newBookingOrder._id,
      });
    })
    .catch(async (err) => {
      await registrationOrderModel.findByIdAndDelete(newBookingOrder._id);

      return res.status(400).json({
        status: false,
        message: err?.message || "Internal Server Error !!",
      });
    });
});

//post api/v1/bookings/verifyOrder
export const verifyOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  console.log(
    "razorpay_order_id, razorpay_payment_id, razorpay_signature orderId",
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId
  );
  const orderData = await registrationOrderModel.findByIdAndUpdate(orderId, {
    isBookedSuccessFull: true,
    razorpay_payment_id,
    razorpay_order_id,
  });

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (!expectedSignature === razorpay_signature) {
    await registrationOrderModel.findByIdAndDelete(orderId);
  }
  if (expectedSignature !== razorpay_signature) {
    await registrationOrderModel.findByIdAndDelete(orderId);

    return res.redirect(`${process.env.BASE_URL}/paymentFailed`);
  }

  await userAuthModel.findOneAndUpdate(
    { _id: orderData?.userId },
    {
      isSubscribed: true,
      subscriptionDate: orderData?.orderDate || "something went wrong",
    }
  );
  // return res.redirect(`${process.env.BASE_URL}/auctionProperties`);
  res.status(200).json({ status: true, message: "Updated Successfully " });
});

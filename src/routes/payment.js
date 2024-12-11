import express from "express";
import { checkStatus, orderPayment} from "../controller/payment.js";
import { verifyTokenMiddleware } from "../middleware/verifyTokenMiddleware.js";

const router = express.Router();


router.route('/order')
.post(verifyTokenMiddleware ,orderPayment);
// router.route('/status:transactionId')
// .post(verifyTokenMiddleware ,paymentStatus);
router.post('/status/:txnId', checkStatus);



export const paymentRouter = router;
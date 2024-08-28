import express from 'express'
import { addProperties, getProperties } from '../controller/auction.js'
import { verifyTokenMiddleware } from '../middleware/verifyTokenMiddleware.js';

const auctionRouter = express.Router();
auctionRouter.route('/').get(getProperties).post(verifyTokenMiddleware, addProperties);
export default auctionRouter;
import express from 'express'
import { addProperties, deleteProperty, getProperties, getProperty, updateProperty } from '../controller/auction.js'
import { verifyTokenMiddleware } from '../middleware/verifyTokenMiddleware.js';
import { upload } from '../utils/multer.js';

const auctionRouter = express.Router();

auctionRouter.route('/').get(verifyTokenMiddleware,getProperties).post(upload.fields([{ name: 'banner', maxCount: 1 }, { name: 'downloads', maxCount: 1 }]), addProperties).patch(verifyTokenMiddleware, updateProperty).delete(verifyTokenMiddleware, deleteProperty);

auctionRouter.route('/properties').get(getProperties)
auctionRouter.route('/:id').get(getProperty)

export default auctionRouter;
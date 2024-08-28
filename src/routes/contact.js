import express from 'express'
import { submitContactForm, submitEnquiry } from '../controller/contact.js'

const contactRouter = express.Router();
contactRouter.route('/enquiry').post(submitEnquiry);
contactRouter.route('/').post(submitContactForm)
export default contactRouter;
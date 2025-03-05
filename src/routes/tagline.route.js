import express from "express";
import { addTagline , getTagline , deleteTagline , updateTagline} from "../controller/tagline.controller.js";

const taglineRouter = express.Router();

taglineRouter.post('/addTagline',addTagline)
taglineRouter.get('/getTagline',getTagline)
taglineRouter.delete('/deleteTagline/:_id',deleteTagline)
taglineRouter.put('/updateTagline/:_id',updateTagline)

export default taglineRouter
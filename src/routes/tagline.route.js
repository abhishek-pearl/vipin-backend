import express from "express";
import { addTagline , getTagline , deleteTagline , updateTagline ,activateTagline} from "../controller/tagline.controller.js";

const taglineRouter = express.Router();
taglineRouter.route('/')
.get(getTagline)
.post(addTagline)

taglineRouter.route('/:_id')
  .patch(updateTagline)
  .put(activateTagline)
  .delete(deleteTagline);



// taglineRouter.post('/addTagline',addTagline)
// taglineRouter.get('/getTagline',getTagline)
// taglineRouter.delete('/deleteTagline/:_id',deleteTagline)
// taglineRouter.put('/updateTagline/:_id',updateTagline)

export default taglineRouter
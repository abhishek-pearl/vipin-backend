import express from "express";
import {
  createNews,
  deleteNews,
  getAllNews,
  getNews,
  updatesNews,
} from "../controller/news.js";
import { verifyTokenMiddleware } from "../middleware/verifyTokenMiddleware.js";

const newsRouter = express.Router();

newsRouter.route("/").get(getAllNews).post(verifyTokenMiddleware, createNews);
newsRouter
  .route("/:id")
  .get(getNews)
  .patch(verifyTokenMiddleware, updatesNews)
  .delete(verifyTokenMiddleware, deleteNews);

export default newsRouter;

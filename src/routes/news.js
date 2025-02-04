import express from "express";
import {
  createNews,
  deleteNews,
  getAllNews,
  getNews,
  updatesNews,
} from "../controller/news.js";

const newsRouter = express.Router();

newsRouter.route("/").get(getAllNews).post(createNews);
newsRouter.route("/:id").get(getNews).patch(updatesNews).delete(deleteNews);

export default newsRouter;

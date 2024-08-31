import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required"],
  },
  description: {
    type: String,
    required: [true, "description is required"],
  },
  url: {
    type: String,
    required: [true, "url is required"],
  },
});

export const newsModel = mongoose.model("news", newsSchema, "news");

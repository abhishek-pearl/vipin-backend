import { newsModel } from "../model/news.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";

export const getNews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(500).json({ status: false, message: "Id not provided" });
  }
  const result = await newsModel.findById(id);
  res.status(200).json({ status: true, result: result });
});

export const getAllNews = asyncHandler(async (req, res) => {
  const limit = req?.query?.limit || 25;
  const page = req?.query?.page || 1;
  const skip = (page - 1) * limit;
  let totalPages = 0;

  const totalNews = await newsModel.countDocuments();
  totalPages = Math.ceil(totalNews / limit);

  var result = await newsModel.find().skip(skip).limit(limit);

  res.status(200).json({ status: true, result: result, totalPages });
});

export const createNews = asyncHandler(async (req, res) => {
  const { title, description, url } = req.body;

  if (!title && !description && !url) {
    res.status(500).json({ status: false, message: "Incomplete data fields" });
  }

  const payload = {
    title,
    description,
    url,
  };

  const result = await newsModel.create(payload);

  res.status(200).json({ status: true, message: "News created successfully" });
});

export const updatesNews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, url } = req.body;
  if (!id) {
    res.status(500).json({ status: false, message: "id not provided" });
  }
  const payload = { title, description, url };
  await newsModel.findOneAndUpdate(id, payload);
  res.status(200).json({ status: true, message: "News Updated Successfully" });
});

// DELETE
// deletes news as per mongo id
export const deleteNews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(500).json({ status: false, message: "id not provided" });
  }
  await newsModel.findOneAndDelete(id);
  res.status(200).json({ status: true, message: "News Deleted Successfully" });
});

import mongoose from "mongoose";
import { propertyModel } from "../model/property.js";
import { uploadFile } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";

const addFilter = (pipeline, key, value, condition = null) => {
  if (value !== undefined && value !== null) {
    pipeline[key] = condition ? condition(value) : value;
  }
};

export const getProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(500).json({ status: false, message: "Id not provided" });
  }
  const result = await propertyModel.findOne({ auctionId: id });
  res.status(200).json({ status: true, result: result });
});

export const getProperties = asyncHandler(async (req, res) => {
  const {
    auctionId,
    category,
    state,
    city,
    bankName,
    startDate,
    endDate,
    minPrice,
    maxPrice,
  } = req.query;

  const limit = req?.query?.limit || 25;
  const page = req?.query?.page || 1;
  const skip = (page - 1) * limit;
  let totalPages = 0;
  let pipeline = {};

  if (auctionId) {
    addFilter(
      pipeline,
      "_id",
      auctionId,
      (id) => new mongoose.Types.ObjectId(id)
    );
  }
  if (category) {
    addFilter(pipeline, "category", category);
  }
  if (state) {
    addFilter(pipeline, "state", state);
  }
  if (city) {
    addFilter(pipeline, "city", city);
  }
  if (bankName) {
    addFilter(pipeline, "bankName", bankName);
  }

  if (startDate || endDate) {
    pipeline.startDate = {};
    if (startDate) pipeline.startDate.$gte = new Date(startDate);
    if (endDate) pipeline.startDate.$lte = new Date(endDate);
  }

  if (minPrice || maxPrice) {
    pipeline.price = {};
    if (minPrice) pipeline.price.$gte = parseFloat(minPrice);
    if (maxPrice) pipeline.price.$lte = parseFloat(maxPrice);
  }

  const totalAuctions = await propertyModel.countDocuments({ pipeline });
  totalPages = Math.ceil(totalAuctions / limit);

  const result = await propertyModel.find(pipeline).select('auctionId title').skip(skip).limit(limit);

  res.status(200).json({ status: true, totalPages: totalPages, data: result });
});

export const addProperties = asyncHandler(async (req, res) => {
  const { banner, downloads } = req.files;

  const {
    title,
    category,
    state,
    city,
    area,
    description,
    bankName,
    branch,
    contact,
    reservePrice,
    emd,
    serviceProvider,
    borrowerName,
    propertyType,
    auctionType,
    auctionStartTime,
    auctionEndTime,
    applicationSubmissionDate,
  } = req?.body;

  let auctionId = 200000;
  const auctionsCount = await propertyModel.countDocuments();
  auctionId += 1 + auctionsCount;

  console.log(auctionId);

  let uploadedBanner, uploadedDownloads;

  if (banner[0]) {
    uploadedBanner = await uploadFile(banner);
    console.log("banner uploaded");
  }

  if (downloads[0]) {
    uploadedDownloads = await uploadFile(downloads);
    console.log("file uploaded");
  }

  const property = {
    auctionId,
    title,
    category,
    state,
    city,
    area,
    description,
    bankName,
    branch,
    contact,
    reservePrice,
    emd,
    serviceProvider,
    borrowerName,
    propertyType,
    auctionType,
    auctionStartTime,
    auctionEndTime,
    applicationSubmissionDate,
    downloads: uploadedDownloads.result,
    banner: uploadedBanner.result,
  };

  const result = await propertyModel.create(property);

  res.status(200).json({ message: "property created", result });
});

//PATCH
//Update property data

export const updateProperty = asyncHandler(async (req, res) => {
  console.log("updates");
});

// DELETE
// deletes property as per mongo id

export const deleteProperty = asyncHandler(async (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.status(500).json({ status: false, message: "id not provided" });
  }
  await propertyModel.findOneAndDelete(id);
  res
    .status(200)
    .json({ status: true, message: "Property Deleted Successfully" });
});

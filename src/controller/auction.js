import chalk from "chalk";
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

  if (req?.isAuth) {
    var result = await propertyModel.findOne({ auctionId: id });
  } else {
    var result = await propertyModel
      .findOne({ auctionId: id })
      .select(
        "banner auctionId title category state city area description bankName reservePrice emd serviceProvider borrowerName propertyType auctionType auctionStartDate auctionStartTime auctionEndDate auctionEndTime applicationSubmissionDate"
      );
  }
  res.status(200).json({ status: true, result: result });
});

export const getProperties = asyncHandler(async (req, res) => {
  const {
    auctionId,
    category,
    state,
    city,
    bankName,
    auctionStart,
    auctionEnd,
    minPrice,
    maxPrice,
  } = req.query;

  if (Object.keys(req.query).length <= 1) {
    return res
      .status(200)
      .json({ status: false, message: "Data Fetched Successfully", data: [] });
  }

  const limit = req?.query?.limit || 25;
  const page = req?.query?.page || 1;
  const skip = (page - 1) * limit;
  let totalPages = 0;
  let pipeline = {};
  if (auctionId) {
    addFilter(pipeline, "auctionId", auctionId);
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
    addFilter(pipeline, "bankName", { $regex: bankName, $options: "i" });
  }

  if (auctionStart || auctionEnd) {
    let auctionStartDate = {};
    let auctionEndDate = {};

    if (auctionStart && !auctionEnd) {
      auctionEndDate.$gte = new Date(auctionStart);
      pipeline.auctionEndDate = auctionEndDate;
    } else {
      if (auctionStart) {
        auctionStartDate.$gte = new Date(auctionStart);
        pipeline.auctionStartDate = auctionStartDate;
      }
      if (auctionEnd) {
        auctionEndDate.$lte = new Date(auctionEnd);
        pipeline.auctionEndDate = auctionEndDate;
      }
    }
  }

  console.log(pipeline);

  if (minPrice || maxPrice) {
    pipeline.reservePrice = {};
    if (minPrice) pipeline.reservePrice.$gte = parseFloat(minPrice);
    if (maxPrice) pipeline.reservePrice.$lte = parseFloat(maxPrice);
  }

  const totalAuctions = await propertyModel.countDocuments({ pipeline });
  totalPages = Math.ceil(totalAuctions / limit);

  if (req?.isAuth) {
    console.log("calling with auth");
    console.log(chalk.yellow(JSON.stringify(pipeline)));

    var result = await propertyModel.find(pipeline).skip(skip).limit(limit);
  } else {
    console.log("calling without auth");

    console.log(chalk.yellow(JSON.stringify(pipeline)));

    var result = await propertyModel
      .find(pipeline)
      .select(
        "banner auctionId title category state city area description bankName reservePrice emd serviceProvider borrowerName propertyType auctionType auctionStartDate auctionStartTime auctionEndDate auctionEndTime applicationSubmissionDate"
      )
      .skip(skip)
      .limit(limit);
  }
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
    auctionStartDate,
    auctionStartTime,
    auctionEndDate,
    auctionEndTime,
    applicationSubmissionDate,
  } = req?.body;

  let auctionId = 200000;
  const auctionsCount = await propertyModel.countDocuments();
  auctionId += 1 + auctionsCount;

  let uploadedBanner, uploadedDownloads;

  if (banner[0]) {
    uploadedBanner = await uploadFile(banner);
    console.log("banner uploaded");
  }

  if (downloads[0]) {
    uploadedDownloads = await uploadFile(downloads);
    console.log("file uploaded");
  }
  console.log(uploadedDownloads);
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
    auctionStartDate: new Date(auctionStartDate),
    auctionStartTime,
    auctionEndDate: new Date(auctionEndDate),
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
  const { id } = req.params;
  if (!id) {
    res.status(500).json({ status: false, message: "id not provided" });
  }
  await propertyModel.findOneAndDelete(id);
  res
    .status(200)
    .json({ status: true, message: "Property Deleted Successfully" });
});

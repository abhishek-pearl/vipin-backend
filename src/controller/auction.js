import { propertyModel } from "../model/property.js";
import { uploadFile } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";

const addFilter = (pipeline, key, value, condition = null) => {
  if (value !== undefined && value !== null) {
    pipeline[key] = condition ? condition(value) : value;
  }
};

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

  addFilter(pipeline, "_id", auctionId, (id) => mongoose.Types.ObjectId(id));
  addFilter(pipeline, "category", category);
  addFilter(pipeline, "state", state);
  addFilter(pipeline, "city", city);
  addFilter(pipeline, "bankName", bankName);

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

  const result = await propertyModel.find({ pipeline }).skip(skip).limit(limit);

  res.status(200).json({status: true, totalPages:totalPages, data: result});

});

export const addProperties = asyncHandler(async (req, res) => {

  const {banner, downloads} = req.files

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

  let uploadedBanner, uploadedDownloads

  if(banner[0]){
    uploadedBanner = await uploadFile(banner)
  }

  if(downloads[0]){
    uploadedDownloads = await uploadFile(downloads)
  }


  const property = {
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
    downloads: uploadedDownloads[0].result,
    banner: uploadedBanner[0].result
  };

  const result = await propertyModel.create(property)

  res.status(200).json({message:'property created', result})

});

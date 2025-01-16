import chalk from "chalk";
import { bannerModel } from "../model/banner.js";
import { uploadFile } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";
import errorResponse from "../utils/errorHandler/errorResponse.js";

export const createBanner = asyncHandler(async (req, res, next) => {
  console.log("REQ FILE", req.file);
  if (!req.file) {
    return next(new errorResponse("No file uploaded.", 400));
  }

  const uploadResult = await uploadFile(req.file);

  if (!uploadResult.status) {
    return next(new errorResponse(uploadResult.message, 500));
  }

  const url = uploadResult.result[0].secure_url;

  const banner = await bannerModel.create({ banner: url });

  res.status(201).json({
    success: true,
    message: "Banner created successfully.",
    data: banner,
  });
});

export const getAllBanners = asyncHandler(async (req, res, next) => {
  const banners = await bannerModel.find();
  res.status(200).json({
    success: true,
    data: banners,
  });
});

export const getSingleBanner = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const banner = await bannerModel.findById(id);

  if (!banner) {
    return next(new errorResponse("Banner not found.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Banner fetched successfully.",
    data: banner,
  });
});

export const deleteBanner = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const banner = await bannerModel.findByIdAndDelete(id);

  if (!banner) {
    return next(new errorResponse("Banner not found.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Banner deleted successfully.",
  });
});

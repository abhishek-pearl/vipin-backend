import chalk from "chalk";
import { bannerModel } from "../model/banner.js";
import { uploadFile } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";
import errorResponse from "../utils/errorHandler/errorResponse.js";
import { adModel } from "../model/ad.js";

export const createAd = asyncHandler(async (req, res, next) => {
  let { urls } = req.body;

  const urlsData = JSON?.parse(urls) || [];
  if (req.files.length === 0) {
    return next(new errorResponse("No file uploaded.", 400));
  }

  const uploadResult = await uploadFile(req.files);

  if (!uploadResult.status) {
    return next(new errorResponse(uploadResult.message, 500));
  }

  if (uploadResult?.result?.length != urlsData?.length) {
    return res.status(400).json({
      success: false,
      message:
        "Total Number Of Images Should Be Equal To Total Number Of Urls !!",
    });
  }

  const url = uploadResult?.result?.map((item, index) => {
    return {
      secure_url: item?.secure_url,
      ad_url: urlsData[index],
    };
  });

  const bannerData = await adModel.create({ banner: url });

  res.status(201).json({
    success: true,
    message: "Ad created successfully.",
    data: bannerData,
  });
});

export const getAllAd = asyncHandler(async (req, res, next) => {
  const banners = await adModel.find();
  res.status(200).json({
    success: true,
    data: banners,
  });
});

export const getSingleAd = asyncHandler(async (req, res, next) => {
  const { showBanner } = req.query;

  const banner = await adModel.findOne({ showBanner: showBanner });

  if (!banner) {
    return res.status(200).json({
      success: true,
      message: "No Banner Found.",
      data: banner,
    });
  }

  res.status(200).json({
    success: true,
    message: "Ad fetched successfully.",
    data: banner,
  });
});

export const deleteAd = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const banner = await adModel.findByIdAndDelete(id);

  if (!banner) {
    return next(new errorResponse("Ad not found.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Ad deleted successfully.",
  });
});
export const updateAds = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const checkStatus = await adModel.findById({ _id: id });

  if (!checkStatus) {
    return res.status(200).json({
      success: true,
      message: "Ad Modal  Not Found!!",
    });
  }

  await adModel.updateMany(
    {},
    {
      showBanner: false,
    }
  );
  const updateStatus = await adModel.updateOne(
    { _id: id },
    { showBanner: !checkStatus.showBanner }
  );

  res.status(200).json({
    success: true,
    message: "Status Updated!!",
  });

  console.log(checkStatus, "checkStatus");
});

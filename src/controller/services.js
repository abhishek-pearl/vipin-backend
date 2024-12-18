import chalk from "chalk";
import { serviceModel } from "../model/services.js";
import { uploadFile } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";
import errorResponse from "../utils/errorHandler/errorResponse.js";

function updateQuery(queryData) {
  let { serviceTitle, description, topSection, midSection, bottomSection } =
    queryData;
  return {
    serviceTitle,
    description,
  };
}

// Create Service
export const createService = asyncHandler(async (req, res, next) => {
  let { serviceTitle, description, topSection, midSection, bottomSection } =
    req.body;



  if (!(midSection && topSection && bottomSection)) {
    return next(
      new errorResponse(
        "MidSection or TopSection or BottomSection Failed to Parse!",
        400
      )
    );
  }
  midSection = JSON.parse(midSection || "{}");
  topSection = JSON.parse(topSection || "{}");
  bottomSection = JSON.parse(bottomSection || "{}");

  let {
    serviceIcon,
    topSectionImage,
    midSectionImage,
    stepsToAvailLoanImage,
    topSectionFeaturesImages,
    bottomSectionFeaturesImages,
  } = req.files;

  const fileKeys = Object.keys(req.files || {});

  const updatedFiles = {};

  await Promise.all(
    fileKeys.map(async (currKey) => {
      const uploadedFiles = await uploadFile(req.files[currKey]);
      updatedFiles[currKey] = uploadedFiles.result || [];
    })
  );

  // Update `req.files` once all uploads are complete
  req.files = { ...updatedFiles };
  console.log(serviceIcon[0].url, "updatedFiles");

  if (
    topSectionFeaturesImages &&
    topSectionFeaturesImages?.length !== topSection?.features.length
  ) {
    return next(
      new errorResponse(
        "Features Text Length does Not Match with Images in Top Section!"
      )
    );
  }
  if (
    bottomSectionFeaturesImages &&
    bottomSectionFeaturesImages?.length !== bottomSection?.features.length
  ) {
    return next(
      new errorResponse(
        "Features Text Length does Not Match with Images in Bottom Section!"
      )
    );
  }

  for (let i = 0; i < (bottomSection?.features?.length || 0); i++) {
    const currImgUrl = req.files.bottomSectionFeaturesImages[i];
    const payload = {
      icon: currImgUrl || {secure_url:"Image URL error"},
      description: bottomSection.features[i].heading,
      ...bottomSection.features[i],
    };
    bottomSection.features[i] = payload;
  }

  serviceIcon = req.files.serviceIcon[0]?.secure_url || "Image URL error";
  topSection.banner =
    req.files.topSectionImage[0]?.secure_url || "Image URL error";
  midSection.stepsToAvailLoan.banner =
    req.files.stepsToAvailLoanImage[0]?.secure_url || "Image URL error";

  const newService = new serviceModel({
    serviceTitle,
    description,
    serviceIcon,
    topSection,
    midSection,
    bottomSection,
  });

  await newService.save();
  res.status(201).json({ message: "Service created successfully", newService });
});

// Get All Services
export const getAllServices = asyncHandler(async (req, res, next) => {
  const services = await serviceModel.find();
  res.status(200).json({
    status: true,
    message: "Data Fetched Successfully ",
    data: services,
  });
});

// Get Service by ID
export const getServiceById = asyncHandler(async (req, res) => {
  const service = await serviceModel.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }
  res.status(200).json(service);
});

// Update Service by ID
export const updateService = asyncHandler(async (req, res, next) => {
  let query = {};
  const { midSection, topSection, bottomSection,...rest } = req.body;
  let {
    serviceIcon,
    topSectionImage,
    midSectionImage,
    stepsToAvailLoanImage,
    topSectionFeaturesImages,
    bottomSectionFeaturesImages,
  } = req.files;
  

  query = updateQuery(rest);

  const fileKeys = Object.keys(req.files || {});

  const updatedFiles = {};
  // 
  
  if(midSection)
    query.midSection = JSON.parse(midSection || "{}");
  
  if(topSection)
    query.topSection = JSON.parse(topSection || "{}");
  
  if(bottomSection)
   query.bottomSection = JSON.parse(bottomSection || "{}");

  await Promise.all(
    fileKeys.map(async (currKey) => {
      const uploadedFiles = await uploadFile(req.files[currKey]);
      updatedFiles[currKey] = uploadedFiles.result || [];
    })
  );

  // Update `req.files` once all uploads are complete
  req.files = { ...updatedFiles };
  // console.log(serviceIcon[0].url, "updatedFiles");


  


  if(query?.bottomSection && query?.bottomSection?.features?.length === (req.files?.bottomSectionFeaturesImages)?.length ){
    for (let i = 0; i < (bottomSection?.features?.length || 0); i++) {
      const currImgUrl = req.files?.bottomSectionFeaturesImages[i];
      const payload = {
        icon: currImgUrl || {secure_url:"Image URL error"},
        description: bottomSection.features[i].heading,
        ...bottomSection?.features[i],
      };
      bottomSection.features[i] = payload;
    } 
  }
  else{
    return next(new errorResponse("Something is missing from Bottom Section Or Images is not equivalent to features !!"));
  }

 

   
  if(req.files?.serviceIcon && req.files?.serviceIcon.length > 0 )
     query.serviceIcon = req.files.serviceIcon[0]?.secure_url || "Image URL error";
  
  
  if(req.files?.topSectionImage && req.files?.topSectionImage.length > 0)
    query.topSection.banner =
    req.files?.topSectionImage[0]?.secure_url || "Image URL error";

  // midSection.banner =
  // req.files?.midSectionImage[0]?.secure_url || "Image URL error";
  if(query?.midSection && req.files?.stepsToAvailLoanImage && req.files?.stepsToAvailLoanImage.length > 0 )
    query.midSection.stepsToAvailLoan.banner =
    req.files?.stepsToAvailLoanImage[0]?.secure_url || "Image URL error";



  const updatedService = await Service.findByIdAndUpdate(req.params.id, query, {
    new: true,
    runValidators: true,
  });

  if (!updatedService) {
    return res.status(404).json({ message: "Service not found" });
  }
  res
    .status(200)
    .json({ message: "Service updated successfully", updatedService });
});

// Delete Service by ID
export const deleteService = asyncHandler(async (req, res, next) => {
  const service = await serviceModel.findByIdAndDelete(req.params.id);
  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }
  res.status(200).json({ message: "Service deleted successfully" });
});

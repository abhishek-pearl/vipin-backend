import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFile = async (files) => {
  try {
    // Ensure files is an array and each file has a path
    if (!Array.isArray(files) || files.some(file => !file.path)) {
      throw new Error("Invalid file data provided.");
    }

    const resultArr = await Promise.all(
      files.map(async (file) => {
        try {
          const res = await cloudinary.uploader.upload(file.path, {
            folder: "vipin",
          });
          console.log("Upload successful:", res);

          // Delete file after successful upload
          fs.unlink(file.path, (err) => {
            if (err) {
              console.error("Error deleting file from disk:", err);
            } else {
              console.log("File deleted from disk:", file.path);
            }
          });

          return res;
        } catch (uploadError) {
          console.error("Error uploading file:", uploadError);
          return null;
        }
      })
    );

    // Filter out any null values from failed uploads
    return { status: true, result: resultArr.filter(Boolean) };
  } catch (error) {
    console.error("Error in uploadFile function:", error);
    return { status: false, message: error.message };
  }
};

import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    banner: {
      type: String,
      required: [true, "url is required"],
    },
  },
  {
    timestamps: true,
  }
);

export const bannerModel = mongoose.model("banners", bannerSchema, "banners");

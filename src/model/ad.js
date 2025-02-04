import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    banner: {
      type: [],
      required: [true, "Image is Required"],
    },
    showBanner: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const adModel = mongoose.model("ads", adSchema, "ads");

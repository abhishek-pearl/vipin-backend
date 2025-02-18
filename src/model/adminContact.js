import mongoose from "mongoose";

const adminContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    phone: {
      type: String,
      required: [true, "mobile is required"],
    },
    address: {
      type: String,
      default: null,
    },
    activeAddress: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const adminContact = mongoose.model(
  "contactAdmin",
  adminContactSchema,
  "contactAdmin"
);

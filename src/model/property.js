import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'title in required']
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  state: {
    type: String,
    required: [true, "State is required"],
  },
  city: {
    type: String,
    required: [true, "City is required"],
  },
  area: {
    type: String,
    required: [true, "Area/Town is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },

  bankName: {
    type: String,
    required: [true, "Bank Name is required"],
  },
  branch: {
    type: String,
    required: [true, "Branch Name is required"],
  },
  contact: {
    type: String,
    required: [true, "Mobile Number is required"],
  },
  reservePrice: {
    type: String,
    required: [true, "Reserve price is required"],
  },
  emd: {
    type: String,
    required: [true, "Reserve price is required"],
  },
  serviceProvider: {
    type: String,
    required: [true, "Service Provider is required"],
  },

  borrowerName: {
    type: String,
    required: [true, "Borrower Name is required"],
  },
  propertyType: {
    type: String,
    required: [true, "Borrower Name is required"],
  },
  auctionType: {
    type: String,
    required: [true, "Borrower Name is required"],
  },
  auctionStartTime: {
    type: String,
    required: [true, "auctionStartTime is required"],
  },
  auctionEndTime: {
    type: String,
    required: [true, "auctionEndTime is required"],
  },
  applicationSubmissionDate: {
    type: String,
    required: [true, "applicationSubmissionDate is required"],
  },
  downloads: {
    type: [
      {
        name: {
          type: String,
          required: [true, "file name is required"],
        },
        file: {
          type: [],
          required: [true, "file is required"],
        },
      },
    ],
  },
});

export const propertyModel = mongoose.model(
  "properties",
  propertySchema,
  "properties"
);

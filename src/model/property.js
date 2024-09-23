import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  auctionId: {
    type: Number,
    unique: true,
    required: [true, "Auction Id is required"],
  },
  title: {
    type: String,
    required: [true, "title in required"],
  },
  category: {
    type: String,
    enum: [
      "Commercial",
      "Gold Auctions",
      "Industrials",
      "Others",
      "Residential",
      "Scrap, Plant & Machinery",
      "Vehicle Auctions"
    ],
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
    type: Number,
    required: [true, "Reserve price is required"],
  },
  emd: {
    type: Number,
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
  auctionStartDate: {
    type: Date,
    required: [true, "Auction start date is required"],
  },
  auctionStartTime: {
    type: String,
    required: [true, "auctionStartTime is required"],
  },
  auctionEndDate: {
    type: Date,
    required: [true, "Auction end date is required"],
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
    type: [],
    required: [true, "Downloadable file is required"],
  },
  banner: {
    type: [],
    required: [true, "Banner is required"],
  },
});

export const propertyModel = mongoose.model(
  "properties",
  propertySchema,
  "properties"
);

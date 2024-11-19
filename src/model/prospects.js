import mongoose from "mongoose";

const prospectsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
  mobile: {
    type: String,
    required: [true, "mobile is required"],
  },
  typeOfLoan: {
    type: String,
    // required: [true, "typeOfLoan is required"],
    default: null,
  },
  loanRequired: {
    type: String,
    // required: [true, "loanRequired is required"],
    default: null,
  },
  pincode: {
    type: String,
    // required: [true, "pincode is required"],
    default: null,
  },
  message: {
    type: String,
    default: null,
  },
  document: {
    type: String,
    default: null,
  },
});

export const prospectsModel = mongoose.model(
  "prospects",
  prospectsSchema,
  "prospects"
);

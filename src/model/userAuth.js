import mongoose from "mongoose";

const userAuthSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "fullName is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
  phone: {
    type: Number,
    required: [true, "phone is required"],
  },
  city: {
    type: String,
    required: [true, "city is required"],
  },
  state: {
    type: String,
    required: [true, "state is required"],
  },
  pincode: {
    type: Number,
    required: [true, "pincode is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  isSubscribed: {
    type: Boolean,
    required: [true, "password is required"],
    default: true
  },

},{timestamps:true});

export const userAuthModel = mongoose.model("user", userAuthSchema);

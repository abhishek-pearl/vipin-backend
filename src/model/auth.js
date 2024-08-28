import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "userName is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
});

export const authModel = mongoose.model("auth", authSchema, "auth");

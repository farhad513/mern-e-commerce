const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter your Name is Required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "please Enter your Email is Required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please Enter your Password is Required"],
    },
    phone: {
      type: String,
      required: [true, "Please Enter your Phone is Required"],
    },
    address: {
      type: String,
      required: [true, "Please Enter your Address is Required"],
    },
    question: {
      type: String,
      required: [true, "Please Enter your Question is Required"],
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Products",
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "Users",
    },
    status: {
      type: String,
      default: "No Process",
      enum: ["No Process", "processing", "Shipping", "delivered", "cancel"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", orderSchema);

const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    accountHolderName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    accountType: {
      type: String,
      enum: ["Savings", "Current"],
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", accountSchema);

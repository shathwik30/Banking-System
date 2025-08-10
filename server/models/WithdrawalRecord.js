const mongoose = require("mongoose");

const withdrawalRecordSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    totalWithdrawn: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WithdrawalRecord", withdrawalRecordSchema);

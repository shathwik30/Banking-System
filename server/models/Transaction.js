const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  type: {
    type: String,
    enum: ["Deposit", "Withdraw"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);

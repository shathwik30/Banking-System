const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const WithdrawalRecord = require("../models/WithdrawalRecord");
const limits = require("../constants/accountLimits");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const { getAccountNumber } = require("../utils/accountNumber");

const signupSchema = z.object({
  accountHolderName: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  accountType: z.enum(["Savings", "Current"]),
  balance: z.number().nonnegative().optional(),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(1),
});

const amountSchema = z.object({
  amount: z.number().positive(),
});

function getStartOfDay() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

async function signup(req, res) {
  try {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors[0].message });
    }
    const { accountHolderName, email, password, accountType, balance } =
      result.data;

    let accountNumber;
    do {
      accountNumber = getAccountNumber();
    } while (await Account.findOne({ accountNumber }));

    if (await Account.findOne({ email })) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const account = new Account({
      accountNumber,
      accountHolderName,
      email,
      password: hashedPassword,
      accountType,
      balance,
    });
    await account.save();

    res.status(201).json({ message: "Signup successful", accountNumber });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function login(req, res) {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors[0].message });
    }
    const { email, password } = result.data;

    const account = await Account.findOne({ email });
    if (!account) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: account._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function getBalance(req, res) {
  try {
    const account = await Account.findById(req.user.id);
    if (!account) return res.status(404).json({ error: "Account not found" });
    res.json({ balance: account.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function getAccountInfo(req, res) {
  try {
    const account = await Account.findById(req.user.id).select(
      "-password -__v -_id -createdAt -updatedAt"
    );
    if (!account) return res.status(404).json({ error: "Account not found" });
    res.json(account);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function depositMoney(req, res) {
  try {
    const result = amountSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors[0].message });
    }
    const { amount } = result.data;

    const account = await Account.findById(req.user.id);
    if (!account) return res.status(404).json({ error: "Account not found" });

    account.balance += amount;
    await account.save();

    await new Transaction({
      account: account._id,
      type: "Deposit",
      amount,
    }).save();

    res.json({ message: "Deposit successful", newBalance: account.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function getTransactionHistory(req, res) {
  try {
    const transactions = await Transaction.find({
      account: req.user.id,
    }).select("-_id -__v");
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function withdrawMoney(req, res) {
  try {
    const result = amountSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors[0].message });
    }
    const { amount } = result.data;

    const account = await Account.findById(req.user.id);
    if (!account) return res.status(404).json({ error: "Account not found" });

    if (amount > account.balance)
      return res.status(400).json({ error: "Insufficient balance" });

    const startOfDay = getStartOfDay();

    let record = await WithdrawalRecord.findOne({
      account: account._id,
      date: startOfDay,
    });
    if (!record) {
      record = new WithdrawalRecord({
        account: account._id,
        date: startOfDay,
        totalWithdrawn: 0,
      });
    }

    if (record.totalWithdrawn + amount > limits[account.accountType]) {
      return res.status(400).json({ error: "Daily withdrawal limit exceeded" });
    }

    account.balance -= amount;
    record.totalWithdrawn += amount;

    await account.save();
    await record.save();

    await new Transaction({
      account: account._id,
      type: "Withdraw",
      amount,
    }).save();

    res.json({ message: "Withdrawal successful", newBalance: account.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  signup,
  login,
  getBalance,
  getAccountInfo,
  depositMoney,
  getTransactionHistory,
  withdrawMoney,
};

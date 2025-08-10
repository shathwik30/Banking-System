const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const accountController = require("../controllers/accountController");

// Public routes
router.post("/signup", accountController.signup);
router.post("/login", accountController.login);

// Protected routes
router.use(auth);

router.get("/balance", accountController.getBalance);
router.get("/account-info", accountController.getAccountInfo);
router.post("/deposit", accountController.depositMoney);
router.post("/withdraw", accountController.withdrawMoney);
router.get("/transactions", accountController.getTransactionHistory);

module.exports = router;

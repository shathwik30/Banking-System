"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getAccountInfo,
  getBalance,
  getTransactionHistory,
  depositMoney,
  withdrawMoney,
} from "../lib/services/api.js";
import "./Dashboard.css";

function Dashboard() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [msg, setMsg] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const showMessage = (text) => setMsg(text);

  const fetchData = useCallback(async () => {
    try {
      const [accountData, balanceData, transactionsData] = await Promise.all([
        getAccountInfo(token),
        getBalance(token),
        getTransactionHistory(token),
      ]);

      if (accountData.error || balanceData.error || transactionsData.error) {
        showMessage(
          accountData.error || balanceData.error || transactionsData.error
        );
      } else {
        setAccount(accountData);
        setBalance(balanceData.balance);
        setTransactions(transactionsData);
      }
    } catch {
      showMessage("An error occurred while fetching data.");
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      router.push("/");
    } else {
      fetchData();
    }
  }, [token, router, fetchData]);

  const refreshTransactions = async () => {
    const data = await getTransactionHistory(token);
    if (!data.error) {
      setTransactions(data);
    }
  };

  const handleAmount = (amount) => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0 || !Number.isInteger(value)) {
      showMessage("Enter a valid integer amount.");
      return null;
    }
    return value;
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setMsg("");
    const amount = handleAmount(depositAmount);
    if (amount === null) return;

    const res = await depositMoney({ amount }, token);
    if (res.error) return showMessage(res.error);

    setBalance(res.newBalance);
    setDepositAmount("");
    showMessage(res.message);
    refreshTransactions();
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setMsg("");
    const amount = handleAmount(withdrawAmount);
    if (amount === null) return;

    const res = await withdrawMoney({ amount }, token);
    if (res.error) return showMessage(res.error);

    if (res.newBalance !== undefined) {
      setBalance(res.newBalance);
      setWithdrawAmount("");
      showMessage(res.message || "Withdrawal successful.");
      refreshTransactions();
    } else {
      showMessage("Unexpected error occurred during withdrawal.");
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    router.push("/");
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h2>Dashboard</h2>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {msg && <p className="message">{msg}</p>}

      {account && (
        <div className="account-info">
          <h3>Account Info</h3>
          <p>
            <strong>Account Holder:</strong> {account.accountHolderName}
          </p>
          <p>
            <strong>Email:</strong> {account.email}
          </p>
          <p>
            <strong>Account Type:</strong> {account.accountType}
          </p>
          <p>
            <strong>Account Number:</strong> {account.accountNumber}
          </p>
        </div>
      )}

      <h3>Balance: ${balance !== null ? parseInt(balance) : "Loading..."}</h3>

      <form onSubmit={handleDeposit} className="transaction-form">
        <h4>Deposit Money</h4>
        <input
          type="number"
          step="1"
          min="1"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="Enter Amount"
          className="input"
          required
        />
        <button type="submit" className="button">
          Deposit
        </button>
      </form>

      <form onSubmit={handleWithdraw} className="transaction-form">
        <h4>Withdraw Money</h4>
        <input
          type="number"
          step="1"
          min="1"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          placeholder="Enter Amount"
          className="input"
          required
        />
        <button type="submit" className="button">
          Withdraw
        </button>
      </form>

      <h3>Transaction History</h3>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {[...transactions].reverse().map((t, index) => (
              <tr key={index}>
                <td>{t.type}</td>
                <td>${parseInt(t.amount)}</td>
                <td>{new Date(t.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;

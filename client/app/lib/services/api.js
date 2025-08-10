const URL = process.env.NEXT_PUBLIC_API_URL;

async function apiRequest(endpoint, body = {}, method = "POST", token = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${URL}${endpoint}`, {
      method,
      headers,
      body: method !== "GET" ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    return { error: "Network or server error" };
  }
}

export function signup(body) {
  return apiRequest("/api/signup", body, "POST");
}

export function login(body) {
  return apiRequest("/api/login", body, "POST");
}

export function getBalance(token) {
  return apiRequest("/api/balance", {}, "GET", token);
}

export function getAccountInfo(token) {
  return apiRequest("/api/account-info", {}, "GET", token);
}

export function depositMoney(body, token) {
  return apiRequest("/api/deposit", body, "POST", token);
}

export function withdrawMoney(body, token) {
  return apiRequest("/api/withdraw", body, "POST", token);
}

export function getTransactionHistory(token) {
  return apiRequest("/api/transactions", {}, "GET", token);
}

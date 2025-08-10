# Banking System Backend

This is the backend for a banking system application. It provides APIs for user authentication, account management, transactions, and more.

## Features

- User signup and login with JWT-based authentication.
- Account management (balance inquiry, account info).
- Deposit and withdrawal functionality with daily limits.
- Transaction history tracking.
- MongoDB integration for data persistence.

---

## Table of Contents

- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Documentation](#api-documentation)
  - [Public Routes](#public-routes)
  - [Protected Routes](#protected-routes)
- [Project Structure](#project-structure)

---

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/dshathwikr/banking-system-backend.git
   cd banking-system-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in the required values in the `.env` file.

4. Start the server:
   - For production:
     ```bash
     npm start
     ```
   - For development (with hot-reloading):
     ```bash
     npm run dev
     ```

---

## Environment Variables

The following environment variables are required:

| Variable      | Description                          |
|---------------|--------------------------------------|
| `PORT`        | Port number for the server          |
| `MONGODB_URI` | MongoDB connection string           |
| `JWT_SECRET`  | Secret key for JWT authentication   |

---

## Scripts

- `npm start`: Starts the server in production mode.
- `npm run dev`: Starts the server in development mode with hot-reloading.

---

## API Documentation

### Public Routes

#### **POST** `/api/signup`

- **Description**: Create a new account.
- **Request Body**:
  ```json
  {
    "accountHolderName": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "accountType": "Savings",
    "balance": 1000
  }
  ```
- **Response**:
  ```json
  {
    "message": "Signup successful",
    "accountNumber": "1234567890"
  }
  ```

#### **POST** `/api/login`

- **Description**: Login to an existing account.
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "JWT_TOKEN"
  }
  ```

---

### Protected Routes

> **Note**: All protected routes require a `Bearer` token in the `Authorization` header.

#### **GET** `/api/balance`

- **Description**: Get the account balance.
- **Response**:
  ```json
  {
    "balance": 1000
  }
  ```

#### **GET** `/api/account-info`

- **Description**: Get account details.
- **Response**:
  ```json
  {
    "accountNumber": "1234567890",
    "accountHolderName": "John Doe",
    "email": "john.doe@example.com",
    "accountType": "Savings",
    "balance": 1000
  }
  ```

#### **POST** `/api/deposit`

- **Description**: Deposit money into the account.
- **Request Body**:
  ```json
  {
    "amount": 500
  }
  ```
- **Response**:
  ```json
  {
    "message": "Deposit successful",
    "newBalance": 1500
  }
  ```

#### **POST** `/api/withdraw`

- **Description**: Withdraw money from the account.
- **Request Body**:
  ```json
  {
    "amount": 200
  }
  ```
- **Response**:
  ```json
  {
    "message": "Withdrawal successful",
    "newBalance": 1300
  }
  ```

#### **GET** `/api/transactions`

- **Description**: Get transaction history.
- **Response**:
  ```json
  [
    {
      "type": "Deposit",
      "amount": 500,
      "timestamp": "2023-10-01T12:00:00Z"
    },
    {
      "type": "Withdraw",
      "amount": 200,
      "timestamp": "2023-10-02T14:00:00Z"
    }
  ]
  ```

---

## Project Structure

```
banking-system-backend/
├── config/                 # Configuration files (e.g., database connection)
├── constants/              # Application constants (e.g., account limits)
├── controllers/            # Route handlers
├── middleware/             # Middleware functions (e.g., authentication)
├── models/                 # Mongoose models
├── routes/                 # API route definitions
├── utils/                  # Utility functions
├── .env.example            # Example environment variables
├── index.js                # Entry point of the application
└── package.json            # Project metadata and dependencies
```

---

## License

This project is licensed under the ISC License.

---

## Author

Developed by [@dshathwikr](https://github.com/dshathwikr).
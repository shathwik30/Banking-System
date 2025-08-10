const express = require("express");
const connectDB = require("./config/db");
const accountRoutes = require("./routes/accountRoutes");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api", accountRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

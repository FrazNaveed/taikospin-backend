require("dotenv").config();
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const contractRoutes = require("./routes/contract");

const app = express(); // Initialize app first
app.use(cors({ origin: "*", credentials: true }));
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Routes
app.use("/auth", authRoutes);
app.use("/contract", contractRoutes);

// Connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening on port ${port}`));

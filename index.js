require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const contractRoutes = require("./routes/contract");

const app = express(); // Initialize app first

const corsOptions = {
  origin: "*", // Allow all origins
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true, // Allow credentials (if needed)
  optionsSuccessStatus: 204, // Respond successfully to preflight requests
  preflightContinue: false,
};

app.use(cors(corsOptions)); // Place this before routes

app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Routes
app.use("/auth", authRoutes);
app.use("/contract", contractRoutes);

// Connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening on port ${port}`));

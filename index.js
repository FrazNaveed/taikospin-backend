require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const contractRoutes = require("./routes/contract");

const corsOptions = {
  origin: "*", // Allow all origins
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
};

app.use(cors(corsOptions));

// Initialize app
const app = express();
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Routes
app.use("/auth", authRoutes);
app.use("/contract", contractRoutes);

// Connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening on port ${port}`));

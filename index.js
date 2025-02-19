require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const contractRoutes = require("./routes/contract");

// Initialize app
const app = express();

// Middlewares
app.use(
  cors({
    origin: "https://taikospin-frontend.vercel.app", // Allow only your frontend
    methods: "GET,POST,PUT,DELETE,OPTIONS", // Allowed HTTP methods
    allowedHeaders: "Content-Type,Authorization", // Allowed headers
  })
);
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Routes
app.use("/auth", authRoutes);
app.use("/contract", contractRoutes);

// Connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening on port ${port}`));

// Import packages
const express = require("express");
const cors = require("cors"); // Import CORS
const bodyParser = require("body-parser"); // Import body-parser
const authRoutes = require("./routes/auth");

// Initialize app
const app = express();

// Middlewares
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Routes
app.use("/auth", authRoutes);

// Connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening on port ${port}`));

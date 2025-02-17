// Import packages
const express = require("express");
const cors = require("cors"); // Import CORS
const authRoutes = require("./routes/auth");

// Initialize app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors()); // Enable CORS

// Routes
app.use("/auth", authRoutes);

// Connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening on port ${port}`));

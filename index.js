// Import packages
const express = require("express");
const authRoutes = require("./routes/auth");

// Middlewares
const app = express();
app.use(express.json());

// Routes

// get
app.use("/auth", authRoutes);

//post
// app.use("/dispense", home);
// app.use("/spin", home);

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));

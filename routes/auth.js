// routes/auth.js
const express = require("express");
const { ethers } = require("ethers");
const crypto = require("crypto");

const router = express.Router();

// Utility function to generate a unique random message
const generateUniqueMessage = (userAddress) => {
  const nonce = crypto.randomBytes(16).toString("hex"); // Generate a random nonce
  const timestamp = Date.now(); // Get the current timestamp
  return `Sign this message to authenticate your address: ${userAddress} with nonce: ${nonce} at time: ${timestamp}`;
};

// Utility function to verify the signed message
const verifySignature = (message, signature, expectedAddress) => {
  try {
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    console.error("Signature verification failed:", error);
    return false;
  }
};

// Route for getting the message to sign
router.get("/signMessage", (req, res) => {
  const { userAddress } = req.query;

  if (!userAddress || !/^0x[a-fA-F0-9]{40}$/.test(userAddress)) {
    return res.status(400).json({ error: "Invalid address format" });
  }

  // Generate a unique message for signing
  const message = generateUniqueMessage(userAddress);

  return res.status(200).json({ message });
});

// Route for verifying the signature
router.post("/verifySignature", (req, res) => {
  const { message, signature, address } = req.body;

  if (!message || !signature || !address) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const isValid = verifySignature(message, signature, address);

  if (isValid) {
    return res
      .status(200)
      .json({ success: true, message: "Signature is valid." });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Invalid signature." });
  }
});

module.exports = router;

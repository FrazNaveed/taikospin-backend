// routes/auth.js
const express = require("express");
const { ethers } = require("ethers");
const crypto = require("crypto");
const router = express.Router();
const contractABI = require("../config/spinwheelABI.json");
const addresses = require("../config/address.json");

// addresses
const OWNER_ADDRESS = addresses.OWNER_ADDRESS;
const CONTRACT_ADDRESS = addresses.TAIKO_SPIN_WHEEL;

// env vars
const PROVIDER_URL = process.env.PROVIDER_URL;
const PRIVATE_KEY = process.env.RELAYER_KEY;

// instances
const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

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
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://taikospin-frontend.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const { userAddress } = req.query;

  if (!userAddress || !/^0x[a-fA-F0-9]{40}$/.test(userAddress)) {
    return res.status(400).json({ error: "Invalid address format" });
  }

  // Generate a unique message for signing
  const message = generateUniqueMessage(userAddress);

  return res.status(200).json({ message });
});

// Route for verifying the signature
router.post("/verifySignature", async (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://taikospin-frontend.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const { message, signature, address } = req.body;

  if (!message || !signature || !address) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const isValid = verifySignature(message, signature, address);

  if (OWNER_ADDRESS == address) {
    return res.status(200).json({
      success: true,
      message: "Admin: Signature verification successful",
    });
  }

  if (isValid) {
    let tx = await contract.transferToUser(address);
    await tx.wait();

    return res
      .status(200)
      .json({ success: true, message: "Congratulations! You got 1 Taiko 🥁" });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Invalid signature." });
  }
});

module.exports = router;

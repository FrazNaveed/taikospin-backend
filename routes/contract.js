const express = require("express");
const { ethers } = require("ethers");
const router = express.Router();
const addresses = require("../config/address.json");

const contractABI = require("../config/spinwheelABI.json");
const tokenABI = require("../config/tokenABI.json");

// addresses
const CONTRACT_ADDRESS = addresses.TAIKO_SPIN_WHEEL;
const TAIKO_TOKEN_ADDRESS = addresses.TAIKO_TOKEN;

// env vars
const PROVIDER_URL = process.env.PROVIDER_URL;
const PRIVATE_KEY = process.env.RELAYER_KEY;

// provider signer instances
const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Initialize contract instance
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
const tokenContract = new ethers.Contract(
  TAIKO_TOKEN_ADDRESS,
  tokenABI,
  provider
);

router.get("/nonce", async (req, res) => {
  const { userAddress } = req.query;

  if (!userAddress) {
    return res
      .status(400)
      .json({ error: "Missing required field: userAddress." });
  }

  try {
    const nonces = await tokenContract.nonces(userAddress);

    return res.status(200).json({
      success: true,
      message: "Nonce fetch successful.",
      nonce: nonces,
    });
  } catch (error) {
    console.error("Fetch failed:", error);
    return res
      .status(500)
      .json({ error: "Fetch failed.", details: error.message });
  }
});

// Route for spinning the wheel
router.post("/spin", async (req, res) => {
  const { signature, message } = req.body;

  if (!signature) {
    return res
      .status(400)
      .json({ error: "Missing required field: signature." });
  }

  if (!message) {
    return res.status(400).json({ error: "Missing required field: message." });
  }

  try {
    const sig = ethers.utils.splitSignature(signature);
    let txn = await contract.spin(
      message.owner,
      message.value,
      message.deadline,
      sig.v,
      sig.r,
      sig.s
    );
    await txn.wait();

    return res.status(200).json({
      success: true,
      message: "Spin successful.",
    });
  } catch (error) {
    console.error("Spin failed:", error);
    return res
      .status(500)
      .json({ error: "Spin failed.", details: error.message });
  }
});

module.exports = router;

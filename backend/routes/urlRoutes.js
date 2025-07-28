const express = require("express");
const ShortURL = require("../models/ShortURL.js");
const { generateShortcode, isValidShortcode } = require("../utils/shortcode");

const router = express.Router();

// POST /shorturls - Create short URL
router.post("/", async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url || !/^https?:\/\/.+/.test(url)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  const expiresAt = new Date(Date.now() + validity * 60000);
  let finalCode = shortcode;

  if (shortcode) {
    if (!isValidShortcode(shortcode)) {
      return res.status(400).json({ error: "Invalid shortcode format" });
    }
    const existing = await ShortURL.findOne({ shortcode });
    if (existing) return res.status(409).json({ error: "Shortcode already exists" });
  } else {
    do {
      finalCode = generateShortcode();
    } while (await ShortURL.findOne({ shortcode: finalCode }));
  }

  const shortUrl = new ShortURL({ shortcode: finalCode, url, expiresAt });
  await shortUrl.save();

  res.status(201).json({
    shortLink: `http://localhost:3001/${finalCode}`,
    expiry: expiresAt.toISOString()
  });
});

// GET /shorturls/:shortcode - Retrieve stats
router.get("/:shortcode", async (req, res) => {
  const code = req.params.shortcode;
  const record = await ShortURL.findOne({ shortcode: code });

  if (!record) return res.status(404).json({ error: "Shortcode not found" });

  res.json({
    url: record.url,
    createdAt: record.createdAt,
    expiry: record.expiresAt,
    totalClicks: record.clicks.length,
    clicks: record.clicks
  });
});

module.exports = router;

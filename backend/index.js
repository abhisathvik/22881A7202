const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const logger = require("./middleware/logger");
const urlRoutes = require("./routes/urlRoutes");
const ShortURL = require("./models/ShortURL");

dotenv.config();
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(logger);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/shorturls", urlRoutes);

// Redirect handler
app.get("/:shortcode", async (req, res) => {
  const code = req.params.shortcode;
  const record = await ShortURL.findOne({ shortcode: code });

  if (!record) return res.status(404).json({ error: "Shortcode not found" });

  const now = new Date();
  if (record.expiresAt < now) {
    return res.status(410).json({ error: "Shortcode expired" });
  }

  // Log the click
  const clickInfo = {
    timestamp: now.toISOString(),
    source: req.get("Referrer") || "unknown",
    location: "India" // (static — can be improved with geo lookup)
  };
  record.clicks.push(clickInfo);
  await record.save();

  res.redirect(record.url);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

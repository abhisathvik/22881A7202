const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema({
  timestamp: String,
  source: String,
  location: String
}, { _id: false });

const shortURLSchema = new mongoose.Schema({
  shortcode: { type: String, unique: true, required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  clicks: [clickSchema]
});

module.exports = mongoose.model("ShortURL", shortURLSchema);

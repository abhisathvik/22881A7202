import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Alert,
  Divider,
} from "@mui/material";
// Assuming these utilities are in src/utils/helpers.js
import { generateShortcode, logEvent } from "../utils/helpers"; 

export default function ShortenerPage() {
  const [urls, setUrls] = useState([
    { original: "", validity: "", custom: "" },
  ]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleChange = (index, field, value) => {
    const updated = [...urls];
    updated[index][field] = value;
    setUrls(updated);
  };

  const validateUrl = (url) => {
    try {
      // Basic URL validation
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = () => {
    setError(null);
    const now = new Date();
    const newResults = [];
    const existing = JSON.parse(localStorage.getItem("shortUrls") || "[]");

    for (const { original, validity, custom } of urls) {
      if (!validateUrl(original)) {
        setError("Invalid URL format: " + original); // Specify which URL is invalid
        return;
      }

      let shortcode = custom.trim();
      if (shortcode && existing.some((e) => e.shortcode === shortcode)) {
        setError("Custom shortcode already exists: " + shortcode);
        return;
      }
      
      // If custom shortcode is not provided or is empty, generate one
      if (!shortcode) {
        shortcode = generateShortcode();
        // Ensure generated shortcode is unique
        while (existing.some((e) => e.shortcode === shortcode)) {
          shortcode = generateShortcode();
        }
      }

      // Parse validity, default to 30 minutes if not a valid number
      const validityMinutes = parseInt(validity);
      const expiryDuration = !isNaN(validityMinutes) && validityMinutes > 0 ? validityMinutes : 30;
      
      const expire = new Date(now.getTime() + expiryDuration * 60000);
      
      const newEntry = {
        original,
        shortcode,
        created: now.toISOString(),
        expires: expire.toISOString(),
        clicks: [],
      };
      
      existing.push(newEntry);
      newResults.push(newEntry);
    }
    
    localStorage.setItem("shortUrls", JSON.stringify(existing));
    newResults.forEach(entry => {
        logEvent(`Shortened: ${entry.original} to ${entry.shortcode}`, "info");
    });
    setResults(newResults);
    // Optionally clear the input fields after successful submission
    setUrls([{ original: "", validity: "", custom: "" }]);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Shorten Your URLs
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="text.secondary">
        Enter up to 5 URLs. Customize shortcode and expiry time (default: 30 minutes).
      </Typography>
      {urls.map((url, idx) => (
        <Paper key={idx} elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Original URL"
                variant="outlined"
                value={url.original}
                onChange={(e) => handleChange(idx, "original", e.target.value)}
                placeholder="e.g., https://www.google.com"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Validity (min)"
                variant="outlined"
                type="number" // Use type="number" for numeric input
                value={url.validity}
                onChange={(e) => handleChange(idx, "validity", e.target.value)}
                placeholder="e.g., 60"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Custom Code"
                variant="outlined"
                value={url.custom}
                onChange={(e) => handleChange(idx, "custom", e.target.value)}
                placeholder="Optional"
              />
            </Grid>
          </Grid>
        </Paper>
      ))}
      {urls.length < 5 && (
        <Button
          variant="outlined"
          onClick={() => setUrls([...urls, { original: "", validity: "", custom: "" }])}
          sx={{ mb: 2 }} // Added margin-bottom for better spacing
        >
          + Add another URL
        </Button>
      )}
      <Box mt={3}>
        <Button variant="contained" size="large" onClick={handleSubmit}>
          Generate Short Links
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
      {results.length > 0 && (
        <Box mt={4}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Shortened Links
          </Typography>
          {results.map((r, i) => (
            <Paper key={i} sx={{ mt: 2, p: 2, borderLeft: '5px solid #1976d2' }}>
              <Typography variant="body1" fontWeight={600}>
                Short URL: <a href={`http://localhost:3000/${r.shortcode}`} target="_blank" rel="noreferrer">http://localhost:3000/{r.shortcode}</a>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Original URL: {r.original} {/* Display original URL for clarity */}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Expires At: {new Date(r.expires).toLocaleString()}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}
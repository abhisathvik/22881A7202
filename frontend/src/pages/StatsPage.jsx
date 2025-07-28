import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";

export default function StatsPage() {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("shortUrls") || "[]");
    // Sort URLs by creation date (newest first) for better readability
    const sortedData = data.sort((a, b) => new Date(b.created) - new Date(a.created));
    setUrls(sortedData);
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Shortened URL Statistics
      </Typography>
      {urls.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No shortened URLs found yet. Go to the "Shorten" page to create some!
        </Typography>
      ) : (
        urls.map((u, i) => (
          <Paper key={i} sx={{ mt: 3, p: 3, borderLeft: '5px solid #4caf50' }} elevation={2}>
            <Typography variant="subtitle1" fontWeight={600}>
              Short URL: <a href={`http://localhost:3000/${u.shortcode}`} target="_blank" rel="noreferrer">http://localhost:3000/{u.shortcode}</a>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Original: {u.original}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created: {new Date(u.created).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Expires: {new Date(u.expires).toLocaleString()}
            </Typography>
            <Typography variant="body2" mt={1}>
              <strong>Total Clicks:</strong> {u.clicks.length}
            </Typography>
            {u.clicks.length > 0 && (
              <Box mt={1}>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="body2" fontWeight={600} mb={1}>Click Details:</Typography>
                {u.clicks.map((click, j) => (
                  <Typography key={j} variant="caption" display="block">
                    - {new Date(click.time).toLocaleString()} | Source: {click.source || 'N/A'} | Location: {click.location || 'N/A'}
                  </Typography>
                ))}
              </Box>
            )}
          </Paper>
        ))
      )}
    </Box>
  );
}
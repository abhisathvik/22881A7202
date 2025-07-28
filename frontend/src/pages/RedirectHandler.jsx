import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import { logEvent } from "../utils/helpers"; // Assuming logEvent is here

export default function RedirectHandler() {
  const { shortcode } = useParams();
  const [redirecting, setRedirecting] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleRedirect = () => {
      const storedUrls = JSON.parse(localStorage.getItem("shortUrls") || "[]");
      const urlEntry = storedUrls.find((entry) => entry.shortcode === shortcode);

      if (urlEntry) {
        const now = new Date();
        const expires = new Date(urlEntry.expires);

        if (now < expires) {
          // Log the click event
          const updatedClicks = [
            ...urlEntry.clicks,
            {
              time: now.toISOString(),
              source: document.referrer || "direct", // Basic source tracking
              // In a real application, you'd get more sophisticated location data
              location: "Unknown", 
            },
          ];
          const updatedEntry = { ...urlEntry, clicks: updatedClicks };

          const updatedUrls = storedUrls.map((entry) =>
            entry.shortcode === shortcode ? updatedEntry : entry
          );
          localStorage.setItem("shortUrls", JSON.stringify(updatedUrls));
          logEvent(`Redirected: ${shortcode} to ${urlEntry.original}`, "info");
          window.location.replace(urlEntry.original); // Use replace to prevent back button issues
        } else {
          setError("This short URL has expired.");
          logEvent(`Expired URL access: ${shortcode}`, "warn");
          setRedirecting(false);
        }
      } else {
        setError("Short URL not found.");
        logEvent(`Non-existent URL access: ${shortcode}`, "error");
        setRedirecting(false);
      }
    };

    handleRedirect();
  }, [shortcode]);

  if (redirecting) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="70vh">
        <CircularProgress />
        <Typography variant="h6" mt={2}>
          Redirecting...
        </Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="70vh">
      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  );
}
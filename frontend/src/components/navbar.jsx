import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          URL Shortener
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Shorten
        </Button>
        <Button color="inherit" component={Link} to="/stats">
          Statistics
        </Button>
      </Toolbar>
    </AppBar>
  );
}
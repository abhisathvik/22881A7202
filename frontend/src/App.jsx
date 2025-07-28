import React from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";
import ShortenerPage from "./pages/ShortnerPage";
import StatsPage from "./pages/StatsPage";
import RedirectHandler from "./pages/RedirectHandler";
import Navbar from "./components/navbar";

function App() {
  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<ShortenerPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/:shortcode" element={<RedirectHandler />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;

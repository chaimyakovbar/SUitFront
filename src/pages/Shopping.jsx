import React, { useState, useEffect } from "react";
import GetAllSuitFromData from "../components/GetAllSuitFromData";
import {
  Box,
  Container,
  Typography,
  Fab,
  useMediaQuery,
  useTheme,
  Drawer,
  Divider,
} from "@mui/material";
import ShowSizes from "../components/ShowSizes";
import useProduct from "../Hooks/useProduct";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TuneIcon from "@mui/icons-material/Tune";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";

// ─── Reusable pill button ──────────────────────────────────────────────────────
const Pill = ({ active, onClick, children }) => (
  <Box
    component="button"
    onClick={onClick}
    sx={{
      background: "none",
      border: "1px solid",
      borderColor: active ? "#C0D3CA" : "rgba(255,255,255,0.15)",
      color: active ? "#C0D3CA" : "rgba(255,255,255,0.5)",
      borderRadius: 0,
      px: "20px",
      py: "9px",
      fontSize: "0.7rem",
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: active ? 600 : 400,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      cursor: "pointer",
      backgroundColor: active ? "rgba(192,211,202,0.07)" : "transparent",
      transition: "all 0.22s ease",
      "&:hover": { borderColor: "rgba(192,211,202,0.45)", color: "rgba(255,255,255,0.85)" },
    }}
  >
    {children}
  </Box>
);

// ─── Icon toggle button ────────────────────────────────────────────────────────
const IconBtn = ({ active, onClick, children }) => (
  <Box
    component="button"
    onClick={onClick}
    sx={{
      background: "none",
      border: "1px solid",
      borderColor: active ? "rgba(192,211,202,0.45)" : "rgba(255,255,255,0.1)",
      color: active ? "#C0D3CA" : "rgba(255,255,255,0.3)",
      borderRadius: "2px",
      width: 34,
      height: 34,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.2s ease",
      "&:hover": { borderColor: "rgba(192,211,202,0.4)", color: "#C0D3CA" },
    }}
  >
    {children}
  </Box>
);

// ══════════════════════════════════════════════════════════════════════════════
const Shopping = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useLanguage();
  const { data } = useProduct();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fn = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const suitCount = data?.allSuitPart?.length || 0;

  return (
    <Box sx={{ backgroundColor: "#0a0a0a", color: "#fff", minHeight: "100vh" }}>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* HERO                                                                */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: "70vh", md: "80vh" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          overflow: "hidden",
          pt: { xs: "80px", md: "90px" },
          pb: 8,
        }}
      >
        {/* Background large text */}
        <Typography
          aria-hidden
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: { xs: "30vw", md: "20vw" },
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "rgba(192,211,202,0.03)",
            userSelect: "none",
            whiteSpace: "nowrap",
            lineHeight: 1,
            pointerEvents: "none",
          }}
        >
          SUIT
        </Typography>

        {/* Eyebrow */}
        <Typography
          sx={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.68rem",
            fontWeight: 500,
            letterSpacing: "0.3em",
            color: "#C0D3CA",
            textTransform: "uppercase",
            mb: 3,
          }}
        >
          Bespoke Atelier
        </Typography>

        {/* Main headline */}
        <Typography
          component="h1"
          sx={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: { xs: "3.5rem", sm: "5rem", md: "7rem" },
            fontWeight: 300,
            letterSpacing: { xs: "0.1em", md: "0.15em" },
            textTransform: "uppercase",
            color: "#fff",
            lineHeight: 0.9,
            mb: 4,
          }}
        >
          {t("premiumSuitCollection")}
        </Typography>

        {/* Divider */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 4,
            width: { xs: "80%", md: "40%" },
          }}
        >
          <Box sx={{ flex: 1, height: "1px", backgroundColor: "rgba(192,211,202,0.2)" }} />
          <Box
            sx={{
              width: 6,
              height: 6,
              border: "1px solid rgba(192,211,202,0.5)",
              transform: "rotate(45deg)",
            }}
          />
          <Box sx={{ flex: 1, height: "1px", backgroundColor: "rgba(192,211,202,0.2)" }} />
        </Box>

        {/* Subtitle */}
        <Typography
          sx={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: { xs: "0.8rem", md: "0.9rem" },
            fontWeight: 300,
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.08em",
            maxWidth: 480,
            lineHeight: 1.8,
            mb: 6,
          }}
        >
          {t("shoppingSubtitle")}
        </Typography>

        {/* Payment CTA */}
        <Link to="/Payed" style={{ textDecoration: "none" }}>
          <Box
            component="span"
            sx={{
              display: "inline-block",
              border: "1px solid rgba(192,211,202,0.3)",
              color: "#C0D3CA",
              px: 5,
              py: 1.5,
              fontSize: "0.72rem",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(192,211,202,0.07)",
                borderColor: "#C0D3CA",
                letterSpacing: "0.25em",
              },
            }}
          >
            {t("forPayment")}
          </Box>
        </Link>

        {/* Scroll indicator */}
        <Box
          sx={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            opacity: 0.4,
          }}
        >
          <Typography sx={{ fontSize: "0.6rem", fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Scroll
          </Typography>
          <Box sx={{ width: "1px", height: 40, backgroundColor: "rgba(255,255,255,0.4)" }} />
        </Box>
      </Box>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* STICKY CONTROLS BAR                                                 */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <Box
        sx={{
          position: "sticky",
          top: { xs: 56, md: 64 },
          zIndex: 100,
          backgroundColor: "rgba(8,8,8,0.9)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(192,211,202,0.08)",
          borderBottom: "1px solid rgba(192,211,202,0.08)",
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 1.5,
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            {/* Sort pills */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Pill active={sortBy === "newest"} onClick={() => setSortBy("newest")}>
                {t("newest")}
              </Pill>
              <Pill active={sortBy === "price-low"} onClick={() => setSortBy("price-low")}>
                {t("priceLowToHigh")}
              </Pill>
              <Pill active={sortBy === "price-high"} onClick={() => setSortBy("price-high")}>
                {t("priceHighToLow")}
              </Pill>
            </Box>

            {/* Right controls */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {suitCount > 0 && (
                <Typography
                  sx={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.68rem",
                    color: "rgba(255,255,255,0.3)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    mr: 1,
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  {suitCount} {t("availableSuits")}
                </Typography>
              )}

              <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.08)", mx: 0.5 }} />

              {/* Sizes / Filter button */}
              <Box
                component="button"
                onClick={() => setDrawerOpen(true)}
                sx={{
                  background: "none",
                  border: "1px solid rgba(192,211,202,0.25)",
                  color: "rgba(255,255,255,0.6)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: "14px",
                  py: "8px",
                  borderRadius: "2px",
                  fontSize: "0.68rem",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.22s ease",
                  "&:hover": { borderColor: "#C0D3CA", color: "#C0D3CA", backgroundColor: "rgba(192,211,202,0.05)" },
                }}
              >
                <TuneIcon sx={{ fontSize: "0.9rem" }} />
                {!isMobile && t("sizes")}
              </Box>

              <IconBtn active={viewMode === "grid"} onClick={() => setViewMode("grid")}>
                <ViewModuleIcon sx={{ fontSize: "1rem" }} />
              </IconBtn>
              <IconBtn active={viewMode === "list"} onClick={() => setViewMode("list")}>
                <ViewListIcon sx={{ fontSize: "1rem" }} />
              </IconBtn>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* PRODUCT GRID                                                         */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <Container maxWidth="xl" sx={{ pt: 6, pb: 14 }}>
        <GetAllSuitFromData viewMode={viewMode} sortBy={sortBy} />
      </Container>

      {/* ── Sizes drawer ────────────────────────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "92vw", sm: "48vw", md: "36vw" },
            backgroundColor: "#080808",
            borderLeft: "1px solid rgba(192,211,202,0.12)",
          },
        }}
      >
        <ShowSizes data={data} onClose={() => setDrawerOpen(false)} />
      </Drawer>

      {/* ── Scroll to top ────────────────────────────────────────────────────── */}
      {showScrollTop && (
        <Fab
          size="small"
          aria-label="scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          sx={{
            position: "fixed",
            bottom: 28,
            right: 28,
            backgroundColor: "rgba(192,211,202,0.08)",
            color: "#C0D3CA",
            border: "1px solid rgba(192,211,202,0.2)",
            backdropFilter: "blur(12px)",
            boxShadow: "none",
            "&:hover": { backgroundColor: "rgba(192,211,202,0.15)" },
            transition: "all 0.2s ease",
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}
    </Box>
  );
};

export default Shopping;

import React, { useCallback, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Drawer,
  IconButton,
  Divider,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import { useLanguage } from "../../../context/LanguageContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

import {
  selectedSleeveButtonsAtom,
  showTextInsideAtom,
  currentColorAtom,
  selectedTopCollarColorAtom,
  selectedBackSuitCutAtom,
  selectedTopCollarTextAtom,
  selectedTopCollarTextColorAtom,
  selectedButtonAtom,
  selectedSuitStitchesAtom,
} from "../../../Utils";

// Import existing button components
import ButtonInside from "../../../customSuite/leftSide/stepTree/ButtonInside";
import ButtonHoles from "../../../customSuite/leftSide/stepTree/ButtonHoles";
import ButtonButton from "../../../customSuite/leftSide/stepTree/ButtonButton";
import PantsControls from "../../PantsControls";
import TextInsideModal from "../../TextInsideModal";

// S3 Assets URLs
const S3_BASE_URL = "https://ch-suits.s3.us-east-1.amazonaws.com";
// const inside = `${S3_BASE_URL}/assets/kinds/insid.svg`;

import holes from "../../../assets/icons/suit/suitAdd/holesUp.webp";
import inside from "../../../assets/icons/suit/suitAdd/inner.webp";
import textInside from "../../../assets/icons/suit/suitAdd/textInside.webp";
import buttonStyle from "../../../assets/icons/suit/suitAdd/button.webp";
import sleeves from "../../../assets/icons/suit/suitAdd/sleeves.webp";
import topCollar from "../../../assets/icons/suit/suitAdd/topCollar.webp";
import backSuitIcon from "../../../assets/icons/suit/suitAdd/backSuit.webp";

// Global animation variants for reuse
const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4 },
  },
};

// Helper function to get categories with translations
const getDetailCategories = (t) => [
  { key: "backSuit", label: "Back Suit", image: backSuitIcon },
  { key: "imagesInsideUp", label: t("innerLining"), image: inside },
  { key: "imageButton", label: t("buttonStyle"), image: buttonStyle },
  { key: "imagesHoles", label: t("buttonHoles"), image: holes },
  { key: "sleeveButtons", label: t("sleeveButtons"), image: sleeves },
  { key: "textInside", label: t("textInside"), image: textInside },
  { key: "topCollar", label: t("topCollarColor"), image: topCollar },
  { key: "stitches", label: t("suitStitches"), image: null },
];

const DetailCard = React.memo(function DetailCard({ category, onClick }) {
  const handleClick = useCallback(
    () => onClick(category.key, category.label),
    [onClick, category.key, category.label]
  );
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Box
        onClick={handleClick}
        sx={{
          cursor: "pointer",
          borderRadius: "20px",
          border: "2px solid rgba(192, 211, 202, 0.2)",
          background:
            "linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(20, 20, 20, 0.9) 100%)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          transition: "all 0.3s ease",
          overflow: "hidden",
          position: "relative",
          width: "100px",
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          p: 0,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(192, 211, 202, 0.03) 0%, transparent 50%, rgba(192, 211, 202, 0.02) 100%)",
            pointerEvents: "none",
          },
          "&:hover": {
            border: "2px solid rgba(192, 211, 202, 0.4)",
            transform: "translateY(-2px)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {category.image ? (
            <img
              src={category.image}
              alt={category.label}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter:
                  "brightness(0.8) contrast(1.5) invert(1) sepia() saturate(0) hue-rotate(0deg)",
              }}
            />
          ) : (
            /* Stitches SVG icon fallback */
            <Box sx={{ width: "55%", height: "55%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.85 }}>
              <svg viewBox="0 0 64 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
                {[0,10,20,30,40,50].map((x, i) => (
                  <line key={i} x1={x} y1={i % 2 === 0 ? 8 : 24} x2={x + 7} y2={i % 2 === 0 ? 8 : 24} stroke="#C0D3CA" strokeWidth="2.5" strokeLinecap="round" />
                ))}
                <path d="M4 8 Q16 16 28 8 Q40 0 52 8" stroke="rgba(192,211,202,0.3)" strokeWidth="1" fill="none" />
                <path d="M4 24 Q16 16 28 24 Q40 32 52 24" stroke="rgba(192,211,202,0.3)" strokeWidth="1" fill="none" />
              </svg>
            </Box>
          )}
          <Typography
            sx={{
              position: "absolute",
              bottom: 4,
              left: 0,
              right: 0,
              fontSize: "0.7rem",
              fontWeight: 600,
              color: "#C0D3CA",
              textAlign: "center",
              letterSpacing: "0.5px",
              background:
                "linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)",
              py: 0.5,
              px: 1,
              zIndex: 2,
            }}
          >
            {category.label}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
});

const FinishingDetails = ({ isPantsMode, isMobile }) => {
  const { t } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [isCollarTextCurved, setIsCollarTextCurved] = useState(true);

  const [selectedSleeveButtons, setSelectedSleeveButtons] = useAtom(
    selectedSleeveButtonsAtom
  );
  const [selectedTopCollarColor, setSelectedTopCollarColor] = useAtom(
    selectedTopCollarColorAtom
  );
  const [selectedBackSuitCut, setSelectedBackSuitCut] = useAtom(
    selectedBackSuitCutAtom
  );
  const [selectedTopCollarText, setSelectedTopCollarText] = useAtom(
    selectedTopCollarTextAtom
  );
  const [selectedTopCollarTextColor, setSelectedTopCollarTextColor] = useAtom(
    selectedTopCollarTextColorAtom
  );
  const [, setShowTextInside] = useAtom(showTextInsideAtom);
  const currColor = useAtomValue(currentColorAtom);
  const selectedButton = useAtomValue(selectedButtonAtom);
  const [selectedSuitStitches, setSelectedSuitStitches] = useAtom(selectedSuitStitchesAtom);

  const detailCategories = getDetailCategories(t);

  const handleCategoryClick = (key, label) => {
    if (key === "textInside") {
      setShowTextInside(true);
      return;
    }
    setSelectedCategory(key);
    setDrawerTitle(label);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedCategory(null);
  };

  const renderSleeveButtonsContent = () => {
    const sleeveOptions = [
      { value: "none", label: t("noButtons"), description: t("cleanMinimalLook"), folder: null },
      { value: "tree", label: t("threeButtons"), description: t("classicThreeButtonStyle"), folder: "3Buttons" },
      { value: "four", label: t("fourButtons"), description: t("modernFourButtonDesign"), folder: "4Buttons" },
      { value: "five", label: t("fiveButtons"), description: t("premiumFiveButtonFinish"), folder: "5Buttons" },
    ];

    const getButtonFolder = (val) => sleeveOptions.find((o) => o.value === val)?.folder || null;

    return (
      <Box>
        {/* Sleeve Preview — zoomed into the sleeve/wrist area */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          sx={{
            position: "relative",
            width: { xs: 200, md: 260 },
            height: { xs: 200, md: 260 },
            margin: "0 auto 28px",
            borderRadius: "20px",
            overflow: "hidden",
            border: "2px solid rgba(192, 211, 202, 0.2)",
            background: "linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Zoom wrapper — scales & positions to show only the sleeve/wrist area */}
          <Box
            sx={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              transform: "scale(3)",
              transformOrigin: "80% 85%",
            }}
          >
            {/* Base sleeve image from S3 */}
            <img
              src={`${S3_BASE_URL}/assets_V3/Ragach/sleeves/${currColor}.webp`}
              alt="sleeve"
              style={{
                position: "absolute",
                top: 0, left: 0,
                width: "100%", height: "100%",
                objectFit: "contain",
              }}
            />
            {/* Button overlay — animates on selection change */}
            <AnimatePresence mode="wait">
              {selectedSleeveButtons !== "none" && (
                <motion.img
                  key={selectedSleeveButtons}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  src={`${S3_BASE_URL}/assets_V3/adds/button/backSuit/${getButtonFolder(selectedSleeveButtons)}/${selectedButton || 'black'}.webp`}
                  alt={`${selectedSleeveButtons} buttons`}
                  style={{
                    position: "absolute",
                    top: 0, left: 0,
                    width: "100%", height: "100%",
                    objectFit: "contain",
                  }}
                />
              )}
            </AnimatePresence>
          </Box>
          {/* Badge - outside zoom wrapper so it stays readable */}
          <Box sx={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", borderRadius: "20px", px: 1.5, py: 0.3, border: "1px solid rgba(192, 211, 202, 0.3)", whiteSpace: "nowrap", zIndex: 10 }}>
            <Typography sx={{ fontSize: "0.7rem", color: "#C0D3CA", fontWeight: 600 }}>
              {sleeveOptions.find((o) => o.value === selectedSleeveButtons)?.label}
            </Typography>
          </Box>
        </Box>

        {/* Options */}
        <Grid container spacing={{ xs: 1, md: 2 }} justifyContent="center">
          {sleeveOptions.map((option, index) => (
            <Grid item key={option.value}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Box
                  onClick={() => setSelectedSleeveButtons(option.value)}
                  sx={{
                    width: { xs: 70, md: 90 },
                    minHeight: { xs: 75, md: 85 },
                    background: selectedSleeveButtons === option.value
                      ? "linear-gradient(135deg, rgba(192, 211, 202, 0.9) 0%, rgba(192, 211, 202, 0.8) 100%)"
                      : "linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(20, 20, 20, 0.9) 100%)",
                    color: selectedSleeveButtons === option.value ? "#000" : "#C0D3CA",
                    border: selectedSleeveButtons === option.value
                      ? "2px solid rgba(192, 211, 202, 0.8)"
                      : "1px solid rgba(192, 211, 202, 0.2)",
                    borderRadius: "16px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 1.5,
                    gap: 0.5,
                    transition: "all 0.3s ease",
                    boxShadow: selectedSleeveButtons === option.value
                      ? "0 8px 24px rgba(192, 211, 202, 0.3)"
                      : "0 4px 12px rgba(0, 0, 0, 0.2)",
                    backdropFilter: "blur(10px)",
                    "&:hover": {
                      border: "2px solid rgba(192, 211, 202, 0.4)",
                      background: selectedSleeveButtons === option.value
                        ? "linear-gradient(135deg, rgba(192, 211, 202, 1) 0%, rgba(192, 211, 202, 0.9) 100%)"
                        : "linear-gradient(135deg, rgba(40, 40, 40, 0.8) 0%, rgba(30, 30, 30, 0.9) 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 32px rgba(192, 211, 202, 0.2)",
                    },
                  }}
                >
                  {/* Dot indicators for button count */}
                  {option.value !== "none" && (
                    <Box sx={{ display: "flex", gap: 0.4, mb: 0.3 }}>
                      {Array.from({ length: option.value === "tree" ? 3 : option.value === "four" ? 4 : 5 }).map((_, i) => (
                        <Box key={i} sx={{ width: 5, height: 5, borderRadius: "50%", background: selectedSleeveButtons === option.value ? "rgba(0,0,0,0.6)" : "rgba(192, 211, 202, 0.7)" }} />
                      ))}
                    </Box>
                  )}
                  <Typography sx={{ fontWeight: 600, fontSize: { xs: "0.7rem", md: "0.85rem" }, textAlign: "center" }}>
                    {option.label}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: "0.6rem", md: "0.7rem" }, textAlign: "center", opacity: 0.8, lineHeight: 1.2 }}>
                    {option.description}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };



  const renderBackSuitContent = () => {
    const cutOptions = [
      {
        value: "oneCut",
        label: "One Cut",
        labelHe: "חתך אחד",
        description: "Center single vent",
      },
      {
        value: "twoCut",
        label: "Two Cuts",
        labelHe: "שני חתכים",
        description: "Double side vents",
      },
    ];

    return (
      <Box>
        {/* Back Suit Preview */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          sx={{
            position: "relative",
            width: { xs: 200, md: 260 },
            height: { xs: 200, md: 260 },
            margin: "0 auto 28px",
            borderRadius: "20px",
            overflow: "hidden",
            border: "2px solid rgba(192, 211, 202, 0.2)",
            background:
              "linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Layer 1: allBack — base image always visible */}
          <img
            src={`${S3_BASE_URL}/assets_V3/Ragach/backSuit/allBack/${currColor}.webp`}
            alt="back suit"
            style={{
              position: "absolute",
              top: 0, left: 0,
              width: "100%", height: "100%",
              objectFit: "contain",
            }}
          />
          {/* Layer 2: Cut type — oneCut or towCut */}
          <AnimatePresence mode="wait">
            <motion.img
              key={selectedBackSuitCut}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={`${S3_BASE_URL}/assets_V3/Ragach/backSuit/${selectedBackSuitCut === "twoCut" ? "towCut" : "oneCut"}/${currColor}.webp`}
              alt={selectedBackSuitCut}
              style={{
                position: "absolute",
                top: 0, left: 0,
                width: "100%", height: "100%",
                objectFit: "contain",
              }}
            />
          </AnimatePresence>
          {/* Layer 3: Collar overlay */}
          <img
            src={`${S3_BASE_URL}/assets_V3/Ragach/backSuit/collar/${currColor}.webp`}
            alt="collar"
            style={{
              position: "absolute",
              top: 0, left: 0,
              width: "100%", height: "100%",
              objectFit: "contain",
            }}
          />

          {/* Cut label badge */}
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
              borderRadius: "20px",
              px: 1.5,
              py: 0.3,
              border: "1px solid rgba(192, 211, 202, 0.3)",
            }}
          >
            <Typography sx={{ fontSize: "0.7rem", color: "#C0D3CA", fontWeight: 600 }}>
              {selectedBackSuitCut === "oneCut" ? "One Cut" : "Two Cuts"}
            </Typography>
          </Box>
        </Box>

        {/* Cut Selection Buttons */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 2 }}>
          {cutOptions.map((option, index) => (
            <motion.div
              key={option.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.12 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box
                onClick={() => setSelectedBackSuitCut(option.value)}
                sx={{
                  width: { xs: 110, md: 140 },
                  py: 2,
                  px: 1.5,
                  background:
                    selectedBackSuitCut === option.value
                      ? "linear-gradient(135deg, rgba(192, 211, 202, 0.9) 0%, rgba(192, 211, 202, 0.8) 100%)"
                      : "linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(20, 20, 20, 0.9) 100%)",
                  color:
                    selectedBackSuitCut === option.value ? "#000" : "#C0D3CA",
                  border:
                    selectedBackSuitCut === option.value
                      ? "2px solid rgba(192, 211, 202, 0.8)"
                      : "1px solid rgba(192, 211, 202, 0.2)",
                  borderRadius: "18px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  transition: "all 0.3s ease",
                  boxShadow:
                    selectedBackSuitCut === option.value
                      ? "0 8px 24px rgba(192, 211, 202, 0.3)"
                      : "0 4px 12px rgba(0, 0, 0, 0.2)",
                  backdropFilter: "blur(10px)",
                  "&:hover": {
                    border: "2px solid rgba(192, 211, 202, 0.5)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 32px rgba(192, 211, 202, 0.2)",
                  },
                }}
              >
                {/* Vent visual indicator */}
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    gap: option.value === "twoCut" ? 1.5 : 0,
                    mb: 0.5,
                  }}
                >
                  {option.value === "oneCut" ? (
                    <Box
                      sx={{
                        width: 3,
                        height: 24,
                        background:
                          selectedBackSuitCut === option.value
                            ? "rgba(0,0,0,0.6)"
                            : "rgba(192, 211, 202, 0.7)",
                        borderRadius: 2,
                      }}
                    />
                  ) : (
                    <>
                      <Box
                        sx={{
                          width: 3,
                          height: 24,
                          background:
                            selectedBackSuitCut === option.value
                              ? "rgba(0,0,0,0.6)"
                              : "rgba(192, 211, 202, 0.7)",
                          borderRadius: 2,
                        }}
                      />
                      <Box
                        sx={{
                          width: 3,
                          height: 24,
                          background:
                            selectedBackSuitCut === option.value
                              ? "rgba(0,0,0,0.6)"
                              : "rgba(192, 211, 202, 0.7)",
                          borderRadius: 2,
                        }}
                      />
                    </>
                  )}
                </Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "0.85rem", md: "0.95rem" },
                    textAlign: "center",
                  }}
                >
                  {option.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "0.68rem", md: "0.75rem" },
                    textAlign: "center",
                    opacity: 0.75,
                    lineHeight: 1.2,
                  }}
                >
                  {option.labelHe}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.65rem",
                    textAlign: "center",
                    opacity: 0.6,
                    lineHeight: 1.2,
                    mt: 0.3,
                  }}
                >
                  {option.description}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>
    );
  };

  const renderTopCollarContent = () => {
    const presetColors = [
      { hex: "#ffffff", label: t("white") || "White" },
      { hex: "#d4af37", label: t("gold") || "Gold" },
      { hex: "#c0c0c0", label: t("silver") || "Silver" },
      { hex: "#000000", label: t("black") || "Black" },
      { hex: "#1a237e", label: t("blue") || "Blue" },
      { hex: "#7b0d1e", label: t("burgundy") || "Burgundy" },
      { hex: "#2e7d32", label: t("green") || "Green" },
      { hex: "#e91e63", label: t("pink") || "Pink" },
    ];

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

        {/* Collar Preview — dark themed, zoomed to collar area */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          sx={{
            position: "relative",
            width: { xs: 240, md: 290 },
            height: { xs: 180, md: 210 },
            margin: "0 auto",
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid rgba(192, 211, 202, 0.15)",
            background: "#0a0a0a",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(192,211,202,0.05)",
          }}
        >
          {/* Icon — inverted to match dark theme */}
          <img
            src={topCollar}
            alt="collar"
            style={{
              position: "absolute",
              width: "240%",
              height: "240%",
              top: "-15%",
              left: "-70%",
              objectFit: "contain",
              objectPosition: "center top",
              filter: "invert(1) brightness(0.7) contrast(1.2)",
              opacity: 0.85,
            }}
          />

          {/* Text overlay — on the collar fold (~8% from top) */}
          {selectedTopCollarText && (
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              sx={{
                position: "absolute",
                top: "9%",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
                pointerEvents: "none",
              }}
            >
              {isCollarTextCurved ? (
                // Cursive / script font style
                <Typography
                  sx={{
                    color: selectedTopCollarTextColor,
                    fontSize: "1.4rem",
                    fontFamily: "'Great Vibes', cursive",
                    fontWeight: 400,
                    letterSpacing: "0.05em",
                    textShadow: `0 1px 8px rgba(0,0,0,0.95), 0 0 20px rgba(0,0,0,0.8)`,
                    whiteSpace: "nowrap",
                    userSelect: "none",
                    transition: "color 0.2s ease",
                  }}
                >
                  {selectedTopCollarText}
                </Typography>
              ) : (
                // Straight / serif font style
                <Typography
                  sx={{
                    color: selectedTopCollarTextColor,
                    fontSize: "0.9rem",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textShadow: `0 1px 6px rgba(0,0,0,0.9), 0 0 16px rgba(0,0,0,0.7)`,
                    whiteSpace: "nowrap",
                    userSelect: "none",
                    transition: "color 0.2s ease",
                  }}
                >
                  {selectedTopCollarText}
                </Typography>
              )}
            </Box>
          )}

          {/* Empty hint */}
          {!selectedTopCollarText && (
            <Box sx={{ position: "absolute", bottom: 12, left: 0, right: 0, textAlign: "center", zIndex: 5 }}>
              <Typography sx={{ fontSize: "0.6rem", color: "rgba(192,211,202,0.3)", fontStyle: "italic", letterSpacing: "0.05em" }}>
                {t("enterTextOnCollar")}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Text Input */}
        <Box sx={{ px: 1 }}>
          <Typography sx={{ color: "rgba(192,211,202,0.8)", fontSize: "0.8rem", mb: 1, fontWeight: 500 }}>
            {t("collarInscription")}
          </Typography>
          <Box
            component="input"
            value={selectedTopCollarText}
            onChange={(e) => setSelectedTopCollarText(e.target.value)}
            placeholder={t("enterNameText")}
            maxLength={30}
            sx={{
              width: "100%",
              background: "rgba(15,15,15,0.9)",
              border: "1px solid rgba(192,211,202,0.2)",
              borderRadius: "12px",
              color: selectedTopCollarTextColor,
              fontSize: "1rem",
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              letterSpacing: "0.05em",
              px: 2,
              py: 1.2,
              outline: "none",
              transition: "border 0.2s ease, box-shadow 0.2s ease",
              "&:focus": {
                border: "1px solid rgba(192,211,202,0.5)",
                boxShadow: "0 0 0 3px rgba(192,211,202,0.08)",
              },
              "&::placeholder": { color: "rgba(192,211,202,0.25)", fontFamily: "inherit" },
              boxSizing: "border-box",
            }}
          />
          <Typography sx={{ color: "rgba(192,211,202,0.3)", fontSize: "0.65rem", mt: 0.5, textAlign: "right" }}>
            {selectedTopCollarText.length}/30
          </Typography>
        </Box>

        {/* Straight / Curved toggle */}
        <Box sx={{ px: 1 }}>
          <Typography sx={{ color: "rgba(192,211,202,0.8)", fontSize: "0.8rem", mb: 1.5, fontWeight: 500 }}>
            {t("writingStyle")}
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5 }}>
            {[
              { value: false, label: t("straightStyle"), desc: "straight" },
              { value: true, label: t("curvedStyle"), desc: "curved" },
            ].map((opt) => (
              <motion.div key={opt.desc} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Box
                  onClick={() => setIsCollarTextCurved(opt.value)}
                  sx={{
                    px: 2.5, py: 1,
                    borderRadius: "12px",
                    cursor: "pointer",
                    background: isCollarTextCurved === opt.value
                      ? "linear-gradient(135deg, rgba(192,211,202,0.15) 0%, rgba(192,211,202,0.08) 100%)"
                      : "rgba(15,15,15,0.8)",
                    border: isCollarTextCurved === opt.value
                      ? "1px solid rgba(192,211,202,0.5)"
                      : "1px solid rgba(192,211,202,0.1)",
                    transition: "all 0.2s ease",
                    boxShadow: isCollarTextCurved === opt.value
                      ? "0 4px 16px rgba(192,211,202,0.1)"
                      : "none",
                  }}
                >
                  <Typography sx={{
                    color: isCollarTextCurved === opt.value ? "#C0D3CA" : "rgba(192,211,202,0.45)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    whiteSpace: "nowrap",
                    transition: "color 0.2s ease",
                  }}>
                    {opt.label}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>

        {/* Text Color */}
        <Box sx={{ px: 1 }}>
          <Typography sx={{ color: "rgba(192,211,202,0.8)", fontSize: "0.8rem", mb: 1.5, fontWeight: 500 }}>
            {t("inscriptionColor")}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center" }}>
            {presetColors.map((c) => (
              <motion.div key={c.hex} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                <Box
                  onClick={() => setSelectedTopCollarTextColor(c.hex)}
                  title={c.label}
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    backgroundColor: c.hex,
                    border: selectedTopCollarTextColor === c.hex
                      ? "3px solid rgba(192,211,202,0.9)"
                      : "2px solid rgba(192,211,202,0.2)",
                    cursor: "pointer",
                    boxShadow: selectedTopCollarTextColor === c.hex
                      ? "0 0 0 2px rgba(192,211,202,0.3)"
                      : "none",
                    transition: "all 0.2s ease",
                    outline: c.hex === "#000000" ? "1px solid rgba(255,255,255,0.1)" : "none",
                  }}
                />
              </motion.div>
            ))}

            {/* Custom color picker */}
            <Box sx={{ position: "relative", width: 34, height: 34 }}>
              <Box
                component="input"
                type="color"
                value={selectedTopCollarTextColor}
                onChange={(e) => setSelectedTopCollarTextColor(e.target.value)}
                title="צבע מותאם אישית"
                sx={{
                  width: "100%",
                  height: "100%",
                  border: "2px dashed rgba(192,211,202,0.4)",
                  borderRadius: "50%",
                  cursor: "pointer",
                  background: "transparent",
                  padding: 0,
                  opacity: 0,
                  position: "absolute",
                  top: 0, left: 0,
                }}
              />
              <Box sx={{
                width: 34, height: 34,
                borderRadius: "50%",
                border: "2px dashed rgba(192,211,202,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: `conic-gradient(red, yellow, lime, cyan, blue, magenta, red)`,
                opacity: 0.8,
                pointerEvents: "none",
              }} />
            </Box>
          </Box>

          {/* Preview of selected color */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
            <Box sx={{ width: 16, height: 16, borderRadius: "4px", backgroundColor: selectedTopCollarTextColor, border: "1px solid rgba(255,255,255,0.2)" }} />
            <Typography sx={{ fontSize: "0.7rem", color: "rgba(192,211,202,0.6)", fontFamily: "monospace" }}>
              {selectedTopCollarTextColor}
            </Typography>
          </Box>
        </Box>

      </Box>
    );
  };

  const renderStitchesContent = () => {
    const stitchOptions = [
      {
        value: "none",
        label: t("noStitches"),
        description: t("noStitchesDesc"),
        color: null,
      },
      {
        value: "match",
        label: t("matchStitches"),
        description: t("matchStitchesDesc"),
        color: "#C0D3CA",
      },
      {
        value: "white",
        label: t("whiteStitches"),
        description: t("whiteStitchesDesc"),
        color: "#ffffff",
      },
      {
        value: "contrast",
        label: t("contrastStitches"),
        description: t("contrastStitchesDesc"),
        color: "#d4af37",
      },
    ];

    return (
      <Box>
        {/* Stitch preview visual */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          sx={{
            position: "relative",
            width: { xs: 200, md: 260 },
            height: { xs: 120, md: 140 },
            margin: "0 auto 28px",
            borderRadius: "16px",
            overflow: "hidden",
            border: "2px solid rgba(192, 211, 202, 0.2)",
            background: "linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Fabric background */}
          <Box sx={{
            position: "absolute",
            inset: 0,
            background: "repeating-linear-gradient(45deg, rgba(192,211,202,0.04) 0px, rgba(192,211,202,0.04) 1px, transparent 1px, transparent 8px)",
          }} />
          {/* Stitch line visualization */}
          <AnimatePresence mode="wait">
            {selectedSuitStitches !== "none" ? (
              <motion.svg
                key={selectedSuitStitches}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                viewBox="0 0 260 100"
                style={{ width: "90%", height: "80%" }}
              >
                {/* Jacket lapel outline */}
                <path
                  d="M40 10 L40 90 M220 10 L220 90 M40 10 Q130 50 220 10"
                  stroke="rgba(192,211,202,0.25)"
                  strokeWidth="1"
                  fill="none"
                />
                {/* Stitch dashes along lapel */}
                {[0,14,28,42,56,70,84,98,112,126,140,154,168,182].map((x, i) => (
                  <line
                    key={i}
                    x1={40 + x * 1.28}
                    y1={10 + Math.sin(i * 0.5) * 30}
                    x2={40 + x * 1.28 + 8}
                    y2={10 + Math.sin(i * 0.5) * 30}
                    stroke={
                      selectedSuitStitches === "white" ? "#ffffff" :
                      selectedSuitStitches === "contrast" ? "#d4af37" :
                      "#C0D3CA"
                    }
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ))}
              </motion.svg>
            ) : (
              <motion.div
                key="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Typography sx={{ color: "rgba(192,211,202,0.3)", fontSize: "0.75rem", fontStyle: "italic" }}>
                  {t("noStitches")}
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Badge */}
          <Box sx={{
            position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
            borderRadius: "20px", px: 1.5, py: 0.3,
            border: "1px solid rgba(192, 211, 202, 0.3)", whiteSpace: "nowrap", zIndex: 10,
          }}>
            <Typography sx={{ fontSize: "0.7rem", color: "#C0D3CA", fontWeight: 600 }}>
              {stitchOptions.find(o => o.value === selectedSuitStitches)?.label}
            </Typography>
          </Box>
        </Box>

        {/* Options */}
        <Grid container spacing={{ xs: 1, md: 2 }} justifyContent="center">
          {stitchOptions.map((option, index) => (
            <Grid item key={option.value}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Box
                  onClick={() => setSelectedSuitStitches(option.value)}
                  sx={{
                    width: { xs: 80, md: 100 },
                    minHeight: { xs: 90, md: 100 },
                    background: selectedSuitStitches === option.value
                      ? "linear-gradient(135deg, rgba(192, 211, 202, 0.9) 0%, rgba(192, 211, 202, 0.8) 100%)"
                      : "linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(20, 20, 20, 0.9) 100%)",
                    color: selectedSuitStitches === option.value ? "#000" : "#C0D3CA",
                    border: selectedSuitStitches === option.value
                      ? "2px solid rgba(192, 211, 202, 0.8)"
                      : "1px solid rgba(192, 211, 202, 0.2)",
                    borderRadius: "16px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 1.5,
                    gap: 0.5,
                    transition: "all 0.3s ease",
                    boxShadow: selectedSuitStitches === option.value
                      ? "0 8px 24px rgba(192, 211, 202, 0.3)"
                      : "0 4px 12px rgba(0, 0, 0, 0.2)",
                    backdropFilter: "blur(10px)",
                    "&:hover": {
                      border: "2px solid rgba(192, 211, 202, 0.4)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 32px rgba(192, 211, 202, 0.2)",
                    },
                  }}
                >
                  {/* Stitch visual indicator */}
                  {option.value !== "none" ? (
                    <Box sx={{ display: "flex", gap: 0.3, mb: 0.3 }}>
                      {[0,1,2,3,4].map((i) => (
                        <Box key={i} sx={{
                          width: 5, height: 2,
                          borderRadius: "1px",
                          background: selectedSuitStitches === option.value
                            ? "rgba(0,0,0,0.5)"
                            : (option.color || "rgba(192,211,202,0.7)"),
                        }} />
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ width: 28, height: 6, mb: 0.3 }} />
                  )}
                  <Typography sx={{ fontWeight: 600, fontSize: { xs: "0.7rem", md: "0.82rem" }, textAlign: "center" }}>
                    {option.label}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: "0.58rem", md: "0.68rem" }, textAlign: "center", opacity: 0.8, lineHeight: 1.2 }}>
                    {option.description}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderDrawerContent = () => {
    switch (selectedCategory) {
      case "backSuit":
        return renderBackSuitContent();
      case "sleeveButtons":
        return renderSleeveButtonsContent();
      case "topCollar":
        return renderTopCollarContent();
      case "stitches":
        return renderStitchesContent();
      case "imagesInsideUp":
        return <ButtonInside handleCloseDrawer={handleDrawerClose} />;
      case "imagesHoles":
        return <ButtonHoles handleCloseDrawer={handleDrawerClose} />;
      case "imageButton":
        return <ButtonButton handleCloseDrawer={handleDrawerClose} />;
      default:
        return null;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };
  // itemVariants moved to module scope

  if (isPantsMode) {
    return (
      <Box sx={{ width: "100%", height: "100%" }}>
        {!isMobile && (
          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: 500,
              color: "#C0D3CA",
              mb: 3,
              textAlign: "center",
            }}
          >
            {t("pantsCustomization")}
          </Typography>
        )}
        <PantsControls isMobile={isMobile} />
      </Box>
    );
  }

  // Mobile horizontal layout
  if (isMobile) {
    return (
      <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          gap: 3,
          minWidth: "fit-content",
        }}
      >
        {detailCategories.map((category) => (
          <DetailCard
            key={category.key}
            category={category}
            onClick={handleCategoryClick}
          />
        ))}

        {/* Drawers for mobile */}
        <Drawer
          anchor="bottom"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              height: "50vh",
              width: "100%",
              background:
                "linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(25, 25, 25, 0.98) 100%)",
              backdropFilter: "blur(20px)",
              color: "#fff",
              border: "1px solid rgba(192, 211, 202, 0.2)",
              boxShadow: "0 -20px 60px rgba(0, 0, 0, 0.5)",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(135deg, rgba(192, 211, 202, 0.03) 0%, transparent 50%, rgba(192, 211, 202, 0.02) 100%)",
                pointerEvents: "none",
              },
              transitionDuration: "0.6s",
              "& .MuiDrawer-paper": {
                borderTopLeftRadius: "24px",
                borderTopRightRadius: "24px",
              },
            },
          }}
          BackdropProps={{
            invisible: false,
            sx: { backgroundColor: "transparent" },
          }}
        >
          <Box sx={{ p: 3, maxHeight: "100%", overflow: "auto" }}>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                component={motion.div}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                sx={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "#C0D3CA",
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                {drawerTitle}
              </Typography>
              <IconButton
                onClick={() => setDrawerOpen(false)}
                component={motion.div}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                sx={{
                  color: "#C0D3CA",
                  background: "rgba(192, 211, 202, 0.1)",
                  "&:hover": {
                    background: "rgba(192, 211, 202, 0.2)",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Content */}
            {renderDrawerContent()}
          </Box>
        </Drawer>

        <TextInsideModal />
      </Box>
    );
  }

  // Desktop vertical layout
  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{ width: "100%", height: "100%" }}
    >
      {/* Description */}
      <Typography
        sx={{
          fontSize: "1rem",
          color: "rgba(192, 211, 202, 0.8)",
          textAlign: "center",
          mb: 4,
          fontWeight: 300,
          lineHeight: 1.5,
        }}
      >
        {t("addFinishingTouches")}
        <br />
        {t("customizeButtonsLinings")}
      </Typography>

      {/* Details Grid */}
      <Grid container spacing={2.5}>
        {detailCategories.map((category) => (
          <Grid item xs={6} sm={4} md={6} key={category.key}>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box
                onClick={() =>
                  handleCategoryClick(category.key, category.label)
                }
                sx={{
                  position: "relative",
                  cursor: "pointer",
                  borderRadius: "16px",
                  border: "1px solid rgba(192, 211, 202, 0.15)",
                  background:
                    "linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(20, 20, 20, 0.9) 100%)",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                  overflow: "hidden",
                  aspectRatio: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 0,
                  backdropFilter: "blur(10px)",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "linear-gradient(135deg, rgba(192, 211, 202, 0.05) 0%, transparent 50%)",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  },
                  "&:hover": {
                    border: "2px solid rgba(192, 211, 202, 0.4)",
                    background:
                      "linear-gradient(135deg, rgba(40, 40, 40, 0.8) 0%, rgba(30, 30, 30, 0.9) 100%)",
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 32px rgba(192, 211, 202, 0.15)",
                    "&::before": {
                      opacity: 1,
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.label}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter:
                          "brightness(0.8) contrast(1.5) invert(1) sepia() saturate(0) hue-rotate(0deg)",
                        transition: "all 0.3s ease",
                      }}
                    />
                  ) : (
                    /* Stitches SVG icon fallback */
                    <Box sx={{ width: "55%", height: "55%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.85 }}>
                      <svg viewBox="0 0 64 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
                        {[0,10,20,30,40,50].map((x, i) => (
                          <line key={i} x1={x} y1={i % 2 === 0 ? 8 : 24} x2={x + 7} y2={i % 2 === 0 ? 8 : 24} stroke="#C0D3CA" strokeWidth="2.5" strokeLinecap="round" />
                        ))}
                        <path d="M4 8 Q16 16 28 8 Q40 0 52 8" stroke="rgba(192,211,202,0.3)" strokeWidth="1" fill="none" />
                        <path d="M4 24 Q16 16 28 24 Q40 32 52 24" stroke="rgba(192,211,202,0.3)" strokeWidth="1" fill="none" />
                      </svg>
                    </Box>
                  )}
                  <Typography
                    sx={{
                      position: "absolute",
                      bottom: 4,
                      left: 0,
                      right: 0,
                      fontSize: { xs: "0.75rem", md: "0.85rem" },
                      fontWeight: 600,
                      color: "#C0D3CA",
                      textAlign: "center",
                      letterSpacing: "0.3px",
                      background:
                        "linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)",
                      py: 0.5,
                      px: 1,
                      zIndex: 2,
                    }}
                  >
                    {category.label}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Enhanced Drawer for Detail Customization */}
      <Drawer
        anchor="right"
        open={drawerOpen && selectedCategory !== "textInside"}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            width: "50vw",
            background:
              "linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(20, 20, 20, 0.98) 100%)",
            backdropFilter: "blur(20px)",
            color: "#fff",
            border: "1px solid rgba(192, 211, 202, 0.15)",
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 20% 20%, rgba(192, 211, 202, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(192, 211, 202, 0.02) 0%, transparent 50%)
              `,
              pointerEvents: "none",
            },
          },
        }}
        ModalProps={{ keepMounted: true }}
        transitionDuration={200}
        sx={{
          "& .MuiDrawer-paper": {
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important",
          },
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Enhanced Drawer Header */}
          <Box
            sx={{
              p: { xs: 2.5, md: 3 },
              pb: 2,
              background:
                "linear-gradient(135deg, rgba(192, 211, 202, 0.05) 0%, rgba(192, 211, 202, 0.02) 100%)",
              borderBottom: "1px solid rgba(192, 211, 202, 0.1)",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: "10%",
                right: "10%",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(192, 211, 202, 0.3) 50%, transparent 100%)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: { xs: "1.4rem", md: "1.6rem" },
                    fontWeight: 400,
                    color: "#C0D3CA",
                    letterSpacing: "0.5px",
                    mb: 0.5,
                  }}
                >
                  {drawerTitle}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(192, 211, 202, 0.7)",
                    fontSize: "0.85rem",
                    fontWeight: 300,
                    letterSpacing: "0.3px",
                  }}
                >
                  {selectedCategory === "sleeveButtons" &&
                    t("selectNumberOfButtons")}
                  {selectedCategory === "topCollar" &&
                    "כתוב טקסט שיופיע על הצווארון"}
                  {selectedCategory === "imagesInsideUp" &&
                    t("chooseInnerLiningStyle")}
                  {selectedCategory === "imageButton" && t("selectButtonStyle")}
                  {selectedCategory === "imagesHoles" &&
                    t("chooseButtonHoleColor")}
                </Typography>
              </Box>
              <IconButton
                onClick={handleDrawerClose}
                component={motion.button}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                sx={{
                  color: "#C0D3CA",
                  background: "rgba(192, 211, 202, 0.1)",
                  border: "1px solid rgba(192, 211, 202, 0.2)",
                  width: 40,
                  height: 40,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(192, 211, 202, 0.2)",
                    border: "1px solid rgba(192, 211, 202, 0.4)",
                    boxShadow: "0 4px 16px rgba(192, 211, 202, 0.2)",
                  },
                }}
              >
                <CloseIcon sx={{ fontSize: "1.2rem" }} />
              </IconButton>
            </Box>
          </Box>

          {/* Enhanced Drawer Content */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            sx={{
              flex: 1,
              p: { xs: 2.5, md: 3 },
              pt: 2,
              overflow: "auto",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "rgba(192, 211, 202, 0.05)",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(192, 211, 202, 0.2)",
                borderRadius: "3px",
                "&:hover": {
                  background: "rgba(192, 211, 202, 0.3)",
                },
              },
            }}
          >
            {renderDrawerContent()}
          </Box>
        </Box>
      </Drawer>

      {/* Text Inside Modal */}
      <TextInsideModal />
    </Box>
  );
};

export default React.memo(FinishingDetails);

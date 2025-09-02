import React, { useState } from "react";
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

import {
  selectedSleeveButtonsAtom,
  showTextInsideAtom,
  currentColorAtom,
  selectedTopCollarColorAtom,
} from "../../../Utils";

// Import existing button components
import ButtonInside from "../../../customSuite/leftSide/stepTree/ButtonInside";
import ButtonHoles from "../../../customSuite/leftSide/stepTree/ButtonHoles";
import ButtonButton from "../../../customSuite/leftSide/stepTree/ButtonButton";
import PantsControls from "../../PantsControls";
import TextInsideModal from "../../TextInsideModal";

// S3 Assets URLs
const S3_BASE_URL = "https://ch-suits.s3.us-east-1.amazonaws.com";
const inside = `${S3_BASE_URL}/assets/kinds/insid.svg`;
const button = `${S3_BASE_URL}/assets/kinds/button.svg`;
const holes = `${S3_BASE_URL}/assets/kinds/AllSuit2.png`;

const FinishingDetails = ({ isPantsMode, isMobile }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [drawerTitle, setDrawerTitle] = useState("");

  const [selectedSleeveButtons, setSelectedSleeveButtons] = useAtom(
    selectedSleeveButtonsAtom
  );
  const [selectedTopCollarColor, setSelectedTopCollarColor] = useAtom(
    selectedTopCollarColorAtom
  );
  const [, setShowTextInside] = useAtom(showTextInsideAtom);
  const currColor = useAtomValue(currentColorAtom);

  const detailCategories = [
    { key: "imagesInsideUp", label: "Inner Lining", image: inside },
    { key: "imageButton", label: "Button Style", image: button },
    { key: "imagesHoles", label: "Button Holes", image: holes },
    { key: "sleeveButtons", label: "Sleeve Buttons", image: button },
    { key: "textInside", label: "Text Inside", image: inside },
    { key: "topCollar", label: "Top Collar Color", image: button },
  ];

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
      {
        value: "none",
        label: "No Buttons",
        description: "Clean, minimal look",
      },
      {
        value: "tree",
        label: "3 Buttons",
        description: "Classic three-button style",
      },
      {
        value: "four",
        label: "4 Buttons",
        description: "Modern four-button design",
      },
      {
        value: "five",
        label: "5 Buttons",
        description: "Premium five-button finish",
      },
    ];

    return (
      <Box>
        {/* Preview */}
        <Box
          sx={{
            position: "relative",
            width: { xs: 180, md: 250 },
            height: { xs: 180, md: 250 },
            margin: "0 auto 24px",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid rgba(192, 211, 202, 0.2)",
          }}
        >
          <img
            src={`/assets/adds/topCollar/body/${currColor}.png`}
            alt="body"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
          <img
            src={`/assets/adds/topCollar/bottom/${currColor}.png`}
            alt="bottom"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
          <img
            src={`/assets/adds/topCollar/sleeves/${currColor}.png`}
            alt="sleeves"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
          {selectedSleeveButtons !== "none" && (
            <img
              src={`/assets/adds/sleevseButton/${selectedSleeveButtons}/${currColor}.png`}
              alt={`Sleeve Buttons - ${selectedSleeveButtons}`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          )}
        </Box>

        {/* Enhanced Options */}
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
                    width: { xs: 60, md: 80 },
                    minHeight: { xs: 70, md: 80 },
                    background:
                      selectedSleeveButtons === option.value
                        ? "linear-gradient(135deg, rgba(192, 211, 202, 0.9) 0%, rgba(192, 211, 202, 0.8) 100%)"
                        : "linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(20, 20, 20, 0.9) 100%)",
                    color:
                      selectedSleeveButtons === option.value
                        ? "#000"
                        : "#C0D3CA",
                    border:
                      selectedSleeveButtons === option.value
                        ? "2px solid rgba(192, 211, 202, 0.8)"
                        : "1px solid rgba(192, 211, 202, 0.2)",
                    borderRadius: "16px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 1.5,
                    transition: "all 0.3s ease",
                    boxShadow:
                      selectedSleeveButtons === option.value
                        ? "0 8px 24px rgba(192, 211, 202, 0.3)"
                        : "0 4px 12px rgba(0, 0, 0, 0.2)",
                    backdropFilter: "blur(10px)",
                    "&:hover": {
                      border: "2px solid rgba(192, 211, 202, 0.4)",
                      background:
                        selectedSleeveButtons === option.value
                          ? "linear-gradient(135deg, rgba(192, 211, 202, 1) 0%, rgba(192, 211, 202, 0.9) 100%)"
                          : "linear-gradient(135deg, rgba(40, 40, 40, 0.8) 0%, rgba(30, 30, 30, 0.9) 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 32px rgba(192, 211, 202, 0.2)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "0.75rem", md: "0.9rem" },
                      textAlign: "center",
                      mb: 0.5,
                    }}
                  >
                    {option.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.65rem", md: "0.75rem" },
                      textAlign: "center",
                      opacity: 0.8,
                      lineHeight: 1.2,
                    }}
                  >
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

  const renderTopCollarContent = () => {
    const colorOptions = [
      {
        name: "black",
        color: "#222",
        label: "Black",
        description: "Classic black collar",
      },
      {
        name: "greyLight",
        color: "#d3d3d3",
        label: "Light Grey",
        description: "Subtle light grey",
      },
      {
        name: "grey",
        color: "#888",
        label: "Dark Grey",
        description: "Sophisticated dark grey",
      },
      {
        name: "bhez",
        color: "#e5d1b8",
        label: "Beige",
        description: "Warm beige tone",
      },
      {
        name: "red",
        color: "#c00",
        label: "Red",
        description: "Bold red accent",
      },
      {
        name: "blueLight",
        color: "#8ecae6",
        label: "Light Blue",
        description: "Fresh light blue",
      },
      {
        name: "white",
        color: "#fff",
        label: "White",
        description: "Clean white finish",
      },
    ];

    return (
      <Box>
        {/* Enhanced Preview */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          sx={{
            position: "relative",
            width: { xs: 200, md: 250 },
            height: { xs: 200, md: 250 },
            margin: "0 auto 24px",
            borderRadius: "20px",
            overflow: "hidden",
            border: "2px solid rgba(192, 211, 202, 0.2)",
            background:
              "linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(10px)",
          }}
        >
          <img
            src={`/assets/adds/topCollar/body/${currColor}.png`}
            alt="body"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
          <img
            src={`/assets/adds/topCollar/bottom/${currColor}.png`}
            alt="bottom"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
          <img
            src={`/assets/adds/topCollar/sleeves/${currColor}.png`}
            alt="sleeves"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
          <img
            src={`/assets/adds/topCollar/topColor/${selectedTopCollarColor}.png`}
            alt="topColor"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </Box>

        {/* Enhanced Color Options */}
        <Grid container spacing={{ xs: 1, md: 2 }} justifyContent="center">
          {colorOptions.map((item, index) => (
            <Grid item key={item.name}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    onClick={() => setSelectedTopCollarColor(item.name)}
                    sx={{
                      width: { xs: 35, md: 50 },
                      height: { xs: 35, md: 50 },
                      backgroundColor: item.color,
                      border:
                        selectedTopCollarColor === item.name
                          ? "3px solid rgba(192, 211, 202, 0.8)"
                          : "2px solid rgba(192, 211, 202, 0.2)",
                      borderRadius: "50%",
                      cursor: "pointer",
                      mb: 1,
                      boxShadow:
                        selectedTopCollarColor === item.name
                          ? "0 6px 20px rgba(192, 211, 202, 0.4)"
                          : "0 2px 8px rgba(0, 0, 0, 0.2)",
                      transition: "all 0.3s ease",
                      backdropFilter: "blur(10px)",
                      "&:hover": {
                        transform: "scale(1.1)",
                        boxShadow: "0 8px 24px rgba(192, 211, 202, 0.3)",
                        border: "3px solid rgba(192, 211, 202, 0.6)",
                      },
                    }}
                  />
                  <Typography
                    sx={{
                      color: "#C0D3CA",
                      fontSize: { xs: "0.7rem", md: "0.8rem" },
                      fontWeight: 500,
                      textAlign: "center",
                      mb: 0.5,
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(192, 211, 202, 0.7)",
                      fontSize: { xs: "0.6rem", md: "0.7rem" },
                      fontWeight: 300,
                      textAlign: "center",
                      lineHeight: 1.2,
                    }}
                  >
                    {item.description}
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
      case "sleeveButtons":
        return renderSleeveButtonsContent();
      case "topCollar":
        return renderTopCollarContent();
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4 },
    },
  };

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
            Pants Customization
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
          <motion.div
            key={category.key}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Box
              onClick={() => handleCategoryClick(category.key, category.label)}
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
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
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
              {/* Icon Container */}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <img
                  src={category.image}
                  alt={category.label}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    filter:
                      "brightness(1.2) contrast(0.8) invert(1) sepia(0) saturate(0) hue-rotate(0deg)",
                    opacity: 0.9,
                  }}
                />
              </Box>

              {/* Label */}
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  color: "#C0D3CA",
                  textAlign: "center",
                  letterSpacing: "0.5px",
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                  lineHeight: 1.2,
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {category.label}
              </Typography>
            </Box>
          </motion.div>
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
        Add the finishing touches that make your suit uniquely yours.
        <br />
        Customize buttons, linings, and special details.
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
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: { xs: 1.5, md: 2 },
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
                {/* Enhanced Category Icon */}
                <Box
                  sx={{
                    width: { xs: 36, md: 44 },
                    height: { xs: 36, md: 44 },
                    mb: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      background:
                        "radial-gradient(circle, rgba(192, 211, 202, 0.1) 0%, transparent 70%)",
                      borderRadius: "50%",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                    },
                  }}
                >
                  <img
                    src={category.image}
                    alt={category.label}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      filter:
                        "brightness(1.3) contrast(0.9) invert(1) sepia(0) saturate(0) hue-rotate(0deg)",
                      opacity: 0.95,
                      transition: "all 0.3s ease",
                    }}
                  />
                </Box>

                {/* Enhanced Category Label */}
                <Typography
                  sx={{
                    color: "#C0D3CA",
                    fontSize: { xs: "0.85rem", md: "0.95rem" },
                    fontWeight: 600,
                    textAlign: "center",
                    lineHeight: 1.3,
                    letterSpacing: "0.3px",
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  {category.label}
                </Typography>
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
                    "Select the number of buttons for your sleeve cuffs"}
                  {selectedCategory === "topCollar" &&
                    "Select the color for your top collar accent"}
                  {selectedCategory === "imagesInsideUp" &&
                    "Choose your inner lining style"}
                  {selectedCategory === "imageButton" &&
                    "Select your button style"}
                  {selectedCategory === "imagesHoles" &&
                    "Choose your button hole color"}
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

export default FinishingDetails;

import React, { useState } from "react";
import {
  selectedPantsHemAtom,
  selectedPantsKindAtom,
  selectedPantsButtonKindAtom,
  selectedPantsLoopsAtom,
  selectedPantsIronAtom,
} from "../Utils";
import { useAtom } from "jotai";
import {
  Box,
  Button,
  Drawer,
  Typography,
  Grid,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { makeStyles } from "@mui/styles";
import { useLanguage } from "../context/LanguageContext";

import hem from "../assets/icons/pant/hem.webp";
import iron from "../assets/icons/pant/iron.webp";
import kind from "../assets/icons/pant/kind.webp";
import buttons from "../assets/icons/pant/button.webp";
import loops from "../assets/icons/pant/loops.webp";

const useStyles = makeStyles({
  root: {
    backgroundColor: "rgba(20, 20, 20, 0.8)",
    borderRadius: "4px",
    border: "1px solid rgba(192, 211, 202, 0.2)",
    padding: "20px",
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "1.8rem !important",
    fontWeight: "300 !important",
    marginBottom: "1.5rem !important",
    color: "#C0D3CA !important",
    textAlign: "center",
    letterSpacing: "0.05em !important",
  },
  controlButton: {
    backgroundColor: "rgba(30, 30, 30, 0.6) !important",
    border: "1px solid rgba(192, 211, 202, 0.2) !important",
    color: "#C0D3CA !important",
    padding: "16px 24px !important",
    borderRadius: "4px !important",
    textTransform: "none !important",
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    fontWeight: "400 !important",
    letterSpacing: "0.05em !important",
    transition: "all 0.3s ease !important",
    width: "100% !important",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.1) !important",
      border: "1px solid rgba(192, 211, 202, 0.4) !important",
      transform: "translateY(-2px)",
    },
  },
  drawerPaper: {
    backgroundColor: "#0a0a0a !important",
    color: "#fff !important",
    borderLeft: "1px solid rgba(192, 211, 202, 0.3) !important",
  },
  drawerTitle: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "1.5rem !important",
    fontWeight: "300 !important",
    marginBottom: "1rem !important",
    color: "#C0D3CA !important",
    letterSpacing: "0.05em !important",
  },
  closeButton: {
    color: "#C0D3CA !important",
    border: "1px solid rgba(192, 211, 202, 0.4) !important",
    padding: "8px !important",
    borderRadius: "0 !important",
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.7rem !important",
    letterSpacing: "0.1em !important",
    transition: "all 0.3s ease !important",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.2) !important",
    },
  },
  divider: {
    backgroundColor: "rgba(192, 211, 202, 0.3) !important",
    margin: "1rem 0 !important",
  },
  listItem: {
    backgroundColor: "rgba(30, 30, 30, 0.6) !important",
    marginBottom: "8px !important",
    borderRadius: "4px !important",
    border: "1px solid rgba(192, 211, 202, 0.1) !important",
    transition: "all 0.3s ease !important",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.1) !important",
      border: "1px solid rgba(192, 211, 202, 0.3) !important",
    },
  },
  selectedListItem: {
    backgroundColor: "rgba(192, 211, 202, 0.1) !important",
    border: "1px solid rgba(192, 211, 202, 0.5) !important",
  },
  listItemText: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    fontWeight: "400 !important",
    color: "#C0D3CA !important",
    letterSpacing: "0.05em !important",
  },
  checkIcon: {
    color: "#C0D3CA !important",
    fontSize: "20px !important",
  },
});

const PantsControls = ({ isMobile: mobileProp }) => {
  const isMobileQuery = useMediaQuery("(max-width:600px)");
  const isMobile = mobileProp !== undefined ? mobileProp : isMobileQuery;
  const classes = useStyles();
  const { t } = useLanguage();

  // const [selectedPantsHoleButton, setSelectedPantsHoleButton] = useAtom(
  //   selectedPantsHoleButtonAtom
  // );
  const [selectedPantsHem, setSelectedPantsHem] = useAtom(selectedPantsHemAtom);

  // New pants5 atoms
  const [selectedPantsKind, setSelectedPantsKind] = useAtom(
    selectedPantsKindAtom
  );
  const [selectedPantsButtonKind, setSelectedPantsButtonKind] = useAtom(
    selectedPantsButtonKindAtom
  );
  const [selectedPantsLoops, setSelectedPantsLoops] = useAtom(
    selectedPantsLoopsAtom
  );
  const [selectedPantsIron, setSelectedPantsIron] = useAtom(
    selectedPantsIronAtom
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState(null);
  const [drawerTitle, setDrawerTitle] = useState("");

  // New pants5 options
  const kindOptions = [
    { value: "regularBase", label: t("regular") },
    { value: "longRegular", label: t("longRegular") },
    { value: "longWide", label: t("longWide") },
    { value: "wide", label: t("wide") },
    { value: "MiddleWide", label: t("mediumWide") },
  ];

  const buttonOptions = {
    regularBase: [
      { value: "none", label: t("noButton") },
      { value: "regularButton", label: t("regularButton") },
    ],
    longRegular: [
      { value: "none", label: t("noButton") },
      { value: "longMidleButton", label: t("middleButton") },
    ],
    longWide: [
      { value: "none", label: t("noButton") },
      { value: "longWideButton", label: t("oneButton") },
      { value: "longWideTwoButton", label: t("twoButtons") },
    ],
    wide: [
      { value: "none", label: t("noButton") },
      { value: "wideButton", label: t("oneButton") },
      { value: "wideTowButton", label: t("twoButtons") },
    ],
    MiddleWide: [
      { value: "none", label: t("noButton") },
      { value: "middleWideButton", label: t("oneButton") },
      { value: "middleWideTwoButton", label: t("twoButtons") },
    ],
  };

  const loopsOptions = {
    regularBase: [
      { value: "none", label: t("noLoops") },
      { value: "loop", label: t("oneLoop") },
      { value: "twoLoop", label: t("twoLoops") },
    ],
    longRegular: [
      { value: "none", label: t("noLoops") },
      { value: "loop", label: t("oneLoop") },
      { value: "twoLoop", label: t("twoLoops") },
    ],
    longWide: [
      { value: "none", label: t("noLoops") },
      { value: "wideOneIoop", label: t("oneLoop") },
      { value: "wideTwoLoop", label: t("twoLoops") },
    ],
    wide: [
      { value: "none", label: t("noLoops") },
      { value: "wideOneIoop", label: t("oneLoop") },
      { value: "wideTwoLoop", label: t("twoLoops") },
    ],
    MiddleWide: [
      { value: "none", label: t("noLoops") },
      { value: "wideMiddleLoop", label: t("oneLoop") },
      { value: "wideMiddleTowLoop", label: t("twoLoops") },
    ],
  };

  const ironOptions = {
    regularBase: [
      { value: "none", label: t("noIron") },
      { value: "regularIron", label: t("regularIron") },
      { value: "oneIron", label: t("oneIron") },
      { value: "oneIronTwoButton", label: t("oneIronTwoButtons") },
    ],
    longRegular: [
      { value: "none", label: t("noIron") },
      { value: "regularIron", label: t("regularIron") },
      { value: "oneIron", label: t("oneIron") },
      { value: "oneIronTwoButton", label: t("oneIronTwoButtons") },
    ],
    longWide: [
      { value: "none", label: t("noIron") },
      { value: "wideIron", label: t("wideIron") },
    ],
    wide: [
      { value: "none", label: t("noIron") },
      { value: "wideIron", label: t("wideIron") },
    ],
    MiddleWide: [
      { value: "none", label: t("noIron") },
      { value: "wideIron", label: t("wideIron") },
    ],
  };

  // Removed lines options (unused)

  // const holeButtonOptions = [
  //   { value: "Regular", label: "Regular" },
  //   { value: "behindLeftSide", label: "Behind Left Side" },
  //   { value: "behindRegular", label: "Behind Regular" },
  //   { value: "LeftSide", label: "Left Side" },
  // ];

  const hemOptions = [
    { value: "none", label: "No Hem" },
    { value: "Hem", label: "With Hem" },
  ];

  const handleOpenDrawer = (title, options, currentValue, setValue) => {
    setDrawerTitle(title);
    setDrawerContent({ options, currentValue, setValue });
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleOptionSelect = (value) => {
    if (drawerContent && drawerContent.setValue) {
      drawerContent.setValue(value);
    }
    handleCloseDrawer();
  };

  // Reset loops and iron when kind changes
  const handleKindChange = (newKind) => {
    setSelectedPantsKind(newKind);
    setSelectedPantsLoops("none");
    setSelectedPantsIron("none");
    setSelectedPantsButtonKind("none");
  };

  // Mobile horizontal layout
  if (isMobile) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          gap: 4,
          minWidth: "fit-content",
        }}
      >
        {/* Pants Type Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={() =>
              handleOpenDrawer(
                "Pants Type",
                kindOptions,
                selectedPantsKind,
                handleKindChange
              )
            }
            sx={{
              position: "relative",
              borderRadius: "12px",
              px: 2,
              py: 1,
              color: "#C0D3CA",
              borderColor: "#C0D3CA",
              "&:hover": { backgroundColor: "rgba(192, 211, 202, 0.1)" },
              width: { xs: 100, md: 120 },
              height: { xs: 100, md: 120 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1,
              overflow: "hidden",
            }}
          >
            <img
              src={kind}
              alt="Pants Type"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                aspectRatio: "1 / 1",
                filter:
                  "brightness(0.8) contrast(1.5) invert(1) sepia() saturate(0) hue-rotate(0deg)",
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{
                position: "absolute",
                bottom: 4,
                left: 0,
                right: 0,
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#C0D3CA",
                textAlign: "center",
                background:
                  "linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)",
                py: 0.5,
                px: 1,
              }}
            >
              {t("pantsType")}
            </Typography>
          </Button>
        </Box>

        {/* Buttons Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={() =>
              handleOpenDrawer(
                "Buttons",
                buttonOptions[selectedPantsKind] || [],
                selectedPantsButtonKind,
                setSelectedPantsButtonKind
              )
            }
            sx={{
              position: "relative",
              borderRadius: "12px",
              px: 2,
              py: 1,
              color: "#C0D3CA",
              borderColor: "#C0D3CA",
              "&:hover": { backgroundColor: "rgba(192, 211, 202, 0.1)" },
              width: { xs: 100, md: 120 },
              height: { xs: 100, md: 120 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1,
              overflow: "hidden",
            }}
          >
            <img
              src={buttons}
              alt="Buttons"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                aspectRatio: "1 / 1",
                filter:
                  "brightness(0.8) contrast(1.5) invert(1) sepia() saturate(0) hue-rotate(0deg)",
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{
                position: "absolute",
                bottom: 4,
                left: 0,
                right: 0,
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#C0D3CA",
                textAlign: "center",
                background:
                  "linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)",
                py: 0.5,
                px: 1,
              }}
            >
              {t("chooseButtons")}
            </Typography>
          </Button>
        </Box>

        {/* Iron Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={() =>
              handleOpenDrawer(
                "Iron",
                ironOptions[selectedPantsKind] || [],
                selectedPantsIron,
                setSelectedPantsIron
              )
            }
            disabled={!selectedPantsKind}
            sx={{
              position: "relative",
              borderRadius: "12px",
              px: 2,
              py: 1,
              color: "#C0D3CA",
              borderColor: "#C0D3CA",
              "&:hover": { backgroundColor: "rgba(192, 211, 202, 0.1)" },
              width: { xs: 100, md: 120 },
              height: { xs: 100, md: 120 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1,
              overflow: "hidden",
            }}
          >
            <img
              src={iron}
              alt="Iron"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                aspectRatio: "1 / 1",
                filter:
                  "brightness(0.8) contrast(1.5) invert(1) sepia() saturate(0) hue-rotate(0deg)",
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{
                position: "absolute",
                bottom: 4,
                left: 0,
                right: 0,
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#C0D3CA",
                textAlign: "center",
                background:
                  "linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)",
                py: 0.5,
                px: 1,
              }}
            >
              {t("chooseIron")}
            </Typography>
          </Button>
        </Box>

        {/* Loops Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={() =>
              handleOpenDrawer(
                "Loops",
                loopsOptions[selectedPantsKind] || [],
                selectedPantsLoops,
                setSelectedPantsLoops
              )
            }
            sx={{
              position: "relative",
              borderRadius: "12px",
              px: 2,
              py: 1,
              color: "#C0D3CA",
              borderColor: "#C0D3CA",
              "&:hover": { backgroundColor: "rgba(192, 211, 202, 0.1)" },
              width: { xs: 100, md: 120 },
              height: { xs: 100, md: 120 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1,
              overflow: "hidden",
            }}
          >
            <img
              src={loops}
              alt="Loops"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                aspectRatio: "1 / 1",
                filter:
                  "brightness(0.8) contrast(1.5) invert(1) sepia() saturate(0) hue-rotate(0deg)",
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{
                position: "absolute",
                bottom: 4,
                left: 0,
                right: 0,
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#C0D3CA",
                textAlign: "center",
                background:
                  "linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)",
                py: 0.5,
                px: 1,
              }}
            >
              {t("chooseLoops")}
            </Typography>
          </Button>
        </Box>

        {/* Hole & Button Section */}

        {/* Hem Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={() =>
              handleOpenDrawer(
                "Hem",
                hemOptions,
                selectedPantsHem,
                setSelectedPantsHem
              )
            }
            sx={{
              position: "relative",
              borderRadius: "12px",
              px: 2,
              py: 1,
              color: "#C0D3CA",
              borderColor: "#C0D3CA",
              "&:hover": { backgroundColor: "rgba(192, 211, 202, 0.1)" },
              width: { xs: 100, md: 120 },
              height: { xs: 100, md: 120 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1,
              overflow: "hidden",
            }}
          >
            <img
              src={hem}
              alt="Hem"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                aspectRatio: "1 / 1",
                filter:
                  "brightness(0.8) contrast(1.5) invert(1) sepia() saturate(0) hue-rotate(0deg)",
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{
                position: "absolute",
                bottom: 4,
                left: 0,
                right: 0,
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#C0D3CA",
                textAlign: "center",
                background:
                  "linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)",
                py: 0.5,
                px: 1,
              }}
            >
              {t("chooseHem")}
            </Typography>
          </Button>
        </Box>

        {/* Mobile Drawer */}
        <Drawer
          anchor="bottom"
          open={drawerOpen}
          onClose={handleCloseDrawer}
          PaperProps={{
            className: classes.drawerPaper,
            sx: {
              height: "30vh",
              borderTop: "1px solid rgba(192, 211, 202, 0.3)",
            },
          }}
        >
          <Box sx={{ padding: "16px 16px 8px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography className={classes.drawerTitle}>
                {drawerTitle}
              </Typography>
              <IconButton onClick={handleCloseDrawer} sx={{ color: "#C0D3CA" }}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider className={classes.divider} />
            <List>
              {drawerContent?.options?.map((option) => (
                <ListItem
                  key={option.value}
                  disablePadding
                  className={`${classes.listItem} ${
                    drawerContent.currentValue === option.value
                      ? classes.selectedListItem
                      : ""
                  }`}
                >
                  <ListItemButton
                    onClick={() => handleOptionSelect(option.value)}
                    sx={{ padding: "14px 16px" }}
                  >
                    <ListItemText
                      primary={option.label}
                      className={classes.listItemText}
                    />
                    {drawerContent.currentValue === option.value && (
                      <CheckCircleIcon className={classes.checkIcon} />
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>
    );
  }

  // Desktop layout
  return (
    <Box className={classes.root}>
      <Typography className={classes.title}>Pants Customization</Typography>

      <Grid container spacing={2.5}>
        {/* Kind Selection */}
        <Grid item xs={6} sm={4} md={6}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Box
              onClick={() =>
                handleOpenDrawer(
                  "Pants Type",
                  kindOptions,
                  selectedPantsKind,
                  handleKindChange
                )
              }
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
                <img
                  src={kind}
                  alt="Pants Type"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter:
                      "brightness(0.8) contrast(1.5) invert(1) sepia() saturate(0) hue-rotate(0deg)",
                  }}
                />
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
                  {t("pantsType")}
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Grid>

        {/* Button Selection */}
        <Grid item xs={6} sm={4} md={6}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Box
              onClick={() =>
                handleOpenDrawer(
                  "Buttons",
                  buttonOptions[selectedPantsKind] || [],
                  selectedPantsButtonKind,
                  setSelectedPantsButtonKind
                )
              }
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
                <img
                  src={buttons}
                  alt="Buttons"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter:
                      "brightness(0.8) contrast(1.5) invert(1) sepia() saturate(0) hue-rotate(0deg)",
                  }}
                />
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
                  {t("chooseButtons")}
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Grid>

        {/* Iron Selection */}
        <Grid item xs={6} sm={4} md={6}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Box
              onClick={() =>
                !selectedPantsKind
                  ? null
                  : handleOpenDrawer(
                      "Iron",
                      ironOptions[selectedPantsKind] || [],
                      selectedPantsIron,
                      setSelectedPantsIron
                    )
              }
              sx={{
                cursor: selectedPantsKind ? "pointer" : "not-allowed",
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
                opacity: selectedPantsKind ? 1 : 0.5,
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
                "&:hover": selectedPantsKind
                  ? {
                      border: "2px solid rgba(192, 211, 202, 0.4)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
                    }
                  : {},
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
                <img
                  src={iron}
                  alt="Iron"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter:
                      "brightness(0.8) contrast(1.5) invert(1) sepia() saturate(0) hue-rotate(0deg)",
                  }}
                />
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
                  {t("chooseIron")}
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Grid>

        {/* Loops Selection */}
        <Grid item xs={6} sm={4} md={6}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Box
              onClick={() =>
                !selectedPantsKind
                  ? null
                  : handleOpenDrawer(
                      "Loops",
                      loopsOptions[selectedPantsKind] || [],
                      selectedPantsLoops,
                      setSelectedPantsLoops
                    )
              }
              sx={{
                cursor: selectedPantsKind ? "pointer" : "not-allowed",
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
                opacity: selectedPantsKind ? 1 : 0.5,
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
                "&:hover": selectedPantsKind
                  ? {
                      border: "2px solid rgba(192, 211, 202, 0.4)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
                    }
                  : {},
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
                <img
                  src={loops}
                  alt="Loops"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter:
                      "brightness(0.8) contrast(1.5) invert(1) sepia() saturate(0) hue-rotate(0deg)",
                  }}
                />
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
                  {t("chooseLoops")}
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Grid>

        {/* Hem Selection */}
        <Grid item xs={6} sm={4} md={6}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Box
              onClick={() =>
                handleOpenDrawer(
                  "Hem",
                  hemOptions,
                  selectedPantsHem,
                  setSelectedPantsHem
                )
              }
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
                <img
                  src={hem}
                  alt="Hem"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter:
                      "brightness(0.8) contrast(1.5) invert(1) sepia() saturate(0) hue-rotate(0deg)",
                  }}
                />
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
                  {t("chooseHem")}
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Grid>
      </Grid>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          className: classes.drawerPaper,
          sx: {
            width: "50vw",
          },
        }}
      >
        <Box sx={{ padding: "24px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography className={classes.drawerTitle}>
              {drawerTitle}
            </Typography>

            <IconButton onClick={handleCloseDrawer} sx={{ color: "#C0D3CA" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider className={classes.divider} />

          <List>
            {drawerContent?.options?.map((option) => (
              <ListItem
                key={option.value}
                disablePadding
                className={`${classes.listItem} ${
                  drawerContent.currentValue === option.value
                    ? classes.selectedListItem
                    : ""
                }`}
              >
                <ListItemButton
                  onClick={() => handleOptionSelect(option.value)}
                  sx={{ padding: "16px 20px" }}
                >
                  <ListItemText
                    primary={option.label}
                    className={classes.listItemText}
                  />
                  {drawerContent.currentValue === option.value && (
                    <CheckCircleIcon className={classes.checkIcon} />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default PantsControls;

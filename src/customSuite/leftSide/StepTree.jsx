import React, { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  Typography,
  useMediaQuery,
  IconButton,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import { makeStyles } from "@mui/styles";
import { useAtom, useAtomValue } from "jotai";
import {
  selectedSleeveButtonsAtom,
  showTextInsideAtom,
  currentColorAtom,
  selectedTopCollarColorAtom,
} from "../../Utils";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import inside from "/assets/kinds/insid.svg";
import poshet from "/assets/kinds/poshet.svg";
import button from "/assets/kinds/button.svg";
import holes from "/assets/kinds/AllSuit2.png";
import PantsControls from "../../components/PantsControls";
import TextInsideModal from "../../components/TextInsideModal";

import ButtonInside from "./stepTree/ButtonInside";
import ButtonHoles from "./stepTree/ButtonHoles";
import ButtonPoshet from "./stepTree/ButtonPoshet";
import ButtonButton from "./stepTree/ButtonButton";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingTop: "3px",
    boxSizing: "border-box",
    backgroundColor: "rgba(20, 20, 20, 0.8)",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(192, 211, 202, 0.4)",
      borderRadius: "4px",
      "&:hover": {
        backgroundColor: "rgba(192, 211, 202, 0.6)",
      },
    },
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryBox: {
    height: "100%",
    minHeight: "20px",
    backgroundColor: "rgba(20, 20, 20, 0.8) !important",
    border: "1px solid rgba(192, 211, 202, 0.2)",
    backdropFilter: "blur(8px)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
      border: "1px solid rgba(192, 211, 202, 0.4)",
    },
  },
  selectedCategory: {
    border: "1px solid rgba(192, 211, 202, 0.6) !important",
    boxShadow: "0 8px 24px rgba(192, 211, 202, 0.15) !important",
  },
  categoryImage: {
    width: (props) => (props.isMobile ? "70%" : "60px") + " !important",
    height: (props) => (props.isMobile ? "auto" : "60px") + " !important",
    objectFit: "contain !important",
    filter:
      "brightness(1.2) contrast(0.8) invert(1) sepia(0) saturate(0) hue-rotate(0deg)",
    opacity: 0.9,
    marginBottom: "16px !important",
    transition: "all 0.3s ease",
  },
  categoryLabel: {
    color: "#C0D3CA !important",
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    fontWeight: "500 !important",
    letterSpacing: "0.02em !important",
    textAlign: "center",
    marginTop: "8px !important",
  },
  checkIcon: {
    position: "absolute !important",
    top: "12px !important",
    right: "12px !important",
    color: "#C0D3CA !important",
    backgroundColor: "rgba(10, 10, 10, 0.8) !important",
    borderRadius: "50% !important",
    padding: "4px !important",
    fontSize: "20px !important",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2) !important",
  },
  drawerPaper: {
    backgroundColor: "#0a0a0a !important",
    color: "#fff !important",
    borderLeft: "1px solid rgba(192, 211, 202, 0.3) !important",
  },
  drawerTitle: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "1rem !important",
    fontWeight: "300 !important",
    marginBottom: "0.8rem !important",
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
    margin: "0.8rem 0 !important",
  },
  optionButton: {
    minWidth: 70,
    minHeight: 90,
    maxWidth: 80,
    maxHeight: 100,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px 2px",
    borderRadius: "8px",
    boxShadow: "none",
    border: "1px solid rgba(192, 211, 202, 0.2)",
    backgroundColor: "rgba(30, 30, 30, 0.6)",
    transition: "all 0.3s",
    position: "relative",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.1)",
      transform: "translateY(-3px)",
      border: "1.5px solid #C0D3CA",
    },
  },
  selectedOption: {
    border: "1.5px solid #C0D3CA",
    boxShadow: "0 5px 15px rgba(0,0,0,0.18)",
  },
});

const StepTree = ({ isPants }) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const classes = useStyles({ isMobile });
  const [selectedSleeveButtons, setSelectedSleeveButtons] = useAtom(
    selectedSleeveButtonsAtom
  );
  // const [textInsideText, setTextInsideText] = useAtom(textInsideTextAtom);
  const [_, setShowTextInside] = useAtom(showTextInsideAtom);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [selectedTopCollarColor, setSelectedTopCollarColor] = useAtom(
    selectedTopCollarColorAtom
  );
  const currColor = useAtomValue(currentColorAtom);

  //   if (currentIndex !== 1) return null;

  const renderDrawerContent = () => {
    if (selectedCategory === "sleeveButtons") {
      const sleeveButtonsOptions = [
        { value: "none", label: "ללא כפתורי שרוולים" },
        { value: "tree", label: "3 כפתורי שרוולים" },
        { value: "four", label: "4 כפתורי שרוולים" },
        { value: "five", label: "5 כפתורי שרוולים" },
      ];
      return (
        <Box sx={{ padding: "16px" }}>
          <Typography variant="h6" sx={{ mb: 2, color: "#C0D3CA" }}>
            בחר כפתורי שרוולים
          </Typography>
          <Box
            sx={{
              position: "relative",
              width: 300,
              height: 300,
              margin: "0 auto",
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
                }}
              />
            )}
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}
          >
            {sleeveButtonsOptions.map((option) => (
              <Box
                key={option.value}
                onClick={() => setSelectedSleeveButtons(option.value)}
                sx={{
                  width: 60,
                  height: 60,
                  backgroundColor:
                    selectedSleeveButtons === option.value
                      ? "#C0D3CA"
                      : "rgba(30,30,30,0.6)",
                  color:
                    selectedSleeveButtons === option.value ? "#222" : "#C0D3CA",
                  border:
                    selectedSleeveButtons === option.value
                      ? "2px solid #C0D3CA"
                      : "1px solid #888",
                  borderRadius: "12px",
                  cursor: "pointer",
                  margin: 0.5,
                  boxShadow:
                    selectedSleeveButtons === option.value
                      ? "0 0 8px #C0D3CA"
                      : "none",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  textAlign: "center",
                  userSelect: "none",
                }}
              >
                {option.label}
              </Box>
            ))}
          </Box>
        </Box>
      );
    }
    if (selectedCategory === "topCollar") {
      return (
        <Box sx={{ padding: "16px" }}>
          <Typography variant="h6" sx={{ mb: 2, color: "#C0D3CA" }}>
            בחר צבע צווארון עליון
          </Typography>
          <Box
            sx={{
              position: "relative",
              width: 300,
              height: 300,
              margin: "0 auto",
              right: isMobile ? "30px" : "0px",
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
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              // gap: isMobile ? 2 : 4,
              mt: isMobile ? 2 : 5,
              mb: 2,
            }}
          >
            {[
              { name: "black", color: "#222", label: "שחור" },
              { name: "greyLight", color: "#d3d3d3", label: "אפור בהיר" },
              { name: "grey", color: "#888", label: "אפור כהה" },
              { name: "bhez", color: "#e5d1b8", label: "בז'" },
              { name: "red", color: "#c00", label: "אדום" },
              { name: "blueLight", color: "#8ecae6", label: "כחול בהיר" },
              { name: "white", color: "#fff", label: "לבן" },
            ].map((item) => (
              <Box
                key={item.name}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mx: isMobile ? 1 : 2,
                  my: 1,
                }}
              >
                <Box
                  onClick={() => setSelectedTopCollarColor(item.name)}
                  sx={{
                    width: isMobile ? 28 : 40,
                    height: isMobile ? 28 : 40,
                    backgroundColor: item.color,
                    border:
                      selectedTopCollarColor === item.name
                        ? isMobile
                          ? "2px solid #C0D3CA"
                          : "3px solid #C0D3CA"
                        : isMobile
                        ? "1px solid #888"
                        : "2px solid #888",
                    borderRadius: isMobile ? "10px" : "24px",
                    cursor: "pointer",
                    boxShadow:
                      selectedTopCollarColor === item.name
                        ? isMobile
                          ? "0 0 8px #C0D3CA"
                          : "0 0 16px #C0D3CA"
                        : "0 2px 8px rgba(0,0,0,0.10)",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1,
                    "&:hover": {
                      transform: "scale(1.08)",
                      boxShadow: isMobile
                        ? "0 0 12px #C0D3CA"
                        : "0 0 24px #C0D3CA",
                    },
                  }}
                />
                <Typography
                  sx={{
                    mt: 1,
                    color: "#C0D3CA",
                    fontWeight: 500,
                    fontSize: isMobile ? "0.8rem" : "1.1rem",
                    textAlign: "center",
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      );
    }
    if (selectedCategory === "textInside") {
      setShowTextInside(true);
      return null;
    }
    // Other components
    const components = {
      imagesInsideUp: <ButtonInside handleCloseDrawer={handleCloseDrawer} />,
      imagesHoles: <ButtonHoles handleCloseDrawer={handleCloseDrawer} />,
      imagesPoshet: <ButtonPoshet handleCloseDrawer={handleCloseDrawer} />,
      imageButton: <ButtonButton handleCloseDrawer={handleCloseDrawer} />,
    };
    return components[selectedCategory] || null;
  };

  const handleClick = (key, label) => {
    if (key === "textInside") {
      setShowTextInside(true);
      return;
    }
    setSelectedCategory(key);
    setDrawerTitle(label);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const categories = [
    { key: "imagesInsideUp", label: "Inner Lining", image: inside },
    { key: "imagesPoshet", label: "Pocket Square", image: poshet },
    { key: "imageButton", label: "Button Style", image: button },
    { key: "imagesHoles", label: "Button Holes", image: holes },
    { key: "sleeveButtons", label: "Sleeve Buttons", image: button },
    { key: "textInside", label: "Text Inside", image: inside },
    { key: "topCollar", label: "צווארון עליון", image: button },
  ];

  return (
    <>
      {isPants ? (
        <div>
          <Typography variant="h2" className={classes.title}>
            <PantsControls />
          </Typography>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={classes.root}
        >
          <Typography
            style={{
              fontSize: "1.2rem",
              marginBottom: "2rem",
              marginTop: "-80px",
              color: "#C0D3CA",
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              letterSpacing: "0.05em",
            }}
          >
            Finishing Details
          </Typography>

          {isMobile ? (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px 6px",
                // marginBottom: "12px",
                color: "white",
                // width: "100%",
                padding: 0,
                mt: 2,
              }}
            >
              {categories.map(({ key, label, image }, index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  style={{
                    flex: "1 0 23%",
                    maxWidth: "23%",
                    minWidth: 44,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    onClick={() => handleClick(key, label)}
                    className={
                      selectedCategory === key
                        ? `${classes.optionButton} ${classes.selectedOption}`
                        : classes.optionButton
                    }
                    sx={{
                      minWidth: 54,
                      minHeight: 70,
                      maxWidth: 60,
                      maxHeight: 80,
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px 2px",
                      borderRadius: "10px",
                      boxShadow:
                        selectedCategory === key
                          ? "0 5px 15px rgba(0,0,0,0.18)"
                          : "none",
                      border:
                        selectedCategory === key
                          ? "1.5px solid #C0D3CA"
                          : "1px solid rgba(192, 211, 202, 0.2)",
                      backgroundColor:
                        selectedCategory === key
                          ? "rgba(192, 211, 202, 0.1)"
                          : "rgba(30, 30, 30, 0.6)",
                      transition: "all 0.3s",
                      position: "relative",
                      "&:hover": {
                        backgroundColor: "rgba(192, 211, 202, 0.1)",
                        transform: "translateY(-3px)",
                        border: "1.5px solid #C0D3CA",
                      },
                    }}
                  >
                    <img
                      src={image}
                      alt={label}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: "contain",
                        filter:
                          "brightness(1.2) contrast(0.8) invert(1) sepia(0) saturate(0) hue-rotate(0deg)",
                        opacity: 0.9,
                        marginBottom: 6,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        color: "#C0D3CA",
                        textAlign: "center",
                        lineHeight: 1.1,
                        letterSpacing: "0.01em",
                        userSelect: "none",
                        marginBottom: 0,
                      }}
                    >
                      {label}
                    </Typography>
                    {selectedCategory === key && (
                      <CheckCircleIcon
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          color: "#C0D3CA",
                          background: "#0a0a0a",
                          borderRadius: "50%",
                          fontSize: 20,
                          boxShadow: "0 1px 4px rgba(192,211,202,0.10)",
                          zIndex: 2,
                          padding: "2px",
                        }}
                      />
                    )}
                  </Button>
                </motion.div>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                marginTop: "80px",
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gridTemplateRows: "repeat(2, 1fr)",
                gap: "18px 18px",
                justifyContent: "center",
                alignItems: "center",
                // margin: "0 auto 8px auto",
                width: "100%",
                maxWidth: "100vw",
                overflow: "hidden",
                background: "rgba(20,20,20,0.0)",
              }}
            >
              {categories.map(({ key, label, image }, index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    onClick={() => handleClick(key, label)}
                    className={
                      selectedCategory === key
                        ? `${classes.optionButton} ${classes.selectedOption}`
                        : classes.optionButton
                    }
                    sx={{
                      minWidth: 90,
                      minHeight: 130,
                      maxWidth: 100,
                      maxHeight: 140,
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "14px 8px",
                      borderRadius: "18px",
                      boxShadow:
                        selectedCategory === key
                          ? "0 8px 32px 0 #C0D3CA55"
                          : "0 2px 12px rgba(0,0,0,0.10)",
                      border:
                        selectedCategory === key
                          ? "2.5px solid #C0D3CA"
                          : "1.5px solid #C0D3CA55",
                      backgroundColor:
                        selectedCategory === key
                          ? "rgba(192, 211, 202, 0.13)"
                          : "rgba(30, 30, 30, 0.7)",
                      transition: "all 0.3s",
                      position: "relative",
                      "&:hover": {
                        backgroundColor: "rgba(192, 211, 202, 0.18)",
                        transform: "scale(1.07)",
                        border: "2.5px solid #C0D3CA",
                        boxShadow: "0 12px 32px 0 #C0D3CA77",
                      },
                    }}
                  >
                    <img
                      src={image}
                      alt={label}
                      style={{
                        width: 64,
                        height: 64,
                        objectFit: "contain",
                        filter:
                          "brightness(1.2) contrast(0.8) invert(1) sepia(0) saturate(0) hue-rotate(0deg)",
                        opacity: 0.95,
                        marginBottom: 14,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        color: "#C0D3CA",
                        textAlign: "center",
                        lineHeight: 1.1,
                        letterSpacing: "0.01em",
                        userSelect: "none",
                        marginBottom: 0,
                      }}
                    >
                      {label}
                    </Typography>
                    {selectedCategory === key && (
                      <CheckCircleIcon
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: "#C0D3CA",
                          background: "#0a0a0a",
                          borderRadius: "50%",
                          fontSize: 32,
                          boxShadow: "0 1px 8px #C0D3CA55",
                          zIndex: 2,
                          padding: "4px",
                        }}
                      />
                    )}
                  </Button>
                </motion.div>
              ))}
            </Box>
          )}

          <Drawer
            anchor="right"
            open={drawerOpen && selectedCategory !== "textInside"}
            onClose={handleCloseDrawer}
            PaperProps={{
              className: classes.drawerPaper,
              sx: {
                width: isMobile ? "80%" : "450px",
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

                <IconButton
                  onClick={handleCloseDrawer}
                  sx={{ color: "#C0D3CA" }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              <Divider className={classes.divider} />

              {renderDrawerContent()}
            </Box>
          </Drawer>
        </motion.div>
      )}

      {/* TextInside Modal */}
      <TextInsideModal />
    </>
  );
};

export default StepTree;

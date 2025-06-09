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
} from "@mui/material";
import { motion } from "framer-motion";
import { makeStyles } from "@mui/styles";
// import { useAtom } from "jotai";
// import { currentIndexAtom } from "../../Utils";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import inside from "/assets/kinds/insid.svg";
import poshet from "/assets/kinds/poshet.svg";
import button from "/assets/kinds/button.svg";
import holes from "/assets/kinds/AllSuit2.png";

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
    height: "100%",
    padding: "10px",
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
});

const StepTree = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const classes = useStyles({ isMobile });
  //   const [currentIndex] = useAtom(currentIndexAtom);
  const [drawerContent, setDrawerContent] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [drawerTitle, setDrawerTitle] = useState("");

  //   if (currentIndex !== 1) return null;

  const handleClick = (key, label) => {
    setSelectedCategory(key);
    setDrawerTitle(label);

    const components = {
      imagesInsideUp: <ButtonInside handleCloseDrawer={handleCloseDrawer} />,
      imagesHoles: <ButtonHoles handleCloseDrawer={handleCloseDrawer} />,
      imagesPoshet: <ButtonPoshet handleCloseDrawer={handleCloseDrawer} />,
      imageButton: <ButtonButton handleCloseDrawer={handleCloseDrawer} />,
    };

    setDrawerContent(components[key]);
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
  ];

  return (
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

      <Grid
        container
        spacing={isMobile ? 1 : 3}
        sx={{
          maxWidth: isMobile ? "100%" : "1200px",
          margin: "0 auto",
          padding: isMobile ? "0 8px" : "0 24px",
        }}
      >
        {categories.map(({ key, label, image }) => (
          <Grid
            item
            xs={6}
            sm={4}
            md={3}
            key={key}
            sx={{
              padding: isMobile ? "4px" : "12px",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: categories.findIndex((c) => c.key === key) * 0.1,
              }}
            >
              <Box
                className={`${classes.categoryBox} ${
                  selectedCategory === key ? classes.selectedCategory : ""
                }`}
                onClick={() => handleClick(key, label)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: isMobile ? "12px 8px" : "24px 16px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  height: isMobile ? "100px" : "auto",
                  minHeight: isMobile ? "100px" : "auto",
                }}
              >
                <img
                  src={image}
                  alt={label}
                  className={classes.categoryImage}
                  style={{
                    width: isMobile ? "45%" : "120px",
                    height: isMobile ? "auto" : "120px",
                    marginBottom: isMobile ? "8px" : "16px",
                  }}
                />
                <Typography
                  className={classes.categoryLabel}
                  style={{
                    fontSize: isMobile ? "0.7rem" : "0.9rem",
                    marginTop: isMobile ? "4px" : "8px",
                  }}
                >
                  {label}
                </Typography>
                {selectedCategory === key && (
                  <CheckCircleIcon
                    className={classes.checkIcon}
                    style={{
                      fontSize: isMobile ? "16px" : "20px",
                      top: isMobile ? "6px" : "12px",
                      right: isMobile ? "6px" : "12px",
                      padding: isMobile ? "2px" : "4px",
                    }}
                  />
                )}
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          className: classes.drawerPaper,
          sx: {
            width: isMobile ? "60%" : "350px",
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

          {drawerContent}
        </Box>
      </Drawer>
    </motion.div>
  );
};

export default StepTree;

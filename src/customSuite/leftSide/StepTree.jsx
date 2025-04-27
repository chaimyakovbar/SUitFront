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
    backgroundColor: "rgba(30, 30, 30, 0.6)",
    borderRadius: "8px",
    border: "1px solid rgba(192, 211, 202, 0.3)",
    width: "100px",
    height: "90px",
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.2)",
      transform: "translateY(-3px)",
    },
    "@media (max-width:600px)": {
      width: "60px",
      height: "60px",
      padding: "5px",
    },
  },
  selectedCategory: {
    backgroundColor: "rgba(192, 211, 202, 0.2)",
    border: "1px solid rgba(192, 211, 202, 0.6)",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
  },
  categoryImage: {
    width: "45px",
    height: "45px",
    objectFit: "contain",
    filter: "brightness(1) contrast(1.2)",
    "@media (max-width:600px)": {
      width: "35px",
      height: "35px",
    },
  },
  categoryTitle: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.7rem !important",
    fontWeight: "400 !important",
    color: "#e0e0e0 !important",
    textAlign: "center",
    marginTop: "5px",
    "@media (max-width:600px)": {
      fontSize: "0.7rem !important",
    },
  },
  checkIcon: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    color: "#C0D3CA",
    backgroundColor: "#0a0a0a",
    borderRadius: "50%",
    padding: "2px",
    fontSize: "10px",
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
  const classes = useStyles();
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
        // variant="h2"
        // className={classes.title}
        style={{ fontSize: "1rem", marginBottom: "1.5rem", marginTop: "-80px" }}
      >
        Finishing Details
      </Typography>

      <Grid container spacing={2}>
        {categories.map(({ key, label, image }) => (
          <Grid item xs={6} key={key}>
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
                position="relative"
              >
                <Typography className={classes.categoryTitle}>
                  {label}
                </Typography>
                <img
                  src={image}
                  alt={label}
                  className={classes.categoryImage}
                />
                {selectedCategory === key && (
                  <CheckCircleIcon className={classes.checkIcon} />
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
            width: isMobile ? "90%" : "350px",
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

import React, { useState } from "react";
import {
  Box,
  Button,
  useMediaQuery,
  Drawer,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useAtom } from "jotai";
import VerifiedIcon from "@mui/icons-material/Verified";
import { currentIndexAtom } from "../../Utils";

import inside from "/assets/kinds/insid.svg";
import poshet from "/assets/kinds/poshet.svg";
import button from "/assets/kinds/button.svg";
import holes from "/assets/kinds/AllSuit2.png";

import ButtonInside from "./ButtonInside";
import ButtonHoles from "./ButtonHoles";
import ButtonPoshet from "./ButtonPoshet";
import ButtonButton from "./ButtonButton";

const useStyles = makeStyles({
  wrapper: (prop) => ({
    width: prop.isMobile ? "100px" : "30%",
    backgroundColor: "#F5F5F7",
    height: prop.isMobile ? "50vh" : "80vh",
    overflowY: "auto",
    padding: prop.isMobile ? "0px" : "30px",
    boxSizing: "border-box",
    marginRight: "20px",
    borderRadius: "12px",
  }),
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    marginBottom: "24px",
  },
  categoryButton: (prop) => ({
    height: prop.isMobile ? "60px" : "100px",
    width: "auto",
    cursor: "pointer",
    objectFit: "contain",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  }),
  selectedButtonWrapper: (prop) => ({
    position: "relative",
    borderRadius: "12px",
    padding: "16px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: prop.isMobile ? "80px" : "120px",
    height: prop.isMobile ? "80px" : "120px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  verifiedIcon: (prop) => ({
    position: "absolute",
    top: "8px",
    right: "8px",
    color: "#FF5722",
    fontSize: prop.isMobile ? "20px" : "24px",
  }),
  categoryText: (prop) => ({
    fontSize: prop.isMobile ? "16px" : "20px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
    textAlign: "center",
  }),
  drawerPaper: (prop) => ({
    width: prop.isMobile ? "80%" : "350px",
    borderRadius: "12px 0 0 12px",
  }),
  drawerContent: {
    padding: "24px",
  },
  closeButton: {
    backgroundColor: "#FF5722",
    color: "white",
    "&:hover": {
      backgroundColor: "#E65100",
    },
    marginBottom: "16px",
  },
});

const RightSide = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const classes = useStyles({ isMobile });
  const [currentIndex] = useAtom(currentIndexAtom);
  const [drawerContent, setDrawerContent] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  if (currentIndex !== 2) return null;

  const handleClick = (category) => {
    setSelectedCategory(category);

    const components = {
      imagesInsideUp: <ButtonInside handleCloseDrawer={handleCloseDrawer} />,
      imagesHoles: <ButtonHoles handleCloseDrawer={handleCloseDrawer} />,
      imagesPoshet: <ButtonPoshet handleCloseDrawer={handleCloseDrawer} />,
      imageButton: <ButtonButton handleCloseDrawer={handleCloseDrawer} />,
    };

    setDrawerContent(components[category] || null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const categories = [
    { key: "imagesInsideUp", label: "סטייל פנימי", image: inside },
    { key: "imagesPoshet", label: "בד כיס", image: poshet },
    { key: "imageButton", label: "סטייל כפתור", image: button },
    { key: "imagesHoles", label: "חורי כפתור", image: holes },
  ];

  return (
    <div className={classes.wrapper}>
      {categories.map(({ key, label, image }) => (
        <div className={classes.buttonContainer} key={key}>
          <Typography className={classes.categoryText}>{label}</Typography>
          <Button onClick={() => handleClick(key)} className={classes.selectedButtonWrapper}>
            <img src={image} className={classes.categoryButton} alt={key} />
            {selectedCategory === key && (
              <VerifiedIcon className={classes.verifiedIcon} />
            )}
          </Button>
        </div>
      ))}

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        classes={{
          paper: classes.drawerPaper,
        }}
        BackdropProps={{ invisible: true }}
      >
        <Box className={classes.drawerContent}>
          <Button
            variant="contained"
            onClick={handleCloseDrawer}
            className={classes.closeButton}
          >
            סגור
          </Button>
          {drawerContent}
        </Box>
      </Drawer>
    </div>
  );
};

export default RightSide;

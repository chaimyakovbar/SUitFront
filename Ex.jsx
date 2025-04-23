import React, { useState } from "react";
import { Box, Button, useMediaQuery, Drawer } from "@mui/material";
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
  container: (prop) => ({
    display: "flex",
    flexDirection: "column",
    gap: prop.isMobile ? "12px" : "24px",
    justifyContent: "flex-start",
    alignItems: "center",
    width: prop.isMobile ? "100%" : "100%",
    backgroundColor: "#F5F5F7",
    height: prop.isMobile ? "50vh" : "80vh",
    overflowY: "auto",
    boxSizing: "border-box",
    padding: prop.isMobile ? "16px" : "30px",
    zIndex: 100,
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    marginRight: "20px",
  }),
  buttonImg: (prop) => ({
    height: prop.isMobile ? "60px" : "100px",
    width: "auto",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
    objectFit: "contain",
  }),
  selectedButton: {
    position: "relative",
    borderRadius: "12px",
    padding: "16px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease-in-out",
    width: (prop) => (prop.isMobile ? "80px" : "120px"),
    height: (prop) => (prop.isMobile ? "80px" : "120px"),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      backgroundColor: "#f0f0f0",
      transform: "scale(1.05)",
      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
    },
  },
  verifiedIcon: (prop) => ({
    position: "absolute",
    top: "8px",
    right: "8px",
    color: "#FF5722",
    fontSize: prop.isMobile ? "20px" : "24px",
    zIndex: 1,
  }),
  text: (prop) => ({
    fontSize: prop.isMobile ? "16px" : "24px",
    fontWeight: "bold",
    marginBottom: prop.isMobile ? "12px" : "16px",
    textAlign: "center",
    color: "#333",
    textShadow: "0 1px 2px rgba(0,0,0,0.1)",
  }),
  drawerPaper: (prop) => ({
    width: prop.isMobile ? "80%" : "350px",
    maxWidth: "350px",
    borderRadius: "12px 0 0 12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
  }),
  drawerContent: {
    padding: "24px",
    height: "100%",
    overflowY: "auto",
  },
  closeButton: {
    position: "absolute",
    top: "16px",
    left: "16px",
    backgroundColor: "#FF5722",
    color: "white",
    "&:hover": {
      backgroundColor: "#E65100",
    },
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
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

    let content;
    switch (category) {
      case "imagesInsideUp":
        content = <ButtonInside handleCloseDrawer={handleCloseDrawer} />;
        break;
      case "imagesHoles":
        content = <ButtonHoles handleCloseDrawer={handleCloseDrawer} />;
        break;
      case "imagesPoshet":
        content = <ButtonPoshet handleCloseDrawer={handleCloseDrawer} />;
        break;
      case "imageButton":
        content = <ButtonButton handleCloseDrawer={handleCloseDrawer} />;
        break;
      default:
        content = null;
        break;
    }

    setDrawerContent(content);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <Box
      display={isMobile ? "block" : "flex"}
      flexDirection={isMobile ? "column" : "row"}
    >
      <div className={classes.container}>
        <div className={classes.buttonContainer}>
          <h2 className={classes.text}>סטייל פנימי</h2>
          <Button
            onClick={() => handleClick("imagesInsideUp")}
            className={classes.selectedButton}
          >
            <img src={inside} className={classes.buttonImg} alt="inside" />
            {selectedCategory === "imagesInsideUp" && (
              <VerifiedIcon className={classes.verifiedIcon} />
            )}
          </Button>
        </div>

        <div className={classes.buttonContainer}>
          <h2 className={classes.text}>בד כיס</h2>
          <Button
            onClick={() => handleClick("imagesPoshet")}
            className={classes.selectedButton}
          >
            <img src={poshet} className={classes.buttonImg} alt="poshet" />
            {selectedCategory === "imagesPoshet" && (
              <VerifiedIcon className={classes.verifiedIcon} />
            )}
          </Button>
        </div>

        <div className={classes.buttonContainer}>
          <h2 className={classes.text}>סטייל כפתור</h2>
          <Button
            onClick={() => handleClick("imageButton")}
            className={classes.selectedButton}
          >
            <img src={button} className={classes.buttonImg} alt="button" />
            {selectedCategory === "imageButton" && (
              <VerifiedIcon className={classes.verifiedIcon} />
            )}
          </Button>
        </div>

        <div className={classes.buttonContainer}>
          <h2 className={classes.text}>חורי כפתור</h2>
          <Button
            onClick={() => handleClick("imagesHoles")}
            className={classes.selectedButton}
          >
            <img
              src={holes}
              className={classes.buttonImg}
              style={{ height: "115px" }}
              alt="holes"
            />
            {selectedCategory === "imagesHoles" && (
              <VerifiedIcon className={classes.verifiedIcon} />
            )}
          </Button>
        </div>
      </div>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        classes={{
          paper: classes.drawerPaper,
        }}
        variant="temporary"
        elevation={4}
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
    </Box>
  );
};

export default RightSide;

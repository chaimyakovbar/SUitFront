import React, { useState } from "react"
import { Box, Button, useMediaQuery, Drawer } from "@mui/material"
import { makeStyles } from "@mui/styles"
import { useAtom } from "jotai"
import VerifiedIcon from "@mui/icons-material/Verified"
import { currentIndexAtom } from "../../Utils"

import inside from "/assets/kinds/insid.svg"
import poshet from "/assets/kinds/poshet.svg"
import button from "/assets/kinds/button.svg"
import holes from "/assets/kinds/AllSuit2.png"

import ButtonInside from "./ButtonInside"
import ButtonHoles from "./ButtonHoles"
import ButtonPoshet from "./ButtonPoshet"
import ButtonButton from "./ButtonButton"

const useStyles = makeStyles({
  container: (prop) => ({
    display: "flex",
    flexDirection: "column",
    gap: prop.isMobile ? "8px" : "12px",
    justifyContent: "flex-start",
    alignItems: "center",
    width: prop.isMobile ? "100%" : "30%",
    backgroundColor: "#F5F5F7",
    height: prop.isMobile ? "50vh" : "80vh",
    overflowY: "auto",
    boxSizing: "border-box",
    padding: prop.isMobile ? "8px" : "20px",
    zIndex: 100,
  }),
  buttonImg: (prop) => ({
    height: prop.isMobile ? "40px" : "80px",
    width: "auto",
    cursor: "pointer",
    transition: "filter 0.3s ease-in-out",
  }),
  selectedButton: {
    position: "relative",
    borderRadius: "12px",
    "&:hover": {
      backgroundColor: "#e0e0e0",
      transform: "scale(1.05)",
    },
  },
  verifiedIcon: (prop) => ({
    position: "absolute",
    top: "4px",
    right: "4px",
    color: "#FF5722",
    fontSize: prop.isMobile ? "16px" : "20px",
  }),
  text: (prop) => ({
    fontSize: prop.isMobile ? "14px" : "20px",
    fontWeight: "bold",
    marginBottom: prop.isMobile ? "4px" : "8px",
    textAlign: "center",
  }),
  drawerPaper: (prop) => ({
    width: prop.isMobile ? "50%" : "350px",
    maxWidth: "350px",
  }),
  leftComponent: {
    flex: 1,
    padding: "20px",
  },
})

const   RightSide = () => {
  const isMobile = useMediaQuery("(max-width:600px)")
  const classes = useStyles({ isMobile })
  const [currentIndex] = useAtom(currentIndexAtom)
  const [drawerContent, setDrawerContent] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  if (currentIndex !== 2) return null

  const handleClick = (category) => {
    setSelectedCategory(category)

    let content
    switch (category) {
      case "imagesInsideUp":
        content = <ButtonInside handleCloseDrawer={handleCloseDrawer}/>
        break
      case "imagesHoles":
        content = <ButtonHoles handleCloseDrawer={handleCloseDrawer}/>
        break
      case "imagesPoshet":
        content = <ButtonPoshet handleCloseDrawer={handleCloseDrawer}/>
        break
      case "imageButton":
        content = <ButtonButton handleCloseDrawer={handleCloseDrawer}/>
        break
      default:
        content = null
        break
    }

    setDrawerContent(content)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
  }

  return (
    <Box
      display={isMobile ? "block" : "flex"}
      flexDirection={isMobile ? "column" : "row"}
    >
      <div className={classes.container}>
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

        <h2 className={classes.text}>חורי כפתור</h2>
        <Button
          onClick={() => handleClick("imagesHoles")}
          className={classes.selectedButton}
        >
          <img src={holes} className={classes.buttonImg} alt="holes" />
          {selectedCategory === "imagesHoles" && (
            <VerifiedIcon className={classes.verifiedIcon} />
          )}
        </Button>
      </div>

      {/* Right Drawer with limited width */}
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
        <Box sx={{ p: 3, height: "100%", overflowY: "auto" }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleCloseDrawer}
            sx={{ mb: 2 }}
          >
            סגור
          </Button>
          {drawerContent}
        </Box>
      </Drawer>
    </Box>
  )
}

export default RightSide

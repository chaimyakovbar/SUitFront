import React, { useState } from "react";
import MiddleSide from "./middleSide/MiddleSide";
import LeftSide from "./leftSide/LeftSide";
import Stepper2 from "../components/Stepper";
// import RightSide from "./rightSide/RightSide";
import { useMediaQuery } from "@mui/material";
import { Box, Container, Typography, Divider, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SuitIcon from "../../public/assets/kinds/kind2.png";
import pantsIcon from "../../public/assets/kinds/pantsIcon.svg";
import { currentIndexAtom } from "../Utils";
import { useAtom } from "jotai";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#0a0a0a",
    color: "#fff",
    minHeight: "100vh",
    paddingTop: "80px",
    paddingBottom: "40px",
  },
  heading: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "2.5rem !important",
    fontWeight: "300 !important",
    marginBottom: "1rem !important",
    letterSpacing: "0.05em !important",
    textAlign: "center",
  },
  subheading: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    fontWeight: "300 !important",
    marginBottom: "2rem !important",
    letterSpacing: "0.05em !important",
    color: "#C0D3CA !important",
    textAlign: "center",
    maxWidth: "600px",
    margin: "0 auto 2rem !important",
  },
  contentWrapper: {
    display: "flex",
    position: "relative",
    minHeight: "70vh",
  },
  divider: {
    backgroundColor: "rgba(192, 211, 202, 0.2) !important",
    margin: "2rem 0 !important",
  },
  toggleButtonMobbile: {
    position: "absolute !important",
    top: "70px !important",
    left: "0px !important",
    zIndex: "1000 !important",
    backgroundColor: "rgba(0, 0, 0, 0.8) !important",
    color: "#fff !important",
    border: "1px solid rgba(192, 211, 202, 0.3) !important",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.9) !important",
      border: "1px solid rgba(192, 211, 202, 0.5) !important",
    },
  },
  toggleButton: {
    position: "absolute !important",
    top: "10px !important",
    left: "530px !important",
    zIndex: "1000 !important",
    backgroundColor: "rgba(0, 0, 0, 0.8) !important",
    color: "#fff !important",
    border: "1px solid rgba(192, 211, 202, 0.3) !important",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.9) !important",
      border: "1px solid rgba(192, 211, 202, 0.5) !important",
    },
  },
  mobileContentWrapper: {
    position: "relative",
  },
  whiteIcon: {
    filter: "brightness(0) invert(1) !important",
    width: "60px !important",
    height: "80px !important",
  },
});

const IndexCustomSuit = () => {
  const classes = useStyles();
  const [isPants, setIsPants] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [currentIndex] = useAtom(currentIndexAtom);

  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        <div>
          <Typography variant="h1" className={classes.heading}>
            Design Your Custom Suit
          </Typography>
          <Typography variant="body1" className={classes.subheading}>
            Create a bespoke suit tailored to your exact preferences. Select
            from premium fabrics, customize every detail, and achieve the
            perfect fit.
          </Typography>
        </div>

        <Divider className={classes.divider} />

        <Stepper2 />

        {isMobile ? (
          <div className={classes.mobileContentWrapper}>
            {currentIndex === 2 && (
            <Button
              className={classes.toggleButtonMobbile}
              onClick={() => setIsPants(!isPants)}
            >
              {isPants ? (
                <img src={pantsIcon} alt="Pants" className={classes.whiteIcon} />
                ) : (
                  <img src={SuitIcon} alt="Suit" className={classes.whiteIcon} />
                )}
              </Button>
            )}
            <MiddleSide isPants={isPants} isMobile={isMobile} />
            <LeftSide isPants={isPants} />
          </div>
        ) : (
          <Box className={classes.contentWrapper}>
            {currentIndex === 2 && (
            <Button
              className={classes.toggleButton}
              onClick={() => setIsPants(!isPants)}
            >
              {isPants ? (
                <img src={pantsIcon} alt="Pants" className={classes.whiteIcon} />
                ) : (
                  <img src={SuitIcon} alt="Suit" className={classes.whiteIcon} />
                )}
              </Button>
            )}
            <LeftSide isPants={isPants} />
            <MiddleSide isPants={isPants} isMobile={isMobile} />
          </Box>
        )}
      </Container>
    </div>
  );
};

export default IndexCustomSuit;

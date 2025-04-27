import React from "react";
import MiddleSide from "./middleSide/MiddleSide";
import LeftSide from "./leftSide/LeftSide";
import Stepper2 from "../components/Stepper";
// import RightSide from "./rightSide/RightSide";
import { useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import { Box, Container, Typography, Divider } from "@mui/material";
import { makeStyles } from "@mui/styles";

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
  }
});

const IndexCustomSuit = () => {
  const classes = useStyles();
  const isMobile = useMediaQuery("(max-width:600px)");
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className={classes.root}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography variant="h1" className={classes.heading}>
            Design Your Custom Suit
          </Typography>
          <Typography variant="body1" className={classes.subheading}>
            Create a bespoke suit tailored to your exact preferences. Select from premium fabrics, 
            customize every detail, and achieve the perfect fit.
          </Typography>
        </motion.div>
        
        <Divider className={classes.divider} />
        
      <Stepper2 />
        <Box className={classes.contentWrapper}>
          <LeftSide />
          {/* <RightSide /> */}
          <MiddleSide isMobile={isMobile} />
        </Box>
      </Container>
      
    </motion.div>
  );
};

export default IndexCustomSuit;
import React from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import { useAtom } from "jotai";
import { currentIndexAtom } from "../../Utils";
import { useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import { Box, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import StepTree from "./StepTree";

const useStyles = makeStyles({
  root: {
    position: "absolute",
    zIndex: 1000,
    width: props => props.isMobile ? "190px" : "30%",
    height: props => props.isMobile ? "42vh" : "52.5vh",
    overflowY: "auto",
    padding: props => props.isMobile ? "10px" : "20px",
    boxSizing: "border-box",
    backgroundColor: "rgba(20, 20, 20, 0.8)",
    borderRadius: "4px",
    border: "1px solid rgba(192, 211, 202, 0.2)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderRadius: "3px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(192, 211, 202, 0.3)",
      borderRadius: "3px",
      "&:hover": {
        backgroundColor: "rgba(192, 211, 202, 0.5)",
      }
    }
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: props => props.isMobile ? "1.2rem !important" : "1.8rem !important",
    fontWeight: "300 !important",
    marginBottom: "1.5rem !important",
    color: "#C0D3CA !important",
    textAlign: "center",
    letterSpacing: "0.05em !important",
  }
});

const LeftSide = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const classes = useStyles({ isMobile });
  const [currentIndex] = useAtom(currentIndexAtom);
  
  // if (currentIndex === 2) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className={classes.root}
    >
      <Typography variant="h2" className={classes.title}>
        {currentIndex === 0 ? "Select Fabric" : "Customize Style"}
      </Typography>
      
      {currentIndex === 0 && <StepOne />}
      {currentIndex === 1 && <StepTwo />}
      {currentIndex === 2 && <StepTree />}
    </motion.div>
  );
};

export default LeftSide;
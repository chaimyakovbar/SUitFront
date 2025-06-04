import React, { useState } from "react";
import { suitsColors } from "../../consts/KindOfColors";
import { useAtom } from "jotai";
import { counterAtom, currentColorAtom } from "../../Utils";
import { useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "row",
    overflowX: "auto",
    gap: (props) => (props.isMobile ? "12px" : "20px"),
    alignItems: "center",
    width: "100%",
  },
  colorButton: {
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: (props) => (props.isMobile ? "50px" : "80px"),
    height: (props) => (props.isMobile ? "50px" : "80px"),
    borderRadius: "50%",
    cursor: "pointer",
    position: "relative",
    transition: "all 0.3s ease",
    border: "2px solid transparent",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
    },
  },
  selectedColor: {
    border: "2px solid #C0D3CA !important",
    boxShadow: "0 5px 15px rgba(192, 211, 202, 0.3) !important",
  },
  checkIcon: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    color: "#C0D3CA",
    backgroundColor: "#0a0a0a",
    borderRadius: "50%",
    padding: "2px",
    fontSize: "20px",
  },
  colorName: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: (props) =>
      props.isMobile ? "0.7rem !important" : "0.8rem !important",
    fontWeight: "300 !important",
    color: "#e0e0e0 !important",
    marginTop: "8px !important",
    textAlign: "center",
    letterSpacing: "0.05em !important",
  },
});

const StepOne = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const classes = useStyles({ isMobile });
  const [counterArray, setCounterArray] = useAtom(counterAtom);
  const [_, setCurrentColor] = useAtom(currentColorAtom);
  const [selectedColor, setSelectedColor] = useState(null);

  const handleClick = (color) => {
    setSelectedColor(color);
    setCurrentColor(color.colorName);
    const updatedCounter = [...counterArray];
    updatedCounter[0] = { step1Validated: true };
    setCounterArray(updatedCounter);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className={classes.container}>
        {suitsColors.map((color, index) => (
          <motion.div
            key={color.colorId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                className={`${classes.colorButton} ${
                  selectedColor?.colorId === color.colorId
                    ? classes.selectedColor
                    : ""
                }`}
                style={{ backgroundImage: `url(${color.color})` }}
                onClick={() => handleClick(color)}
              >
                {selectedColor?.colorId === color.colorId && (
                  <CheckCircleIcon className={classes.checkIcon} />
                )}
              </Box>
              <Typography className={classes.colorName}>
                {color.name}
              </Typography>
            </Box>
          </motion.div>
        ))}
      </Box>
    </motion.div>
  );
};

export default StepOne;

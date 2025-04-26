import React from "react";
import ImageFilterComponent from "../../components/ImageCollector";
import { motion } from "framer-motion";
import { Box, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
    position: "relative",
    marginLeft: props => props.isMobile ? '130px' : '36%',
    transition: "all 0.3s ease",
  },
  imageContainer: {
    backgroundColor: "rgba(30, 30, 30, 0.4)",
    borderRadius: "4px",
    border: "1px solid rgba(192, 211, 202, 0.2)",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
  }
});

const MiddleSide = ({ isMobile }) => {
  const classes = useStyles({ isMobile });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className={classes.root}
    >
      <Box className={classes.imageContainer}>
        <ImageFilterComponent />
      </Box>
    </motion.div>
  );
};

export default MiddleSide;

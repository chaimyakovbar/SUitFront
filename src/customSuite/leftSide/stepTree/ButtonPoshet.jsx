import React from "react";
import { Button, Box, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { makeStyles } from "@mui/styles";
import { useAtom } from "jotai";
import { selectedPoshetAtom } from "../../../Utils";
import { imagesPoshet } from "../../../consts/KindOfColors";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const useStyles = makeStyles({
  container: {
    width: "100%",
  },
  fabricGrid: {
    display: "flex",
    flexDirection: "row",
    overflowX: "auto",
    gap: "15px",
    alignItems: "center",
    width: "100%",
  },
  fabricItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // marginBottom: "15px",
  },
  fabricButton: {
    width: "80px",
    height: "80px",
    borderRadius: "4px",
    padding: 0,
    position: "relative",
    overflow: "hidden",
    // border: "1px solid rgba(192, 211, 202, 0.2)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "2px 5px 15px rgba(0, 0, 0, 0.3)",
    },
  },
  selectedFabric: {
    border: "1px solid rgba(192, 211, 202, 0.5)",
    boxShadow: "0px 1px 20px 14px rgba(192, 211, 202, 0.2)",
  },
  fabricImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  fabricName: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.8rem !important",
    fontWeight: "300 !important",
    color: "#e0e0e0 !important",
    marginTop: "8px !important",
    textAlign: "center",
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
  resetButton: {
    backgroundColor: "transparent !important",
    color: "#C0D3CA !important",
    // border: "1px solid #C0D3CA !important",
    padding: "8px 16px !important",
    borderRadius: "0 !important",
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.8rem !important",
    letterSpacing: "0.1em !important",
    marginTop: "20px !important",
    transition: "all 0.3s ease !important",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.1) !important",
      transform: "translateY(-2px) !important",
    },
  },
});

const ButtonPoshet = ({ handleCloseDrawer }) => {
  const classes = useStyles();
  const [selectedPoshet, setSelectedPoshet] = useAtom(selectedPoshetAtom);

  const handleClick = (color) => {
    setSelectedPoshet(color);
    handleCloseDrawer(false);
  };

  const handleReset = () => {
    setSelectedPoshet(null);
    handleCloseDrawer(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={classes.container}
    >
      <Grid container spacing={2} className={classes.fabricGrid}>
        {imagesPoshet.map((item, index) => (
          <Grid item key={item.name} xs={4} sm={2}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={classes.fabricItem}
            >
              <div
                className={`${classes.fabricButton} ${
                  item.name === selectedPoshet ? classes.selectedFabric : ""
                }`}
                onClick={() => handleClick(item.name)}
                position="relative"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className={classes.fabricImage}
                />
                {item.name === selectedPoshet && (
                  <CheckCircleIcon className={classes.checkIcon} />
                )}
              </div>
              <Typography className={classes.fabricName}>
                {item.name}
              </Typography>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <div sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button className={classes.resetButton} onClick={handleReset}>
          Reset Selection
        </Button>
      </div>
    </motion.div>
  );
};

export default ButtonPoshet;

import React from "react";
import { Button, Box, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { makeStyles } from "@mui/styles";
import { useAtom } from "jotai";
import { selectedButtonAtom } from "../../Utils";
import { imageButton } from "../../consts/KindOfColors";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const useStyles = makeStyles({
  container: {
    width: "100%",
  },
  buttonGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    justifyContent: "center",
  },
  buttonItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "15px",
  },
  button: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    padding: 0,
    position: "relative",
    overflow: "hidden",
    border: "1px solid rgba(192, 211, 202, 0.2)",
    backgroundColor: "rgba(30, 30, 30, 0.6)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
    }
  },
  selectedButton: {
    border: "1px solid rgba(192, 211, 202, 0.5)",
    boxShadow: "0 5px 15px rgba(192, 211, 202, 0.2)",
  },
  buttonImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  buttonName: {
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
    border: "1px solid #C0D3CA !important",
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
  }
});

const ButtonButton = ({ handleCloseDrawer }) => {
  const classes = useStyles();
  const [selectedButton, setSelectedButton] = useAtom(selectedButtonAtom);

  const handleClick = (name) => {
    setSelectedButton(name);
    handleCloseDrawer(false);
  };

  const handleReset = () => {
    setSelectedButton(null);
    handleCloseDrawer(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={classes.container}
    >
      <Grid container spacing={2} className={classes.buttonGrid}>
        {imageButton.map((item, index) => (
          <Grid item key={item.name} xs={4}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={classes.buttonItem}
            >
              <Box
                className={`${classes.button} ${selectedButton === item.name ? classes.selectedButton : ""}`}
                onClick={() => handleClick(item.name)}
                position="relative"
              >
                <img src={item.img} alt={item.name} className={classes.buttonImage} />
                {selectedButton === item.name && (
                  <CheckCircleIcon className={classes.checkIcon} />
                )}
              </Box>
              <Typography className={classes.buttonName}>
                {item.name}
              </Typography>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button className={classes.resetButton} onClick={handleReset}>
          Reset Selection
        </Button>
      </Box>
    </motion.div>
  );
};

export default ButtonButton;

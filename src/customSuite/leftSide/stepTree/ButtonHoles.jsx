import React, { useState } from "react";
import { Button, Box, Typography, Grid, Tabs, Tab } from "@mui/material";
import { motion } from "framer-motion";
import { makeStyles } from "@mui/styles";
import { useAtom } from "jotai";
import {
  selectedHolesButtonAtom,
  selectedHolesButtonUpAtom,
} from "../../../Utils";
import { imagesHoles } from "../../../consts/KindOfColors";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import holes from "/assets/kinds/AllSuit.png";
import JustUp from "/assets/kinds/JustUp.png";

const useStyles = makeStyles({
  container: {
    width: "100%",
  },
  tabsContainer: {
    marginBottom: "20px",
    borderBottom: "1px solid rgba(192, 211, 202, 0.2)",
  },
  tab: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.8rem !important",
    fontWeight: "300 !important",
    color: "#e0e0e0 !important",
    letterSpacing: "0.05em !important",
    textTransform: "none !important",
    minWidth: "120px !important",
  },
  tabSelected: {
    color: "#C0D3CA !important",
  },
  tabIndicator: {
    backgroundColor: "#C0D3CA !important",
  },
  tabPanel: {
    padding: "15px 0",
  },
  tabImage: {
    width: "80px",
    height: "120px",
    objectFit: "contain",
    marginBottom: "10px",
  },
  colorGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    justifyContent: "center",
  },
  colorItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "10px",
  },
  colorButton: {
    width: "20px",
    height: "60px",
    borderRadius: "10px",
    padding: 0,
    position: "relative",
    border: "1px solid rgba(192, 211, 202, 0.2)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
    }
  },
  selectedColor: {
    border: "1px solid rgba(192, 211, 202, 0.5)",
    boxShadow: "0 5px 15px rgba(192, 211, 202, 0.2)",
  },
  colorName: {
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

const ButtonHoles = ({ handleCloseDrawer }) => {
  const classes = useStyles();
  const [selectedHolesButton, setSelectedHolesButton] = useAtom(
    selectedHolesButtonAtom
  );
  const [selectedHolesButtonUp, setSelectedHolesButtonUp] = useAtom(
    selectedHolesButtonUpAtom
  );
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleClick = (color) => {
    setSelectedHolesButton(color);
    setSelectedHolesButtonUp(color);
    handleCloseDrawer(false);
  };

  const handleClick2 = (color) => {
    setSelectedHolesButton(null);
    setSelectedHolesButtonUp(color);
    handleCloseDrawer(false);
  };

  const handleReset = () => {
    setSelectedHolesButton(null);
    setSelectedHolesButtonUp(null);
    handleCloseDrawer(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={classes.container}
    >
      <Box className={classes.tabsContainer}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          classes={{ indicator: classes.tabIndicator }}
          centered
        >
          <Tab 
            label="All Suit" 
            className={classes.tab} 
            classes={{ selected: classes.tabSelected }}
          />
          <Tab 
            label="Just Upper" 
            className={classes.tab} 
            classes={{ selected: classes.tabSelected }}
          />
        </Tabs>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <img
          src={tabValue === 0 ? holes : JustUp}
          alt={tabValue === 0 ? "All Suit" : "Just Upper"}
          className={classes.tabImage}
        />
      </Box>

      <Grid container spacing={1} className={classes.colorGrid}>
        {imagesHoles.map((item, index) => (
          <Grid item key={item.name} xs={3}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={classes.colorItem}
            >
              <Box
                className={`${classes.colorButton} ${
                  tabValue === 0
                    ? selectedHolesButton === item.name ? classes.selectedColor : ""
                    : selectedHolesButtonUp === item.name ? classes.selectedColor : ""
                }`}
                style={{ backgroundColor: item.color }}
                onClick={() => tabValue === 0 ? handleClick(item.name) : handleClick2(item.name)}
                position="relative"
              >
                {((tabValue === 0 && selectedHolesButton === item.name) || 
                  (tabValue === 1 && selectedHolesButtonUp === item.name)) && (
                  <CheckCircleIcon className={classes.checkIcon} />
                )}
              </Box>
              <Typography className={classes.colorName}>
                {item.name}
              </Typography>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button className={classes.resetButton} onClick={handleReset}>
          Reset Selection
        </Button>
      </Box>
    </motion.div>
  );
};

export default ButtonHoles;
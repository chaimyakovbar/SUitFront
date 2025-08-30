import React, { useState } from "react";
import { Button, Box, Typography, Grid, Tabs, Tab } from "@mui/material";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import {
  selectedHolesButtonAtom,
  selectedHolesButtonUpAtom,
} from "../../../Utils";
import { imagesHoles } from "../../../consts/KindOfColors";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// S3 Assets URLs
const S3_BASE_URL = "https://ch-suits.s3.us-east-1.amazonaws.com";
const holes = `${S3_BASE_URL}/assets/kinds/AllSuit.png`;
const JustUp = `${S3_BASE_URL}/assets/kinds/JustUp.png`;

const ButtonHoles = ({ handleCloseDrawer }) => {
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
    <Box sx={{ width: "100%" }}>
      {/* Enhanced Tabs */}
      <Box
        sx={{
          mb: 3,
          borderBottom: "1px solid rgba(192, 211, 202, 0.2)",
          background:
            "linear-gradient(135deg, rgba(192, 211, 202, 0.05) 0%, rgba(192, 211, 202, 0.02) 100%)",
          borderRadius: "12px",
          p: 1,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": {
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.9rem",
              fontWeight: 400,
              color: "rgba(192, 211, 202, 0.7)",
              letterSpacing: "0.5px",
              textTransform: "none",
              minWidth: "120px",
              transition: "all 0.3s ease",
              "&.Mui-selected": {
                color: "#C0D3CA",
                fontWeight: 600,
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#C0D3CA",
              height: "2px",
              borderRadius: "1px",
            },
          }}
          centered
        >
          <Tab label="All Suit" />
          <Tab label="Just Upper" />
        </Tabs>
      </Box>

      {/* Enhanced Preview Image */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 4,
          p: 2,
          background:
            "linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)",
          borderRadius: "16px",
          border: "1px solid rgba(192, 211, 202, 0.15)",
          backdropFilter: "blur(10px)",
        }}
      >
        <img
          src={tabValue === 0 ? holes : JustUp}
          alt={tabValue === 0 ? "All Suit" : "Just Upper"}
          style={{
            width: "100px",
            height: "150px",
            objectFit: "contain",
            filter: "brightness(1.1) contrast(1.1)",
          }}
        />
      </Box>

      {/* Enhanced Color Grid */}
      <Grid container spacing={3} sx={{ justifyContent: "center" }}>
        {imagesHoles.map((item, index) => (
          <Grid item key={item.name} xs={6} sm={4} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Main Color Circle */}
                <Box
                  sx={{
                    width: { xs: 60, md: 70 },
                    height: { xs: 60, md: 70 },
                    backgroundColor: item.color,
                    border: (
                      tabValue === 0
                        ? selectedHolesButton === item.name
                        : selectedHolesButtonUp === item.name
                    )
                      ? "3px solid rgba(192, 211, 202, 0.8)"
                      : "2px solid rgba(192, 211, 202, 0.2)",
                    borderRadius: "50%",
                    cursor: "pointer",
                    position: "relative",
                    transition: "all 0.3s ease",
                    boxShadow: (
                      tabValue === 0
                        ? selectedHolesButton === item.name
                        : selectedHolesButtonUp === item.name
                    )
                      ? "0 8px 24px rgba(192, 211, 202, 0.3)"
                      : "0 4px 12px rgba(0, 0, 0, 0.2)",
                    backdropFilter: "blur(10px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      transform: "translateY(-4px) scale(1.05)",
                      boxShadow: "0 12px 32px rgba(192, 211, 202, 0.2)",
                      border: "3px solid rgba(192, 211, 202, 0.6)",
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "-2px",
                      left: "-2px",
                      right: "-2px",
                      bottom: "-2px",
                      background: `linear-gradient(45deg, ${item.color}, ${item.color}dd)`,
                      borderRadius: "50%",
                      zIndex: -1,
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                    },
                    "&:hover::before": {
                      opacity: 0.3,
                    },
                  }}
                  onClick={() =>
                    tabValue === 0
                      ? handleClick(item.name)
                      : handleClick2(item.name)
                  }
                >
                  {/* Inner Circle for Depth */}
                  <Box
                    sx={{
                      width: "70%",
                      height: "70%",
                      backgroundColor: item.color,
                      borderRadius: "50%",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
                      position: "relative",
                    }}
                  />

                  {/* Selection Check Icon */}
                  {((tabValue === 0 && selectedHolesButton === item.name) ||
                    (tabValue === 1 &&
                      selectedHolesButtonUp === item.name)) && (
                    <CheckCircleIcon
                      sx={{
                        position: "absolute",
                        top: "-6px",
                        right: "-6px",
                        color: "#C0D3CA",
                        backgroundColor: "rgba(10, 10, 10, 0.95)",
                        borderRadius: "50%",
                        padding: "3px",
                        fontSize: "18px",
                        border: "2px solid rgba(192, 211, 202, 0.4)",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                      }}
                    />
                  )}
                </Box>

                {/* Color Name */}
                <Typography
                  sx={{
                    color: "#C0D3CA",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    textAlign: "center",
                    mt: 1.5,
                    mb: 0.5,
                    letterSpacing: "0.3px",
                    textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  {item.name}
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Enhanced Reset Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button
          onClick={handleReset}
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          sx={{
            background:
              "linear-gradient(135deg, rgba(192, 211, 202, 0.1) 0%, rgba(192, 211, 202, 0.05) 100%)",
            color: "#C0D3CA",
            border: "1px solid rgba(192, 211, 202, 0.3)",
            padding: "10px 24px",
            borderRadius: "8px",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.85rem",
            fontWeight: 500,
            letterSpacing: "0.5px",
            transition: "all 0.3s ease",
            backdropFilter: "blur(10px)",
            "&:hover": {
              background:
                "linear-gradient(135deg, rgba(192, 211, 202, 0.2) 0%, rgba(192, 211, 202, 0.1) 100%)",
              border: "1px solid rgba(192, 211, 202, 0.5)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 24px rgba(192, 211, 202, 0.2)",
            },
          }}
        >
          Reset Selection
        </Button>
      </Box>
    </Box>
  );
};

export default ButtonHoles;

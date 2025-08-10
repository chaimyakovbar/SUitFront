import React, { useState } from "react";
import { useAtom } from "jotai";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Button,
  Divider,
  useMediaQuery,
  Slider,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  currentKindAtom,
  selectedCollarAtom,
  selectedLapelTypeAtom,
  selectedPacketTypeAtom,
  selectedKindTypeAtom,
} from "../../Utils";

import kind1Img from "/assets/kinds/kind1.png";
import kind2Img from "/assets/kinds/kind2.png";
import kind3Img from "/assets/kinds/kind3.png";
import kind4Img from "/assets/kinds/kind4.png";
import collarTight from "/assets/kinds/collarTight.png";
import collarDistant from "/assets/kinds/collarDistant.png";
import packet1 from "/assets/kinds/1.png";
import packet2 from "/assets/kinds/2.png";
import packet3 from "/assets/kinds/3.png";

const useStyles = makeStyles({
  sectionTitle: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "1.3rem !important",
    fontWeight: "300 !important",
    marginBottom: "1rem !important",
    marginTop: "1.5rem !important",
    color: "#C0D3CA !important",
    textAlign: "center",
    letterSpacing: "0.05em !important",
  },
  optionsContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    overflowX: "auto",
    gap: "12px",
    alignItems: "center",
    marginBottom: "20px",
    color: "white",
  },
  optionButton: {
    color: "white",
    backgroundColor: "rgba(30, 30, 30, 0.6) !important",
    border: "1px solid rgba(192, 211, 202, 0.2) !important",
    borderRadius: "4px !important",
    padding: "1px !important",
    position: "relative",
    transition: "all 0.3s ease !important",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.1) !important",
      transform: "translateY(-3px) !important",
    },
  },
  selectedOption: {
    backgroundColor: "rgba(192, 211, 202, 0.1) !important",
    border: "1px solid rgba(192, 211, 202, 0.5) !important",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2) !important",
  },
  optionImage: {
    width: "60px",
    height: "80px",
    color: "white",
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
  divider: {
    backgroundColor: "rgba(192, 211, 202, 0.2) !important",
    margin: "1.5rem 0 !important",
  },
  sliderContainer: {
    padding: "0 20px",
    marginBottom: "20px",
  },
  slider: {
    color: "#C0D3CA !important",
    "& .MuiSlider-track": {
      backgroundColor: "#C0D3CA !important",
    },
    "& .MuiSlider-rail": {
      backgroundColor: "rgba(192, 211, 202, 0.3) !important",
    },
    "& .MuiSlider-thumb": {
      backgroundColor: "#C0D3CA !important",
      border: "2px solid #0a0a0a !important",
    },
    "& .MuiSlider-mark": {
      backgroundColor: "rgba(192, 211, 202, 0.5) !important",
    },
    "& .MuiSlider-markLabel": {
      color: "#C0D3CA !important",
      fontFamily: "'Montserrat', sans-serif !important",
      fontSize: "0.8rem !important",
    },
  },
  pocketButton: {
    backgroundColor: "rgba(30, 30, 30, 0.6) !important",
    border: "1px solid rgba(192, 211, 202, 0.2) !important",
    borderRadius: "4px !important",
    padding: "8px 16px !important",
    margin: "10px",
    color: "rgb(193 211 201) !important",
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    transition: "all 0.3s ease !important",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.1) !important",
      transform: "translateY(-3px) !important",
    },
    "&:disabled": {
      backgroundColor: "rgba(192, 211, 202, 0.1) !important",
      color: "grey !important",
      cursor: "not-allowed",
    },
  },
});

function StepTwo() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const classes = useStyles({ isMobile });
  const [selectedKind, setSelectedKind] = useState(null);
  const [selectedKindPucket, setSelectedKindPucket] = useState(true);
  const [, setKindColor] = useAtom(currentKindAtom);
  const [selectedPacketType, setSelectedPacketType] = useAtom(
    selectedPacketTypeAtom
  );
  const [_, setSelectedKindType] = useAtom(selectedKindTypeAtom);
  const [selectedCollar, setSelectedCollar] = useAtom(selectedCollarAtom);
  const [, setSelectedLapelType] = useAtom(selectedLapelTypeAtom);

  const suitKinds = [
    { name: "kind1", image: kind1Img },
    { name: "kind2", image: kind2Img },
    { name: "kind3", image: kind3Img },
    { name: "kind4", image: kind4Img },
  ];

  const Laplekinds = [
    { name: "collarTight", image: collarTight },
    { name: "collarDistant", image: collarDistant },
    { name: "collarCircel", image: collarDistant },
  ];

  const lapelLevels = [
    { value: 1, label: "Slime" },
    { value: 2, label: "Standard" },
    { value: 3, label: "Wide" },
    { value: 4, label: "Extra Wide" },
  ];

  const packetType = [
    { name: "packet1", image: packet1 },
    { name: "packet2", image: packet2 },
    { name: "packet3", image: packet3 },
    { name: "packet4", image: packet1 },
    { name: "packet5", image: packet2 },
  ];

  const packetType2 = [
    { name: "packet1", image: packet1 },
    { name: "packet2", image: packet2 },
    { name: "packet4", image: packet1 },
    { name: "packet5", image: packet2 },
  ];

  const handelClickPucket = (type) => {
    setSelectedKindPucket((prev) => !prev);
    setSelectedKindType(type);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h3" className={classes.sectionTitle}>
        Suit Type
      </Typography>
      <Box className={classes.optionsContainer}>
        {suitKinds.map((kind, index) => (
          <motion.div
            key={kind.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Button
              onClick={() => {
                setKindColor(kind.name);
                setSelectedKind(kind.name);
              }}
              className={`${classes.optionButton} ${
                selectedKind === kind.name ? classes.selectedOption : ""
              }`}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  filter:
                    "contrast(0.5) brightness(1.2) contrast(0.8) invert(1) sepia(0) saturate(0) hue-rotate(0deg)",
                }}
              >
                <img
                  src={kind.image}
                  alt={kind.name}
                  style={{ width: "60px", height: "80px", color: "white" }}
                />
              </div>
              {selectedKind === kind.name && (
                <CheckCircleIcon className={classes.checkIcon} />
              )}
            </Button>
          </motion.div>
        ))}
      </Box>

      <Divider className={classes.divider} />

      <Typography variant="h3" className={classes.sectionTitle}>
        Collar Style
      </Typography>
      <Box className={classes.optionsContainer}>
        {Laplekinds.map((kind, index) => (
          <motion.div
            key={kind.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
          >
            <Button
              onClick={() => setSelectedCollar(kind.name)}
              className={`${classes.optionButton} ${
                selectedCollar === kind.name ? classes.selectedOption : ""
              }`}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  filter:
                    "contrast(0.5) brightness(1.2) contrast(0.8) invert(1) sepia(0) saturate(0) hue-rotate(0deg)",
                }}
              >
                <img
                  src={kind.image}
                  alt={kind.name}
                  className={classes.optionImage}
                />
              </div>
              {selectedCollar === kind.name && (
                <CheckCircleIcon className={classes.checkIcon} />
              )}
            </Button>
          </motion.div>
        ))}
      </Box>

      <Box className={classes.sliderContainer}>
        <Slider
          aria-label="Lapel Type"
          defaultValue={2}
          getAriaValueText={(value) =>
            lapelLevels.find((level) => level.value === value)?.label ||
            "Standard"
          }
          valueLabelDisplay="auto"
          step={1}
          marks={lapelLevels}
          min={1}
          max={4}
          className={classes.slider}
          onChange={(event, newValue) => {
            const selectedLevel = lapelLevels.find(
              (level) => level.value === newValue
            );
            setSelectedLapelType(selectedLevel?.label || "Standard");
          }}
        />
      </Box>

      <Divider className={classes.divider} />

      <Typography variant="h3" className={classes.sectionTitle}>
        Pocket Style
      </Typography>
      <Box className={classes.optionsContainer}>
        <Button
          disabled={selectedKindPucket}
          className={classes.pocketButton}
          onClick={() => handelClickPucket("packetBottom")}
        >
          straight
        </Button>
        <Button
          disabled={!selectedKindPucket}
          className={classes.pocketButton}
          onClick={() => handelClickPucket("packetSide")}
        >
          crooked
        </Button>
      </Box>

      <Box className={classes.optionsContainer}>
        {selectedKindPucket &&
          packetType.map((kind) => (
            <Button
              key={kind.name}
              onClick={() => setSelectedPacketType(kind.name)}
              className={`${classes.optionButton} ${
                selectedPacketType === kind.name ? classes.selectedOption : ""
              }`}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  filter:
                    "contrast(0.5) brightness(1.2) contrast(0.8) invert(1) sepia(0) saturate(0) hue-rotate(0deg)",
                }}
              >
                <img
                  src={kind.image}
                  alt={kind.name}
                  className={classes.optionImage}
                />
              </div>
              {selectedPacketType === kind.name && (
                <CheckCircleIcon className={classes.checkIcon} />
              )}
            </Button>
          ))}
        {!selectedKindPucket &&
          packetType2.map((kind) => (
            <Button
              key={kind.name}
              onClick={() => setSelectedPacketType(kind.name)}
              className={`${classes.optionButton} ${
                selectedPacketType === kind.name ? classes.selectedOption : ""
              }`}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  filter:
                    "contrast(0.5) brightness(1.2) contrast(0.8) invert(1) sepia(0) saturate(0) hue-rotate(0deg)",
                }}
              >
                <img
                  src={kind.image}
                  alt={kind.name}
                  className={classes.optionImage}
                />
              </div>
              {selectedPacketType === kind.name && (
                <CheckCircleIcon className={classes.checkIcon} />
              )}
            </Button>
          ))}
      </Box>
    </motion.div>
  );
}

export default StepTwo;

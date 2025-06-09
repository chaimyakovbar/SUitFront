import React, { useState } from "react";
import { useAtom } from "jotai";
import { motion } from "framer-motion";
import { Box, Typography, Button, Divider, useMediaQuery } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  currentKindAtom,
  selectedCollarAtom,
  selectedLapelTypeAtom,
  selectedPacketTypeAtom,
  selectedKindTypeAtom,
} from "../../Utils";

import wide from "/assets/kinds/wide.png";
import slim from "/assets/kinds/slim.png";
import standard from "/assets/kinds/standard.png";
import kind1Img from "/assets/kinds/kind1.png";
// import kind2Img from "/assets/kinds/kind2.2.png";
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
    color: "white",
    width: (props) => (props.isMobile ? "65px" : "100px"),
    height: (props) => (props.isMobile ? "65px" : "120px"),
    objectFit: "contain",
    filter:
      "brightness(1.2) contrast(0.8) invert(1) sepia(0) saturate(0) hue-rotate(0deg)",
    opacity: 0.9,
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
  const [selectedKindPucket, setSelectedKindPucket] = useState(false);
  const [, setKindColor] = useAtom(currentKindAtom);
  const [selectedPacketType, setSelectedPacketType] = useAtom(
    selectedPacketTypeAtom
  );
  const [_, setSelectedKindType] = useAtom(selectedKindTypeAtom);
  const [selectedCollar, setSelectedCollar] = useAtom(selectedCollarAtom);
  const [selectedLapelType, setSelectedLapelType] = useAtom(
    selectedLapelTypeAtom
  );

  const suitKinds = [
    { name: "kind1", image: kind1Img },
    { name: "kind2", image: kind2Img },
    { name: "kind3", image: kind3Img },
    { name: "kind4", image: kind4Img },
  ];

  const Laplekinds = [
    { name: "collarTight", image: collarTight },
    { name: "collarDistant", image: collarDistant },
  ];

  const collarTypes = [
    { name: "Slim", image: slim },
    { name: "Standard", image: standard },
    { name: "Wide", image: wide },
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
              <img
                src={kind.image}
                alt={kind.name}
                className={classes.optionImage}
              />
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
              <img
                src={kind.image}
                alt={kind.name}
                className={classes.optionImage}
              />
              {selectedCollar === kind.name && (
                <CheckCircleIcon className={classes.checkIcon} />
              )}
            </Button>
          </motion.div>
        ))}
      </Box>

      <Divider className={classes.divider} />

      <Typography variant="h3" className={classes.sectionTitle}>
        Lapel Type
      </Typography>
      <Box className={classes.optionsContainer}>
        {collarTypes.map((kind, index) => (
          <motion.div
            key={kind.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
          >
            <Button
              onClick={() => setSelectedLapelType(kind.name)}
              className={`${classes.optionButton} ${
                selectedLapelType === kind.name ? classes.selectedOption : ""
              }`}
            >
              <img
                src={kind.image}
                alt={kind.name}
                className={classes.optionImage}
              />
              {selectedLapelType === kind.name && (
                <CheckCircleIcon className={classes.checkIcon} />
              )}
            </Button>
          </motion.div>
        ))}
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
              <img
                src={kind.image}
                alt={kind.name}
                className={classes.optionImage}
              />
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
              <img
                src={kind.image}
                alt={kind.name}
                className={classes.optionImage}
              />
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

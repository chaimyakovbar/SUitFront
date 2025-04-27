import React, { useState } from "react";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useAtom } from "jotai";
import VerifiedIcon from "@mui/icons-material/Verified";
import {
  currentKindAtom,
  selectedCollarAtom,
  selectedLapelTypeAtom,
  selectedPacketTypeAtom,
  selectedKindTypeAtom,
} from "../../Utils";
import "./styles.css";

import wide from "/assets/kinds/wide.png";
import slim from "/assets/kinds/slim.png";
import standard from "/assets/kinds/standard.png";
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
  buttonImg: {
    height: "60px",
    width: "auto",
    transition: "filter 0.3s ease-in-out",
    objectFit: "contain",
  },
  container: {
    "@media (max-width: 600px)": {
      with: "200px",
    },
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: "15px",
  },
  button: {
    "@media (max-width: 600px)": {
      with: "40px",
      height: "60px",
    },
    width: "80px",
    height: "80px",
    transition: "all 0.2s ease-in-out",
    borderRadius: "6px",
    padding: "4px",
    position: "relative",
    "&:hover": {
      backgroundColor: "#e0e0e0",
      transform: "scale(1.05)",
      boxShadow: "0 6px 12px #FF5722",
    },
  },
  selectedButton: {
    backgroundColor: "transparent !important",
    boxShadow: "0 6px 12px #FF5722 !important",
    transform: "scale(1.05) !important",
  },
  verifiedIcon: {
    position: "absolute",
    top: "5px",
    right: "5px",
    color: "#FF5722", // Orange color
    fontSize: "20px", // Adjust the size as needed
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    margin: "15px 0 10px",
    textAlign: "center",
    color: "#333",
  },
});

function StepTwo() {
  const classes = useStyles();
  const [selectedKind, setSelectedKind] = useState(null);
  const [selectedKindPucket, setSelectedKindPucket] = useState(false);
  const [, setKindColor] = useAtom(currentKindAtom);
  const [selectedPacketType, setSelectedPacketType] = useAtom(selectedPacketTypeAtom);
  const [selecteKindType, setSelectedKindType] = useAtom(selectedKindTypeAtom);
  const [selectedCollar, setSelectedCollar] = useAtom(selectedCollarAtom);
  const [selectedLapelType, setSelectedLapelType] = useAtom(selectedLapelTypeAtom);


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
  ]

  const handelClickPucket = (type) => {
    setSelectedKindPucket((prev) => !prev);
    setSelectedKindType(type)
  };

  return (
    <>
      <h2 className={classes.title}>בחר את סוג החליפה</h2>
      <div className={classes.container}>
        {suitKinds.map((kind) => (
          <Button
            key={kind.name}
            onClick={() => {
              setKindColor(kind.name);
              setSelectedKind(kind.name);
            }}
            className={`${classes.button} ${
              selectedKind === kind.name ? classes.selectedButton : ""
            }`}
          >
            <img
              src={kind.image}
              alt={kind.name}
              className={classes.buttonImg}
            />
            {selectedKind === kind.name && (
              <VerifiedIcon className={classes.verifiedIcon} />
            )}
          </Button>
        ))}
      </div>

      <h3 className={classes.title}>בחר את סוג הצווארון</h3>
      <div className={classes.container}>
        {Laplekinds.map((kind) => (
          <Button
            key={kind.name}
            onClick={() => setSelectedCollar(kind.name)}
            className={`${classes.button} ${
              selectedCollar === kind.name ? classes.selectedButton : ""
            }`}
          >
            <img
              src={kind.image}
              alt={kind.name}
              className={classes.buttonImg}
            />
            {selectedCollar === kind.name && (
              <VerifiedIcon className={classes.verifiedIcon} />
            )}
          </Button>
        ))}
      </div>

      <h3 className={classes.title}>בחר את סוג הדש</h3>
      <div className={classes.container}>
        {collarTypes.map((kind) => (
          <Button
            key={kind.name}
            onClick={() => setSelectedLapelType(kind.name)}
            className={`${classes.button} ${
              selectedLapelType === kind.name ? classes.selectedButton : ""
            }`}
          >
            <img
              src={kind.image}
              alt={kind.name}
              className={classes.buttonImg}
            />
            {selectedLapelType === kind.name && (
              <VerifiedIcon className={classes.verifiedIcon} />
            )}
          </Button>
        ))}
      </div>

      <h3 className={classes.title}>בחר את סוג הכיסים</h3>
      <button
        disabled={!selectedKindPucket}
        className="pocket-button"
        onClick={() => handelClickPucket("packetSide")}
      >
          כיס עקום
      </button>
      <button
        disabled={selectedKindPucket}
        className="pocket-button"
        onClick={() => handelClickPucket("packetBottom")}
      >
      
        כיס ישר
      </button>
      <div className={classes.container}>
        {selecteKindType ===  'packetBottom' &&
          packetType.map((kind) => (
            <Button
              key={kind.name}
              onClick={() => setSelectedPacketType(kind.name)}
              className={`${classes.button} ${
                selectedPacketType === kind.name ? classes.selectedButton : ""
              }`}
            >
              <img
                src={kind.image}
                alt={kind.name}
                className={classes.buttonImg}
              />
              {selectedPacketType === kind.name && (
                <VerifiedIcon className={classes.verifiedIcon} />
              )}
            </Button>
          ))}
        {selecteKindType ===  'packetSide' &&
          packetType2.map((kind) => (
            <Button
              key={kind.name}
              onClick={() => setSelectedPacketType(kind.name)}
              className={`${classes.button} ${
                selectedPacketType === kind.name ? classes.selectedButton : ""
              }`}
            >
              <img
                src={kind.image}
                alt={kind.name}
                className={classes.buttonImg}
              />
              {selectedPacketType === kind.name && (
                <VerifiedIcon className={classes.verifiedIcon} />
              )}
            </Button>
          ))}
      </div>
    </>
  );
}

export default StepTwo;

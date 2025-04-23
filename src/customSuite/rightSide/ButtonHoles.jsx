import React, { useState } from "react";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useAtom } from "jotai";
import {
  selectedHolesButtonAtom,
  selectedHolesButtonUpAtom,
} from "../../Utils";
import { imagesHoles } from "../../consts/KindOfColors";
import holes from "/assets/kinds/AllSuit.png";
import JustUp from "/assets/kinds/JustUp.png";

const useStyles = makeStyles({
  container: {
    position: "absolute",
    right: 10,
    top: 100,
    width: "330px",
    backgroundColor: "#F5F5F7",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  button: {
    width: "140px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px",
    minWidth: "80px",
    background: "#f0f0f0",
    color: "#333",
    borderRadius: "8px",
    position: "relative",
    transition: "transform 0.3s ease",
  },
  buttonText: {
    margin: "0 0 0 0",
    fontSize: "14px",
    display: 'flex',
    justifyContent: 'center'
  },
  selectedButton: {
    boxShadow: '0px 0px 10px 5px rgb(255 0 0)',
    transform: "scale(1.1)",
  },
  resetButton: {
    marginTop: "20px",
    padding: "10px",
    border: "2px solid #ff0000",
    borderRadius: "8px",
    backgroundColor: "#f0f0f0",
    color: "#ff0000",
    "&:hover": {
      backgroundColor: "#ffe0e0",
    },
  },
  selectionIndicator: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    width: "20px",
    height: "20px",
    backgroundColor: "red",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "12px",
  },
});


const ButtonHoles = ({ handleCloseDrawer }) => {
  const classes = useStyles();
  const [selectedHolesButton, setSelectedHolesButton] = useAtom(
    selectedHolesButtonAtom
  );
  const [selectedHolesButtonUp, setSelectedHolesButtonUp] = useAtom(
    selectedHolesButtonUpAtom
  );

  const [showAllSuit, setShowAllSuit] = useState(true);

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
    <div className={classes.container}>
      <div style={{ display: "flex" }}>
        <div style={{ marginLeft: "50px" }}>
          <img
            style={{ width: "90px", height: "140px"}}
            src={holes}
            alt={holes}
          />

          <Button
            style={{
              backgroundColor: showAllSuit ? "#1976d2" : "#e0e0e0",
              color: showAllSuit ? "white" : "black",
              margin: "5px",
              minWidth: "50px",
            }}
            onClick={() => setShowAllSuit(true)}
            variant="contained"
          >
            All Suit
          </Button>
        </div>
        <div>
          <img
            style={{ width: "90px", height: "140px" }}
            src={JustUp}
            alt={JustUp}
          />

          <Button
            style={{
              backgroundColor: showAllSuit ? "#e0e0e0" : "#1976d2",
              color: showAllSuit ? "black" : "white",
              margin: "5px",
              minWidth: "50px",
            }}
            onClick={() => setShowAllSuit(false)}
            variant="contained"
          >
            Just Up
          </Button>
        </div>
      </div>

      {showAllSuit ? (
        <div style={{ display: "ruby" }}>
          {imagesHoles.map((item) => (
            <div>
            <button
              onClick={() => handleClick(item.name)}
              key={item.name}
              className={`${classes.button} ${
                selectedHolesButton === item.name ? classes.selectedButton : ""
              }`}
              style={{
                backgroundColor: item.color,
                margin: "15px",
                height: "65px",
                width: "10px",
                border: "none",
                borderRadius: "50%",
              }}
            >
              {selectedHolesButton === item.name && (
                <div className={classes.selectionIndicator}>✓</div>
              )}
            </button>
          <p className={classes.buttonText}>{item.name}</p>
          </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "ruby" }}>
          {imagesHoles.map((item) => (
            <div>
            <button
              onClick={() => handleClick2(item.name)}
              key={item.name}
              className={`${classes.button} ${
                selectedHolesButtonUp === item.name
                  ? classes.selectedButton
                  : ""
              }`}
              style={{
                backgroundColor: item.color,
                margin: "15px",
                height: "65px",
                width: "10px",
                border: "none",
                borderRadius: "50%",
              }}
            >
              {selectedHolesButtonUp === item.name && (
                <div className={classes.selectionIndicator}>✓</div>
              )}
            </button>
               <p className={classes.buttonText}>{item.name}</p>
               </div>
          ))}
        </div>
      )}
      <Button className={classes.resetButton} onClick={handleReset}>
        Reset to Default
      </Button>
    </div>
  );
};

export default ButtonHoles;

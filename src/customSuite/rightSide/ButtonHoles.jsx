import React, { useState } from "react";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useAtom } from "jotai";
import {
  selectedHolesButtonAtom,
  selectedHolesButtonUpAtom,
} from "../../../Utils";
import { imagesHoles } from "../../consts/KindOfColors";
import holes from "../../assets/kinds/AllSuit.png";
import JustUp from "../../assets/kinds/JustUp.png";

const useStyles = makeStyles({
  container: {
    position: "absolute",
    right: 10,
    width: "350px",
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
  },
  buttonText: {
    margin: "5px 0 0",
    fontSize: "14px",
  },
});

const ButtonHoles = () => {
  const classes = useStyles();
  const [, setSelectedHolesButton] = useAtom(selectedHolesButtonAtom);
  const [, setSelectedHolesButtonUp] = useAtom(selectedHolesButtonUpAtom);

  const [showAllSuit, setShowAllSuit] = useState(false);

  const handleClick = (color) => {
    setSelectedHolesButton(color);
    setSelectedHolesButtonUp(color);
  };

  const handleClick2 = (color) => {
    setSelectedHolesButton(null);
    setSelectedHolesButtonUp(color);
  };

  return (
    <div className={classes.container}>
      <div style={{ display: "flex" }}>
        <div>
          <img
            style={{ width: "90px", height: "140px" }}
            src={JustUp}
            alt={JustUp}
          />

          <Button
            style={{ backgroundColor: showAllSuit ? "grey" : "blue" }}
            onClick={() => setShowAllSuit(false)}
            variant="contained"
            color="primary"
          >
            Just Up
          </Button>
        </div>
        <div>
          <img
            style={{ width: "90px", height: "140px" }}
            src={holes}
            alt={holes}
          />

          <Button
            style={{ backgroundColor: showAllSuit ? "blue" : "grey" }}
            onClick={() => setShowAllSuit(true)}
            variant="contained"
            color="primary"
          >
            All Suit
          </Button>
        </div>
      </div>

      {showAllSuit ? (
        <div>
          {imagesHoles.map((item) => (
            <Button
              onClick={() => handleClick(item.name)}
              key={item.name}
              className={classes.button}
              style={{
                backgroundColor: item.color,
                margin: "15px",
                height: "70px",
                border: "1px solid black",
              }}
            >
              <p className={classes.buttonText}>{item.name}</p>
            </Button>
          ))}
        </div>
      ) : (
        <div>
          {imagesHoles.map((item) => (
            <Button
              onClick={() => handleClick2(item.name)}
              key={item.name}
              className={classes.button}
              style={{
                backgroundColor: item.color,
                margin: "15px",
                height: "70px",
                border: "1px solid black",
              }}
            >
              <p className={classes.buttonText}>{item.name}</p>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ButtonHoles;

import React from "react";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useAtom } from "jotai";
import { selectedPoshetAtom } from "../../Utils";
import { imagesPoshet } from "../../consts/KindOfColors";

const useStyles = makeStyles({
  container: {
    position: "absolute",
    right: 10,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  button: {
    width: "90px",
    height: "70px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px",
    minWidth: "80px",
    color: "#333",
    borderRadius: "8px",
  },
  buttonText: {
    margin: "5px 0 0",
    fontSize: "14px",
  },
  activeButton: {
    backgroundColor: "#3f51b5",
    color: "#fff",
  },
  inactiveButton: {
    backgroundColor: "#f0f0f0",
  },
});

const ButtonPoshet = ({handleCloseDrawer}) => {
  const classes = useStyles();
  const [selectedPoshet, setSelectedPoshet] = useAtom(selectedPoshetAtom)

  const handleClick = (color) => {
    setSelectedPoshet(color)
    handleCloseDrawer(false)
  };

  return (
    <div className={classes.container}>
      {imagesPoshet.map((item) => (
        <Button
          onClick={() => handleClick(item.name)}
          key={item.name}
          className={`${classes.button} ${
            item.color === selectedPoshet
              ? classes.activeButton
              : classes.inactiveButton
          }`}
          style={{ backgroundColor: item.color, border: "1px solid black" }}
        >
          <p className={classes.buttonText}>{item.name}</p>
        </Button>
      ))}
    </div>
  )
}

export default ButtonPoshet;

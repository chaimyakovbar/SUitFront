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
    top: 100,
    width: "330px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  buttonGrid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "15px",
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    position: "relative",
    height: "100px",
    width: "100px",
    // borderRadius: "50%",
    border: "2px solid transparent",
    // backgroundColor: "#f0f0f0",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      boxShadow: "0 0 8px rgba(0, 0, 0, 0.2)",
    },
  },
  selectedButton: {
    border: "3px solid red",
    boxShadow: "0 0 10px rgba(63, 181, 65, 0.5)",
    transform: "scale(1.1)",
  },
  selectionIndicator: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    width: "20px",
    height: "20px",
    backgroundColor: "red",
    // borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "12px",
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%",
  },
  resetButton: {
    marginTop: "20px",
    padding: "10px",
    border: "2px solid #ff0000",
    borderRadius: "8px",
    backgroundColor: "#fff",
    color: "#ff0000",
    "&:hover": {
      backgroundColor: "#ffe0e0",
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
    <div className={classes.container}>
      <div className={classes.buttonGrid}>
        {imagesPoshet.map((item) => (
          <button
            key={item.name}
            onClick={() => handleClick(item.name)}
            className={`${classes.button} ${
              item.color === selectedPoshet ? classes.selectedButton : ""
            }`}
          >
            {item.color === selectedPoshet && (
              <div className={classes.selectionIndicator}>✓</div>
            )}
            <img
              src={item.img}
              alt={item.name}
              className={classes.image}
            />
          </button>
        ))}
      </div>
      <Button className={classes.resetButton} onClick={handleReset}>
        Reset to Default
      </Button>
    </div>
  );
};

export default ButtonPoshet;

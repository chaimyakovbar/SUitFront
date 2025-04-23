import React from "react";
import { imagesInsideUp } from "../../consts/KindOfColors";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useAtom } from "jotai";
import { selectedInsideTypeAtom } from "../../Utils";

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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "0",
    background: "#f0f0f0",
    color: "#333",
    borderRadius: "50%",
    position: "relative",
    height: "65px",
    width: "65px",
    border: "1px solid black",
    overflow: "hidden",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },
  buttonText: {
    margin: "5px 0 0",
    fontSize: "14px",
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
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "12px",
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
});

const ButtonInside = ({ handleCloseDrawer }) => {
  const classes = useStyles();
  const [selectedInsideType, setSelectedInsideType] = useAtom(
    selectedInsideTypeAtom
  );

  const handleClick = (name) => {
    setSelectedInsideType(name);
    handleCloseDrawer(false);
  };

  const handleReset = () => {
    setSelectedInsideType(null);
    handleCloseDrawer(false);
  };

  return (
    <div className={classes.container}>
      <div style={{ display: "ruby" }}>
        {imagesInsideUp.map((item) => (
          <button
            onClick={() => handleClick(item.name)}
            key={item.name}
            className={`${classes.button} ${
              item.name === selectedInsideType ? classes.selectedButton : ""
            }`}
            style={{
              margin: "15px",
              height: "75px",
              width: "75px",
            }}
          >
            {item.name === selectedInsideType && (
              <div className={classes.selectionIndicator}>✓</div>
            )}
            <img src={item.img} alt={item.name} />
          </button>
        ))}
      </div>
      <Button className={classes.resetButton} onClick={handleReset}>
        Reset to Default
      </Button>
    </div>
  );
};

export default ButtonInside;

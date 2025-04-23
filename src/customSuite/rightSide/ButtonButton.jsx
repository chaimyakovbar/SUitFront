import React from "react";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useAtom } from "jotai";
import { selectedButtonAtom } from "../../Utils"; // Import the Jotai atom
import { imageButton } from "../../consts/KindOfColors"; // Import the button images array

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
    height: "75px",
    width: "75px",
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
    border: "3px solid #ff0000",
    boxShadow: "0 0 10px rgba(255, 0, 0, 0.5)",
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

const ButtonButton = ({ handleCloseDrawer }) => {
  const classes = useStyles();
  const [selectedButton, setSelectedButton] = useAtom(selectedButtonAtom); // Using Jotai atom

  const handleClick = (name) => {
    setSelectedButton(name);
    handleCloseDrawer(false);
  };

  const handleReset = () => {
    setSelectedButton(null);
    handleCloseDrawer(false);
  };

  return (
    <div className={classes.container}>
      <div style={{ display: "ruby" }}>
        {imageButton.map((item) => (
          <button
            onClick={() => handleClick(item.name)}
            key={item.name}
            className={`${classes.button} ${
              selectedButton === item.name ? classes.selectedButton : ""
            }`}
            style={{
              margin: "15px",
            }}
          >
            {selectedButton === item.name && (
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

export default ButtonButton;

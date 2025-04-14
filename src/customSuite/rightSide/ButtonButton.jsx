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
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
  },
  button: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px",
    minWidth: "80px",
    borderRadius: "8px",
    transition: "0.3s",
  },
  activeButton: {
    border: "2px solid #3f51b5", // Blue border for the selected button
    backgroundColor: "#e0e0e0",
  },
  inactiveButton: {
    backgroundColor: "#f0f0f0",
  },
  buttonImage: {
    width: "50px",
    height: "50px",
    objectFit: "cover",
    borderRadius: "4px",
  },
  buttonText: {
    margin: "5px 0 0",
    fontSize: "14px",
  },
});

const ButtonButton = ({handleCloseDrawer}) => {
  const classes = useStyles();
  const [selectedButton, setSelectedButton] = useAtom(selectedButtonAtom); // Using Jotai atom

  const handleClick = (name) => {
    setSelectedButton(name)
    handleCloseDrawer(false)
  };

  return (
    <div className={classes.container}>
      {imageButton.map((item) => (
        <Button
          onClick={() => handleClick(item.name)} // Select the clicked button
          key={item.name}
          className={`${classes.button} ${selectedButton === item.name ? classes.activeButton : classes.inactiveButton}`} 
        >
          <img src={item.img} alt={item.name} className={classes.buttonImage} />
          <p className={classes.buttonText}>{item.name}</p>
        </Button>
      ))}
    </div>
  );
};

export default ButtonButton;

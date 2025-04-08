import React from "react";
import { imagesInsideUp } from "../../consts/KindOfColors";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useAtom } from "jotai";
import { selectedInsideTypeAtom } from "../../../Utils";

const useStyles = makeStyles({
    container: {
      position: "absolute",
      right: 10,
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      maxWidth: "200px",
    },
    button: {
      width: "90px",
      display: "flex",
      alignItems: "center",
      padding: "10px",
      borderRadius: "8px",
      "& img": {
        width: "90px",
        height: "90px",
      },
    },
  });
  


const ButtonInside = () => {
  const classes = useStyles();
  const [, setSelectedInsideType] = useAtom(selectedInsideTypeAtom);

  const handleClick = (name) => {
    setSelectedInsideType(name);
  };

  return (
    <div className={classes.container} style={{width: '200px'}}>
      {imagesInsideUp.map((item) => (
        <Button
          onClick={() => handleClick(item.name)}
          key={item.name}
          className={classes.button}
        >
          <img src={item.img} alt={item.name} />
          {/* <p className={classes.buttonText}>{item.name}</p> */}
        </Button>
      ))}
    </div>
  );
};

export default ButtonInside;

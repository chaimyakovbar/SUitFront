import * as React from "react";
import { useAtom } from "jotai";
import {
  selectedInsideTypeAtom,
  selectedButtonAtom,
  selectedPoshetAtom,
  selectedHolesButtonAtom,
  selectedHolesButtonUpAtom,
} from "../../Utils";
import {
  List,
  ListItem,
  ListItemButton,
  Box,
  Button,
  Drawer,
} from "@mui/material";
import {
  imagesInsideUp,
  imagesHoles,
  imagesHolesUp,
  imagesPoshet,
  imageButton,
} from "../consts/KindOfColors";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  buttonStyle: {
    width: "100px",
    height: "100px",
    borderRadius: "50px",
    border: "2px solid black",
    transition: "transform 0.5s ease-in-out",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
  listContainer: {
    backgroundColor: "#F5F5F7",
    width: "30%",
    padding: "10px",
  },
  colorBox: {
    width: "30%px",
    height: "50px",
    borderRadius: "8px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
});

const TopDrawer = ({ name }) => {
  const classes = useStyles();
  const [, setSelectedInsideType] = useAtom(selectedInsideTypeAtom);
  const [, setSelectedButton] = useAtom(selectedButtonAtom);
  const [, setSelectedPoshet] = useAtom(selectedPoshetAtom);
  const [, setSelectedHolesButton] = useAtom(selectedHolesButtonAtom);
  const [, setSelectedHolesButtonUp] = useAtom(selectedHolesButtonUpAtom);

  const handleMenuClick = () => {
    window.scrollTo({ left: 0, behavior: "smooth" });
  };

  const getImages = () => {
    switch (name) {
      case "imagesInsideUp":
        return imagesInsideUp;
      case "imagesHoles":
        return imagesHoles;
      case "imagesHolesUp":
        return imagesHolesUp;
      case "imagesPoshet":
        return imagesPoshet;
      case "imageButton":
        return imageButton;
      default:
        return [];
    }
  };

  const handleInsideKindSelect = (itemName) => {
    switch (name) {
      case "imagesInsideUp":
        setSelectedInsideType(itemName);
        break;
      case "imagesHoles":
        setSelectedHolesButton(itemName);
        setSelectedHolesButtonUp(itemName);
        break;
      case "imagesHolesUp":
        setSelectedHolesButtonUp(itemName);
        break;
      case "imagesPoshet":
        setSelectedPoshet(itemName);
        break;
      case "imageButton":
        setSelectedButton(itemName);
        break;
      default:
        break;
    }
  };

  const images = getImages();

  
  return (
    <Box className={classes.listContainer}>
      <List>
        {images.map((item, index) => {
          if (index % 2 === 0) {
            return (
              <Box key={index} className={classes.row}>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleMenuClick}>
                    <Button
                      onClick={() => handleInsideKindSelect(item.name)}
                      className={classes.buttonStyle}
                    >
                      { name === 'imagesHoles' && 
                      <div>
                        <Button onClick={handleMenuClick}> all suit
                        <div
                          className={classes.colorBox}
                          style={{ backgroundColor: item.color }}
                        ></div>
                        </Button>
                        <Button onClick={handleMenuClick}> just Up Hole 
                        <div
                          className={classes.colorBox}
                          style={{ backgroundColor: item.color }}
                        ></div>
                        </Button>
                        </div>}
                      {name === "imagesPoshet" ? (
                        <div
                          className={classes.colorBox}
                          style={{ backgroundColor: item.color }}
                        ></div>
                      ) : (
                        <img
                          src={item.img}
                          alt={item.name}
                          className={classes.buttonStyle}
                        />
                      )}
                    </Button>
                  </ListItemButton>
                </ListItem>
                {images[index + 1] && (
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleMenuClick}>
                      <Button
                        onClick={() => handleInsideKindSelect(images[index + 1].name)}
                        className={classes.buttonStyle}
                      >
                        {name === "imagesPoshet" ? (
                          <div
                            className={classes.colorBox}
                            style={{ backgroundColor: images[index + 1].color }}
                          ></div>
                        ) : (
                          <img
                            src={images[index + 1].img}
                            alt={images[index + 1].name}
                            className={classes.buttonStyle}
                          />
                        )}
                      </Button>
                    </ListItemButton>
                  </ListItem>
                )}
              </Box>
            );
          }
          return null;
        })}
      </List>
    </Box>
  );
};

export default TopDrawer;

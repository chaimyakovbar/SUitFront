import React, { useRef } from "react";
import AllCollection from "./AllCollection";
import About from "../pages/About";
import { makeStyles } from "@mui/styles";
import Drawer from "./Drawer2";
import OpenDrawer from "./OpenDrawer";
import { useMediaQuery } from "react-responsive";
import { useSetAtom } from "jotai";
import { openUserDialog } from "../../Utils";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

const useStyles = makeStyles({
  navContainer: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    backgroundColor: "rgb(26 26 26 / 26%)",
    backdropFilter: "blur(8px)",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    borderRadius: "0 0 20px 20px",
  },
  drawer: {
    display: "flex",
    alignItems: "center",
  },
  drawerForIphone: {
    display: "flex",
    alignItems: "center",
  },
});

const NavBar = () => {
  const classes = useStyles();
  const setOpenSignUp = useSetAtom(openUserDialog);
  const targetSectionRef = useRef(null);
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  const scrollToTargetSection = () => {
    if (targetSectionRef.current) {
      targetSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // const menuItems = [
  //   { text: "אודות", link: "/about" },
  //   { text: "אוסף", link: "/collection" },
  //   { text: "צור קשר", action: scrollToTargetSection },
  // ];

  const menuUser = [
    // { icon: <FavoriteIcon />, link: "/likes" },
    { icon: <PermIdentityIcon />, action: () => setOpenSignUp(true) },
    { icon: <ShoppingBagIcon />, link: "/shopping" },
  ];

  return (
    <div className={classes.navContainer}>
           {isMobile ? (
        <div className={classes.drawerForIphone}>
          <Drawer scrollToTargetSection={scrollToTargetSection} />
        </div>
      ) : (
        <div className={classes.drawer}>
          <OpenDrawer scrollToTargetSection={scrollToTargetSection} />
        </div>
      )}

      <div style={{ marginLeft: "auto" }}>
        <List style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
          {menuUser.map((item, index) => (
            <ListItem key={index} disablePadding style={{ width: "auto" }}>
              <ListItemButton
                component={item.link ? Link : "button"}
                to={item.link ? item.link : undefined}
                onClick={item.action ? item.action : undefined}
                style={{
                  padding: "10px 10px",
                  textShadow: "black 3px 3px 3px",
                  cursor: "pointer",
                }}
              >
                {item.icon}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default NavBar;

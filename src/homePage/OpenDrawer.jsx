import React from "react";
import { Link, useLocation } from "react-router-dom";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { motion } from "framer-motion";
import User from "../User/User";

const useStyles = makeStyles({
  navList: {
    display: "flex",
    flexDirection: "row",
    gap: "15px",
  },
  navItem: {
    width: "auto",
  },
  navButton: {
    padding: "8px 15px !important",
    borderRadius: "0 !important",
    position: "relative",
    overflow: "hidden",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "0%",
      height: "2px",
      backgroundColor: "#8B5E3C",
      transition: "width 0.3s ease",
    },
    "&:hover::after": {
      width: "100%",
    },
  },
  activeButton: {
    "&::after": {
      width: "100% !important",
    },
  },
  navText: {
    fontSize: "14px !important",
    color: "#C0D3CA !important",
    textAlign: "center !important",
    fontWeight: "500 !important",
    letterSpacing: "1px !important",
    textTransform: "uppercase !important",
    transition: "color 0.3s ease !important",
    "&:hover": {
      color: "#fff !important",
    },
  },
  activeText: {
    color: "#fff !important",
    fontWeight: "600 !important",
  },
});

const OpenDrawer = ({ scrollToTargetSection }) => {
  const classes = useStyles();
  const location = useLocation();

  const menuItems = [
    { text: "Home", link: "/", exact: true },
    { 
      text: "Collections", 
      link: "/#targetSection", 
      action: scrollToTargetSection,
      isActive: location.hash === "#targetSection" 
    },
    { text: "About", link: "/about", isActive: location.pathname === "/about" },
    { text: "Contact", link: "/contact", isActive: location.pathname === "/contact" },
    { text: "Size Guide", link: "/indexSizes", isActive: location.pathname === "/indexSizes" },
    { text: "Support", link: "/PolicySupport", isActive: location.pathname === "/PolicySupport" },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <List className={classes.navList}>
        {menuItems.map((item, index) => (
          <ListItem key={item.text} className={classes.navItem} disablePadding>
            <motion.div
              whileHover={{ y: -3 }}
              whileTap={{ y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ListItemButton
                component={Link}
                to={item.link}
                onClick={item.action}
                className={`${classes.navButton} ${
                  (item.exact && location.pathname === "/" && !location.hash) || 
                  (!item.exact && item.isActive) ? classes.activeButton : ""
                }`}
              >
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    className: `${classes.navText} ${
                      (item.exact && location.pathname === "/" && !location.hash) || 
                      (!item.exact && item.isActive) ? classes.activeText : ""
                    }`,
                  }}
                />
              </ListItemButton>
            </motion.div>
          </ListItem>
        ))}
      </List>

      <User />
    </div>
  );
};

export default OpenDrawer;

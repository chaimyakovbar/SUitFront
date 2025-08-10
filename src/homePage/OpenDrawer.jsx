import React from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import User from "../User/User";

const OpenDrawer = ({ scrollToTargetSection }) => {
  const menuItems = [
    { text: "indexSizes", link: "/indexSizes" },
    { text: "HOME", link: "/" },
    {
      text: "ALL COLLECTION",
      link: "/#targetSection",
      action: scrollToTargetSection,
    },
    { text: "ABOUT US", link: "/about" },
    { text: "CONTACT", link: "/contact" },
    { text: "POLICY SUPPORT", link: "/PolicySupport" },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        padding: "20px",
      }}
    >
      <List style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding style={{ width: "auto" }}>
            <ListItemButton
              component={Link}
              to={item.link}
              onClick={item.action ? item.action : undefined}
              style={{
                padding: "10px 10px",
                textShadow: "black 3px 3px 3px",
              }}
            >
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: 17,
                  color: "#8B5E3C",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <User />
    </div>
  );
};

export default OpenDrawer;

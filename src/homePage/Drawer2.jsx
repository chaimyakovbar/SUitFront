import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { openUserDialog } from "../Utils";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import User from "../User/User";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import { ViewHeadline } from "@mui/icons-material";

const Drawer2 = ({ scrollToTargetSection }) => {
  const [state, setState] = useState({ top: false });
  const [, setOpen] = useAtom(openUserDialog);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    )
      return;
    setState({ ...state, [anchor]: open });
  };

  const handleClose = () => setState({ top: false });

  const handleMenuClick = (action) => {
    if (action) action();
    else window.scrollTo({ top: 0, behavior: "smooth" });
    handleClose();
  };

  const menuItems = [
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

  const menuUser = [
    {
      text: "Account",
      icon: <PermIdentityIcon />,
      action: () => setOpen(true),
    },
    { text: "Shopping Bag", icon: <ShoppingBagIcon />, link: "/shopping" },
  ];

  const list = (anchor) => (
    <Box
      sx={{
        width: anchor === "top" ? "100%" : 250,
        bgcolor: "#101010",
        color: "#C0D3CA",
        paddingTop: 2,
        paddingBottom: 2,
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleMenuClick(item.action)}
              component={Link}
              to={item.link}
              sx={{
                justifyContent: "flex-end",
                "&:hover": {
                  backgroundColor: "#1f1f1f",
                },
                paddingRight: 3,
              }}
            >
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  textAlign: "right",
                  color: "#C0D3CA",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <div style={{ borderTop: "1px solid #333", margin: "20px 0" }} />
        {menuUser.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleMenuClick(item.action)}
              component={item.link ? Link : "button"}
              to={item.link}
              sx={{
                justifyContent: "flex-end",
                "&:hover": {
                  backgroundColor: "#1f1f1f",
                },
                paddingRight: 3,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                {item.icon}
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "22px",
                    fontWeight: "bold",
                    textAlign: "right",
                    color: "#C0D3CA",
                  }}
                />
              </div>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Button
        onClick={toggleDrawer("top", true)}
        sx={{
          color: "#C0D3CA",
          minWidth: "unset",
          padding: 1,
          "&:hover": {
            backgroundColor: "#1f1f1f",
          },
        }}
      >
        <ViewHeadline sx={{ fontSize: 30 }} />
      </Button>
      <Drawer
        anchor="top"
        open={state.top}
        onClose={toggleDrawer("top", false)}
        PaperProps={{
          sx: {
            height: '50vh',
            backgroundColor: "#121212",
            borderBottom: "1px solid #333",
          },
        }}
      >
        {list("top")}
      </Drawer>
      <User />
    </div>
  );
};

export default Drawer2;

import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { useMediaQuery } from "react-responsive";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Container,
  Drawer,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { AnimatePresence } from "framer-motion";
import User from "../User/User";
import LanguageToggle from "../components/LanguageToggle";
import { useLanguage } from "../context/LanguageContext";

const useStyles = makeStyles({
  appBar: {
    backgroundColor: "transparent !important",
    boxShadow: "none !important",
    transition: "all 0.4s ease !important",
    position: "fixed !important",
  },
  appBarScrolled: {
    backgroundColor: "rgba(0, 0, 0, 0.9) !important",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 0 !important",
    transition: "padding 0.4s ease !important",
  },
  toolbarScrolled: {
    padding: "8px 0 !important",
  },
  logo: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "1.8rem !important",
    fontWeight: "300 !important",
    color: "#fff !important",
    textDecoration: "none",
    letterSpacing: "0.15em !important",
    textTransform: "uppercase",
  },
  navContainer: {
    display: "flex",
    alignItems: "center",
  },
  navLink: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.75rem !important",
    fontWeight: "300 !important",
    color: "#fff !important",
    textDecoration: "none",
    letterSpacing: "0.15em !important",
    textTransform: "uppercase",
    margin: "0 15px",
    position: "relative",
    padding: "5px 0",
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "0",
      height: "1px",
      backgroundColor: "#fff",
      transition: "width 0.3s ease",
    },
    "&:hover:after": {
      width: "100%",
    },
  },
  activeLink: {
    "&:after": {
      width: "100%",
    },
  },
  iconButton: {
    color: "#fff !important",
    margin: "0 5px !important",
    padding: "8px !important",
    transition: "all 0.3s ease !important",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.1) !important",
    },
  },
  mobileMenu: {
    width: "100vw",
    backgroundColor: "#000 !important",
  },
  mobileMenuHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  mobileMenuLogo: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "1.6rem !important",
    fontWeight: "300 !important",
    color: "#fff !important",
    letterSpacing: "0.15em !important",
    textTransform: "uppercase",
  },
  mobileMenuList: {
    padding: "30px 20px",
  },
  mobileMenuItem: {
    marginBottom: "15px",
  },
  mobileMenuLink: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    fontWeight: "300 !important",
    color: "#fff !important",
    textDecoration: "none",
    letterSpacing: "0.15em !important",
    textTransform: "uppercase",
    display: "block",
    padding: "10px 0 10px 50px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    transition: "all 0.3s ease",
    "&:hover": {
      color: "#ccc !important",
      paddingLeft: "55px",
    },
  },
  mobileMenuDivider: {
    backgroundColor: "rgba(255,255,255,0.1) !important",
    margin: "10px 20px !important",
  },
  mobileMenuFooter: {
    display: "flex",
    justifyContent: "center",
    padding: "20px",
  },
  mobileMenuIcon: {
    color: "#fff !important",
    margin: "0 10px !important",
  },
});

const NavBar = () => {
  const classes = useStyles();
  const location = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 960 });
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  // const setOpenSignUp = useSetAtom(openUserDialog);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { text: t("home"), link: "/", exact: true },
    { text: t("customSuit"), link: "/customSuit", exact: true },
    { text: t("about"), link: "/about" },
    { text: t("contact"), link: "/contact" },
    { text: t("sizeGuide"), link: "/indexSizes" },
    { text: t("support"), link: "/PolicySupport" },
  ];

  const menuUser = [
    {
      icon: <PermIdentityIcon sx={{ fontSize: "1.2rem" }} />,
      link: "/account",
      label: t("account"),
    },
    {
      icon: <ShoppingBagIcon sx={{ fontSize: "1.2rem" }} />,
      link: "/shopping",
      label: t("shoppingBag"),
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <>
      <AppBar
        className={`${classes.appBar} ${
          scrolled ? classes.appBarScrolled : ""
        }`}
      >
        <Container maxWidth="lg">
          <Toolbar
            className={`${classes.toolbar} ${
              scrolled ? classes.toolbarScrolled : ""
            }`}
          >
            <Link to="/" className={classes.logo}>
              Suit
            </Link>

            {isMobile ? (
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleMobileMenu}
                className={classes.iconButton}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <>
                <Box className={classes.navContainer}>
                  {menuItems.map((item) => (
                    <AnimatePresence key={item.text}>
                      {item.link ? (
                        <Link
                          to={item.link}
                          className={`${classes.navLink} ${
                            isActive(item.link, item.exact)
                              ? classes.activeLink
                              : ""
                          }`}
                          onClick={item.action}
                        >
                          {item.text}
                        </Link>
                      ) : (
                        <span
                          className={classes.navLink}
                          style={{ cursor: "pointer" }}
                          onClick={item.action}
                        >
                          {item.text}
                        </span>
                      )}
                    </AnimatePresence>
                  ))}
                </Box>

                <Box className={classes.navContainer}>
                  {menuUser.map((item, index) => (
                    <AnimatePresence key={index}>
                      <IconButton
                        component={item.link ? Link : "button"}
                        to={item.link}
                        onClick={item.action}
                        className={classes.iconButton}
                        size="small"
                        aria-label={item.label}
                      >
                        {item.icon}
                      </IconButton>
                    </AnimatePresence>
                  ))}
                  <LanguageToggle />
                  <User />
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Menu */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        classes={{ paper: classes.mobileMenu }}
      >
        <div className={classes.mobileMenuHeader}>
          <Typography variant="h6" className={classes.mobileMenuLogo}>
            Suit
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="close menu"
            onClick={toggleMobileMenu}
            className={classes.iconButton}
          >
            <CloseIcon />
          </IconButton>
        </div>

        <List className={classes.mobileMenuList}>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              className={classes.mobileMenuItem}
              disablePadding
            >
              {item.link ? (
                <Link
                  to={item.link}
                  className={classes.mobileMenuLink}
                  onClick={() => {
                    if (item.action) item.action();
                    toggleMobileMenu();
                  }}
                >
                  {item.text}
                </Link>
              ) : (
                <span
                  className={classes.mobileMenuLink}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (item.action) item.action();
                    toggleMobileMenu();
                  }}
                >
                  {item.text}
                </span>
              )}
            </ListItem>
          ))}
        </List>

        <Divider className={classes.mobileMenuDivider} />

        <Box className={classes.mobileMenuFooter}>
          {menuUser.map((item, index) => (
            <IconButton
              key={index}
              component={item.link ? Link : "button"}
              to={item.link}
              onClick={() => {
                if (item.action) item.action();
                toggleMobileMenu();
              }}
              className={classes.mobileMenuIcon}
              size="large"
              aria-label={item.label}
            >
              {item.icon}
            </IconButton>
          ))}
        </Box>
      </Drawer>
    </>
  );
};

export default NavBar;

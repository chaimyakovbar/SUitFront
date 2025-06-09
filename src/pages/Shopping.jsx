import React, { useState, useEffect } from "react";
import HaveUser from "../components/HaveUser";
// import { authUserAtom } from "../Utils";
// import { useAtom } from "jotai";
import GetAllSuitFromData from "../components/GetAllSuitFromData";
import { Button, Drawer, Box, Container } from "@mui/material";
import { Link } from "react-router-dom";
import ShowSizes from "../components/ShowSizes";
import useProduct from "../Hooks/useProduct";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#0a0a0a",
    color: "#fff",
    minHeight: "100vh",
    paddingTop: "120px",
    paddingBottom: "80px",
  },
  container: {
    position: "relative",
  },
  header: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "40px",
    position: "sticky",
    top: "60px",
    zIndex: 100,
    backgroundColor: "#0a0a0a",
    padding: "20px 0",
    transition: "background-color 0.3s ease",
  },
  headerScrolled: {
    backgroundColor: "transparent",
  },
  mainContent: {
    flex: 1,
  },
  footer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "40px",
    padding: "20px 0",
  },
  button: {
    backgroundColor: "transparent !important",
    color: "#fff !important",
    border: "1px solid #fff !important",
    padding: "12px 35px !important",
    fontSize: "0.85rem !important",
    borderRadius: "0 !important",
    fontWeight: "400 !important",
    letterSpacing: "0.15em !important",
    textTransform: "uppercase !important",
    transition: "all 0.3s ease !important",
    fontFamily: "'Montserrat', sans-serif !important",
    minWidth: "200px !important",
    "&:hover": {
      backgroundColor: "#fff !important",
      color: "#000 !important",
    },
  },
  drawer: {
    "& .MuiDrawer-paper": {
      backgroundColor: "#0a0a0a !important",
      color: "#fff !important",
      borderLeft: "1px solid rgba(255,255,255,0.1) !important",
    },
  },
});

const Shopping = () => {
  // const [user] = useAtom(authUserAtom);
  const classes = useStyles();
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data } = useProduct();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 60);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSideDrawer = () => {
    setSideDrawerOpen(!sideDrawerOpen);
  };

  // if (!user) return <HaveUser />;

  return (
    <Box className={classes.root}>
      <Container maxWidth="lg" className={classes.container}>
        <Box
          className={`${classes.header} ${
            isScrolled ? classes.headerScrolled : ""
          }`}
        >
          <Link to="/Payed" style={{ textDecoration: "none" }}>
            <Button variant="outlined" className={classes.button}>
              for payment
            </Button>
          </Link>
        </Box>

        <Box className={classes.mainContent}>
          <GetAllSuitFromData />
        </Box>

        <Drawer
          anchor="right"
          open={sideDrawerOpen}
          onClose={toggleSideDrawer}
          className={classes.drawer}
          PaperProps={{
            sx: {
              width: { xs: "100%", sm: "400px" },
            },
          }}
        >
          <ShowSizes data={data} onClose={toggleSideDrawer} />
        </Drawer>
      </Container>
    </Box>
  );
};

export default Shopping;

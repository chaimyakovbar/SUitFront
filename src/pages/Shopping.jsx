import React, { useState, useEffect } from "react";
import HaveUser from "../components/HaveUser";
// import { authUserAtom } from "../Utils";
// import { useAtom } from "jotai";
import GetAllSuitFromData from "../components/GetAllSuitFromData";
import {
  Button,
  Drawer,
  Box,
  Container,
  Typography,
  IconButton,
  Badge,
  Fab,
  useMediaQuery,
  useTheme,
  Paper,
  Divider,
  Chip,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import ShowSizes from "../components/ShowSizes";
import useProduct from "../Hooks/useProduct";
import { makeStyles } from "@mui/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

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
  mainContainer: {
    paddingTop: "20px",
    paddingBottom: "40px",
  },
  heroSection: {
    textAlign: "center",
    padding: "60px 0",
    marginBottom: "40px",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  heroTitle: {
    fontSize: "3rem",
    fontWeight: "700",
    marginBottom: "16px",
    background: "linear-gradient(45deg, #fff 30%, #f0f0f0 90%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontFamily: "'Montserrat', sans-serif",
  },
  heroSubtitle: {
    fontSize: "1.2rem",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: "32px",
    fontFamily: "'Montserrat', sans-serif",
  },
  controlsSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    padding: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    flexWrap: "wrap",
    gap: "16px",
  },
  leftControls: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  rightControls: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  controlButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1) !important",
    color: "#fff !important",
    border: "1px solid rgba(255, 255, 255, 0.2) !important",
    padding: "8px 16px !important",
    borderRadius: "8px !important",
    textTransform: "none !important",
    fontWeight: "500 !important",
    transition: "all 0.3s ease !important",
    minWidth: "auto !important",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2) !important",
      border: "1px solid rgba(255, 255, 255, 0.4) !important",
    },
  },
  activeControlButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2) !important",
    border: "1px solid rgba(255, 255, 255, 0.4) !important",
  },
  contentSection: {
    position: "relative",
  },
  drawer: {
    "& .MuiDrawer-paper": {
      backgroundColor: "#0a0a0a !important",
      color: "#fff !important",
      borderLeft: "1px solid rgba(255,255,255,0.1) !important",
      backdropFilter: "blur(10px)",
    },
  },
  scrollToTop: {
    position: "fixed !important",
    bottom: "24px !important",
    right: "24px !important",
    backgroundColor: "rgba(255, 255, 255, 0.1) !important",
    color: "#fff !important",
    border: "1px solid rgba(255, 255, 255, 0.2) !important",
    backdropFilter: "blur(10px)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2) !important",
      transform: "translateY(-2px)",
    },
  },
  statsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      transform: "translateY(-4px)",
    },
  },
  statsNumber: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "8px",
  },
  statsLabel: {
    fontSize: "0.9rem",
    color: "rgba(255, 255, 255, 0.7)",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  mobileControls: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "100%",
  },
});

const Shopping = () => {
  // const [user] = useAtom(authUserAtom);
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'price-low', 'price-high'
  const { data } = useProduct();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 60);
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSideDrawer = () => {
    setSideDrawerOpen(!sideDrawerOpen);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  // if (!user) return <HaveUser />;

  return (
    <Box className={classes.root}>
      <Container maxWidth="lg" className={classes.container}>
        {/* Original Header */}
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

        {/* Main Content */}
        <Container maxWidth="xl" className={classes.mainContainer}>
          {/* Hero Section */}
          <Box className={classes.heroSection}>
            <Typography className={classes.heroTitle}>
              Premium Suit Collection
            </Typography>
            <Typography className={classes.heroSubtitle}>
              Discover our handcrafted suits designed for the modern gentleman
            </Typography>
          </Box>

          {/* Stats Section */}
          <Grid container spacing={3} sx={{ marginBottom: 4 }}>
            <Grid item xs={12} sm={4}>
              <Paper className={classes.statsCard}>
                <Typography className={classes.statsNumber}>
                  {data?.allSuitPart?.length || 0}
                </Typography>
                <Typography className={classes.statsLabel}>
                  Available Suits
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper className={classes.statsCard}>
                <Typography className={classes.statsNumber}>Premium</Typography>
                <Typography className={classes.statsLabel}>
                  Quality Grade
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper className={classes.statsCard}>
                <Typography className={classes.statsNumber}>24/7</Typography>
                <Typography className={classes.statsLabel}>Support</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Controls Section */}
          <Box className={classes.controlsSection}>
            <Box
              className={
                isMobile ? classes.mobileControls : classes.leftControls
              }
            >
              <Button
                className={`${classes.controlButton} ${
                  sortBy === "newest" ? classes.activeControlButton : ""
                }`}
                onClick={() => handleSortChange("newest")}
                startIcon={<SortIcon />}
              >
                Newest
              </Button>
              <Button
                className={`${classes.controlButton} ${
                  sortBy === "price-low" ? classes.activeControlButton : ""
                }`}
                onClick={() => handleSortChange("price-low")}
                startIcon={<SortIcon />}
              >
                Price: Low to High
              </Button>
              <Button
                className={`${classes.controlButton} ${
                  sortBy === "price-high" ? classes.activeControlButton : ""
                }`}
                onClick={() => handleSortChange("price-high")}
                startIcon={<SortIcon />}
              >
                Price: High to Low
              </Button>
            </Box>

            <Box className={classes.rightControls}>
              <IconButton
                className={`${classes.controlButton} ${
                  viewMode === "grid" ? classes.activeControlButton : ""
                }`}
                onClick={() => handleViewModeChange("grid")}
              >
                <ViewModuleIcon />
              </IconButton>
              <IconButton
                className={`${classes.controlButton} ${
                  viewMode === "list" ? classes.activeControlButton : ""
                }`}
                onClick={() => handleViewModeChange("list")}
              >
                <ViewListIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Content Section */}
          <Box className={classes.contentSection}>
            <GetAllSuitFromData viewMode={viewMode} sortBy={sortBy} />
          </Box>
        </Container>

        {/* Size Drawer */}
        <Drawer
          anchor="right"
          open={sideDrawerOpen}
          onClose={toggleSideDrawer}
          className={classes.drawer}
          PaperProps={{
            sx: {
              width: '50vw',
            },
          }}
        >
          <ShowSizes data={data} onClose={toggleSideDrawer} />
        </Drawer>
      </Container>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Fab
          color="primary"
          aria-label="scroll to top"
          onClick={scrollToTop}
          className={classes.scrollToTop}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}
    </Box>
  );
};

export default Shopping;

import React, { useRef } from "react";
import { makeStyles } from "@mui/styles";
import { Link, useLocation } from "react-router-dom";
import "./HomePage2.css";

// S3 Assets URLs
import heroBackground from "../assets/icons/background/homePage.webp";
const S3_BASE_URL = "https://ch-suits.s3.us-east-1.amazonaws.com";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  useMediaQuery,
  Divider,
  IconButton,
} from "@mui/material";
import ButtonReactBits from "../reactBits/Button";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import MostPoPular from "./MostPoPular";
import AllCollection from "./AllCollection";
import NavBar from "./NavBar";
import { useLanguage } from "../context/LanguageContext";

const useStyles = makeStyles({
  root: {
    background: "#0a0a0a",
    color: "#fff",
    overflowX: "hidden",
  },
  heroSection: {
    height: "100vh",
    width: "100%",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  videoBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: 0.6,
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
    zIndex: 1,
  },
  heroContent: (props) => ({
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    maxWidth: props.isMobile ? "350px" : "800px",
    padding: "0 20px",
  }),
  heroTitle: (props) => ({
    maxWidth: props.isMobile ? "350px" : "800px",
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: props.isMobile ? "2.5rem !important" : "4rem !important",
    fontWeight: "300 !important",
    letterSpacing: props.isMobile ? "0.05em !important" : "0.15em !important",
    marginBottom: "1.5rem !important",
    textTransform: "uppercase",
    lineHeight: "1.2 !important",
  }),
  heroSubtitle: (props) => ({
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: props.isMobile ? "0.9rem !important" : "1.1rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.05em !important",
    marginBottom: "3rem !important",
    maxWidth: props.isMobile ? "350px" : "700px",
    margin: "0 auto 3rem !important",
    lineHeight: "1.8 !important",
  }),
  ctaButton: {
    color: "#fff !important",
    padding: "14px 32px !important",
    border: "none !important",
    borderRadius: "6px !important",
    fontSize: "16px !important",
    fontWeight: "600 !important",
    cursor: "pointer !important",
    transition: "transform 0.2s ease, box-shadow 0.2s ease !important",
    fontFamily: "'Montserrat', sans-serif !important",
    "& .shiny-text": {
      color: "#fff !important",
      fontWeight: "600 !important",
      fontSize: "16px !important",
    },
    "&:hover": {
      transform: "scale(1.05) !important",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4) !important",
    },
  },
  "@keyframes sweep": {
    "0%": { transform: "translateX(-150%) skewX(-20deg)" },
    "18%": { transform: "translateX(260%) skewX(-20deg)" },
    "100%": { transform: "translateX(260%) skewX(-20deg)" },
  },

  scrollDown: {
    position: "absolute",
    bottom: "30px",
    marginLeft: "30px",
    transform: "translateX(-50%)",
    zIndex: 2,
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
  },
  scrollText: {
    fontSize: "0.7rem !important",
    letterSpacing: "0.15em !important",
    marginBottom: "8px !important",
    fontFamily: "'Montserrat', sans-serif !important",
  },
  section: {
    padding: "90px 0",
    position: "relative",
  },
  sectionDark: {
    backgroundColor: "#0a0a0a",
  },
  sectionLight: {
    backgroundColor: "#111111",
  },
  sectionTitle: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "2.8rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.1em !important",
    marginBottom: "1.2rem !important",
    textTransform: "uppercase",
    position: "relative",
    display: "inline-block",
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: "-12px",
      left: "0",
      width: "50px",
      height: "1px",
      backgroundColor: "#fff",
    },
  },
  sectionSubtitle: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.05em !important",
    marginBottom: "3rem !important",
    maxWidth: "550px",
    lineHeight: "1.7 !important",
    color: "#aaa",
  },
  divider: {
    backgroundColor: "rgba(255,255,255,0.1) !important",
    margin: "0 !important",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    maxHeight: "500px",
  },
  featuredContent: {
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
    maxHeight: "500px",
  },
  featuredTitle: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "2.2rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.05em !important",
    marginBottom: "1.2rem !important",
  },
  featuredText: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.85rem !important",
    fontWeight: "300 !important",
    lineHeight: "1.7 !important",
    marginBottom: "1.8rem !important",
    color: "#aaa",
  },
  featuredButton: {
    backgroundColor: "transparent !important",
    color: "#fff !important",
    border: "1px solid #fff !important",
    padding: "10px 25px !important",
    fontSize: "0.75rem !important",
    borderRadius: "0 !important",
    fontWeight: "400 !important",
    letterSpacing: "0.15em !important",
    textTransform: "uppercase !important",
    transition: "all 0.3s ease !important",
    alignSelf: "flex-start",
    fontFamily: "'Montserrat', sans-serif !important",
    "&:hover": {
      backgroundColor: "#fff !important",
      color: "#000 !important",
    },
  },
});

const HomePage2 = () => {
  const targetSectionRef = useRef(null);
  const popularSectionRef = useRef(null);
  const isMobile = useMediaQuery("(max-width:600px)");
  const classes = useStyles({ isMobile });
  const location = useLocation();
  const { t } = useLanguage();

  React.useEffect(() => {
    if (location.state && location.state.scrollToAllCollection) {
      if (targetSectionRef.current) {
        targetSectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className={classes.root}>
      <NavBar />

      {/* Hero Section */}
      <section className={classes.heroSection}>
        <img
          // initial={{ scale: 1.1 }}
          // animate={{ scale: 1 }}
          // transition={{ duration: 10, ease: "easeOut" }}
          className={classes.videoBackground}
          src={heroBackground}
          alt="Background"
        />
        <div className={classes.heroOverlay}></div>

        <motion.div
          className={classes.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: "easeOut",
          }}
          style={{ willChange: "transform, opacity" }}
        >
          <Typography variant="h1" className={classes.heroTitle}>
            {t("heroTitle")}
          </Typography>
          <Typography variant="body1" className={classes.heroSubtitle}>
            {t("heroSubtitle")}
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/customSuit"
            className={`${classes.ctaButton} gradient-animation`}
          >
            <ButtonReactBits
              text={t("designButton")}
              disabled={false}
              speed={3}
            />
          </Button>
        </motion.div>

        {/* החלפת אנימציה אינסופית ב-CSS */}
        <div
          className={classes.scrollDown}
          onClick={() => scrollToSection(popularSectionRef)}
          style={{
            animation: "bounce 1.5s ease-in-out infinite",
            willChange: "transform",
          }}
        >
          <Typography variant="body2" className={classes.scrollText}>
            {t("scrollDown")}
          </Typography>
          <KeyboardArrowDownIcon fontSize="small" />
        </div>
      </section>

      <Divider className={classes.divider} />

      {/* Popular Section */}
      {/* <Box
        component="section"
        className={`${classes.section} ${classes.sectionLight}`}
        ref={popularSectionRef}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h2" className={classes.sectionTitle}>
              {t("mostPopular")}
            </Typography>
            <Typography variant="body1" className={classes.sectionSubtitle}>
              {t("mostPopularSubtitle")}
            </Typography>
          </motion.div>

          <MostPoPular />
        </Container>
      </Box> */}

      <Divider className={classes.divider} />

      {/* Featured Section */}
      <Box
        component="section"
        className={`${classes.section} ${classes.sectionDark}`}
      >
        <Container maxWidth="lg">
          <Grid container spacing={0}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
              >
                <img
                  src={`${S3_BASE_URL}/assets/photoBackGround4.webp`}
                  alt="Featured Collection"
                  className={classes.featuredImage}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
                className={classes.featuredContent}
              >
                <Typography variant="h3" className={classes.featuredTitle}>
                  {t("artOfTailoring")}
                </Typography>
                <Typography variant="body1" className={classes.featuredText}>
                  {t("artOfTailoringText")}
                </Typography>
                <Button
                  component={Link}
                  to="/about"
                  className={classes.featuredButton}
                >
                  {t("ourProcess")}
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Divider className={classes.divider} />

      {/* Collections Section */}
      <Box
        component="section"
        className={`${classes.section} ${classes.sectionLight}`}
        ref={targetSectionRef}
        id="targetSection"
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h2" className={classes.sectionTitle}>
              {t("ourCollections")}
            </Typography>
            <Typography variant="body1" className={classes.sectionSubtitle}>
              {t("collectionsSubtitle")}
            </Typography>
          </motion.div>

          <AllCollection targetSectionRef={targetSectionRef} />
        </Container>
      </Box>
    </div>
  );
};

export default HomePage2;

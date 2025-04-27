import React, { useRef, useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  useMediaQuery, 
  Divider,
  IconButton
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MostPoPular from "./MostPoPular";
import AllCollection from "./AllCollection";
import NavBar from "./NavBar";

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
    background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
    zIndex: 1,
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    maxWidth: "800px",
    padding: "0 20px",
  },
  heroTitle: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "4rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.15em !important",
    marginBottom: "1.5rem !important",
    textTransform: "uppercase",
    lineHeight: "1.2 !important",
  },
  heroSubtitle: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.95rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.05em !important",
    marginBottom: "2.5rem !important",
    maxWidth: "600px",
    margin: "0 auto 2.5rem !important",
    lineHeight: "1.8 !important",
  },
  ctaButton: {
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
    "&:hover": {
      backgroundColor: "#fff !important",
      color: "#000 !important",
    },
  },
  scrollDown: {
    position: "absolute",
    bottom: "30px",
    left: "50%",
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
  const classes = useStyles();
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:960px)");

  useEffect(() => {
    // Add Google Fonts
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Montserrat:wght@200;300;400;500&display=swap';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // const scrollToSection = (ref) => {
  //   ref.current.scrollIntoView({
  //     behavior: "smooth",
  //     block: "start",
  //   });
  // };

  return (
    <div className={classes.root}>
      <NavBar />
      
      {/* Hero Section */}
      <section className={classes.heroSection}>
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className={classes.videoBackground} 
          src="/assets/photoBackGround3.jpg" 
          alt="Background" 
        />
        <div className={classes.heroOverlay}></div>

        <motion.div 
          className={classes.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <Typography variant="h1" className={classes.heroTitle}>
            Timeless Elegance
          </Typography>
          <Typography variant="body1" className={classes.heroSubtitle}>
            Discover our exclusive collection of meticulously crafted suits, where traditional craftsmanship meets contemporary design. Each piece is tailored to perfection, ensuring an impeccable fit and unparalleled sophistication.
          </Typography>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              component={Link}
              to="/customSuit"
              className={classes.ctaButton}
            >
              Design Your Suit
            </Button>
          </motion.div>
        </motion.div>

        {/* <motion.div 
          className={classes.scrollDown}
          onClick={() => scrollToSection(popularSectionRef)}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Typography variant="body2" className={classes.scrollText}>
            SCROLL DOWN
          </Typography>
          <KeyboardArrowDownIcon fontSize="small" />
        </motion.div> */}
      </section>

      <Divider className={classes.divider} />

      {/* Popular Section */}
      <Box 
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
              Most Popular
            </Typography>
            <Typography variant="body1" className={classes.sectionSubtitle}>
              Our finest selection of suits that have become customer favorites for their exceptional quality and timeless style.
            </Typography>
          </motion.div>
          
          <MostPoPular />
        </Container>
      </Box>

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
                  src="/assets/photoBackGround4.webp" 
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
                  The Art of Tailoring
                </Typography>
                <Typography variant="body1" className={classes.featuredText}>
                  Our master tailors bring decades of experience to every suit, combining traditional techniques with modern precision. Each garment is crafted with meticulous attention to detail, from the selection of premium fabrics to the final hand-stitched finishes.
                </Typography>
                <Button 
                  component={Link}
                  to="/about"
                  className={classes.featuredButton}
                >
                  Our Process
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
              Our Collections
            </Typography>
            <Typography variant="body1" className={classes.sectionSubtitle}>
              Browse through our carefully curated collections designed for every occasion and personal style.
            </Typography>
          </motion.div>
          
          <AllCollection targetSectionRef={targetSectionRef} />
        </Container>
      </Box>
    </div>
  );
};

export default HomePage2;

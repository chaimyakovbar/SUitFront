import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Divider,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLanguage } from "../context/LanguageContext";

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
  returnButton: {
    position: "absolute",
    top: 0,
    left: 0,
    color: "#C0D3CA",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    fontSize: "0.9rem",
    fontFamily: "'Montserrat', sans-serif",
    letterSpacing: "0.1em",
    transition: "color 0.3s ease",
    "&:hover": {
      color: "#fff",
    },
  },
  returnIcon: {
    marginRight: "8px",
    fontSize: "1.2rem",
  },
  heading: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "3rem !important",
    fontWeight: "300 !important",
    marginBottom: "2rem !important",
    letterSpacing: "0.05em !important",
    textAlign: "center",
  },
  subheading: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "2rem !important",
    fontWeight: "300 !important",
    marginBottom: "1.5rem !important",
    letterSpacing: "0.05em !important",
    color: "#C0D3CA !important",
  },
  paragraph: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "1rem !important",
    fontWeight: "300 !important",
    lineHeight: "1.8 !important",
    marginBottom: "1.5rem !important",
    color: "#e0e0e0 !important",
  },
  highlight: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "1.2rem !important",
    fontWeight: "400 !important",
    fontStyle: "italic !important",
    color: "#C0D3CA !important",
    marginTop: "2rem !important",
    marginBottom: "2rem !important",
    textAlign: "center",
    lineHeight: "1.6 !important",
  },
  divider: {
    backgroundColor: "rgba(192, 211, 202, 0.2) !important",
    margin: "3rem 0 !important",
  },
  imageContainer: {
    position: "relative",
    height: "400px",
    overflow: "hidden",
    marginBottom: "2rem",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "grayscale(20%)",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.6) 100%)",
  },
});

const About = () => {
  const classes = useStyles();
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className={classes.root}
    >
      <Container maxWidth="lg" className={classes.container}>
        <Link to="/" className={classes.returnButton}>
          <ArrowBackIcon className={classes.returnIcon} />
          {t("returnToMain")}
        </Link>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography variant="h1" className={classes.heading}>
            {t("ourHeritage")}
          </Typography>
        </motion.div>

        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Typography variant="h2" className={classes.subheading}>
                {t("italianCraftsmanship")}
              </Typography>
              <Typography variant="body1" className={classes.paragraph}>
                {t("aboutParagraph1")}
              </Typography>
              <Typography variant="body1" className={classes.paragraph}>
                {t("aboutParagraph2")}
              </Typography>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className={classes.imageContainer}
            >
              <img
                src="/assets/oldMan.jpg"
                alt="Tailor workshop"
                className={classes.image}
              />
              <div className={classes.imageOverlay}></div>
            </motion.div>
          </Grid>
        </Grid>

        <Divider className={classes.divider} />

        <Grid container spacing={6} direction="row-reverse">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Typography variant="h2" className={classes.subheading}>
                {t("artOfTailoring")}
              </Typography>
              <Typography variant="body1" className={classes.paragraph}>
                {t("aboutParagraph3")}
              </Typography>
              <Typography variant="body1" className={classes.paragraph}>
                {t("aboutParagraph4")}
              </Typography>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className={classes.imageContainer}
            >
              <img
                src="/assets/takeSizes.jpg"
                alt="Suit detail"
                className={classes.image}
              />
              <div className={classes.imageOverlay}></div>
            </motion.div>
          </Grid>
        </Grid>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <Typography variant="body1" className={classes.highlight}>
            "{t("aboutQuote")}"
          </Typography>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default About;

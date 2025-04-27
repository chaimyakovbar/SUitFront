import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, Container, Typography, Button, Grid, Divider } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
    background: "linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.6) 100%)",
  },
});

const About = () => {
  const classes = useStyles();

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
          Return to Main Page
        </Link>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography variant="h1" className={classes.heading}>
            Our Heritage
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
                Italian Suit Craftsmanship Since 1957
              </Typography>
              <Typography variant="body1" className={classes.paragraph}>
                Founded in 1957, our Italian suit atelier has been a symbol of timeless
                elegance and exceptional craftsmanship for over six decades. Located in
                the heart of Italy, we take pride in designing and tailoring
                high-quality suits that blend tradition with modern sophistication.
              </Typography>
              <Typography variant="body1" className={classes.paragraph}>
                Each suit is crafted with precision by skilled artisans using the
                finest Italian fabrics, ensuring a perfect fit and unparalleled
                comfort. Whether you're looking for a classic business suit, a stylish
                tuxedo, or a custom-made masterpiece, our collection offers a wide
                range of designs to suit every occasion.
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
                src="/assets/about/tailor-workshop.jpg" 
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
                The Art of Tailoring
              </Typography>
              <Typography variant="body1" className={classes.paragraph}>
                Our commitment to excellence and attention to detail have made us a
                trusted name in men's fashion, attracting clients from around the world.
                We believe that a well-tailored suit is more than just clothing—it's a
                statement of confidence, style, and tradition.
              </Typography>
              <Typography variant="body1" className={classes.paragraph}>
                Each garment passes through the hands of at least 16 specialized artisans, 
                from pattern makers to button specialists. We maintain the traditional 
                techniques that have been passed down through generations, ensuring that 
                every stitch contributes to both the aesthetic appeal and structural 
                integrity of the final piece.
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
                src="/assets/about/suit-detail.jpg" 
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
            "Visit us and experience the essence of Italian tailoring, where
            quality meets heritage, and every suit tells a story of craftsmanship and tradition."
          </Typography>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default About;
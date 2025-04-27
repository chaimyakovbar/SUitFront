import React from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import first from '../assets/places/first.png';
import sec from '../assets/places/sec.png';
import therd from '../assets/places/therd.png';

const useStyles = makeStyles({
  container: {
    width: '100%',
  },
  productCard: {
    position: 'relative',
    overflow: 'hidden',
    height: '450px',
    cursor: 'pointer',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'grayscale(20%)',
    transition: 'all 0.7s ease',
  },
  productOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: '30px 25px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
    transition: 'all 0.5s ease',
  },
  productTitle: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: '1.7rem !important',
    fontWeight: '300 !important',
    color: '#fff !important',
    marginBottom: '8px !important',
    letterSpacing: '0.05em !important',
  },
  productPrice: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: '1rem !important',
    fontWeight: '300 !important',
    color: '#fff !important',
    marginBottom: '15px !important',
    letterSpacing: '0.05em !important',
  },
  productDescription: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: '0.8rem !important',
    fontWeight: '300 !important',
    color: '#ccc !important',
    marginBottom: '20px !important',
    maxHeight: '0',
    opacity: '0',
    overflow: 'hidden',
    transition: 'all 0.5s ease',
    lineHeight: '1.6 !important',
  },
  productButton: {
    backgroundColor: 'transparent !important',
    color: '#fff !important',
    border: '1px solid #fff !important',
    padding: '8px 20px !important',
    fontSize: '0.7rem !important',
    borderRadius: '0 !important',
    fontWeight: '400 !important',
    letterSpacing: '0.15em !important',
    textTransform: 'uppercase !important',
    transition: 'all 0.3s ease !important',
    fontFamily: "'Montserrat', sans-serif !important",
    opacity: '0',
    transform: 'translateY(20px)',
    transition: 'all 0.5s ease',
    '&:hover': {
      backgroundColor: '#fff !important',
      color: '#000 !important',
    },
  },
  hoverCard: {
    '&:hover $productImage': {
      transform: 'scale(1.05)',
      filter: 'grayscale(0%)',
    },
    '&:hover $productOverlay': {
      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)',
    },
    '&:hover $productDescription': {
      maxHeight: '80px',
      opacity: '1',
      marginBottom: '20px',
    },
    '&:hover $productButton': {
      opacity: '1',
      transform: 'translateY(0)',
    },
  },
});

const popularItems = [
  {
    id: 1,
    image: sec,
    title: "Classic Black Suit",
    description: "Timeless elegance for formal occasions. Crafted with premium Italian wool for exceptional comfort.",
    price: "$599",
    link: "/collection/1"
  },
  {
    id: 2,
    image: first,
    title: "Navy Business Suit",
    description: "Professional style for the modern executive. Tailored fit with subtle details for a refined look.",
    price: "$649",
    link: "/collection/2"
  },
  {
    id: 3,
    image: therd,
    title: "Gray Slim Fit",
    description: "Contemporary design for a sophisticated appearance. Perfect for both formal and semi-formal events.",
    price: "$579",
    link: "/collection/3"
  }
];

const MostPoPular = () => {
  const classes = useStyles();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7 }
    }
  };

  return (
    <Box className={classes.container}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <Grid container spacing={3}>
          {popularItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <motion.div 
                variants={itemVariants}
                className={`${classes.productCard} ${classes.hoverCard}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className={classes.productImage}
                />
                <div className={classes.productOverlay}>
                  <Typography variant="h4" className={classes.productTitle}>
                    {item.title}
                  </Typography>
                  <Typography variant="h6" className={classes.productPrice}>
                    {item.price}
                  </Typography>
                  <Typography variant="body2" className={classes.productDescription}>
                    {item.description}
                  </Typography>
                  <Button 
                    component={Link}
                    to={item.link}
                    className={classes.productButton}
                  >
                    View Details
                  </Button>
                </div>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  );
};

export default MostPoPular;
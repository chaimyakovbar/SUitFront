import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import doll1 from "../assets/suits/dollSuitGrey.webp";
import { makeStyles } from "@mui/styles";
import Slider from "react-slick";
import { Box, useMediaQuery, Typography } from "@mui/material";
import { collections } from "../consts/KindOfColors";
import { motion, useAnimation } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const useStyles = makeStyles({
  collectionsGrid: {
    width: "100%",
    position: "relative",
  },
  carouselWrapper: {
    width: "100%",
    margin: "0 auto",
    "& .slick-track": {
      display: "flex",
    },
    "& .slick-list": {
      overflow: "visible",
    },
    "& .slick-dots": {
      bottom: "-40px",
      "& li button:before": {
        fontSize: "6px",
        color: "#fff",
        opacity: 0.5,
      },
      "& li.slick-active button:before": {
        color: "#fff",
        opacity: 1,
      },
    },
    "& .slick-slide": {
      opacity: 0.4,
      transition: "all 0.5s ease",
      filter: "grayscale(100%)",
      "&.slick-active": {
        opacity: 1,
        filter: "grayscale(0%)",
      },
      "&.slick-center": {
        opacity: 1,
        filter: "grayscale(0%)",
        transform: "scale(1.05)",
      },
    },
  },
  collectionCard: {
    position: "relative",
    overflow: "hidden",
    height: "500px",
    margin: "0 10px",
    cursor: "pointer",
  },
  collectionImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "all 0.7s ease",
  },
  collectionImageHovered: {
    transform: "scale(1.05)",
  },
  collectionOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)",
    padding: "40px 25px 30px",
    transition: "all 0.3s ease",
  },
  collectionTitle: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "2rem !important",
    fontWeight: "300 !important",
    color: "#fff !important",
    marginBottom: "12px !important",
    letterSpacing: "0.05em !important",
  },
  viewCollection: {
    display: "flex",
    alignItems: "center",
    color: "#fff",
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.8rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.15em !important",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "& svg": {
      marginLeft: "8px",
      fontSize: "0.9rem",
      transition: "transform 0.3s ease",
    },
    "&:hover": {
      color: "#ccc",
      "& svg": {
        transform: "translateX(5px)",
      },
    },
  },
  infiniteCarousel: {
    position: "relative",
    width: "100%",
    overflow: "hidden",
  },
  carouselTrack: {
    display: "flex",
    width: "fit-content",
  },
  carouselItem: {
    flex: "0 0 auto",
  },
  floatingAnimation: {
    animation: "$float 6s ease-in-out infinite",
  },
  "@keyframes float": {
    "0%": {
      transform: "translateY(0px)",
    },
    "50%": {
      transform: "translateY(-10px)",
    },
    "100%": {
      transform: "translateY(0px)",
    },
  },
});

const AllCollection = ({ targetSectionRef }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [hoveredImage, setHoveredImage] = useState(null);
  const controls = useAnimation();

  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:960px)");

  // Start the infinite animation when component mounts
  useEffect(() => {
    controls.start({
      x: ["0%", "-50%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 120,
          ease: "linear",
        },
      },
    });
  }, [controls]);

  const settings = {
    slidesToShow: isMobile ? 1 : isTablet ? 2 : 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0",
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 1000,
    dots: true,
    arrows: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerMode: false,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "30px",
        }
      }
    ]
  };

  // Duplicate collections for infinite scroll effect
  const duplicatedCollections = [...collections, ...collections];

  return (
    <motion.div 
      ref={targetSectionRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className={classes.collectionsGrid}
    >
      {/* Standard carousel for mobile and tablet */}
      {(isMobile || isTablet) && (
        <Box className={classes.carouselWrapper}>
          <Slider {...settings}>
            {collections.map((collection) => (
              <div key={collection.id}>
                <motion.div 
                  className={classes.collectionCard}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => navigate(`/collection/${collection.id}`)}
                >
                  <img
                    src={hoveredImage === collection.id ? doll1 : collection.image}
                    alt={collection.title}
                    className={`${classes.collectionImage} ${
                      hoveredImage === collection.id ? classes.collectionImageHovered : ""
                    }`}
                    onMouseEnter={() => setHoveredImage(collection.id)}
                    onMouseLeave={() => setHoveredImage(null)}
                  />

                  <div className={classes.collectionOverlay}>
                    <Typography variant="h4" className={classes.collectionTitle}>
                      {collection.title}
                    </Typography>
                    <div className={classes.viewCollection}>
                      <span>View Collection</span>
                      <ArrowForwardIcon fontSize="small" />
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </Box>
      )}

      {/* Infinite animation carousel for desktop */}
      {!isMobile && !isTablet && (
        <div className={classes.infiniteCarousel}>
          <motion.div 
            className={classes.carouselTrack}
            animate={controls}
          >
            {duplicatedCollections.map((collection, index) => (
              <motion.div 
                key={`${collection.id}-${index}`}
                className={`${classes.carouselItem} ${classes.collectionCard}`}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => navigate(`/collection/${collection.id}`)}
                style={{ width: "400px", margin: "0 15px" }}
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{
                  y: {
                    repeat: Infinity,
                    repeatType: "mirror",
                    duration: 400 + (index % 3) * 10,
                    ease: "easeInOut",
                  },
                }}
              >
                <img
                  src={hoveredImage === `${collection.id}-${index}` ? doll1 : collection.image}
                  alt={collection.title}
                  className={`${classes.collectionImage} ${
                    hoveredImage === `${collection.id}-${index}` ? classes.collectionImageHovered : ""
                  }`}
                  onMouseEnter={() => setHoveredImage(`${collection.id}-${index}`)}
                  onMouseLeave={() => setHoveredImage(null)}
                />

                <div className={classes.collectionOverlay}>
                  <Typography variant="h4" className={classes.collectionTitle}>
                    {collection.title}
                  </Typography>
                  <div className={classes.viewCollection}>
                    <span>View Collection</span>
                    <ArrowForwardIcon fontSize="small" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AllCollection;

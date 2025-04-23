import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import doll1 from "../assets/suits/dollSuitGrey.webp";
import { makeStyles } from "@mui/styles";
import Slider from "react-slick";
import { Box, useMediaQuery } from "@mui/material";
import { collections } from "../consts/KindOfColors";

const useStyles = makeStyles({
  collectionCard: {
    position: "relative",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  collectionImage: {
    width: "100%",
    height: "500px",
    objectFit: "cover",
    filter: "brightness(0.7)",
    transition: "0.3s",
  },
  collectionImageHovered: {
    filter: "brightness(1)",
  },
  collectionOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "22px",
    textShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)",
  },
  collectionButtonContainer: {
    display: "flex",
    overflowX: "auto", // גלילה אופקית אפשרית כאן
    justifyContent: "center",
    marginTop: "10px",
  },
  collectionButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#1b3b6f",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "0.3s",
    whiteSpace: "nowrap", // שימור של תוכן על שורה אחת
  },
  collectionsGrid: {
    display: "flex",
    gap: "20px",
    padding: "50px",
    backgroundColor: "#FAF3E0",
    maxWidth: "100%",
  },
  carouselWrapper: {
    width: "100%",
    margin: "2rem auto",
    overflow: "hidden",
    "& .slick-track": {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    "& .slick-list": {
      overflow: "hidden",
      margin: "0 -5px",
    },
    "& .slick-slide": {
      width: "450px !important",
      padding: "0 5px",
    },
  },
  imageCard: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "12px",
    aspectRatio: "16/10",
    width: "100%",
    height: "300px",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
  },
});

const AllCollection = ({ targetSectionRef }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [hoveredImage, setHoveredImage] = useState(null);

  const isMobile = useMediaQuery("(max-width:600px)");

  const settings = {
    slidesToShow: isMobile ? 1 : 5,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 20,
    cssEase: "linear",
    speed: 6000,
    swipe: true,
    touchMove: true,
    draggable: true,
    pauseOnHover: true,
    arrows: false,
  };

  return (
    <div ref={targetSectionRef} style={{ backgroundColor: "#FAF3E0" }}>
      <div id="targetSection" className={classes.collectionsGrid}>
        <Box className={classes.carouselWrapper}>
          <Slider {...settings}>
            {collections.map((collection) => (
              <div key={collection.id} className={classes.collectionCard}>
                <img
                  src={
                    hoveredImage === collection.id ? doll1 : collection.image
                  }
                  alt={collection.title}
                  className={`${classes.collectionImage} ${
                    hoveredImage === collection.id
                      ? classes.collectionImageHovered
                      : ""
                  }`}
                  onMouseEnter={() => setHoveredImage(collection.id)}
                  onMouseLeave={() => setHoveredImage(null)}
                />

                <div className={classes.collectionOverlay}>
                  {collection.title}
                  <br />
                  <div className={classes.collectionButtonContainer}>
                    <button
                      onClick={() => navigate(`/collection/${collection.id}`)}
                      className={classes.collectionButton}
                    >
                      View Collection
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
          {/* <img
            className={classes.img}
            src="/assets/photoBackGround4.webp"
            alt="Background"
          />
          <img
            className={classes.img}
            src="/assets/photoBackGround5.webp"
            alt="Background"
          />
          <img
            className={classes.img}
            src="/assets/photoBackGround6.webp"
            alt="Background"
          /> */}
        </Box>
      </div>
    </div>
  );
};

export default AllCollection;

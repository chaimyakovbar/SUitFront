import React, { useRef } from "react";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import Drawer from "./Drawer2";
import OpenDrawer from "./OpenDrawer";
import MostPoPular from "./MostPoPular";
import AllCollection from "./AllCollection";

const useStyles = makeStyles({
  topDiv: {
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
  },
  img: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    objectFit: "cover",
  },
  drawerForIphone: {
    position: "absolute",
    top: "20px",
    right: "20px",
    zIndex: 10,
  },
  drawer: {
    position: "absolute",
    top: "20px",
    left: "20px",
    zIndex: 10,
  },
  divLink: {
    position: "absolute",
    bottom: "250px",
    left: "50px",
    zIndex: 10,
  },
  link: {
    backgroundColor: "#8B5E3C",
    color: "#FFF",
    padding: "10px 20px",
    fontSize: "18px",
    borderRadius: "5px",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "0.3s",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
  },
});

const HomePage2 = () => {
  const targetSectionRef = useRef(null);

  const classes = useStyles();

  return (
    <div>
      <div className={classes.topDiv}>
        <img className={classes.img} src="/assets/photoBackGround3.jpg" alt="Background" />

        <div className={classes.divLink}>
          <Link
            to="/customSuit"
            className={classes.link}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#5E3C1B")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#8B5E3C")}
          >
            Custom Your Suit
          </Link>
        </div>
      </div>

      <MostPoPular />

      <AllCollection targetSectionRef={targetSectionRef} />

    </div>
  );
};

export default HomePage2;

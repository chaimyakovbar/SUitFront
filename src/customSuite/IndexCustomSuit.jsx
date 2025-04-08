import React from "react";
import MiddleSide from "./middleSide/MiddleSide";
import LeftSide from "./leftSide/LeftSide";
import MostPoPular from "../homePage/MostPoPular";
import Stepper2 from "../components/Stepper";
import RightSide from "./rightSide/RightSide";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

const IndexCustomSuit = () => {
  return (
    <div >
      <Link to="/">
      <Button>מעבר לדף הבית </Button>
      </Link>
      <div style={{ display: "flex"}}>

        <LeftSide />

        <RightSide />
        
        <MiddleSide />

      </div>
      <Stepper2 />
    </div>
  );
};

export default IndexCustomSuit;

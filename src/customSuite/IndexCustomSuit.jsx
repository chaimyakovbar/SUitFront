import React from "react";
import MiddleSide from "./middleSide/MiddleSide";
import LeftSide from "./leftSide/LeftSide";
import Stepper2 from "../components/Stepper";
import RightSide from "./rightSide/RightSide";
import { useMediaQuery } from "@mui/material";

const IndexCustomSuit = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <div>
      <div style={{ display: "flex" }}>
        <div>
          <LeftSide />
        </div>
        <div>
          <RightSide />
        </div>
        <div style={{marginLeft: isMobile ? '130px' : '36%'}}>
          <MiddleSide />
        </div>
      </div>
      <Stepper2 />
    </div>
  );
};

export default IndexCustomSuit;

import React from "react";
import MiddleSide from "./middleSide/MiddleSide";
import LeftSide from "./leftSide/LeftSide";
import Stepper2 from "../components/Stepper";
import RightSide from "./rightSide/RightSide";

const IndexCustomSuit = () => {
  return (
    <div >
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

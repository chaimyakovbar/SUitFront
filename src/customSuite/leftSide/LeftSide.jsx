import React from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import { useAtom } from "jotai";
import { currentIndexAtom } from "../../../Utils";
import { useMediaQuery } from "@mui/material";

const LeftSide = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [currentIndex] = useAtom(currentIndexAtom);
  if (currentIndex === 2) return null
  return (
    <div
      style={{
        width: isMobile ? "100px" : "30%",
        backgroundColor: "#F5F5F7",
        height: isMobile ? "50vh" : "80vh",
        overflowY: "auto",
        padding: isMobile ? "0px" : "30px",
        boxSizing: "border-box",
        marginRight: "20px",
      }}
    >
      {currentIndex === 0 && <StepOne />}
      {currentIndex === 1 && <StepTwo />}
    </div>
  );
};

export default LeftSide;

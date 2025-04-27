import React from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import { useAtom } from "jotai";
import { currentIndexAtom } from "../../Utils";
import "./styles.css";

const LeftSide = () => {
  const [currentIndex] = useAtom(currentIndexAtom);
  if (currentIndex === 2) return null;
  return (
    <div className="left-side-container">
      {currentIndex === 0 && <StepOne />}
      {currentIndex === 1 && <StepTwo />}
    </div>
  );
};

export default LeftSide;

import React, { useState } from "react";
import { suitsColors } from "../../consts/KindOfColors";
import { useAtom } from "jotai";
import { counterAtom, currentColorAtom } from "../../Utils";
import "./styles.css";

const StepOne = () => {
  const [counterArray, setCounterArray] = useAtom(counterAtom);
  const [_, setCurrentColor] = useAtom(currentColorAtom);
  const [selectedColor, setSelectedColor] = useState(null);

  const handleClick = (color) => {
    setSelectedColor(color);
    setCurrentColor(color.colorName);
    const updatedCounter = [...counterArray];
    updatedCounter[0] = { step1Validated: true };
    setCounterArray(updatedCounter);
  };

  return (
    <div className="step-one-container">
      {suitsColors.map((color) => (
        <div key={color.colorId} className="color-option">
          <button
            onClick={() => handleClick(color)}
            className={`color-button ${
              selectedColor?.colorId === color.colorId ? "selected" : ""
            }`}
            style={{ backgroundImage: `url(${color.color})` }}
            onMouseEnter={(e) => {
              e.currentTarget.classList.add("hover");
            }}
            onMouseLeave={(e) => {
              e.currentTarget.classList.remove("hover");
            }}
          />
          <p className="color-name">
            <span>{color.name}</span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default StepOne;

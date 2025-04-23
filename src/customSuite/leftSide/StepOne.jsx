import React, { useState } from "react";
import { suitsColors } from "../../consts/KindOfColors";
import { useAtom } from "jotai";
import { counterAtom, currentColorAtom } from "../../Utils";
import { useMediaQuery } from "@mui/material";

const StepOne = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: isMobile ? "12px" : "24px",
          justifyItems: "center",
          marginTop: "20px",
          // padding: isMobile ? "0 10px" : "0",
        }}
      >
        {suitsColors.map((color) => (
          <div key={color.colorId} style={{ textAlign: "center" }}>
            <button
              onClick={() => handleClick(color)}
              variant="contained"
              style={{
                backgroundImage: `url(${color.color})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: isMobile ? "50px" : "100px",
                height: isMobile ? "50px" : "100px",
                borderRadius: "50%",
                boxShadow:
                  selectedColor?.colorId === color.colorId
                    ? "0 0 0 4px #FF6D00, 0 4px 12px rgba(0, 0, 0, 0.3)"
                    : "0 4px 12px rgba(0, 0, 0, 0.2)",
                border:
                  selectedColor?.colorId === color.colorId
                    ? "3px solid #FF6D00"
                    : "2px solid #333",
                transition: "all 0.3s ease-in-out",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.filter = "brightness(0.9)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.filter = "brightness(1)";
              }}
            />
            <p
              style={{
                marginTop: "12px",
                fontSize: isMobile ? "12px" : "15px",
                color: "#444",
                fontWeight: "bold",
                textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              }}
            >
              <span style={{fontSize: isMobile ? "12px" : "20px"}}>{color.name}</span>
            </p>
          </div>
        ))}
      </div>

  );
};

export default StepOne;

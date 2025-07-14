import { useEffect, useState } from "react";
import {
  selectedPantsColorAtom,
  selectedPantsHoleButtonAtom,
  selectedPantsLinesAtom,
  selectedPantsHemAtom,
  currentColorAtom,
} from "../Utils";
import { useAtomValue } from "jotai";
import { useMediaQuery } from "@mui/material";

const ImageCollectorForPants = () => {
  const [loading, setLoading] = useState(true);

  // Pants customization atoms
  const selectedPantsColor = useAtomValue(selectedPantsColorAtom);
  const selectedPantsHoleButton = useAtomValue(selectedPantsHoleButtonAtom);
  const selectedPantsLines = useAtomValue(selectedPantsLinesAtom);
  const selectedPantsHem = useAtomValue(selectedPantsHemAtom);
  const currentSuitColor = useAtomValue(currentColorAtom);

  // Use pants color if selected, otherwise use suit color
  const effectivePantsColor = selectedPantsColor || currentSuitColor;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [
    selectedPantsColor,
    selectedPantsHoleButton,
    selectedPantsLines,
    selectedPantsHem,
    currentSuitColor,
  ]);

  const isMobile = useMediaQuery("(max-width:600px)");

  const imageStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
  };

  const overlayStyle = {
    ...imageStyle,
    zIndex: 100,
  };

  const handleImageError = (imageName) => {
    console.warn(`⚠️ Failed to load pants image: ${imageName}`);
  };

  return (
    <div
      style={{
        position: "relative",
        right: 0,
        width: isMobile ? "450px" : "500px",
        height: isMobile ? "450px" : "500px",
      }}
    >
      {/* Simple Loader */}
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "5px solid #f3f3f3",
              borderTop: "5px solid #3498db",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <p style={{ marginTop: "10px", color: "white" }}>Loading pants... </p>
        </div>
      )}

      {/* Base pants - AllPants */}
      <img
        src={`/assets/pants/AllPants/${effectivePantsColor}.png`}
        alt={`All Pants - ${effectivePantsColor}`}
        style={imageStyle}
        onError={() =>
          handleImageError(`allPants: AllPants/${effectivePantsColor}`)
        }
      />

      {/* Lines overlay - only show if selected */}
      {selectedPantsLines !== "none" && (
        <img
          src={`/assets/pants/lines/${selectedPantsLines}/${effectivePantsColor}.png`}
          alt={`Lines - ${selectedPantsLines}`}
          style={overlayStyle}
          onError={() =>
            handleImageError(
              `lines: ${selectedPantsLines}/${effectivePantsColor}`
            )
          }
        />
      )}

      {/* Hole and button overlay - always show (default is Regular) */}
      <img
        src={`/assets/pants/HoleAndButton/${selectedPantsHoleButton}/${effectivePantsColor}.png`}
        alt={`Hole and Button - ${selectedPantsHoleButton}`}
        style={overlayStyle}
        onError={() =>
          handleImageError(
            `holeButton: ${selectedPantsHoleButton}/${effectivePantsColor}`
          )
        }
      />

      {/* Hem overlay - only show if selected */}
      {selectedPantsHem !== "none" && (
        <img
          src={`/assets/pants/Hem/${effectivePantsColor}.png`}
          alt={`Hem - ${effectivePantsColor}`}
          style={overlayStyle}
          onError={() => handleImageError(`hem: ${effectivePantsColor}`)}
        />
      )}
    </div>
  );
};

export default ImageCollectorForPants;

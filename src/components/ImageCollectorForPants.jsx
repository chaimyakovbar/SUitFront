import { useEffect, memo } from "react";
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
  // Remove artificial loading state to prevent re-render jank on small changes

  // Pants customization atoms
  const selectedPantsColor = useAtomValue(selectedPantsColorAtom);
  const selectedPantsHoleButton = useAtomValue(selectedPantsHoleButtonAtom);
  const selectedPantsLines = useAtomValue(selectedPantsLinesAtom);
  const selectedPantsHem = useAtomValue(selectedPantsHemAtom);
  const currentSuitColor = useAtomValue(currentColorAtom);

  // Use pants color if selected, otherwise use suit color
  const effectivePantsColor = selectedPantsColor || currentSuitColor;

  useEffect(() => {
    // No artificial delay
  }, [selectedPantsColor, selectedPantsHoleButton, selectedPantsLines, selectedPantsHem, currentSuitColor]);

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
      {/* Loader removed to reduce constant reflow/paint on minor state changes */}

      {/* Base pants - AllPants */}
      <img
        src={`/assets/pants/AllPants/${effectivePantsColor}.png`}
        alt={`All Pants - ${effectivePantsColor}`}
        style={imageStyle}
        loading="lazy"
        decoding="async"
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
          loading="lazy"
          decoding="async"
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
        loading="lazy"
        decoding="async"
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
          loading="lazy"
          decoding="async"
          onError={() => handleImageError(`hem: ${effectivePantsColor}`)}
        />
      )}
    </div>
  );
};

export default memo(ImageCollectorForPants);

import { useEffect, memo } from "react";
import {
  selectedPantsColorAtom,
  selectedPantsHoleButtonAtom,
  selectedPantsLinesAtom,
  selectedPantsHemAtom,
  currentColorAtom,
  selectedPantsKindAtom,
  selectedPantsButtonKindAtom,
  selectedPantsLoopsAtom,
  selectedPantsIronAtom,
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

  // New pants5 atoms
  const selectedPantsKind = useAtomValue(selectedPantsKindAtom);
  const selectedPantsButtonKind = useAtomValue(selectedPantsButtonKindAtom);
  const selectedPantsLoops = useAtomValue(selectedPantsLoopsAtom);
  const selectedPantsIron = useAtomValue(selectedPantsIronAtom);

  // Use pants color if selected, otherwise use suit color
  const effectivePantsColor = selectedPantsColor || currentSuitColor;

  useEffect(() => {
    // No artificial delay
  }, [
    selectedPantsColor,
    selectedPantsHoleButton,
    selectedPantsLines,
    selectedPantsHem,
    currentSuitColor,
    selectedPantsKind,
    selectedPantsButtonKind,
    selectedPantsLoops,
    selectedPantsIron,
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

  // Helper function to get button image path based on kind and button choice
  const getButtonImagePath = () => {
    if (selectedPantsButtonKind === "none") return null;

    switch (selectedPantsKind) {
      case "regularBase":
        return selectedPantsButtonKind === "regularButton"
          ? "regularButton"
          : null;
      case "longRegular":
        return selectedPantsButtonKind === "longMidleButton"
          ? "longMidleButton"
          : null;
      case "longWide":
        if (selectedPantsButtonKind === "longWideButton")
          return "longWideButton";
        if (selectedPantsButtonKind === "longWideTwoButton")
          return "longWideTwoButton";
        return null;
      case "wide":
        if (selectedPantsButtonKind === "wideButton") return "wideButton";
        if (selectedPantsButtonKind === "wideTowButton") return "wideTowButton";
        return null;
      case "MiddleWide":
        if (selectedPantsButtonKind === "middleWideButton")
          return "longWideButton"; // Uses longWideButton image
        if (selectedPantsButtonKind === "middleWideTwoButton")
          return "longWideTwoButton"; // Uses longWideTwoButton image
        return null;
      default:
        return null;
    }
  };

  // Helper function to get loops image path based on kind and loops choice
  const getLoopsImagePath = () => {
    if (selectedPantsLoops === "none") return null;

    switch (selectedPantsKind) {
      case "regularBase":
      case "longRegular":
        if (selectedPantsLoops === "loop") return "loop";
        if (selectedPantsLoops === "twoLoop") return "twoLoop";
        return null;
      case "longWide":
      case "wide":
        if (selectedPantsLoops === "wideOneIoop") return "wideOneIoop";
        if (selectedPantsLoops === "wideTwoLoop") return "wideTwoLoop";
        return null;
      case "MiddleWide":
        if (selectedPantsLoops === "wideMiddleLoop") return "wideMiddleLoop";
        if (selectedPantsLoops === "wideMiddleTowLoop")
          return "wideMiddleTowLoop";
        return null;
      default:
        return null;
    }
  };

  // Helper function to get iron image path based on kind and iron choice
  const getIronImagePath = () => {
    if (selectedPantsIron === "none") return null;

    switch (selectedPantsKind) {
      case "regularBase":
      case "longRegular":
        if (selectedPantsIron === "regularIron") return "regularIron";
        if (selectedPantsIron === "oneIron") return "oneIron";
        if (selectedPantsIron === "oneIronTwoButton") return "oneIronTwoButton";
        return null;
      case "longWide":
      case "wide":
      case "MiddleWide":
        return selectedPantsIron === "wideIron" ? "wideIron" : null;
      default:
        return null;
    }
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

      {/* Base pants - allPants (always active) */}
      <img
        src={`/assets/pants/allPants/${effectivePantsColor}.png`}
        alt={`All Pants - ${effectivePantsColor}`}
        style={imageStyle}
        loading="lazy"
        decoding="async"
        onError={() =>
          handleImageError(`allPants: pants/allPants/${effectivePantsColor}`)
        }
      />

      {/* Kind layer - only show if not regularBase */}
      {selectedPantsKind !== "regularBase" && (
        <img
          src={`/assets/pants/kind/${selectedPantsKind}/${effectivePantsColor}.png`}
          alt={`Kind - ${selectedPantsKind}`}
          style={overlayStyle}
          loading="lazy"
          decoding="async"
          onError={() =>
            handleImageError(
              `kind: pants/kind/${selectedPantsKind}/${effectivePantsColor}`
            )
          }
        />
      )}

      {/* Button layer - only show if button is selected */}
      {(() => {
        const buttonPath = getButtonImagePath();
        return buttonPath ? (
          <img
            src={`/assets/pants/button/${buttonPath}/${effectivePantsColor}.png`}
            alt={`Button - ${buttonPath}`}
            style={overlayStyle}
            loading="lazy"
            decoding="async"
            onError={() =>
              handleImageError(
                `button: pants/button/${buttonPath}/${effectivePantsColor}`
              )
            }
          />
        ) : null;
      })()}

      {/* Loops layer - only show if loops are selected */}
      {(() => {
        const loopsPath = getLoopsImagePath();
        return loopsPath ? (
          <img
            src={`/assets/pants/loops/${loopsPath}/${effectivePantsColor}.png`}
            alt={`Loops - ${loopsPath}`}
            style={overlayStyle}
            loading="lazy"
            decoding="async"
            onError={() =>
              handleImageError(
                `loops: pants/loops/${loopsPath}/${effectivePantsColor}`
              )
            }
          />
        ) : null;
      })()}

      {/* Iron layer - only show if iron is selected */}
      {(() => {
        const ironPath = getIronImagePath();
        return ironPath ? (
          <img
            src={`/assets/pants/iron/${ironPath}/${effectivePantsColor}.png`}
            alt={`Iron - ${ironPath}`}
            style={overlayStyle}
            loading="lazy"
            decoding="async"
            onError={() =>
              handleImageError(
                `iron: pants/iron/${ironPath}/${effectivePantsColor}`
              )
            }
          />
        ) : null;
      })()}

      {/* Hem layer - only show if hem is selected */}
      {selectedPantsHem !== "none" && (
        <img
          src={`/assets/pants/hem/hem/${effectivePantsColor}.png`}
          alt={`Hem - ${effectivePantsColor}`}
          style={overlayStyle}
          loading="lazy"
          decoding="async"
          onError={() =>
            handleImageError(`hem: pants/hem/hem/${effectivePantsColor}`)
          }
        />
      )}
    </div>
  );
};

export default memo(ImageCollectorForPants);

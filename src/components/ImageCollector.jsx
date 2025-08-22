import { useEffect, useMemo, memo } from "react";
import {
  currentKindAtom,
  currentColorAtom,
  selectedCollarAtom,
  selectedLapelTypeAtom,
  selectedPacketTypeAtom,
  selectedInsideTypeAtom,
  selectedButtonAtom,
  selectedPoshetAtom,
  selectedHolesButtonAtom,
  selectedHolesButtonUpAtom,
  selectedSleeveButtonsAtom,
  textInsideTextAtom,
  textInsideFontAtom,
  textInsideColorAtom,
  priceAllSuitAtom,
  selectedKindTypeAtom,
} from "../Utils";
import { useAtomValue, useAtom } from "jotai";
import { useMediaQuery } from "@mui/material";
import { suitPricing } from "../config/suitPricing";
import TextInside from "../../public/assets/adds/TextInside.png";

const ImageFilterComponent = () => {
  // const previousConfigRef = useRef(null);

  const currColor = useAtomValue(currentColorAtom);
  const selectedKind = useAtomValue(currentKindAtom);
  const [_, setPriceAllSuit] = useAtom(priceAllSuitAtom);
  const selectedCollar = useAtomValue(selectedCollarAtom);
  const selectedButton = useAtomValue(selectedButtonAtom);
  const selectedPoshet = useAtomValue(selectedPoshetAtom);
  const selectedLapelType = useAtomValue(selectedLapelTypeAtom);
  const selectedPacketType = useAtomValue(selectedPacketTypeAtom);
  const selectedInsideType = useAtomValue(selectedInsideTypeAtom);
  const selectedHolesButton = useAtomValue(selectedHolesButtonAtom);
  const selectedHolesButtonUp = useAtomValue(selectedHolesButtonUpAtom);
  const selectedKindType = useAtomValue(selectedKindTypeAtom);
  const selectedSleeveButtons = useAtomValue(selectedSleeveButtonsAtom);
  const textInsideText = useAtomValue(textInsideTextAtom);
  const textInsideFont = useAtomValue(textInsideFontAtom);
  const textInsideColor = useAtomValue(textInsideColorAtom);

  const packetKind = selectedKindType || "packetBottom";
  const insideColor = selectedInsideType || currColor;
  const holeButtonColor = selectedHolesButton;
  const holeButtonUpColor = selectedHolesButtonUp;
  const buttonColor = selectedButton;
  const poshetColor = selectedPoshet;
  // Some asset folders are named 'Slime' instead of 'Slim'
  const lapelDir = selectedLapelType === "Slim" ? "Slime" : selectedLapelType;

  const bottomPart =
    selectedKind === "kind2"
      ? "bottom2"
      : selectedKind === "kind1"
      ? "bottom"
      : "bottomKind3";

  // Remove artificial loading delay to avoid jank on every small change
  useEffect(() => {
    // No-op: keep effect so dependencies are explicit for future optimizations
  }, [
    selectedKind,
    selectedSleeveButtons,
    textInsideText,
    textInsideFont,
    textInsideColor,
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
    console.warn(`⚠️ Failed to load image: ${imageName}`);
  };

  // Calculate total price
  const calculateTotalPrice = useMemo(() => {
    let total = suitPricing.basePrices[selectedKind] || 0;
    // Add lapel type cost
    const lapelCost =
      suitPricing.additionalCosts.lapelTypes[selectedLapelType] || 0;
    total += lapelCost;

    // Add collar type cost
    const collarCost =
      suitPricing.additionalCosts.collarTypes[selectedCollar] || 0;
    total += collarCost;

    // Add packet type cost
    const packetCost =
      suitPricing.additionalCosts.packetTypes[selectedPacketType] || 0;
    total += packetCost;

    // Add special features costs
    if (poshetColor) {
      total += suitPricing.additionalCosts.features.poshet;
    }
    if (holeButtonColor) {
      total += suitPricing.additionalCosts.features.holesButton;
    }
    if (holeButtonUpColor) {
      total += suitPricing.additionalCosts.features.holesButtonUp;
    }

    // Add color costs based on their specific categories
    if (currColor) {
      // Main suit color
      if (suitPricing.additionalCosts.MainSuitColors[currColor] !== undefined) {
        const mainColorCost =
          suitPricing.additionalCosts.MainSuitColors[currColor];
        total += mainColorCost;
      }
    }

    if (insideColor) {
      // Inside color
      if (suitPricing.additionalCosts.InsideColors[insideColor] !== undefined) {
        const insideColorCost =
          suitPricing.additionalCosts.InsideColors[insideColor];
        total += insideColorCost;
      }
    }

    // Handle button color
    if (selectedButton) {
      const buttonColorCost =
        suitPricing.additionalCosts.ButtonColors[selectedButton];
      if (buttonColorCost !== undefined) {
        total += buttonColorCost;
      }
    }

    return total;
  }, [
    selectedKind,
    selectedLapelType,
    selectedCollar,
    selectedPacketType,
    currColor,
    insideColor,
    selectedButton,
    poshetColor,
    holeButtonColor,
    holeButtonUpColor,
  ]);

  useEffect(() => {
    setPriceAllSuit(calculateTotalPrice);
  }, [calculateTotalPrice, setPriceAllSuit]);

  return (
    <div
      style={{
        position: "relative",
        right: 0,
        width: isMobile ? "450px" : "500px",
        height: isMobile ? "450px" : "500px",
      }}
    >
      {/* <div
        style={{
          position: "absolute",
          right: 10,
          top: 65,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "8px 16px",
          borderRadius: "4px",
          zIndex: 1001,
          fontSize: isMobile ? "14px" : "18px",
          fontWeight: "bold",
        }}
      >
        ${calculateTotalPrice}
      </div>{" "}
      <div
        style={{
          position: "absolute",
          right: 10,
          top: 65,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "8px 16px",
          borderRadius: "4px",
          zIndex: 1001,
          fontSize: isMobile ? "14px" : "18px",
          fontWeight: "bold",
        }}
      >
        ${calculateTotalPrice}
      </div> */}
      {/* Loader removed to reduce constant reflow/paint on minor state changes */}
      {/* Base parts */}
      <img
        src={`/assets/ragach/Kinds/${selectedKind}/${currColor}.png`}
        alt={`Suit Body - ${selectedKind} ${currColor}`}
        style={{ ...imageStyle, zIndex: 2 }}
        loading="lazy"
        decoding="async"
        onError={() => handleImageError("suitBody")}
      />
      <img
        src={`/assets/ragach/colar/${currColor}.png`}
        alt={`Collar - ${currColor}`}
        style={{ ...imageStyle, zIndex: 200 }}
        loading="lazy"
        decoding="async"
        onError={() => handleImageError("collar")}
      />
      <img
        src={`/assets/ragach/sleeves/${currColor}.png`}
        alt={`Sleeves - ${currColor}`}
        style={imageStyle}
        loading="lazy"
        decoding="async"
        onError={() => handleImageError("sleeves")}
      />
      <img
        src={`/assets/ragach/insideUp/${insideColor}.png`}
        alt={`Inside Up - ${insideColor}`}
        style={imageStyle}
        loading="lazy"
        decoding="async"
        onError={() => handleImageError("insideUp")}
      />
      <img
        src={`/assets/ragach/insideBottom/${currColor}.png`}
        alt={`Inside Bottom - ${insideColor}`}
        style={imageStyle}
        loading="lazy"
        decoding="async"
        onError={() => handleImageError("insideBottom")}
      />
      <img
        src={`/assets/ragach/${bottomPart}/${currColor}.png`}
        alt={`Bottom - ${currColor}`}
        style={{ ...imageStyle, zIndex: 2 }}
        loading="lazy"
        decoding="async"
        onError={() => handleImageError("bottom")}
      />
      {/* Fixed Lapel/Collar path */}
      <img
        src={`/assets/ragach/${selectedCollar}/${lapelDir}/${selectedKind}/${currColor}.png`}
        alt={`Lapel Collar - ${currColor}`}
        style={{ ...imageStyle, zIndex: 200 }}
        loading="lazy"
        decoding="async"
        onError={() =>
          handleImageError(
            `lapelCollar: ${selectedCollar}/${lapelDir}/${selectedKind}/${currColor}`
          )
        }
      />
      {/* Packet Bottom with specific type */}
      {selectedPacketType === "packet4" && (
        <img
          src={`/assets/ragach/packet/${packetKind}/packet1/${currColor}.png`}
          alt={`Packet Bottom - ${currColor}`}
          style={overlayStyle}
          loading="lazy"
          decoding="async"
          onError={() =>
            handleImageError(`packetBottom: ${selectedPacketType}/${currColor}`)
          }
        />
      )}
      {selectedPacketType === "packet5" && (
        <img
          src={`/assets/ragach/packet/${packetKind}/packet2/${currColor}.png`}
          alt={`Packet Bottom - ${currColor}`}
          style={overlayStyle}
          loading="lazy"
          decoding="async"
          onError={() =>
            handleImageError(`packetBottom: ${selectedPacketType}/${currColor}`)
          }
        />
      )}
      <img
        src={`/assets/ragach/packet/${packetKind}/${selectedPacketType}/${currColor}.png`}
        alt={`Packet Bottom - ${currColor}`}
        style={overlayStyle}
        loading="lazy"
        decoding="async"
        onError={() =>
          handleImageError(`packetBottom: ${selectedPacketType}/${currColor}`)
        }
      />
      {poshetColor && (
        <img
          src={`/assets/adds/poshet/${poshetColor}.png`}
          alt={`Poshet - ${poshetColor}`}
          style={overlayStyle}
          loading="lazy"
          decoding="async"
          onError={() => handleImageError(`poshet: ${poshetColor}`)}
        />
      )}
      <img
        src={`/assets/ragach/packetUp/${currColor}.png`}
        alt={`Packet Up - ${currColor}`}
        style={{ ...imageStyle, zIndex: 3 }}
        loading="lazy"
        decoding="async"
        onError={() => handleImageError("packetUp")}
      />
      {buttonColor !== null && (
        <img
          src={`/assets/ragach/button/${selectedKind}/${buttonColor}.png`}
          alt={`Button - ${buttonColor}`}
          style={overlayStyle}
          loading="lazy"
          decoding="async"
          onError={() =>
            handleImageError(`button: ${selectedKind}/${buttonColor}`)
          }
        />
      )}
      {holeButtonColor && (
        <img
          src={`/assets/adds/holesButton/${selectedKind}/${holeButtonColor}.png`}
          alt={`Hole Button - ${holeButtonColor}`}
          style={overlayStyle}
          loading="lazy"
          decoding="async"
          onError={() =>
            handleImageError(`holeButton: ${selectedKind}/${holeButtonColor}`)
          }
        />
      )}
      {holeButtonUpColor && (
        <img
          src={`/assets/adds/holesButtonUp/${holeButtonUpColor}.png`}
          alt={`Hole Button Up - ${holeButtonUpColor}`}
          style={overlayStyle}
          loading="lazy"
          decoding="async"
          onError={() => handleImageError(`holeButtonUp: ${holeButtonUpColor}`)}
        />
      )}
      {/* Sleeve buttons overlay - only show if selected */}
      {/* {selectedSleeveButtons !== "none" && (
        <img
          src={`public/assets/adds/sleevseButton/${selectedSleeveButtons}/${currColor}.png`}
          alt={`Sleeve Buttons - ${selectedSleeveButtons}`}
          style={overlayStyle}
          onError={() =>
            handleImageError(
              `sleeveButtons: ${selectedSleeveButtons}/${currColor}`
            )
          }
        />
      )} */}
      {/* TextInside overlay - REMOVED: Text is saved to database but not displayed on suit */}
      {/* {textInsideText && (
        <div style={{ ...overlayStyle, zIndex: 200 }}>
          <img
            src="/assets/adds/TextInside.png"
            alt="TextInside"
            style={imageStyle}
            onError={() => handleImageError("TextInside")}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: textInsideColor,
              padding: "8px 16px",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "bold",
              textAlign: "center",
              minWidth: "120px",
              fontFamily: textInsideFont,
            }}
          >
            {textInsideText}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default memo(ImageFilterComponent);

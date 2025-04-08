import { useState, useEffect, useMemo } from "react";
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
  allSuitPartAtom
  
} from "../../Utils";
import { useAtomValue, useAtom } from "jotai";

const BASE_PARTS = ["insideUp", "insideBottom", "sleeves", "colar"]

const ImageFilterComponent = () => {
  const DEFAULT_KIND = "kind1";
  const DEFAULT_LAPEL = "standard";
  const DEFAULT_PACKET_TYPE = "packet1";
  const DEFAULT_LAPEL_KIND = "collarTight";
  const DEFAULT_COLOR = { colorName: "blackGrey" };

  const [imagePaths, setImagePaths] = useState({});
  const [loadingParts, setLoadingParts] = useState({});
  
  const currColor = useAtomValue(currentColorAtom);
  const selectedKind = useAtomValue(currentKindAtom);
  const selectedCollar = useAtomValue(selectedCollarAtom);
  const selectedLapelType = useAtomValue(selectedLapelTypeAtom);
  const selectedPacketType = useAtomValue(selectedPacketTypeAtom);
  const selectedInsideType = useAtomValue(selectedInsideTypeAtom);
  const selectedHolesButton = useAtomValue(selectedHolesButtonAtom);
  const selectedHolesButtonUp = useAtomValue(selectedHolesButtonUpAtom);
  const selectedButton = useAtomValue(selectedButtonAtom);
  const selectedPoshet = useAtomValue(selectedPoshetAtom);
    const [_, setAllSuitPart] = useAtom(allSuitPartAtom)

  const kind = selectedKind || DEFAULT_KIND;
  const lapelType = selectedLapelType || DEFAULT_LAPEL;
  const lapelKind = selectedCollar || DEFAULT_LAPEL_KIND;
  const packetType = selectedPacketType || DEFAULT_PACKET_TYPE;
  const color = currColor?.colorName || DEFAULT_COLOR.colorName;
  const insideColor = selectedInsideType || color;
  const holeButtonColor = selectedHolesButton;
  const holeButtonUpColor = selectedHolesButtonUp;
  const buttonColor = selectedButton;
  const poshetColor = selectedPoshet;

    const suitConfig = useMemo(() => ({
      kind,
      lapelType,
      lapelKind,
      packetType,
      color,
      insideColor,
      holeButtonColor: selectedHolesButton,
      holeButtonUpColor: selectedHolesButtonUp,
      buttonColor: selectedButton,
      poshetColor: selectedPoshet,
    }), [
      kind, lapelType, lapelKind, packetType, color, insideColor,
      selectedHolesButton, selectedHolesButtonUp, selectedButton, selectedPoshet
    ])

      const partsToLoad = useMemo(() => {
        const bottomPart = (kind === "kind3" || kind === "kind4") ? "bottomKind3" : "bottom"
        return [...BASE_PARTS, bottomPart, "packetUp", "packetBottom"]
      }, [kind])

  useEffect(() => {
    console.log("Current Values:", { color, kind, lapelType, lapelKind, packetType });

    if (!color) return;

    setImagePaths({});
    setLoadingParts({});

    setAllSuitPart({
      ...suitConfig,
       ...partsToLoad.reduce((acc, part) => ({ ...acc, [part]: true }), {}),
    })

    const bottomPart = kind === "kind3" || kind === "kind4" ? "bottomKind3" : "bottom";
    const allParts = [...BASE_PARTS, bottomPart, "packetUp", "packetBottom"];

    allParts.forEach((part) => {
      setLoadingParts((prev) => ({ ...prev, [part]: true }));

      import(`../assets/ragach/${part}/${color}.png`)
        .then((image) => {
          setImagePaths((prev) => ({
            ...prev,
            [part]: image.default,
          }));
        })
        .catch(() => {
          console.warn(`⚠️ Missing image for ${part}: ${color}`);
        })
        .finally(() => {
          setLoadingParts((prev) => ({ ...prev, [part]: false }));
        });
    });

    const packetBottomPath = `../assets/ragach/packetBottom/${packetType}/${color}.png`;
    import(/* @vite-ignore */ packetBottomPath)
      .then((image) => {
        setImagePaths((prev) => ({
          ...prev,
          packetBottom: image.default,
        }));
      })
      .catch(() => {
        console.warn(`⚠️ Missing image for packetBottom: ${packetType}/${color}`);
      })
      .finally(() => {
        setLoadingParts((prev) => ({ ...prev, packetBottom: false }));
      });

    const imagePath = `../assets/ragach/${lapelKind}/${lapelType}/${kind}/${color}.png`;
    import(/* @vite-ignore */ imagePath)
      .then((image) => {
        setImagePaths((prev) => ({
          ...prev,
          lapelCollar: image.default,
        }));
      })
      .catch(() => {
        console.warn(`⚠️ Missing lapel/collar image: ${lapelKind}/${lapelType}/${kind}/${color}`);
      })
      .finally(() => {
        setLoadingParts((prev) => ({ ...prev, lapelCollar: false }));
      });

    // Loading inside color image
    const insideUpPath = `../assets/ragach/insideUp/${insideColor}.png`;
    import(/* @vite-ignore */ insideUpPath)
      .then((image) => {
        setImagePaths((prev) => ({
          ...prev,
          insideUp: image.default,
        }));
      })
      .catch(() => {
        console.warn(`⚠️ Missing image for insideUp: ${insideColor}`);
      });

    // Only load additional parts if the user has selected the relevant options
    if (holeButtonColor) {
      const holeButtonPath = `../assets/adds/holesButton/${kind}/${holeButtonColor}.png`;
      import(/* @vite-ignore */ holeButtonPath)
        .then((image) => {
          setImagePaths((prev) => ({
            ...prev,
            holeButton: image.default,
          }));
        })
        .catch(() => {
          console.warn(`⚠️ Missing image for holeButton: ${holeButtonColor}`);
        });
    }
    if (holeButtonUpColor) {
      const holeButtonUpPath = `../assets/adds/holesButtonUp/${holeButtonUpColor}.png`;
      import(/* @vite-ignore */ holeButtonUpPath)
        .then((image) => {
          setImagePaths((prev) => ({
            ...prev,
            holeButtonUp: image.default,
          }));
        })
        .catch(() => {
          console.warn(`⚠️ Missing image for holeButtonUp: ${holeButtonUpColor}`);
        });
    }

    if (buttonColor) {
      const buttonColorPath = `../assets/ragach/button/${kind}/${buttonColor}.png`;
      import(/* @vite-ignore */ buttonColorPath)
        .then((image) => {
          setImagePaths((prev) => ({
            ...prev,
            buttonColor: image.default,
          }));
        })
        .catch(() => {
          console.warn(`⚠️ Missing image for buttonColor: ${buttonColor}`);
        });
    }

    if (poshetColor) {
      const poshetColorPath = `../assets/adds/poshet/${poshetColor}.png`;
      import(/* @vite-ignore */ poshetColorPath)
        .then((image) => {
          setImagePaths((prev) => ({
            ...prev,
            poshetColor: image.default,
          }));
        })
        .catch(() => {
          console.warn(`⚠️ Missing image for poshetColor: ${poshetColor}`);
        });
    }
  }, [color, selectedKind, lapelType, lapelKind, packetType, kind, insideColor, holeButtonColor, buttonColor, poshetColor, holeButtonUpColor, setAllSuitPart, suitConfig, partsToLoad]);

  return (
    <div>
      <div style={{ position: "relative", width: "500px", height: "500px" }}>
        {Object.entries(imagePaths).map(([part, src]) => (
          <img
            key={part}
            src={src}
            alt={`${color} ${part}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              opacity: loadingParts[part] ? 0.5 : 1,
              zIndex: part === "packetBottom" || part === "packetUp" || part === 'buttonColor' || part === 'holeButton' || part === 'poshetColor' ? 100 : 1,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageFilterComponent;

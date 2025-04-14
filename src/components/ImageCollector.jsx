import { useEffect, useMemo, useRef, useState } from "react"
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
  allSuitPartAtom,
} from "../Utils"
import { useAtomValue, useAtom } from "jotai"
import { useMediaQuery } from "@mui/material"

const ImageFilterComponent = () => {
  const DEFAULT_KIND = "kind1"
  const DEFAULT_LAPEL = "Standard"
  const DEFAULT_PACKET_TYPE = "packet1"
  const DEFAULT_LAPEL_KIND = "collarTight"
  const DEFAULT_COLOR = { colorName: "blackGrey" }

  const previousConfigRef = useRef(null)
  const [loading, setLoading] = useState(true)

  const currColor = useAtomValue(currentColorAtom)
  const selectedKind = useAtomValue(currentKindAtom)
  const [_, setAllSuitPart] = useAtom(allSuitPartAtom)
  const selectedCollar = useAtomValue(selectedCollarAtom)
  const selectedButton = useAtomValue(selectedButtonAtom)
  const selectedPoshet = useAtomValue(selectedPoshetAtom)
  const selectedLapelType = useAtomValue(selectedLapelTypeAtom)
  const selectedPacketType = useAtomValue(selectedPacketTypeAtom)
  const selectedInsideType = useAtomValue(selectedInsideTypeAtom)
  const selectedHolesButton = useAtomValue(selectedHolesButtonAtom)
  const selectedHolesButtonUp = useAtomValue(selectedHolesButtonUpAtom)

  const kind = selectedKind || DEFAULT_KIND
  const lapelType = selectedLapelType || DEFAULT_LAPEL
  const lapelKind = selectedCollar || DEFAULT_LAPEL_KIND
  const packetType = selectedPacketType || DEFAULT_PACKET_TYPE
  const color = currColor?.colorName || DEFAULT_COLOR.colorName
  const insideColor = selectedInsideType || color
  const holeButtonColor = selectedHolesButton
  const holeButtonUpColor = selectedHolesButtonUp
  const buttonColor = selectedButton
  const poshetColor = selectedPoshet

  const suitConfig = useMemo(
    () => ({ kind, lapelType, lapelKind, packetType, color, insideColor, holeButtonColor, holeButtonUpColor, buttonColor, poshetColor}),
    [ kind, lapelType, lapelKind, packetType, color, insideColor, holeButtonColor, holeButtonUpColor, buttonColor, poshetColor,]
  )

  const bottomPart = kind === "kind3" || kind === "kind4" ? "bottomKind3" : "bottom"

  // Show loader whenever configuration changes
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 200) // Show loader for 800ms

    return () => clearTimeout(timer)
  }, [suitConfig])

  useEffect(() => {
    if (!color) return

    console.log("Current Values:", {
      color,
      kind,
      lapelType,
      lapelKind,
      packetType,
    })

    const partsToInclude = ["colar", "sleeves", "insideUp", "insideBottom", "packetUp", bottomPart, "packetBottom"]
    
    const newSuit = {
      ...suitConfig,
      parts: partsToInclude.reduce((acc, part) => ({ ...acc, [part]: true }), {}),
    }

    const configString = JSON.stringify(newSuit)
    if (previousConfigRef.current !== configString) {
      previousConfigRef.current = configString

      setAllSuitPart((current) => {
        const existingIndex = current.findIndex(
          (suit) => JSON.stringify({ ...suit, parts: { ...suit.parts } }) === configString
        )

        if (existingIndex >= 0) {
          return current
        }

        return [...current, newSuit]
      })
    }
  }, [suitConfig, setAllSuitPart, color, kind, lapelType, lapelKind, packetType, bottomPart])

  const isMobile = useMediaQuery("(max-width:600px)")

  const imageStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
  }

  const overlayStyle = {
    ...imageStyle,
    zIndex: 100,
  }

  const handleImageError = (imageName) => {
    console.warn(`⚠️ Failed to load image: ${imageName}`)
  }

  return (
    <div
      style={{
        position: "relative",
        right: 0,
        width: isMobile ? "250px" : "500px",
        height: isMobile ? "350px" : "500px",
      }}
    >
      {/* Simple Loader */}
      {loading && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          // backgroundColor: "rgba(255, 255, 255, 0.8)",
          zIndex: 1000,
        }}>
          <div style={{
            width: "50px",
            height: "50px",
            border: "5px solid #f3f3f3",
            borderTop: "5px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <p style={{ marginTop: "10px", color: 'white' }}>Loading suit... </p>
        </div>
      )}

      {/* Base parts */}
      <img 
        src={`/assets/ragach/colar/${color}.png`}
        alt={`Collar - ${color}`}
        style={imageStyle}
        onError={() => handleImageError('collar')}
      />
      
      <img 
        src={`/assets/ragach/sleeves/${color}.png`}
        alt={`Sleeves - ${color}`}
        style={imageStyle}
        onError={() => handleImageError('sleeves')}
      />
      
      <img 
        src={`/assets/ragach/insideUp/${insideColor}.png`}
        alt={`Inside Up - ${insideColor}`}
        style={imageStyle}
        onError={() => handleImageError('insideUp')}
      />
      
      <img 
        src={`/assets/ragach/insideBottom/${color}.png`}
        alt={`Inside Bottom - ${insideColor}`}
        style={imageStyle}
        onError={() => handleImageError('insideBottom')}
      />
      
      <img 
        src={`/assets/ragach/${bottomPart}/${color}.png`}
        alt={`Bottom - ${color}`}
        style={imageStyle}
        onError={() => handleImageError('bottom')}
      />
      
      {/* Fixed Lapel/Collar path */}
      <img 
        src={`/assets/ragach/${lapelKind}/${lapelType}/${kind}/${color}.png`}
        alt={`Lapel Collar - ${color}`}
        style={imageStyle}
        onError={() => handleImageError(`lapelCollar: ${lapelKind}/${lapelType}/${kind}/${color}`)}
      />
      
      {/* Packet Bottom with specific type */}
      <img 
        src={`/assets/ragach/packetBottom/${packetType}/${color}.png`}
        alt={`Packet Bottom - ${color}`}
        style={overlayStyle}
        onError={() => handleImageError(`packetBottom: ${packetType}/${color}`)}
      />
      
      {poshetColor && (
        <img 
          src={`/assets/adds/poshet/${poshetColor}.png`}
          alt={`Poshet - ${poshetColor}`}
          style={overlayStyle}
          onError={() => handleImageError(`poshet: ${poshetColor}`)}
        />
      )}

      <img 
        src={`/assets/ragach/packetUp/${color}.png`}
        alt={`Packet Up - ${color}`}
        style={imageStyle}
        onError={() => handleImageError('packetUp')}
      />
      
      {buttonColor && (
        <img 
          src={`/assets/ragach/button/${kind}/${buttonColor}.png`}
          alt={`Button - ${buttonColor}`}
          style={overlayStyle}
          onError={() => handleImageError(`button: ${kind}/${buttonColor}`)}
        />
      )}
      
      {holeButtonColor && (
        <img 
          src={`/assets/adds/holesButton/${kind}/${holeButtonColor}.png`}
          alt={`Hole Button - ${holeButtonColor}`}
          style={overlayStyle}
          onError={() => handleImageError(`holeButton: ${kind}/${holeButtonColor}`)}
        />
      )}
      
      {holeButtonUpColor && (
        <img 
          src={`/assets/adds/holesButtonUp/${holeButtonUpColor}.png`}
          alt={`Hole Button Up - ${holeButtonUpColor}`}
          style={overlayStyle}
          onError={() => handleImageError(`holeButtonUp: ${holeButtonUpColor}`)}
        />
      )}
    </div>
  )
}

export default ImageFilterComponent
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Box, Tooltip, useTheme, Typography } from "@mui/material";
import { Doll } from "./Doll3D";
import { useLanguage } from "../context/LanguageContext";
import { quickFitPoints, pointIdToInputKey } from "../config/mannequinPoints";

/**
 * QuickFitMannequin
 *
 * Renders a 3D mannequin with only the minimal required measurement points.
 * Each point:
 * - turns green when it has a value
 * - shows bilingual (HE/EN) instructions on hover
 *
 * Props:
 * - values: { [inputKey]: number | string }
 * - onPointSelect?: (inputKey: string) => void
 * - showPoints?: boolean // when false, shows only the 3D doll without markers
 */
const QuickFitMannequin = ({
  values = {},
  onPointSelect,
  showPoints = true,
}) => {
  const theme = useTheme(); // eslint-disable-line no-unused-vars
  const { language } = useLanguage();

  // Simple 2D overlay positions relative to the mannequin container.
  // These are approximate and can be tweaked visually.
  const pointPositions = {
    height: { top: "5%", left: "50%" },
    weight: { top: "90%", left: "10%" },
    chest: { top: "32%", left: "52%" },
    waist: { top: "44%", left: "55%" },
    hip: { top: "56%", left: "52%" },
    neck: { top: "20%", left: "50%" },
    shoulderWidth: { top: "26%", left: "30%" },
  };

  const getValueForPoint = (point) => {
    const key = point.inputKey;
    const raw = values[key];
    if (raw === undefined || raw === null || raw === "") return null;
    const num = Number(raw);
    return Number.isNaN(num) || num <= 0 ? null : num;
  };

  const getTooltipText = (point) => {
    const he = point.helpHe;
    const en = point.helpEn;
    // Main language per context, but always show both in one tooltip
    if (language === "he") {
      return `${point.labelHe} – ${he}\n\n${point.labelEn} – ${en}`;
    }
    return `${point.labelEn} – ${en}\n\n${point.labelHe} – ${he}`;
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 420,
        height: 520,
        borderRadius: 4,
        overflow: "hidden",
        background:
          "radial-gradient(circle at top, rgba(255,255,255,0.12), transparent 55%), #111111",
        boxShadow: "0 18px 45px rgba(0,0,0,0.7)",
      }}
    >
      {/* 3D Mannequin */}
      <Canvas
        camera={{ position: [0, 1.6, 4], fov: 40 }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Lights – stronger so the model is clearly visible */}
        <ambientLight intensity={1.1} />
        <directionalLight position={[2, 4, 3]} intensity={1.6} />
        <directionalLight position={[-2, 3, -2]} intensity={0.8} />
        <Doll position={[0, -1.2, 0]} />
        <OrbitControls enablePan={false} minDistance={3} maxDistance={6} />
      </Canvas>

      {/* Overlay points */}
      {showPoints &&
        quickFitPoints.map((point) => {
          const pos = pointPositions[point.id] || { top: "50%", left: "50%" };
          const hasValue = !!getValueForPoint(point);

          return (
            <Tooltip
              key={point.id}
              title={
                <span style={{ whiteSpace: "pre-line" }}>
                  {getTooltipText(point)}
                </span>
              }
              placement="top"
              arrow
            >
              <Box
                onClick={() =>
                  onPointSelect &&
                  onPointSelect(pointIdToInputKey[point.id] || point.inputKey)
                }
                sx={{
                  position: "absolute",
                  top: pos.top,
                  left: pos.left,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.95)",
                  backgroundColor: hasValue
                    ? "#00e676" // bright green
                    : "#ff1744", // bright red
                  boxShadow: hasValue
                    ? "0 0 16px rgba(0,230,118,0.9)"
                    : "0 0 14px rgba(255,23,68,0.9)",
                  cursor: "pointer",
                  transform: "translate(-50%, -50%)",
                  transition: "all 0.18s ease-in-out",
                  zIndex: 2,
                  "&:hover": {
                    transform: "translate(-50%, -50%) scale(1.2)",
                  },
                }}
              />
            </Tooltip>
          );
        })}

      {/* Legend for colors */}
      {showPoints && (
        <Box
          sx={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 1.5,
            py: 0.5,
            borderRadius: 999,
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 3,
          }}
        >
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#00e676",
              boxShadow: "0 0 8px rgba(0,230,118,0.9)",
            }}
          />
          <Typography variant="caption" sx={{ color: "#f5f5f5" }}>
            {language === "he" ? "נקודה מלאה" : "Point filled"}
          </Typography>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#ff1744",
              boxShadow: "0 0 8px rgba(255,23,68,0.9)",
            }}
          />
          <Typography variant="caption" sx={{ color: "#f5f5f5" }}>
            {language === "he" ? "נקודה חסרה" : "Point empty"}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default QuickFitMannequin;

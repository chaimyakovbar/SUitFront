import React, { Suspense, memo } from "react";
import { Box } from "@mui/material";

const ImageFilterComponent = React.lazy(() => import("../ImageCollector"));
const ImageFilterComponentForPants = React.lazy(() =>
  import("../ImageCollectorForPants")
);

// Quick performance mode switch to disable heavy visual effects temporarily
const PERF_MODE = true;

const SuitPreview = ({ isPantsMode, isMobile }) => {
  // Variants disabled in PERF_MODE

  return (
    <Box
      component="div"
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        maxWidth: { xs: "100%", md: "600px" },
        mx: "auto",
      }}
    >
      {/* Preview Container with Elegant Border */}
      <Box
        component="div"
        sx={{
          position: "relative",
          background: "transparent",
          backdropFilter: "none",
          border: "none",
          borderRadius: isMobile ? "0" : "32px",
          padding: isMobile ? "0" : "24px",
          boxShadow: "none",
          overflow: "hidden",
          "&::before": PERF_MODE ? {} : {},
          "&::after": PERF_MODE ? {} : {},
        }}
      >
        {/* Suit/Pants Display */}
        <Box
          sx={{
            position: "relative",
            borderRadius: isMobile ? "16px" : "20px",
            overflow: "hidden",
            background: isMobile
              ? "linear-gradient(135deg, rgba(30, 30, 30, 0.3) 0%, rgba(20, 20, 20, 0.5) 100%)"
              : "transparent",
            boxShadow: isMobile ? "0 8px 32px rgba(0, 0, 0, 0.3)" : "none",
          }}
        >
          <Suspense
            fallback={
              <div
                style={{
                  width: isMobile ? "450px" : "500px",
                  height: isMobile ? "450px" : "500px",
                }}
              />
            }
          >
            {isPantsMode ? (
              <ImageFilterComponentForPants />
            ) : (
              <ImageFilterComponent />
            )}
          </Suspense>
        </Box>

        {/* Floating Elements disabled in PERF_MODE */}
        {!isMobile && !PERF_MODE && (
          <>
            <Box
              sx={{
                position: "absolute",
                top: "10%",
                right: "10%",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "rgba(192, 211, 202, 0.6)",
                animation: "float 3s ease-in-out infinite",
                "@keyframes float": {
                  "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
                  "50%": { transform: "translateY(-10px) rotate(180deg)" },
                },
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: "15%",
                left: "15%",
                width: "3px",
                height: "3px",
                borderRadius: "50%",
                background: "rgba(192, 211, 202, 0.4)",
                animation: "float 4s ease-in-out infinite reverse",
              }}
            />
          </>
        )}
      </Box>

      {/* Mobile: Additional subtle frame */}
      {isMobile && (
        <Box
          sx={{
            position: "absolute",
            top: "-8px",
            left: "-8px",
            right: "-8px",
            bottom: "-8px",
            border: "1px solid rgba(192, 211, 202, 0.1)",
            borderRadius: "24px",
            pointerEvents: "none",
          }}
        />
      )}
    </Box>
  );
};

export default memo(SuitPreview);

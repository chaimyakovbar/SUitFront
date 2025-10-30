import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useAtomValue } from "jotai";
import { currentIndexAtom } from "../../Utils";

// Step Components
import FabricSelection from "./steps/FabricSelection";
import SuitDesign from "./steps/SuitDesign";
import FinishingDetails from "./steps/FinishingDetails";

const stepComponents = {
  0: FabricSelection,
  1: SuitDesign,
  2: FinishingDetails,
};

const stepTitles = {
  0: "Choose Your Fabric",
  1: "Design Your Style",
  2: "Perfect the Details",
};

const CustomizationPanel = ({ isPantsMode, isMobile }) => {
  const currentStep = useAtomValue(currentIndexAtom);
  const CurrentStepComponent = stepComponents[currentStep];

  const containerVariants = {
    hidden: { opacity: 0, x: isMobile ? 0 : -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  // Mobile footer layout - no wrapper needed
  if (isMobile) {
    return (
      <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "relative",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              gap: "20px",
              overflowX: "auto",
              overflowY: "hidden",
            }}
          >
            {CurrentStepComponent && (
              <CurrentStepComponent
                isPantsMode={isPantsMode}
                isMobile={isMobile}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </Box>
    );
  }

  // Desktop layout - keep the existing Paper design
  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", lg: "400px" },
        position: "relative",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          background:
            "linear-gradient(135deg, rgba(20, 20, 20, 0.7) 0%, rgba(30, 30, 30, 0.5) 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(192, 211, 202, 0.15)",
          borderRadius: "24px",
          overflow: "hidden",
          position: "relative",
          height: "550px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          display: "flex",
          flexDirection: "column",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(192, 211, 202, 0.03) 0%, transparent 50%, rgba(192, 211, 202, 0.02) 100%)",
            pointerEvents: "none",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            padding: "24px 32px 20px",
            borderBottom: "1px solid rgba(192, 211, 202, 0.1)",
            background:
              "linear-gradient(135deg, rgba(192, 211, 202, 0.05) 0%, transparent 100%)",
            flexShrink: 0,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.75rem",
              fontWeight: 300,
              color: "#C0D3CA",
              textAlign: "center",
              letterSpacing: "0.02em",
              lineHeight: 1.2,
            }}
          >
            {stepTitles[currentStep]}
          </Typography>
        </Box>

        {/* Content Area */}
        <Box
          sx={{
            padding: "24px 32px",
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(192, 211, 202, 0.3)",
              borderRadius: "3px",
              "&:hover": {
                background: "rgba(192, 211, 202, 0.5)",
              },
            },
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ height: "100%" }}
            >
              {CurrentStepComponent && (
                <CurrentStepComponent
                  isPantsMode={isPantsMode}
                  isMobile={isMobile}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Paper>
    </Box>
  );
};

export default React.memo(CustomizationPanel);

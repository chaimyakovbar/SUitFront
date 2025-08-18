import React, { useState } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  currentIndexAtom,
  counterAtom,
  currentKindAtom,
  allSuitPartAtom,
  authUserAtom,
  currentColorAtom,
  selectedCollarAtom,
  selectedLapelTypeAtom,
  selectedPacketTypeAtom,
  selectedInsideTypeAtom,
  selectedButtonAtom,
  selectedPoshetAtom,
  selectedHolesButtonAtom,
  selectedHolesButtonUpAtom,
  priceAllSuitAtom,
  selectedPantsColorAtom,
  selectedPantsLinesAtom,
  selectedPantsHoleButtonAtom,
  selectedPantsHemAtom,
  selectedSleeveButtonsAtom,
  textInsideTextAtom,
  textInsideFontAtom,
  textInsideColorAtom,
  selectedKindTypeAtom,
  selectedTopCollarColorAtom,
} from "../../Utils";
import {
  createCompleteSuitObject,
  resetSuitState,
} from "../../utils/suitStateManager";
import { postSuitProduct } from "../../api/suit";

const steps = [
  {
    id: 0,
    title: "Fabric Selection",
    subtitle: "Choose your premium fabric",
    validate: "step1Validated",
    icon: "🎨",
  },
  {
    id: 1,
    title: "Suit Design",
    subtitle: "Select style & structure",
    validate: "step2Validated",
    icon: "✂️",
  },
  {
    id: 2,
    title: "Finishing Details",
    subtitle: "Perfect your personal touch",
    validate: "step3Validated",
    icon: "💎",
  },
  {
    id: 3,
    title: "Complete Suit",
    subtitle: "Finalize your creation",
    validate: "step3Validated", // Same as step 3 since it's the completion
    icon: "✨",
  },
];

const StepNavigator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [currentStep, setCurrentStep] = useAtom(currentIndexAtom);
  const counterArray = useAtomValue(counterAtom);
  const currentKind = useAtomValue(currentKindAtom);
  const [allSuitPart, setAllSuitPart] = useAtom(allSuitPartAtom);
  const user = useAtomValue(authUserAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // All state atoms for creating complete suit object
  const currColor = useAtomValue(currentColorAtom);
  const selectedKind = useAtomValue(currentKindAtom);
  const selectedCollar = useAtomValue(selectedCollarAtom);
  const selectedLapelType = useAtomValue(selectedLapelTypeAtom);
  const selectedPacketType = useAtomValue(selectedPacketTypeAtom);
  const selectedKindType = useAtomValue(selectedKindTypeAtom);
  const selectedButton = useAtomValue(selectedButtonAtom);
  const selectedPoshet = useAtomValue(selectedPoshetAtom);
  const selectedHolesButton = useAtomValue(selectedHolesButtonAtom);
  const selectedHolesButtonUp = useAtomValue(selectedHolesButtonUpAtom);
  const selectedInsideType = useAtomValue(selectedInsideTypeAtom);
  const selectedPantsColor = useAtomValue(selectedPantsColorAtom);
  const selectedPantsLines = useAtomValue(selectedPantsLinesAtom);
  const selectedPantsHoleButton = useAtomValue(selectedPantsHoleButtonAtom);
  const selectedPantsHem = useAtomValue(selectedPantsHemAtom);
  const selectedSleeveButtons = useAtomValue(selectedSleeveButtonsAtom);
  const textInsideText = useAtomValue(textInsideTextAtom);
  const textInsideFont = useAtomValue(textInsideFontAtom);
  const textInsideColor = useAtomValue(textInsideColorAtom);
  const priceAllSuit = useAtomValue(priceAllSuitAtom);
  const topCollarColor = useAtomValue(selectedTopCollarColorAtom);

  const isStepValid = (stepIndex) => {
    return counterArray[stepIndex]?.[steps[stepIndex].validate];
  };

  const isStepAccessible = (stepIndex) => {
    if (stepIndex === 0) return true;
    if (stepIndex === 3) return true; // Complete Suit step is always accessible when shown
    for (let i = 0; i < stepIndex; i++) {
      if (!isStepValid(i)) return false;
    }
    return true;
  };

  const handleStepClick = (stepIndex) => {
    if (stepIndex === 3) {
      // Complete Suit step - handle completion
      handleFinish();
    } else if (isStepAccessible(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  };

  const handleFinish = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Navigate to sizes page
      navigate("/indexSizes");

      // Create complete suit object
      const newSuit = createCompleteSuitObject({
        currentColor: currColor,
        selectedKind,
        selectedCollar,
        selectedLapelType,
        selectedPacketType,
        selectedKindType,
        selectedButton,
        selectedPoshet,
        selectedHolesButton,
        selectedHolesButtonUp,
        selectedInsideType,
        selectedPantsColor,
        selectedPantsLines,
        selectedPantsHoleButton,
        selectedPantsHem,
        selectedSleeveButtons,
        textInsideText,
        textInsideFont,
        textInsideColor,
        priceAllSuit,
        topCollarColor,
      });

      // Check for duplicates and save
      const currentSuits = [...allSuitPart];
      const isDuplicate = currentSuits.some(
        (suit) => JSON.stringify(suit) === JSON.stringify(newSuit)
      );

      if (!isDuplicate) {
        currentSuits.push(newSuit);
        setAllSuitPart(currentSuits);

        if (user) {
          await postSuitProduct({
            email: user.email,
            allSuitPart: newSuit,
          });
        }

        enqueueSnackbar("Your custom suit has been saved successfully!", {
          variant: "success",
        });
      } else {
        enqueueSnackbar("This suit configuration already exists!", {
          variant: "warning",
        });
      }
    } catch (error) {
      console.error("Error saving suit:", error);
      enqueueSnackbar("Error saving your suit configuration", {
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
  };

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        px: { xs: 2, md: 0 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, md: 2 },
          background: "rgba(30, 30, 30, 0.4)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(192, 211, 202, 0.15)",
          borderRadius: "24px",
          padding: { xs: "16px 20px", md: "20px 32px" },
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(192, 211, 202, 0.05) 0%, transparent 100%)",
            pointerEvents: "none",
          },
        }}
      >
        {steps.map((step, index) => {
          // Show "Complete Suit" step only when on the last step (step 2)
          if (index === 3 && currentStep !== 2) {
            return null;
          }

          const isActive = currentStep === index;
          const isCompleted = index === 3 ? false : isStepValid(index); // Complete Suit step is never "completed"
          const isAccessible = isStepAccessible(index);
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <Box
                component={motion.div}
                variants={stepVariants}
                onClick={() => handleStepClick(index)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1, md: 1.5 },
                  cursor: isAccessible ? "pointer" : "not-allowed",
                  opacity: isAccessible ? 1 : 0.4,
                  transition: "all 0.3s ease",
                  padding: { xs: "8px 12px", md: "12px 16px" },
                  borderRadius: "16px",
                  position: "relative",
                  "&:hover": isAccessible
                    ? {
                        background: "rgba(192, 211, 202, 0.1)",
                        transform: "translateY(-2px)",
                      }
                    : {},
                }}
              >
                {/* Step Icon/Number */}
                <Box
                  component={motion.div}
                  animate={
                    index === 3
                      ? {
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                          transition: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                        }
                      : {}
                  }
                  sx={{
                    width: { xs: 36, md: 44 },
                    height: { xs: 36, md: 44 },
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isActive
                      ? "linear-gradient(135deg, #C0D3CA 0%, #A8C3B8 100%)"
                      : isCompleted
                      ? "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"
                      : "rgba(60, 60, 60, 0.6)",
                    border: isActive
                      ? "2px solid rgba(192, 211, 202, 0.5)"
                      : "1px solid rgba(192, 211, 202, 0.2)",
                    color: isActive || isCompleted ? "#000" : "#C0D3CA",
                    fontSize: { xs: "14px", md: "16px" },
                    fontWeight: 600,
                    boxShadow: isActive
                      ? "0 4px 16px rgba(192, 211, 202, 0.4)"
                      : isCompleted
                      ? "0 4px 16px rgba(76, 175, 80, 0.3)"
                      : "none",
                    transition: "all 0.3s ease",
                    transform: isActive ? "scale(1.1)" : "scale(1)",
                    position: "relative",
                  }}
                >
                  {index === 3 && isSubmitting
                    ? "⏳"
                    : isCompleted && !isActive
                    ? "✓"
                    : isMobile
                    ? index + 1
                    : step.icon}
                </Box>

                {/* Step Text - Hide on very small screens */}
                {!isMobile && (
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: isActive ? "#C0D3CA" : "#fff",
                        lineHeight: 1.2,
                        mb: 0.5,
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        color: "rgba(192, 211, 202, 0.7)",
                        lineHeight: 1.1,
                      }}
                    >
                      {step.subtitle}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Connector Line */}
              {!isLast && (
                <Box
                  sx={{
                    width: { xs: 20, md: 40 },
                    height: "2px",
                    background: isCompleted
                      ? "linear-gradient(90deg, #4CAF50, #C0D3CA)"
                      : "rgba(192, 211, 202, 0.2)",
                    borderRadius: "1px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {isActive && (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        background:
                          "linear-gradient(90deg, transparent, #C0D3CA, transparent)",
                        animation: "pulse 2s ease-in-out infinite",
                        "@keyframes pulse": {
                          "0%, 100%": { opacity: 0.5 },
                          "50%": { opacity: 1 },
                        },
                      }}
                    />
                  )}
                </Box>
              )}
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
};

export default StepNavigator;

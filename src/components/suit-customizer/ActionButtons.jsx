import React, { useState } from "react";
import { Box, Button, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useLanguage } from "../../context/LanguageContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
  currentIndexAtom,
  counterAtom,
  currentKindAtom,
  allSuitPartAtom,
  authUserAtom,
  // ... import all other required atoms
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

const ActionButtons = ({ isMobile }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useLanguage();

  const steps = [
    { id: 0, label: t("fabric"), validate: "step1Validated" },
    { id: 1, label: t("design"), validate: "step2Validated" },
    { id: 2, label: t("details"), validate: "step3Validated" },
  ];

  const [currentStep, setCurrentStep] = useAtom(currentIndexAtom);
  const [counterArray] = useAtom(counterAtom);
  const currentKind = useAtomValue(currentKindAtom);
  const user = useAtomValue(authUserAtom);
  const [allSuitPart, setAllSuitPart] = useAtom(allSuitPartAtom);

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Setters for reset after save
  const [, setCurrColor] = useAtom(currentColorAtom);
  const [, setSelectedKind] = useAtom(currentKindAtom);
  const [, setSelectedCollar] = useAtom(selectedCollarAtom);
  const [, setSelectedLapelType] = useAtom(selectedLapelTypeAtom);
  const [, setSelectedPacketType] = useAtom(selectedPacketTypeAtom);
  const [, setSelectedKindType] = useAtom(selectedKindTypeAtom);
  const [, setSelectedButton] = useAtom(selectedButtonAtom);
  const [, setSelectedPoshet] = useAtom(selectedPoshetAtom);
  const [, setSelectedHolesButton] = useAtom(selectedHolesButtonAtom);
  const [, setSelectedHolesButtonUp] = useAtom(selectedHolesButtonUpAtom);
  const [, setSelectedInsideType] = useAtom(selectedInsideTypeAtom);
  const [, setSelectedPantsColor] = useAtom(selectedPantsColorAtom);
  const [, setSelectedPantsLines] = useAtom(selectedPantsLinesAtom);
  const [, setSelectedPantsHoleButton] = useAtom(selectedPantsHoleButtonAtom);
  const [, setSelectedPantsHem] = useAtom(selectedPantsHemAtom);
  const [, setSelectedSleeveButtons] = useAtom(selectedSleeveButtonsAtom);
  const [, setTextInsideText] = useAtom(textInsideTextAtom);
  const [, setTextInsideFont] = useAtom(textInsideFontAtom);
  const [, setTextInsideColor] = useAtom(textInsideColorAtom);

  const isStepValid = () => {
    if (currentStep === 1) return !!currentKind;
    return counterArray[currentStep]?.[steps[currentStep].validate];
  };

  const isLastStep = currentStep === steps.length - 1;
  const canGoNext = isStepValid() && !isLastStep;
  const canGoBack = currentStep > 0;
  // Allow completion immediately on last step - finishing details are optional
  const canFinish = isLastStep;
  const nextEnabled = isLastStep
    ? canFinish && !isSubmitting
    : isStepValid() && !isSubmitting;

  const handleNext = () => {
    if (canGoNext) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (canGoBack) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinish = async () => {
    if (!canFinish) return;

    setIsSubmitting(true);

    try {
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
          // Save to server BEFORE navigating to avoid unmount canceling the request on mobile
          await postSuitProduct({
            email: user.email,
            allSuitPart: newSuit,
          });
        }

        enqueueSnackbar(t("customSuitSavedSuccessfully"), {
          variant: "success",
        });
        // Reset all customization state to defaults after successful save
        resetSuitState({
          setCurrColor,
          setSelectedKind,
          setSelectedCollar,
          setSelectedLapelType,
          setSelectedPacketType,
          setSelectedButton,
          setSelectedPoshet,
          setSelectedHolesButton,
          setSelectedHolesButtonUp,
          setSelectedInsideType,
          setSelectedPantsColor,
          setSelectedPantsLines,
          setSelectedPantsHoleButton,
          setSelectedPantsHem,
          setSelectedSleeveButtons,
          setTextInsideText,
          setTextInsideFont,
          setTextInsideColor,
        });
        setCurrentStep(0);
        // Navigate only after successful save
        navigate("/indexSizes");
      } else {
        enqueueSnackbar(t("suitConfigurationExists"), {
          variant: "warning",
        });
        // For duplicates, still navigate to sizes for user flow consistency
        navigate("/indexSizes");
      }

      // Reset state (optional - uncomment if you want to reset after finish)
      // resetSuitState({ /* pass all setters */ });
      // setCurrentStep(0);
    } catch (error) {
      console.error("Error saving suit:", error);
      enqueueSnackbar(t("errorSavingSuitConfiguration"), {
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <Box
      component={motion.div}
      variants={buttonVariants}
      initial="hidden"
      animate="visible"
      sx={{
        display: "flex",
        gap: { xs: 2, md: 2.5 },
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Back Button */}
      <Button
        onClick={handleBack}
        disabled={!canGoBack}
        startIcon={<ArrowBackIcon />}
        component={motion.button}
        whileHover={canGoBack ? { scale: 1.02 } : {}}
        whileTap={canGoBack ? { scale: 0.98 } : {}}
        sx={{
          flex: 1,
          minHeight: { xs: 44, md: 48 },
          borderRadius: "12px",
          background: canGoBack
            ? "linear-gradient(135deg, rgba(100, 100, 100, 0.8) 0%, rgba(80, 80, 80, 0.9) 100%)"
            : "rgba(40, 40, 40, 0.6)",
          color: canGoBack ? "#C0D3CA" : "rgba(192, 211, 202, 0.3)",
          border: canGoBack
            ? "1px solid rgba(192, 211, 202, 0.3)"
            : "1px solid rgba(192, 211, 202, 0.1)",
          fontSize: { xs: "0.85rem", md: "0.9rem" },
          fontWeight: 500,
          textTransform: "none",
          letterSpacing: "0.02em",
          boxShadow: canGoBack ? "0 4px 16px rgba(0, 0, 0, 0.2)" : "none",
          transition: "all 0.3s ease",
          backdropFilter: "blur(10px)",
          "&:hover": canGoBack
            ? {
                background:
                  "linear-gradient(135deg, rgba(120, 120, 120, 0.9) 0%, rgba(100, 100, 100, 1) 100%)",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
                transform: "translateY(-1px)",
                border: "1px solid rgba(192, 211, 202, 0.5)",
              }
            : {},
          "&:disabled": {
            cursor: "not-allowed",
            opacity: 0.5,
          },
          "& .MuiButton-startIcon": {
            marginRight: "6px",
          },
        }}
      >
        {currentStep === 0 ? t("start") : t("back")}
      </Button>

      {/* Next/Finish Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.1,
          ease: "easeOut",
        }}
        style={{ willChange: "transform, opacity", width: "100%", flex: 1 }}
      >
        <Button
          onClick={isLastStep ? handleFinish : handleNext}
          disabled={isLastStep ? isSubmitting : !isStepValid() || isSubmitting}
          endIcon={isLastStep ? <CheckCircleIcon /> : <ArrowForwardIcon />}
          component={motion.button}
          animate={nextEnabled ? { scale: [1, 1.03, 1] } : {}}
          transition={
            nextEnabled
              ? { duration: 1.6, repeat: Infinity, repeatType: "reverse" }
              : {}
          }
          initial={isLastStep && !isSubmitting ? { opacity: 0, y: 10 } : {}}
          whileHover={
            isLastStep
              ? !isSubmitting
                ? { scale: 1.02 }
                : {}
              : isStepValid() && !isSubmitting
              ? { scale: 1.02 }
              : {}
          }
          whileTap={
            isLastStep
              ? !isSubmitting
                ? { scale: 0.98 }
                : {}
              : isStepValid() && !isSubmitting
              ? { scale: 0.98 }
              : {}
          }
          sx={{
            flex: 1,
            minHeight: { xs: 44, md: 48 },
            borderRadius: isLastStep ? "6px" : "12px",
            background: isLastStep
              ? !isSubmitting
                ? "linear-gradient(90deg, #C0D3CA, #A8C3B8, #C0D3CA)"
                : "rgba(40, 40, 40, 0.6)"
              : isStepValid() && !isSubmitting
              ? "linear-gradient(135deg, rgba(192, 211, 202, 0.9) 0%, rgba(168, 195, 184, 0.9) 100%)"
              : "rgba(40, 40, 40, 0.6)",
            backgroundSize:
              isLastStep && !isSubmitting ? "200% 100%" : "100% 100%",
            animation:
              isLastStep && !isSubmitting
                ? "gradientMove 2s linear infinite"
                : "none",
            "@keyframes gradientMove":
              isLastStep && !isSubmitting
                ? {
                    "0%": { backgroundPosition: "0% 50%" },
                    "100%": { backgroundPosition: "200% 50%" },
                  }
                : {},
            color: isLastStep
              ? !isSubmitting
                ? "#0a0a0a"
                : "rgba(192, 211, 202, 0.3)"
              : isStepValid() && !isSubmitting
              ? "#000"
              : "rgba(192, 211, 202, 0.3)",
            border: isLastStep
              ? !isSubmitting
                ? "none"
                : "1px solid rgba(192, 211, 202, 0.1)"
              : isStepValid() && !isSubmitting
              ? "1px solid rgba(192, 211, 202, 0.4)"
              : "1px solid rgba(192, 211, 202, 0.1)",
            fontSize: { xs: "0.85rem", md: isLastStep ? "1rem" : "0.9rem" },
            fontWeight: isLastStep ? 600 : 500,
            fontFamily: isLastStep ? "'Montserrat', sans-serif" : "inherit",
            textTransform: "none",
            letterSpacing: "0.02em",
            padding: isLastStep ? "14px 32px" : "auto",
            boxShadow: isLastStep
              ? !isSubmitting
                ? "0 10px 30px rgba(192, 211, 202, 0.35)"
                : "none"
              : isStepValid() && !isSubmitting
              ? "0 4px 16px rgba(192, 211, 202, 0.2)"
              : "none",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            backdropFilter: "blur(10px)",
            ...(nextEnabled
              ? {
                  boxShadow:
                    "0 0 0 0 rgba(192, 211, 202, 0.0), 0 10px 30px rgba(192, 211, 202, 0.35)",
                  animation: "glow 1.8s ease-in-out infinite",
                  "@keyframes glow": {
                    "0%": {
                      boxShadow:
                        "0 0 0 0 rgba(192, 211, 202, 0.0), 0 10px 30px rgba(192, 211, 202, 0.35)",
                    },
                    "50%": {
                      boxShadow:
                        "0 0 0 6px rgba(192, 211, 202, 0.18), 0 14px 40px rgba(192, 211, 202, 0.45)",
                    },
                    "100%": {
                      boxShadow:
                        "0 0 0 0 rgba(192, 211, 202, 0.0), 0 10px 30px rgba(192, 211, 202, 0.35)",
                    },
                  },
                }
              : {}),
            "&:hover": isLastStep
              ? !isSubmitting
                ? {
                    background:
                      "linear-gradient(135deg, #D0E3DA 0%, #C0D3CA 100%)",
                    boxShadow: "0 14px 40px rgba(192, 211, 202, 0.45)",
                    transform: "translateY(-1px)",
                    animationPlayState: "paused",
                  }
                : {}
              : isStepValid() && !isSubmitting
              ? {
                  background:
                    "linear-gradient(135deg, rgba(208, 227, 218, 0.95) 0%, rgba(184, 211, 200, 0.95) 100%)",
                  boxShadow: "0 6px 20px rgba(192, 211, 202, 0.3)",
                  transform: "translateY(-1px)",
                  border: "1px solid rgba(192, 211, 202, 0.6)",
                }
              : {},
            "&:disabled": {
              cursor: "not-allowed",
              opacity: 0.5,
            },
            "& .MuiButton-endIcon": {
              marginLeft: "6px",
            },
          }}
        >
          {isSubmitting
            ? t("saving")
            : isLastStep
            ? t("completeSuit")
            : t("nextStep")}
        </Button>
      </motion.div>
    </Box>
  );
};

export default ActionButtons;

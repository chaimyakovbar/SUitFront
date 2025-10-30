import React, { useCallback, useState } from "react";
import {
  Box,
  Container,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom, useSetAtom } from "jotai";
import { getDefaultStore } from "jotai";
import {
  currentIndexAtom,
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
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

// New components
import CustomizerHeader from "./CustomizerHeader";
import StepNavigator from "./StepNavigator";
import SuitPreview from "./SuitPreview";
import CustomizationPanel from "./CustomizationPanel";
import SuitToggle from "./SuitToggle";

const SuitCustomizer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentStep, setCurrentStep] = useAtom(currentIndexAtom);
  const [isPantsMode, setIsPantsMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Setters only (no subscription) for reset logic
  const setAllSuitPart = useSetAtom(allSuitPartAtom);
  const setCurrColor = useSetAtom(currentColorAtom);
  const setSelectedCollar = useSetAtom(selectedCollarAtom);
  const setSelectedLapelType = useSetAtom(selectedLapelTypeAtom);
  const setSelectedPacketType = useSetAtom(selectedPacketTypeAtom);
  const setSelectedButton = useSetAtom(selectedButtonAtom);
  const setSelectedPoshet = useSetAtom(selectedPoshetAtom);
  const setSelectedHolesButton = useSetAtom(selectedHolesButtonAtom);
  const setSelectedHolesButtonUp = useSetAtom(selectedHolesButtonUpAtom);
  const setSelectedInsideType = useSetAtom(selectedInsideTypeAtom);
  const setSelectedPantsColor = useSetAtom(selectedPantsColorAtom);
  const setSelectedPantsLines = useSetAtom(selectedPantsLinesAtom);
  const setSelectedPantsHoleButton = useSetAtom(selectedPantsHoleButtonAtom);
  const setSelectedPantsHem = useSetAtom(selectedPantsHemAtom);
  const setSelectedSleeveButtons = useSetAtom(selectedSleeveButtonsAtom);
  const setTextInsideText = useSetAtom(textInsideTextAtom);
  const setTextInsideFont = useSetAtom(textInsideFontAtom);
  const setTextInsideColor = useSetAtom(textInsideColorAtom);

  // Prevent scrolling on mobile
  // React.useEffect(() => {
  //   if (isMobile) {
  //     document.body.style.overflow = "hidden";
  //     document.documentElement.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "auto";
  //     document.documentElement.style.overflow = "auto";
  //   }

  //   // Cleanup on unmount
  //   return () => {
  //     document.body.style.overflow = "auto";
  //     document.documentElement.style.overflow = "auto";
  //   };
  // }, [isMobile]);

  const handleToggle = useCallback(() => {
    setIsPantsMode((prev) => !prev);
  }, []);

  const handleFinish = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const store = getDefaultStore();
      const newSuit = createCompleteSuitObject({
        currentColor: store.get(currentColorAtom),
        selectedKind: store.get(currentKindAtom),
        selectedCollar: store.get(selectedCollarAtom),
        selectedLapelType: store.get(selectedLapelTypeAtom),
        selectedPacketType: store.get(selectedPacketTypeAtom),
        selectedKindType: store.get(selectedKindTypeAtom),
        selectedButton: store.get(selectedButtonAtom),
        selectedPoshet: store.get(selectedPoshetAtom),
        selectedHolesButton: store.get(selectedHolesButtonAtom),
        selectedHolesButtonUp: store.get(selectedHolesButtonUpAtom),
        selectedInsideType: store.get(selectedInsideTypeAtom),
        selectedPantsColor: store.get(selectedPantsColorAtom),
        selectedPantsLines: store.get(selectedPantsLinesAtom),
        selectedPantsHoleButton: store.get(selectedPantsHoleButtonAtom),
        selectedPantsHem: store.get(selectedPantsHemAtom),
        selectedSleeveButtons: store.get(selectedSleeveButtonsAtom),
        textInsideText: store.get(textInsideTextAtom),
        textInsideFont: store.get(textInsideFontAtom),
        textInsideColor: store.get(textInsideColorAtom),
        priceAllSuit: store.get(priceAllSuitAtom),
        topCollarColor: store.get(selectedTopCollarColorAtom),
      });

      const currentSuits = [...store.get(allSuitPartAtom)];
      const isDuplicate = currentSuits.some(
        (suit) => JSON.stringify(suit) === JSON.stringify(newSuit)
      );

      if (!isDuplicate) {
        currentSuits.push(newSuit);
        setAllSuitPart(currentSuits);

        const user = store.get(authUserAtom);
        if (user?.email) {
          await postSuitProduct({
            email: user.email,
            allSuitPart: newSuit,
          });
        }
      }

      enqueueSnackbar(
        isDuplicate
          ? "This suit configuration already exists!"
          : "Your custom suit has been saved successfully!",
        { variant: isDuplicate ? "warning" : "success" }
      );

      // Reset all customization state to defaults after successful save
      resetSuitState({
        setCurrColor,
        setSelectedKind: (v) => setCurrentStep(0) || v, // step reset handled separately
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

      navigate("/indexSizes");
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
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        minHeight: "100vh",
        background: isMobile
          ? "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)"
          : "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 30%, #0f0f0f 70%, #0a0a0a 100%)",
        color: "#fff",
        position: "relative",
        overflow: { xs: "hidden", lg: "visible" },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(192, 211, 202, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(192, 211, 202, 0.03) 0%, transparent 50%)
          `,
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <Box
          component={motion.div}
          variants={headerVariants}
          sx={{ pt: { xs: 3, md: 5 }, pb: { xs: 2, md: 3 } }}
        >
          <CustomizerHeader />
        </Box>

        {/* Step Navigator - Hidden on mobile */}
        {!isMobile && (
          <Box sx={{ mb: { xs: 3, md: 4 } }}>
            <StepNavigator />
          </Box>
        )}

        {/* Main Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: { xs: 3, md: 2 }, // Reduced gap for desktop
            alignItems: { xs: "center", lg: "flex-start" },
            minHeight: { xs: "auto", lg: "70vh" },
            justifyContent: { lg: "center" }, // Center the content
            overflow: { xs: "hidden", lg: "visible" }, // Prevent scrolling on mobile
          }}
        >
          {/* Mobile Layout */}
          {isMobile ? (
            <Box
              sx={{
                width: "100%",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Numbers Navigation with Expandable Title */}
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                sx={{
                  position: "fixed",
                  top: 60,
                  left: 0,
                  right: 0,
                  display: "flex",
                  alignItems: "center",
                  background:
                    "linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(20, 20, 20, 0.98) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(192, 211, 202, 0.15)",
                  borderRadius: "20px",
                  mx: 1,
                  mt: 1,
                  mb: 1,
                  p: 2,
                  gap: 2,
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  flexShrink: 0,
                  zIndex: 1200, // חשוב כדי שיישב מעל אלמנטים אחרים
                }}
              >
                {/* Step Numbers */}
                <Box sx={{ display: "flex", gap: 1 }}>
                  {[0, 1, 2].map((step) => (
                    <Box
                      key={step}
                      onClick={() => setCurrentStep(step)}
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          currentStep === step
                            ? "linear-gradient(135deg, #C0D3CA 0%, #A8C3B8 100%)"
                            : "rgba(192, 211, 202, 0.1)",
                        color: currentStep === step ? "#000" : "#C0D3CA",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        border:
                          currentStep === step
                            ? "2px solid rgba(192, 211, 202, 0.5)"
                            : "1px solid rgba(192, 211, 202, 0.2)",
                        "&:hover": {
                          background:
                            currentStep === step
                              ? "linear-gradient(135deg, #C0D3CA 0%, #A8C3B8 100%)"
                              : "rgba(192, 211, 202, 0.2)",
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      {step + 1}
                    </Box>
                  ))}
                  {/* Complete Suit Step - Only show on last step */}
                  {currentStep === 2 && (
                    <Box
                      onClick={handleFinish}
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isSubmitting
                          ? "linear-gradient(135deg, rgba(192, 211, 202, 0.1) 0%, rgba(168, 195, 184, 0.1) 100%)"
                          : "linear-gradient(135deg, rgba(192, 211, 202, 0.2) 0%, rgba(168, 195, 184, 0.2) 100%)",
                        color: "#C0D3CA",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        cursor: isSubmitting ? "default" : "pointer",
                        transition: "all 0.3s ease",
                        border: "2px solid rgba(192, 211, 202, 0.3)",
                        opacity: isSubmitting ? 0.6 : 1,
                        "&:hover": isSubmitting
                          ? {}
                          : {
                              background:
                                "linear-gradient(135deg, rgba(192, 211, 202, 0.3) 0%, rgba(168, 195, 184, 0.3) 100%)",
                              transform: "scale(1.05)",
                            },
                      }}
                    >
                      {isSubmitting ? "⏳" : "✨"}
                    </Box>
                  )}
                </Box>

                {/* Expandable Title */}
                <Box sx={{ flex: 1, overflow: "hidden", minWidth: 0 }}>
                  <Typography
                    component={motion.div}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={currentStep}
                    sx={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: currentStep === 2 ? "0.9rem" : "1rem",
                      fontWeight: 400,
                      color: "#C0D3CA",
                      letterSpacing: "0.5px",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >
                    {currentStep === 0
                      ? "Choose Fabric"
                      : currentStep === 1
                      ? "Design Style"
                      : "Perfect Details"}
                  </Typography>
                </Box>
              </Box>

              {/* Suit Preview - Smaller Size */}
              <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: 2,
                  py: 1, // Minimal padding
                  pb: 10, // Add bottom padding for floating footer
                  position: "relative",
                  minHeight: "300px", // Fixed height instead of flex
                }}
              >
                {/* Suit/Pants Toggle for customization step */}
                {currentStep === 2 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 96,
                      right: 16,
                      zIndex: 10,
                    }}
                  >
                    <SuitToggle
                      isPantsMode={isPantsMode}
                      onToggle={handleToggle}
                      mobile={true}
                    />
                  </Box>
                )}

                <Box sx={{ transform: "scale(0.8)" }}>
                  <SuitPreview isPantsMode={isPantsMode} isMobile={true} />
                </Box>
              </Box>

              {/* Floating Horizontal Scrollable Options Footer */}
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                sx={{
                  position: "fixed",
                  bottom: 16,
                  left: 16,
                  right: 16,
                  zIndex: 1000,
                  background:
                    "linear-gradient(135deg, rgba(20, 20, 20, 0.85) 0%, rgba(30, 30, 30, 0.9) 100%)",
                  backdropFilter: "blur(15px)",
                  border: "1px solid rgba(192, 211, 202, 0.12)",
                  borderRadius: "16px",
                  p: 1.5,
                  height: "160px",
                  overflow: "hidden",
                  boxShadow:
                    "0 4px 20px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(192, 211, 202, 0.1)",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "linear-gradient(135deg, rgba(192, 211, 202, 0.02) 0%, transparent 50%, rgba(192, 211, 202, 0.01) 100%)",
                    pointerEvents: "none",
                    borderRadius: "16px",
                  },
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    overflowX: "auto",
                    overflowY: "hidden",
                    position: "relative",
                    zIndex: 1,
                    "&::-webkit-scrollbar": {
                      height: "6px",
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
                  <CustomizationPanel
                    isPantsMode={isPantsMode}
                    isMobile={true}
                  />
                </Box>
              </Box>
            </Box>
          ) : (
            // Desktop Layout
            <>
              {/* Left: Customization Panel */}
              <Box
                sx={{
                  flex: "0 0 400px", // Slightly wider panel
                  position: "relative",
                }}
              >
                <CustomizationPanel
                  isPantsMode={isPantsMode}
                  isMobile={false}
                />
              </Box>

              {/* Center: Suit Preview */}
              <Box
                sx={{
                  flex: "0 0 auto", // Don't expand, just fit content
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  minWidth: "500px", // Ensure minimum width for suit preview
                }}
              >
                {/* Suit/Pants Toggle for customization step */}
                {currentStep === 2 && (
                  <SuitToggle
                    isPantsMode={isPantsMode}
                    onToggle={handleToggle}
                    mobile={false}
                  />
                )}

                <SuitPreview isPantsMode={isPantsMode} isMobile={false} />
              </Box>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default SuitCustomizer;

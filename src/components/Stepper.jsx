import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Box, 
  Step, 
  Button, 
  Stepper, 
  StepButton, 
  Typography, 
  Dialog, 
  Paper, 
  Stack,
  Container,
  IconButton,
  CircularProgress
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useAtom, useAtomValue } from "jotai";
import {
  counterAtom,
  currentIndexAtom,
  currentKindAtom,
  allSuitPartAtom,
  userAtom,
  openUserDialog,
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
} from "../Utils";
import ExplainDialog from "./ExplainDialog";
import { useSnackbar } from "notistack";
import HaveUser from "./HaveUser";
import { useNavigate } from "react-router-dom";
import UserLogin from "../User/UserLogin";
import UserSignUp from "../User/UserSignUp";
import { postSuitProduct } from "../api/suit";
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const steps = [
  {
    label: "Color Selection",
    validate: "step1Validated",
    explanation: "Choose the color of your custom suit from our premium fabric selection.",
  },
  {
    label: "Style Design",
    validate: "step2Validated",
    explanation: "Select your preferred suit style and customize design elements.",
  },
  {
    label: "Measurements",
    validate: "step3Validated",
    explanation: "Provide your measurements for a perfect fit tailored to your body.",
  },
];

const useStyles = makeStyles({
  root: {
    backgroundColor: "#0a0a0a",
    color: "#fff",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    position: "relative",
    padding: "0",
  },
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  stepper: {
    backgroundColor: "transparent !important",
    padding: "15px 0 !important",
    flexShrink: 0, // Prevent stepper from shrinking
  },
  contentArea: {
    flex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  suitPartContainer: {
    flex: 1,
    overflow: "auto",
    padding: "0 5px",
    marginBottom: "10px",
    // Custom scrollbar styling
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderRadius: "3px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(192, 211, 202, 0.3)",
      borderRadius: "3px",
      "&:hover": {
        backgroundColor: "rgba(192, 211, 202, 0.5)",
      }
    },
  },
  controls: {
    paddingTop: "10px",
    borderTop: "1px solid rgba(192, 211, 202, 0.1)",
    flexShrink: 0, // Prevent controls from shrinking
  },
  step: {
    "& .MuiStepLabel-label": {
      color: "#a0a0a0 !important",
      fontFamily: "'Montserrat', sans-serif !important",
      fontSize: "0.85rem !important",
      letterSpacing: "0.1em !important",
      "&.Mui-active": {
        color: "#C0D3CA !important",
      },
      "&.Mui-completed": {
        color: "#C0D3CA !important",
      },
    },
  },
  stepIcon: {
    color: "#C0D3CA !important",
  },
  stepConnector: {
    "& .MuiStepConnector-line": {
      borderColor: "rgba(192, 211, 202, 0.3) !important",
    },
  },
  button: {
    backgroundColor: "transparent !important",
    color: "#C0D3CA !important",
    border: "1px solid #C0D3CA !important",
    padding: "8px 20px !important",
    borderRadius: "0 !important",
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.85rem !important",
    letterSpacing: "0.1em !important",
    transition: "all 0.3s ease !important",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.1) !important",
      transform: "translateY(-2px) !important",
    },
    "&.Mui-disabled": {
      color: "#505050 !important",
      borderColor: "#505050 !important",
    },
  },
  buttonPrimary: {
    backgroundColor: "#C0D3CA !important",
    color: "#0a0a0a !important",
    border: "1px solid #C0D3CA !important",
    padding: "8px 20px !important",
    borderRadius: "0 !important",
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.85rem !important",
    letterSpacing: "0.1em !important",
    transition: "all 0.3s ease !important",
    "&:hover": {
      backgroundColor: "#a9c0b3 !important",
      transform: "translateY(-2px) !important",
    },
  },
  dialogPaper: {
    backgroundColor: "#0a0a0a !important",
    color: "#fff !important",
    borderRadius: "4px !important",
    padding: "24px !important",
    border: "1px solid rgba(192, 211, 202, 0.2) !important",
  },
  dialogTitle: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "1.8rem !important",
    fontWeight: "300 !important",
    marginBottom: "1rem !important",
    color: "#C0D3CA !important",
  },
  dialogContent: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    lineHeight: "1.6 !important",
    marginBottom: "1.5rem !important",
    color: "#e0e0e0 !important",
  },
  confirmationDialog: {
    position: "relative",
    padding: "30px 20px 20px !important",
  },
  errorMessage: {
    color: "#f44336 !important",
    fontSize: "0.85rem !important",
    marginTop: "8px !important",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  validationIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginTop: "10px",
    color: "#C0D3CA",
    fontSize: "0.8rem !important",
  },
  completedContainer: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }
});

const StyledStepper = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useAtom(currentIndexAtom);
  const [completed, setCompleted] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [dialogType, setDialogType] = useState(null);
  const [user] = useAtom(userAtom);
  const [_, setOpenUserDialog] = useAtom(openUserDialog);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [priceAllSuit] = useAtom(priceAllSuitAtom);
  const [allSuitPart] = useAtom(allSuitPartAtom);
  const [currentKind] = useAtom(currentKindAtom);
  const [currentColor] = useAtom(currentColorAtom);
  const [selectedCollar] = useAtom(selectedCollarAtom);
  const [selectedLapelType] = useAtom(selectedLapelTypeAtom);
  const [selectedPacketType] = useAtom(selectedPacketTypeAtom);
  const [selectedInsideType] = useAtom(selectedInsideTypeAtom);
  const [selectedButton] = useAtom(selectedButtonAtom);
  const [selectedPoshet] = useAtom(selectedPoshetAtom);
  const [selectedHolesButton] = useAtom(selectedHolesButtonAtom);
  const [selectedHolesButtonUp] = useAtom(selectedHolesButtonUpAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [counterArray] = useAtom(counterAtom);

  // Check if the current step is validated
  const isCurrentStepValidated = useCallback(() => {
    if (activeStep === 0) {
      return currentColor && currentKind && counterArray[0]?.step1Validated;
    } else if (activeStep === 1) {
      return selectedCollar && selectedLapelType && selectedPacketType;
    } else if (activeStep === 2) {
      return selectedInsideType && selectedButton && selectedHolesButton && selectedHolesButtonUp;
    }
    return false;
  }, [
    activeStep, 
    counterArray, 
    currentColor, 
    currentKind, 
    selectedCollar, 
    selectedLapelType, 
    selectedPacketType,
    selectedInsideType,
    selectedButton, 
    selectedHolesButton, 
    selectedHolesButtonUp
  ]);

  // Update completed steps when validation changes
  useEffect(() => {
    if (isCurrentStepValidated()) {
      const newCompleted = { ...completed };
      newCompleted[activeStep] = true;
      setCompleted(newCompleted);
    }
  }, [
    isCurrentStepValidated, 
    activeStep, 
    completed,
    currentColor, 
    currentKind,
    selectedCollar, 
    selectedLapelType, 
    selectedPacketType,
    selectedInsideType,
    selectedButton,
    selectedHolesButton,
    selectedHolesButtonUp
  ]);

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    if (!isCurrentStepValidated()) {
      setErrorMessage(`Please complete all selections in the "${steps[activeStep].label}" step`);
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }
    
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    
    setActiveStep(newActiveStep);
    setErrorMessage("");
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setErrorMessage("");
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
    setErrorMessage("");
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
    setErrorMessage("");
  };

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpenUserDialog(true);
  };

  const handleExplainDialog = (content) => {
    setDialogContent(content);
    setOpenDialog(true);
  };

  const handleConfirmSubmit = () => {
    setConfirmDialogOpen(true);
  };

  const handleCancelSubmit = () => {
    setConfirmDialogOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Validate all required fields are present
      if (!currentKind || !currentColor || !selectedCollar || !selectedLapelType || 
          !selectedPacketType || !selectedInsideType || !selectedButton || 
          !selectedHolesButton || !selectedHolesButtonUp) {
        throw new Error("Missing required suit configuration details");
      }
      
      const response = await postSuitProduct({
        totalPrice: priceAllSuit,
        kind: currentKind,
        color: currentColor,
        collar: selectedCollar,
        lapel: selectedLapelType,
        packet: selectedPacketType,
        inside: selectedInsideType,
        button: selectedButton,
        poshet: selectedPoshet,
        holesButton: selectedHolesButton,
        holesButtonUp: selectedHolesButtonUp,
      });

      if (response.status === 201) {
        enqueueSnackbar("Your custom suit has been created successfully!", { 
          variant: "success",
          autoHideDuration: 5000
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating suit:", error);
      enqueueSnackbar(error.message || "Error creating suit. Please try again.", { 
        variant: "error",
        autoHideDuration: 5000
      });
    } finally {
      setIsSubmitting(false);
      setConfirmDialogOpen(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className={classes.root}
    >
      <Container maxWidth="lg" className={classes.container}>
        <Stepper 
          nonLinear 
          activeStep={activeStep} 
          className={classes.stepper}
          alternativeLabel
        >
          {steps.map((step, index) => (
            <Step key={step.label} completed={completed[index]} className={classes.step}>
              <StepButton 
                onClick={handleStep(index)}
                icon={completed[index] ? 
                  <CheckCircleIcon className={classes.stepIcon} fontSize="small" /> : 
                  <RadioButtonUncheckedIcon className={classes.stepIcon} fontSize="small" />
                }
              >
                {step.label}
              </StepButton>
            </Step>
          ))}
        </Stepper>

        <Box className={classes.contentArea}>
          {allStepsCompleted() ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={classes.completedContainer}
            >
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  backgroundColor: 'rgba(30, 30, 30, 0.6)',
                  border: '1px solid rgba(192, 211, 202, 0.2)',
                  borderRadius: '4px',
                  textAlign: 'center',
                  maxWidth: '500px'
                }}
              >
                <Typography 
                  sx={{ 
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.8rem",
                    fontWeight: 300,
                    color: "#C0D3CA",
                    mb: 2
                  }}
                >
                  All steps completed
                </Typography>
                <Typography 
                  sx={{ 
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.95rem",
                    color: "#e0e0e0",
                    mb: 3
                  }}
                >
                  Your custom suit has been designed. Would you like to place your order?
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Button onClick={handleReset} className={classes.button}>
                    Reset
                  </Button>
                  <Button onClick={handleConfirmSubmit} className={classes.buttonPrimary}
                    disabled={isSubmitting}>
                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Place Order"}
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          ) : (
            <>
              <Box className={classes.suitPartContainer}>
                {activeStep === 0 && allSuitPart}
                {activeStep === 1 && allSuitPart}
                {activeStep === 2 && (
                  user ? allSuitPart : <HaveUser />
                )}

                {errorMessage && (
                  <Box 
                    sx={{ 
                      backgroundColor: 'rgba(244, 67, 54, 0.1)', 
                      border: '1px solid rgba(244, 67, 54, 0.3)', 
                      borderRadius: '4px', 
                      p: 1.5, 
                      mt: 1 
                    }}
                  >
                    <Typography className={classes.errorMessage}>
                      <ErrorOutlineIcon fontSize="small" />
                      {errorMessage}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box className={classes.controls}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                    size="small"
                  >
                    Back
                  </Button>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      onClick={() => handleExplainDialog(steps[activeStep].explanation)}
                      className={classes.button}
                      size="small"
                    >
                      Info
                    </Button>
                    <Button
                      onClick={handleNext}
                      className={classes.buttonPrimary}
                      size="small"
                    >
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </Box>
                </Box>

                <Box className={classes.validationIndicator}>
                  {isCurrentStepValidated() ? (
                    <>
                      <CheckCircleIcon fontSize="small" />
                      <Typography variant="body2">{steps[activeStep].label} complete</Typography>
                    </>
                  ) : (
                    <>
                      <RadioButtonUncheckedIcon fontSize="small" />
                      <Typography variant="body2">Please complete all selections</Typography>
                    </>
                  )}
                </Box>
              </Box>
            </>
          )}
        </Box>

        {/* Information Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          PaperProps={{ className: classes.dialogPaper }}
        >
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography className={classes.dialogTitle}>
                Step Information
              </Typography>
              
              <IconButton onClick={() => setOpenDialog(false)} sx={{ color: "#C0D3CA" }}>
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Typography className={classes.dialogContent}>
              {dialogContent}
            </Typography>
            
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={() => setOpenDialog(false)} className={classes.button}>
                I Understand
              </Button>
            </Box>
          </Box>
        </Dialog>

        {/* Login/Signup Dialog */}
        <Dialog
          open={dialogType !== null}
          onClose={() => setDialogType(null)}
          PaperProps={{ className: classes.dialogPaper }}
        >
          <Box p={3}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography className={classes.dialogTitle}>
                {dialogType === "login" ? "Sign In" : "Create Account"}
              </Typography>
              
              <IconButton onClick={() => setDialogType(null)} sx={{ color: "#C0D3CA" }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {dialogType === "login" && (
              <UserLogin setDialogType={setDialogType} />
            )}
            {dialogType === "signup" && (
              <UserSignUp setDialogType={setDialogType} />
            )}
          </Box>
        </Dialog>

        {/* Order Confirmation Dialog */}
        <Dialog
          open={confirmDialogOpen}
          onClose={handleCancelSubmit}
          PaperProps={{ className: classes.dialogPaper }}
        >
          <Box className={classes.confirmationDialog}>
            <Typography className={classes.dialogTitle}>
              Confirm Your Order
            </Typography>
            
            <Typography className={classes.dialogContent}>
              You're about to place an order for your custom suit with a total price of ${priceAllSuit}.
              Would you like to proceed with this order?
            </Typography>
            
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
              <Button 
                onClick={handleCancelSubmit} 
                className={classes.button}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                className={classes.buttonPrimary}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Confirm Order"
                )}
              </Button>
            </Box>
          </Box>
        </Dialog>
      </Container>
    </motion.div>
  );
};

export default StyledStepper;

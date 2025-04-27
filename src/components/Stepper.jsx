import React, { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";

import Button from "@mui/material/Button";
import Stepper from "@mui/material/Stepper";
import { useAtom, useAtomValue } from "jotai";
import StepButton from "@mui/material/StepButton";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import { Paper, Stack } from "@mui/material";
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

const steps = [
  {
    label: "בחירת הצבע",
    validate: "step1Validated",
    explanation: "כאן באפשרותיך לבחור את צבע החליפה שברצונך לייצר ",
  },
  {
    label: "עיצוב החליפה",
    validate: "step2Validated",
    explanation: "בחר סוג חליפה ועיצוב שנראה לך חובה לבחור ״סוג חליפה״",
  },
  {
    label: "טאץ אישי",
    validate: "step3Validated",
    explanation: "בחר את הטאץ המיוחד שלך ",
  },
];

const StyledStepper = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  // const isMobile = useMediaQuery("(max-width:600px)");
  // const allSuitPart = useAtomValue(allSuitPartAtom);
  const user = useAtomValue(userAtom);
  const [counterArray] = useAtom(counterAtom);
  const [activeStep, setActiveStep] = useAtom(currentIndexAtom);
  // const [completed, setCompleted] = React.useState({});
  const [currentKind] = useAtom(currentKindAtom);
  const [allSuitPart, setAllSuitPart] = useAtom(allSuitPartAtom);
  const [open, setOpen] = useAtom(openUserDialog);
  const [dialogType, setDialogType] = useState(null);
  const previousConfigRef = useRef(null);

  const [currColor, setCurrColor] = useAtom(currentColorAtom);
  const priceAllSuit = useAtomValue(priceAllSuitAtom);
  const [selectedKind, setSelectedKind] = useAtom(currentKindAtom);
  const [selectedCollar, setSelectedCollar] = useAtom(selectedCollarAtom);
  const [selectedButton, setSelectedButton] = useAtom(selectedButtonAtom);
  const [selectedPoshet, setSelectedPoshet] = useAtom(selectedPoshetAtom);
  const [selectedLapelType, setSelectedLapelType] = useAtom(
    selectedLapelTypeAtom
  );
  const [selectedPacketType, setSelectedPacketType] = useAtom(
    selectedPacketTypeAtom
  );
  const [selectedInsideType, setSelectedInsideType] = useAtom(
    selectedInsideTypeAtom
  );
  const [selectedHolesButton, setSelectedHolesButton] = useAtom(
    selectedHolesButtonAtom
  );
  const [selectedHolesButtonUp, setSelectedHolesButtonUp] = useAtom(
    selectedHolesButtonUpAtom
  );

  const insideColor = selectedInsideType || currColor;
  const holeButtonColor = selectedHolesButton;
  const holeButtonUpColor = selectedHolesButtonUp;
  const buttonColor = selectedButton;
  const poshetColor = selectedPoshet;

  let totalSteps = steps.length;
  const isLastStep = activeStep === totalSteps - 1;
  const isStepValid =
    activeStep === 1
      ? !!currentKind
      : counterArray[activeStep]?.[steps[activeStep].validate];

  // useEffect(() => {
  //   setDialogContent(steps[activeStep].explanation);
  //   setOpenDialog(true);
  // }, [activeStep]);

  const handleNext = () => {
    if (!isStepValid) return;
    // setCompleted((prev) => ({ ...prev, [activeStep]: true }));
    if (!isLastStep) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  const bottomPart =
    selectedKind === "kind3" || selectedKind === "kind4"
      ? "bottomKind3"
      : "bottom";

  const handleSubmitSuit = async () => {
    const newSuit = {
      kind: selectedKind || null,
      colar: currColor,
      sleeves: currColor,
      insideUp: currColor,
      packetUp: currColor,
      bottomPart: bottomPart,
      color: currColor || null,
      lapelType: selectedLapelType || null,
      lapelKind: selectedCollar || null,
      packetType: selectedPacketType || null,
      totalPrice: priceAllSuit,
      buttonColor: buttonColor || null,
      insideColor: insideColor || currColor || null,
      poshetColor: poshetColor || null,
      holeButtonColor: holeButtonColor || null,
      holeButtonUpColor: holeButtonUpColor || null,
    };

    try {
      if (user) {
        // Create a deep copy of the current suits
        const currentSuits = [...allSuitPart];

        // Check if this exact suit configuration already exists
        const isDuplicate = currentSuits.some((suit) => {
          return JSON.stringify(suit) === JSON.stringify(newSuit);
        });

        if (!isDuplicate) {
          // Add the new suit to the array
          currentSuits.push(newSuit);

          // Update state and save to backend
          setAllSuitPart(currentSuits);
          await postSuitProduct({
            email: user.email,
            allSuitPart: newSuit,
          });

          // Reset all stepper states
          setSelectedButton(null);
          setSelectedPoshet(null);
          setSelectedLapelType("Standard");
          setSelectedPacketType("packet1");
          setSelectedInsideType(null);
          setSelectedHolesButton(null);
          setSelectedHolesButtonUp(null);
          setCurrColor("blackGrey");
          setSelectedKind("kind1");
          setSelectedCollar("collarTight");
          setActiveStep(0);
          // setCompleted({});
          previousConfigRef.current = null;

          navigate("/indexSizes");
          enqueueSnackbar("החליפה נשמרה בהצלחה!", { variant: "success" });
        } else {
          enqueueSnackbar("חליפה זהה כבר קיימת!", { variant: "warning" });
        }
      } else {
        setOpen(true);
      }
    } catch (error) {
      console.error("שגיאה בשליחת הנתונים:", error);
      enqueueSnackbar("שגיאה בשמירת המידות.", { variant: "error" });
    }
  };

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpen(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        // backgroundColor: "#F5F5F7",
        // width: isMobile ? "77%" :"100%",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{
            color: "white",
            border: "2px solid black",
            backgroundColor: "#FF6D00",
            fontSize: "16px",
            fontWeight: "bold",
            px: 4,
            py: 1.5,
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#E65100",
              transform: "scale(1.05)",
              boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
            },
            "&:disabled": {
              backgroundColor: "#121212",
              color: "#9E9E9E",
              border: "2px solid #C0D3CA !important",
              cursor: "not-allowed",
            },
          }}
        >
          חזור
        </Button>

        {isLastStep ? (
          <Button
            onClick={handleSubmitSuit}
            sx={{
              color: "white",
              backgroundColor: "#388E3C",
              fontSize: "16px",
              fontWeight: "bold",
              px: 4,
              py: 1.5,
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#388E3C",
                transform: "scale(1.05)",
                boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
              },
            }}
          >
            סיים
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!isStepValid}
            sx={{
              color: "white",
              backgroundColor: "#E65100",
              border: "2px solid #C0D3CA !important",
              fontSize: "16px",
              fontWeight: "bold",
              px: 4,
              py: 1.5,
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#E65100",
                transform: "scale(1.05)",
                boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
              },
              "&:disabled": {
                backgroundColor: "#121212",
                color: "#9E9E9E",
                border: "2px solid #BDBDBD",
                cursor: "not-allowed",
              },
            }}
          >
            הבא
          </Button>
        )}
      </Box>
      {/* 
      <Paper
        elevation={6}
        sx={{
          padding: 3,
          maxWidth: 800,
          width: isMobile ? "87%" : "100%",
          borderRadius: 4,
          backgroundColor: "#ffffff",
        }}
      >
        <Stepper
          nonLinear
          activeStep={activeStep}
          sx={{ width: isMobile ? "100%" : "100%" }}
        >
          {steps.map((step, index) => (
            <Step key={step.label} completed={completed[index]}>
              <StepButton color="inherit" onClick={() => setActiveStep(index)}>
                {step.label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </Paper> */}

      <Dialog
        style={{ borderRadius: 8 }}
        open={open}
        onClose={() => setOpen(false)}
      >
        <div
          style={{
            padding: 4,
            maxWidth: 500,
            width: "358px",
            height: "120px",
            borderRadius: "10%",
            textAlign: "center",
            marginTop: "20px",
            backgroundColor: "#ffffff",
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            אנא התחבר או הירשם
          </Typography>
          <div style={{ fontSize: "10px" }}>
            החלק הבא זה מדידות וכדי שלא יאבדו המידות וכל המאמץ ילכו לפח אנא ירשם
            כדי שנמור לך על המידה
          </div>

          <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenDialog("login")}
            >
              היכנס
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleOpenDialog("signup")}
            >
              הירשם
            </Button>
          </Stack>

          {dialogType === "login" && (
            <UserLogin setDialogType={setDialogType} />
          )}
          {dialogType === "signup" && (
            <UserSignUp setDialogType={setDialogType} />
          )}
        </div>
      </Dialog>

      {/* <ExplainDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        content={dialogContent}
      /> */}
    </Box>
  );
};

export default StyledStepper;

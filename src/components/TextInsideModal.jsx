import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { useSnackbar } from "notistack";
import { useLanguage } from "../context/LanguageContext";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  textInsideTextAtom,
  textInsideFontAtom,
  textInsideColorAtom,
  showTextInsideAtom,
} from "../Utils";

import textInside from "../assets/icons/suit/suitAdd/textInside.webp";

const TextInsideModal = () => {
  const { t } = useLanguage();
  const { enqueueSnackbar } = useSnackbar();
  const [showTextInside, setShowTextInside] = useAtom(showTextInsideAtom);
  const [textInsideText, setTextInsideText] = useAtom(textInsideTextAtom);
  const [textInsideFont, setTextInsideFont] = useAtom(textInsideFontAtom);
  const [textInsideColor, setTextInsideColor] = useAtom(textInsideColorAtom);

  const [tempText, setTempText] = useState(textInsideText);
  const [tempColor, setTempColor] = useState(textInsideColor);
  const [tempFont, setTempFont] = useState(textInsideFont === "script" ? "script" : "straight");

  React.useEffect(() => {
    if (showTextInside) {
      setTempText(textInsideText);
      setTempColor(textInsideColor);
      setTempFont(textInsideFont === "script" ? "script" : "straight");
    }
  }, [showTextInside, textInsideText, textInsideColor, textInsideFont]);

  const colorOptions = [
    { hex: "#ffffff", label: t("white") || "White" },
    { hex: "#d4af37", label: t("gold") || "Gold" },
    { hex: "#c0c0c0", label: t("silver") || "Silver" },
    { hex: "#000000", label: t("black") || "Black" },
    { hex: "#1a237e", label: t("blue") || "Blue" },
    { hex: "#7b0d1e", label: t("burgundy") || "Burgundy" },
    { hex: "#2e7d32", label: t("green") || "Green" },
    { hex: "#e91e63", label: t("pink") || "Pink" },
  ];

  const handleClose = () => setShowTextInside(false);

  const handleSave = async () => {
    try {
      setTextInsideText(tempText);
      setTextInsideColor(tempColor);
      setTextInsideFont(tempFont);
      setShowTextInside(false);
      enqueueSnackbar(t("textSavedSuccessfully"), {
        variant: "success",
        autoHideDuration: 4000,
      });
    } catch (error) {
      console.error("Error updating text inside settings:", error);
      enqueueSnackbar(t("errorUpdatingTextSettings"), {
        variant: "error",
        autoHideDuration: 4000,
      });
    }
  };

  const handleCancel = () => {
    setTempText(textInsideText);
    setTempColor(textInsideColor);
    setTempFont(textInsideFont === "script" ? "script" : "straight");
    setShowTextInside(false);
  };

  const isScript = tempFont === "script";

  return (
    <Dialog
      open={showTextInside}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background:
            "linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(20, 20, 20, 0.98) 100%)",
          backdropFilter: "blur(20px)",
          color: "white",
          borderRadius: "20px",
          border: "1px solid rgba(192, 211, 202, 0.15)",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
          overflow: "hidden",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background: `
              radial-gradient(circle at 20% 20%, rgba(192, 211, 202, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(192, 211, 202, 0.02) 0%, transparent 50%)
            `,
            pointerEvents: "none",
          },
        },
      }}
    >
      <Box
        sx={{
          p: { xs: 2.5, md: 3 },
          pb: 2,
          background: "linear-gradient(135deg, rgba(192, 211, 202, 0.05) 0%, rgba(192, 211, 202, 0.02) 100%)",
          borderBottom: "1px solid rgba(192, 211, 202, 0.1)",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0, left: "10%", right: "10%",
            height: "1px",
            background: "linear-gradient(90deg, transparent 0%, rgba(192, 211, 202, 0.3) 50%, transparent 100%)",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: { xs: "1.4rem", md: "1.6rem" },
                fontWeight: 400,
                color: "#C0D3CA",
                letterSpacing: "0.5px",
                mb: 0.5,
              }}
            >
              {t("addTextInside")}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(192, 211, 202, 0.7)", fontSize: "0.85rem", fontWeight: 300, letterSpacing: "0.3px" }}
            >
              {t("personalizeSuitWithCustomText")}
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
            component={motion.button}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            sx={{
              color: "#C0D3CA",
              background: "rgba(192, 211, 202, 0.1)",
              border: "1px solid rgba(192, 211, 202, 0.2)",
              width: 40, height: 40,
              transition: "all 0.3s ease",
              "&:hover": {
                background: "rgba(192, 211, 202, 0.2)",
                border: "1px solid rgba(192, 211, 202, 0.4)",
                boxShadow: "0 4px 16px rgba(192, 211, 202, 0.2)",
              },
            }}
          >
            <CloseIcon sx={{ fontSize: "1.2rem" }} />
          </IconButton>
        </Box>
      </Box>

      <DialogContent sx={{ p: { xs: 2, md: 2.5 }, pt: 1, flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          sx={{ display: "flex", flexDirection: "column", gap: 2.5, alignItems: "center" }}
        >
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: "350px",
              height: "200px",
              border: "2px solid rgba(192, 211, 202, 0.2)",
              borderRadius: "16px",
              overflow: "hidden",
              background: "linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(10px)",
            }}
          >
            <img
              src={textInside}
              alt="TextInside"
              style={{
                width: "100%", height: "100%",
                objectFit: "cover",
                filter: "brightness(0.8) contrast(1.5) invert(1) sepia() saturate(0) hue-rotate(0deg)",
              }}
            />
            {tempText && (
              <motion.div
                key={`${tempFont}-${tempColor}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "65%",
                  transform: "translate(-50%, -50%) rotate(-5deg)",
                  color: tempColor,
                  textAlign: "center",
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                  fontFamily: isScript ? "'Great Vibes', cursive" : "'Cormorant Garamond', serif",
                  fontSize: isScript ? "1.8rem" : "1rem",
                  fontWeight: isScript ? 400 : 700,
                  letterSpacing: isScript ? "0.05em" : "0.15em",
                  textShadow: "0 1px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)",
                }}
              >
                {tempText}
              </motion.div>
            )}
            {!tempText && (
              <Box sx={{ position: "absolute", bottom: 12, left: 0, right: 0, textAlign: "center" }}>
                <Typography sx={{ fontSize: "0.6rem", color: "rgba(192,211,202,0.3)", fontStyle: "italic", letterSpacing: "0.05em" }}>
                  {t("enterTextOnCollar") || "Enter text — it will appear inside the suit"}
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ width: "100%", px: 1 }}>
            <Typography sx={{ color: "rgba(192,211,202,0.8)", fontSize: "0.8rem", mb: 1, fontWeight: 500 }}>
              {t("yourText")}
            </Typography>
            <Box
              component="input"
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              placeholder={t("enterYourTextHere")}
              maxLength={30}
              sx={{
                width: "100%",
                background: "rgba(15,15,15,0.9)",
                border: "1px solid rgba(192,211,202,0.2)",
                borderRadius: "12px",
                color: tempColor,
                fontSize: isScript ? "1.3rem" : "1rem",
                fontFamily: isScript ? "'Great Vibes', cursive" : "'Cormorant Garamond', serif",
                fontWeight: isScript ? 400 : 600,
                letterSpacing: "0.05em",
                px: 2, py: 1.2,
                outline: "none",
                transition: "all 0.2s ease",
                "&:focus": {
                  border: "1px solid rgba(192,211,202,0.5)",
                  boxShadow: "0 0 0 3px rgba(192,211,202,0.08)",
                },
                "&::placeholder": { color: "rgba(192,211,202,0.25)", fontFamily: "inherit" },
                boxSizing: "border-box",
              }}
            />
            <Typography sx={{ color: "rgba(192,211,202,0.3)", fontSize: "0.65rem", mt: 0.5, textAlign: "right" }}>
              {tempText.length}/30
            </Typography>
          </Box>

          <Box sx={{ width: "100%", px: 1 }}>
            <Typography sx={{ color: "rgba(192,211,202,0.8)", fontSize: "0.8rem", mb: 1.5, fontWeight: 500 }}>
              {t("writingStyle")}
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              {[
                { value: "straight", label: t("straightStyle") || "Straight" },
                { value: "script",   label: t("curvedStyle") || "Script" },
              ].map((opt) => (
                <motion.div key={opt.value} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Box
                    onClick={() => setTempFont(opt.value)}
                    sx={{
                      px: 2.5, py: 1,
                      borderRadius: "12px",
                      cursor: "pointer",
                      background: tempFont === opt.value
                        ? "linear-gradient(135deg, rgba(192,211,202,0.15) 0%, rgba(192,211,202,0.08) 100%)"
                        : "rgba(15,15,15,0.8)",
                      border: tempFont === opt.value
                        ? "1px solid rgba(192,211,202,0.5)"
                        : "1px solid rgba(192,211,202,0.1)",
                      transition: "all 0.2s ease",
                      boxShadow: tempFont === opt.value ? "0 4px 16px rgba(192,211,202,0.1)" : "none",
                    }}
                  >
                    <Typography sx={{
                      color: tempFont === opt.value ? "#C0D3CA" : "rgba(192,211,202,0.45)",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      whiteSpace: "nowrap",
                      transition: "color 0.2s ease",
                    }}>
                      {opt.label}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Box>

          <Box sx={{ width: "100%", px: 1 }}>
            <Typography sx={{ color: "rgba(192,211,202,0.8)", fontSize: "0.8rem", mb: 1.5, fontWeight: 500 }}>
              {t("inscriptionColor")}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center" }}>
              {colorOptions.map((c) => (
                <motion.div key={c.hex} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                  <Box
                    onClick={() => setTempColor(c.hex)}
                    title={c.label}
                    sx={{
                      width: 34, height: 34,
                      borderRadius: "50%",
                      backgroundColor: c.hex,
                      border: tempColor === c.hex
                        ? "3px solid #C0D3CA"
                        : "2px solid rgba(192,211,202,0.25)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: tempColor === c.hex
                        ? "0 0 0 2px rgba(0,0,0,0.8), 0 4px 16px rgba(192,211,202,0.3)"
                        : "0 2px 8px rgba(0,0,0,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {tempColor === c.hex && (
                      <CheckCircleIcon sx={{ fontSize: 16, color: c.hex === "#000000" ? "#fff" : "#000", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }} />
                    )}
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: { xs: 2, md: 2.5 }, pt: 1.5,
          borderTop: "1px solid rgba(192, 211, 202, 0.1)",
          gap: 2,
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Button
          onClick={handleCancel}
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          sx={{
            background: "linear-gradient(135deg, rgba(192, 211, 202, 0.1) 0%, rgba(192, 211, 202, 0.05) 100%)",
            color: "#C0D3CA",
            border: "1px solid rgba(192, 211, 202, 0.3)",
            padding: "10px 24px",
            borderRadius: "8px",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.85rem",
            fontWeight: 500,
            letterSpacing: "0.5px",
            transition: "all 0.3s ease",
            backdropFilter: "blur(10px)",
            "&:hover": {
              background: "linear-gradient(135deg, rgba(192, 211, 202, 0.2) 0%, rgba(192, 211, 202, 0.1) 100%)",
              border: "1px solid rgba(192, 211, 202, 0.5)",
              boxShadow: "0 8px 24px rgba(192, 211, 202, 0.2)",
            },
          }}
        >
          {t("cancel")}
        </Button>
        <Button
          onClick={handleSave}
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          sx={{
            background: "linear-gradient(135deg, rgba(192, 211, 202, 0.9) 0%, rgba(192, 211, 202, 0.8) 100%)",
            color: "#000",
            border: "1px solid rgba(192, 211, 202, 0.8)",
            padding: "10px 32px",
            borderRadius: "8px",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: "0.5px",
            transition: "all 0.3s ease",
            backdropFilter: "blur(10px)",
            "&:hover": {
              background: "linear-gradient(135deg, rgba(192, 211, 202, 1) 0%, rgba(192, 211, 202, 0.9) 100%)",
              border: "1px solid rgba(192, 211, 202, 1)",
              boxShadow: "0 8px 24px rgba(192, 211, 202, 0.3)",
            },
          }}
        >
          {t("save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TextInsideModal;

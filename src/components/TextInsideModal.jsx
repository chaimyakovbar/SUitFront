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
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  textInsideTextAtom,
  textInsideColorAtom,
  showTextInsideAtom,
} from "../Utils";

const TextInsideModal = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [showTextInside, setShowTextInside] = useAtom(showTextInsideAtom);
  const [textInsideText, setTextInsideText] = useAtom(textInsideTextAtom);
  const [textInsideColor, setTextInsideColor] = useAtom(textInsideColorAtom);

  const [tempText, setTempText] = useState(textInsideText);
  const [tempColor, setTempColor] = useState(textInsideColor);

  const colorOptions = [
    { value: "#ffffff", label: "White", description: "Clean white text" },
    { value: "#000000", label: "Black", description: "Classic black text" },
    { value: "#ff0000", label: "Red", description: "Bold red text" },
    { value: "#00ff00", label: "Green", description: "Fresh green text" },
    { value: "#0000ff", label: "Blue", description: "Professional blue text" },
    { value: "#ffff00", label: "Yellow", description: "Bright yellow text" },
    { value: "#ff00ff", label: "Magenta", description: "Vibrant magenta text" },
    { value: "#00ffff", label: "Cyan", description: "Modern cyan text" },
    { value: "#ffa500", label: "Orange", description: "Warm orange text" },
    { value: "#800080", label: "Purple", description: "Elegant purple text" },
  ];

  const handleClose = () => {
    setShowTextInside(false);
  };

  const handleSave = async () => {
    try {
      // Update local state only - text will be saved with suit later
      setTextInsideText(tempText);
      setTextInsideColor(tempColor);
      setShowTextInside(false);

      // Show success message to user using snackbar
      enqueueSnackbar(
        "Text saved successfully! It will be saved with the suit when you finish creating it.",
        {
          variant: "success",
          autoHideDuration: 4000,
        }
      );

      // The text will be saved as part of the suit when the user finishes the suit creation
    } catch (error) {
      console.error("Error updating text inside settings:", error);
      enqueueSnackbar("Error updating text settings", {
        variant: "error",
        autoHideDuration: 4000,
      });
    }
  };

  const handleCancel = () => {
    setTempText(textInsideText);
    setTempColor(textInsideColor);
    setShowTextInside(false);
  };

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
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 20%, rgba(192, 211, 202, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(192, 211, 202, 0.02) 0%, transparent 50%)
            `,
            pointerEvents: "none",
          },
        },
      }}
    >
      {/* Enhanced Header */}
      <Box
        sx={{
          p: { xs: 2.5, md: 3 },
          pb: 2,
          background:
            "linear-gradient(135deg, rgba(192, 211, 202, 0.05) 0%, rgba(192, 211, 202, 0.02) 100%)",
          borderBottom: "1px solid rgba(192, 211, 202, 0.1)",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: "10%",
            right: "10%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(192, 211, 202, 0.3) 50%, transparent 100%)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
              Add Text Inside
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(192, 211, 202, 0.7)",
                fontSize: "0.85rem",
                fontWeight: 300,
                letterSpacing: "0.3px",
              }}
            >
              Personalize your suit with custom text
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
              width: 40,
              height: 40,
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

      {/* Enhanced Content */}
      <DialogContent
        sx={{
          p: { xs: 2, md: 2.5 },
          pt: 1,
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {/* Enhanced Preview Image */}
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
              background:
                "linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(10px)",
            }}
          >
            <img
              src={`${S3_BASE_URL}/assets/adds/TextInside.png`}
              alt="TextInside"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                filter: "brightness(1.1) contrast(1.1)",
              }}
            />
            {/* Enhanced Text overlay */}
            {tempText && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "absolute",
                  top: "65%",
                  left: "30%",
                  transform: "translateY(-50px) rotate(-20deg)",
                  backgroundColor: "rgba(159, 148, 148, 0.4)",
                  border: "1px solid rgba(0, 0, 0, 0.3)",
                  color: tempColor,
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  textAlign: "center",
                  maxWidth: "120px",
                  fontFamily: "'Montserrat', sans-serif",
                  backdropFilter: "blur(5px)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                }}
              >
                {tempText}
              </motion.div>
            )}
          </Box>

          {/* Enhanced Text Input */}
          <TextField
            fullWidth
            label="Your Text"
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            variant="outlined"
            placeholder="Enter your text here..."
            sx={{
              "& .MuiOutlinedInput-root": {
                background:
                  "linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(20, 20, 20, 0.9) 100%)",
                borderRadius: "12px",
                border: "1px solid rgba(192, 211, 202, 0.2)",
                backdropFilter: "blur(10px)",
                "& fieldset": {
                  borderColor: "rgba(192, 211, 202, 0.2)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(192, 211, 202, 0.4)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "rgba(192, 211, 202, 0.6)",
                },
                "& input": {
                  color: "#C0D3CA",
                  fontSize: "1rem",
                  fontWeight: 400,
                  "&::placeholder": {
                    color: "rgba(192, 211, 202, 0.5)",
                    opacity: 1,
                  },
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(192, 211, 202, 0.7)",
                fontSize: "0.9rem",
                fontWeight: 400,
                "&.Mui-focused": {
                  color: "#C0D3CA",
                },
              },
            }}
          />

          {/* Enhanced Color Selection */}
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="h6"
              sx={{
                mb: 1,
                color: "#C0D3CA",
                textAlign: "center",
                fontSize: "0.9rem",
                fontWeight: 500,
                letterSpacing: "0.5px",
              }}
            >
              Choose Text Color
            </Typography>
            <Grid container spacing={1.5} sx={{ justifyContent: "center" }}>
              {colorOptions.map((color, index) => (
                <Grid item key={color.value} xs={3} sm={2} md={1.5}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        onClick={() => setTempColor(color.value)}
                        sx={{
                          width: { xs: 40, md: 45 },
                          height: { xs: 40, md: 45 },
                          backgroundColor: color.value,
                          border:
                            tempColor === color.value
                              ? "3px solid rgba(192, 211, 202, 0.8)"
                              : "2px solid rgba(192, 211, 202, 0.2)",
                          borderRadius: "50%",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          boxShadow:
                            tempColor === color.value
                              ? "0 8px 24px rgba(192, 211, 202, 0.3)"
                              : "0 4px 12px rgba(0, 0, 0, 0.2)",
                          backdropFilter: "blur(10px)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 12px 32px rgba(192, 211, 202, 0.2)",
                            border: "3px solid rgba(192, 211, 202, 0.6)",
                          },
                        }}
                      >
                        {tempColor === color.value && (
                          <CheckCircleIcon
                            sx={{
                              color: "#C0D3CA",
                              fontSize: "20px",
                              filter:
                                "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))",
                            }}
                          />
                        )}
                      </Box>
                      <Typography
                        sx={{
                          color: "#C0D3CA",
                          fontSize: "0.6rem",
                          fontWeight: 500,
                          textAlign: "center",
                          mt: 0.5,
                          letterSpacing: "0.3px",
                        }}
                      >
                        {color.label}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </DialogContent>

      {/* Enhanced Actions */}
      <DialogActions
        sx={{
          p: { xs: 2, md: 2.5 },
          pt: 1.5,
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
            background:
              "linear-gradient(135deg, rgba(192, 211, 202, 0.1) 0%, rgba(192, 211, 202, 0.05) 100%)",
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
              background:
                "linear-gradient(135deg, rgba(192, 211, 202, 0.2) 0%, rgba(192, 211, 202, 0.1) 100%)",
              border: "1px solid rgba(192, 211, 202, 0.5)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 24px rgba(192, 211, 202, 0.2)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          sx={{
            background:
              "linear-gradient(135deg, rgba(192, 211, 202, 0.9) 0%, rgba(192, 211, 202, 0.8) 100%)",
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
              background:
                "linear-gradient(135deg, rgba(192, 211, 202, 1) 0%, rgba(192, 211, 202, 0.9) 100%)",
              border: "1px solid rgba(192, 211, 202, 1)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 24px rgba(192, 211, 202, 0.3)",
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TextInsideModal;

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import { useAtom } from "jotai";
import { useSnackbar } from "notistack";
import {
  textInsideTextAtom,
  textInsideFontAtom,
  textInsideColorAtom,
  showTextInsideAtom,
} from "../Utils";

const TextInsideModal = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [showTextInside, setShowTextInside] = useAtom(showTextInsideAtom);
  const [textInsideText, setTextInsideText] = useAtom(textInsideTextAtom);
  const [textInsideFont, setTextInsideFont] = useAtom(textInsideFontAtom);
  const [textInsideColor, setTextInsideColor] = useAtom(textInsideColorAtom);

  const [tempText, setTempText] = useState(textInsideText);
  const [tempFont, setTempFont] = useState(textInsideFont);
  const [tempColor, setTempColor] = useState(textInsideColor);

  const fontOptions = [
    { value: "Arial", label: "Arial" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Helvetica", label: "Helvetica" },
    { value: "Georgia", label: "Georgia" },
    { value: "Verdana", label: "Verdana" },
    { value: "Courier New", label: "Courier New" },
    { value: "Impact", label: "Impact" },
    { value: "Comic Sans MS", label: "Comic Sans MS" },
  ];

  const colorOptions = [
    { value: "#ffffff", label: "לבן" },
    { value: "#000000", label: "שחור" },
    { value: "#ff0000", label: "אדום" },
    { value: "#00ff00", label: "ירוק" },
    { value: "#0000ff", label: "כחול" },
    { value: "#ffff00", label: "צהוב" },
    { value: "#ff00ff", label: "מגנטה" },
    { value: "#00ffff", label: "ציאן" },
    { value: "#ffa500", label: "כתום" },
    { value: "#800080", label: "סגול" },
  ];

  const handleClose = () => {
    setShowTextInside(false);
  };

  const handleSave = async () => {
    try {
      // Update local state only - text will be saved with suit later
      setTextInsideText(tempText);
      setTextInsideFont(tempFont);
      setTextInsideColor(tempColor);
      setShowTextInside(false);

      console.log("✅ Text inside settings updated locally");
      console.log("📝 Text:", tempText);
      console.log("🔤 Font:", tempFont);
      console.log("🎨 Color:", tempColor);

      // Show success message to user using snackbar
      enqueueSnackbar(
        "הטקסט נשמר בהצלחה! הוא יישמר עם החליפה כשתסיים את היצירה.",
        {
          variant: "success",
          autoHideDuration: 4000,
        }
      );

      // The text will be saved as part of the suit when the user finishes the suit creation
    } catch (error) {
      console.error("Error updating text inside settings:", error);
      enqueueSnackbar("שגיאה בעדכון הגדרות הטקסט", {
        variant: "error",
        autoHideDuration: 4000,
      });
    }
  };

  const handleCancel = () => {
    setTempText(textInsideText);
    setTempFont(textInsideFont);
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
        style: {
          backgroundColor: "#1a1a1a",
          color: "white",
          borderRadius: "12px",
        },
      }}
    >
      <DialogTitle
        style={{
          borderBottom: "1px solid #333",
          padding: "20px 24px",
        }}
      >
        הוסף טקסט פנימי
      </DialogTitle>
      <DialogContent style={{ padding: "24px" }}>
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            alignItems: "center",
          }}
        >
          {/* TextInside Image */}
          <Box
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "400px",
              height: "300px",
              border: "2px solid #333",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <img
              src="/assets/adds/TextInside.png"
              alt="TextInside"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
            {/* Text overlay */}
            {tempText && (
              <div
                style={{
                  position: "absolute",
                  top: "65%",
                  left: "30%",
                  transform: "translateY(-50px) rotate(-20deg)",
                  backgroundColor: "rgb(159 148 148 / 40%)",
                  border: "1px solid black",
                  color: tempColor,
                  padding: "8px 16px",
                  borderRadius: "4px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  textAlign: "center",
                  maxWidth: "120px",
                  fontFamily: tempFont,
                  // whiteSpace: "nowrap",
                }}
              >
                {tempText}
              </div>
            )}
          </Box>

          {/* Text Input */}
          <TextField
            fullWidth
            label="הטקסט שלך"
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            variant="outlined"
            placeholder="הכנס את הטקסט שלך כאן..."
            InputProps={{
              style: {
                color: "white",
                backgroundColor: "#2a2a2a",
                borderRadius: "8px",
              },
            }}
            InputLabelProps={{
              style: {
                color: "#ccc",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#444",
                },
                "&:hover fieldset": {
                  borderColor: "#666",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#4CAF50",
                },
              },
            }}
          />

          {/* Font and Color Selection */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel style={{ color: "#ccc" }}>גופן</InputLabel>
                <Select
                  value={tempFont}
                  onChange={(e) => setTempFont(e.target.value)}
                  style={{
                    color: "white",
                    backgroundColor: "#2a2a2a",
                    borderRadius: "8px",
                  }}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#444",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#666",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#4CAF50",
                    },
                  }}
                >
                  {fontOptions.map((font) => (
                    <MenuItem key={font.value} value={font.value}>
                      {font.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel style={{ color: "#ccc" }}>צבע</InputLabel>
                <Select
                  value={tempColor}
                  onChange={(e) => setTempColor(e.target.value)}
                  style={{
                    color: "white",
                    backgroundColor: "#2a2a2a",
                    borderRadius: "8px",
                  }}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#444",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#666",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#4CAF50",
                    },
                  }}
                >
                  {colorOptions.map((color) => (
                    <MenuItem key={color.value} value={color.value}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: color.value,
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                          }}
                        />
                        {color.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions
        style={{
          borderTop: "1px solid #333",
          padding: "16px 24px",
          gap: "12px",
        }}
      >
        <Button
          onClick={handleCancel}
          style={{
            color: "#ccc",
            border: "1px solid #444",
          }}
        >
          ביטול
        </Button>
        <Button
          onClick={handleSave}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            "&:hover": {
              backgroundColor: "#45a049",
            },
          }}
        >
          שמור
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TextInsideModal;

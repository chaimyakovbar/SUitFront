import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../Utils";
import { bodyPoints } from "../consts/KindOfColors";
import {
  Box,
  TextField,
  Button,
  Dialog,
  Slide,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import useProduct from '../Hooks/UseProduct.jsx'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const OnlySizes = () => {
  const { data, isLoading } = useProduct();
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);
  const [sizes, setSizes] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && data && data.sizes) {
      setSizes((prevSizes) => ({
        ...prevSizes,
        ...data.sizes,
      }));
    }
  }, [isLoading, data]);

  const handleSizeChange = (category, value) => {
    setSizes((prev) => ({ ...prev, [category]: value }));
  };

  const getEffectiveValue = (category) => {
    if (sizes[category] !== undefined && sizes[category] !== "") {
      return sizes[category];
    }

    if (
      data &&
      data.sizes &&
      data.sizes[category] !== undefined &&
      data.sizes[category] !== ""
    ) {
      return data.sizes[category];
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const combinedSizes =
        data && data.sizes ? { ...data.sizes, ...sizes } : sizes;

      await axios.post("http://localhost:3020/product", {
        email: user.email,
        sizes: combinedSizes,
      });
      alert("המידות נשמרו בהצלחה!");
    } catch (error) {
      console.error("שגיאה בשליחת הנתונים:", error);
      alert("שגיאה בשמירת המידות.");
    }
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  if (isLoading) return <p>טוען נתונים...</p>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          onClick={() => navigate("/")}
          sx={{ borderRadius: 2 }}
        >
          ← חזרה לדף הראשי
        </Button>
      </Box>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2, width: "200px" }}
        onClick={handleOpenDialog}
      >
        לשינוי המידות לחץ
      </Button>

      {/* דיאלוג לתהליך אישור */}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
      >
        <Box sx={{ p: 2 }}>
          <Typography>בטוח לשנות?</Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button onClick={handleSubmit}>אישור</Button>
            <Button onClick={handleClose}>בטל</Button>
          </Box>
        </Box>
      </Dialog>

      <Box
        sx={{
          width: 300,
          p: 3,
          overflowY: "auto",
          flexGrow: 1,
        }}
      >
        {bodyPoints.map((point) => {
          const effectiveValue = getEffectiveValue(point.category);
          const isCompleted =
            effectiveValue &&
            effectiveValue.toString().trim() !== "" &&
            Number(effectiveValue) > 0;

          return (
            <Box
              key={point.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                p: 1,
                borderRadius: 1,
                bgcolor: isCompleted
                  ? "rgba(76, 175, 80, 0.1)"
                  : "rgba(255, 235, 235, 0.5)",
              }}
            >
              <Typography>{point.label}</Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  type="number"
                  size="small"
                  value={effectiveValue}
                  onChange={(e) =>
                    handleSizeChange(point.category, e.target.value)
                  }
                  sx={{ width: 80 }}
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ס״מ
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default OnlySizes;

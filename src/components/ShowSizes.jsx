import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Drawer, Box, Typography, TextField } from "@mui/material";
import { bodyPoints } from "../consts/KindOfColors";
import { useAtom } from "jotai";
import { authUserAtom } from "../Utils";
import { postProduct } from "../api/suit";

const ShowSizes = ({ data, onClose }) => {
  const [sizes, setSizes] = useState({});
  const [user] = useAtom(authUserAtom);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (data && data.sizes) {
      setSizes((prevSizes) => ({
        ...prevSizes,
        ...data.sizes,
      }));
    }
  }, [data]);

  const getEffectiveValue = (category) => {
    // First check local state (prioritize local changes)
    if (sizes[category] !== undefined && sizes[category] !== "") {
      return sizes[category];
    }

    // Then fall back to database value if available
    if (
      data &&
      data.sizes &&
      data.sizes[category] !== undefined &&
      data.sizes[category] !== ""
    ) {
      return data.sizes[category];
    }

    // Return empty string as default
    return "";
  };

  const handleSizeChange = (category, value) => {
    setSizes((prev) => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async () => {
    if (Object.keys(sizes).length === 0) {
      alert("אנא מלא את כל המידות הנדרשות");
      return;
    }

    try {
      // Combine existing database values with local changes for the save
      const combinedSizes =
        data && data.sizes ? { ...data.sizes, ...sizes } : sizes;

      await postProduct({
        email: user.email,
        sizes: combinedSizes,
      });

      alert("המידות נשמרו בהצלחה!");
      onClose();
      queryClient.invalidateQueries(["product"]);
    } catch (error) {
      console.error("שגיאה בשליחת הנתונים:", error);
      alert("שגיאה בשמירת המידות.");
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        כל המידות
      </Typography>

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
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        שמור את כל המידות
      </Button>
    </Box>
  );
};

export default ShowSizes;

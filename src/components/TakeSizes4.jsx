import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useAtom } from "jotai";
import { authUserAtom } from "../Utils";
import { postProduct, getAllProducts } from "../api/suit";
import { useSnackbar } from "notistack";

const TakeSizes4 = () => {
  const [selectedJacketSize, setSelectedJacketSize] = useState("");
  const [selectedPantsSize, setSelectedPantsSize] = useState("");
  const [user] = useAtom(authUserAtom);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const sizes = Array.from({ length: 31 }, (_, i) => i + 30); // 30–60

  useEffect(() => {
    const loadExistingSizes = async () => {
      if (!user?.email) return;

      try {
        const response = await getAllProducts(user.email);
        console.log("Response data:", response.data);
        const userData = response.data;

        // Check for sizes in the profile_chaim object
        if (userData?.sizesTable) {
          console.log("Found sizesTable:", userData.sizesTable);
          const { jacket, pants } = userData.sizesTable;
          console.log("Jacket size:", jacket, "Pants size:", pants);

          // Convert to numbers and set the states
          const jacketSize = parseInt(jacket);
          const pantsSize = parseInt(pants);

          console.log(
            "Setting sizes - Jacket:",
            jacketSize,
            "Pants:",
            pantsSize
          );

          setSelectedJacketSize(jacketSize);
          setSelectedPantsSize(pantsSize);

          enqueueSnackbar("Loaded your saved sizes", { variant: "info" });
        } else {
          console.log("No sizesTable found in data");
        }
      } catch (error) {
        console.error("Error loading sizes:", error);
      }
    };

    loadExistingSizes();
  }, [user?.email, enqueueSnackbar]);

  const handleSaveSizes = async () => {
    if (!selectedJacketSize || !selectedPantsSize) {
      enqueueSnackbar("Please select both jacket and pants sizes", {
        variant: "warning",
      });
      return;
    }

    if (!user?.email) {
      enqueueSnackbar("Please log in to save sizes", { variant: "error" });
      return;
    }

    try {
      const sizesTable = {
        jacket: selectedJacketSize.toString(),
        pants: selectedPantsSize.toString(),
      };

      await postProduct({
        email: user.email,
        sizesTable, // Send directly without nesting in sizes
      });
      enqueueSnackbar("Sizes saved successfully!", { variant: "success" });
      navigate("/Shopping");
    } catch (error) {
      console.error("Error saving sizes:", error);
      enqueueSnackbar("Failed to save sizes. Please try again.", {
        variant: "error",
      });
    }
  };

  const tableStyle = {
    backgroundColor: "#111",
    border: "2px solid #444",
    borderRadius: "16px",
    padding: "2rem",
    marginBottom: "3rem",
    boxShadow: "0 0 20px rgba(255, 255, 255, 0.05)",
  };

  const selectStyle = {
    minWidth: "200px",
    "& .MuiOutlinedInput-root": {
      color: "#fff",
      "& fieldset": {
        borderColor: "#555",
      },
      "&:hover fieldset": {
        borderColor: "#FFD700",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#FFD700",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#fff",
      "&.Mui-focused": {
        color: "#FFD700",
      },
    },
    "& .MuiSelect-icon": {
      color: "#fff",
    },
  };

  const menuItemStyle = {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#333",
    },
    "&.Mui-selected": {
      backgroundColor: "#FFD700",
      color: "#000",
      "&:hover": {
        backgroundColor: "#FFC800",
      },
    },
  };

  const saveButtonStyle = {
    backgroundColor: "#FFD700",
    color: "#000",
    border: "2px solid #FFD700",
    borderRadius: "10px",
    padding: "1rem 2rem",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.2s ease-in-out",
    marginTop: "2rem",
    fontSize: "1.2rem",
    "&:hover": {
      backgroundColor: "#FFC800",
      borderColor: "#FFC800",
    },
  };

  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#fff",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "sans-serif",
        textAlign: "center",
        marginTop: "100px",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "20px",
          top: "120px",
          display: "flex",
          gap: "10px",
          zIndex: 20000,
        }}
      >
        <Button
          onClick={() => navigate("/indexSizes")}
          style={{
            color: "#fff",
            backgroundColor: "#333",
            "&:hover": {
              backgroundColor: "#444",
            },
          }}
        >
          <ArrowBackIcon style={{ marginRight: "8px" }} />
          Back
        </Button>
        <Button
          onClick={() => navigate("/Shopping")}
          style={{
            color: "#fff",
            backgroundColor: "#333",
            "&:hover": {
              backgroundColor: "#444",
            },
          }}
        >
          <ShoppingCartIcon style={{ marginRight: "8px" }} />
          Shopping
        </Button>
      </div>

      {/* חליפה */}
      <div style={tableStyle}>
        <h1 style={{ fontSize: "1.8rem", marginBottom: "2rem", color: "#fff" }}>
          Choose Jacket Size
        </h1>
        <FormControl sx={selectStyle}>
          <InputLabel id="jacket-size-label">Jacket Size</InputLabel>
          <Select
            labelId="jacket-size-label"
            id="jacket-size-select"
            value={selectedJacketSize}
            label="Jacket Size"
            onChange={(e) => setSelectedJacketSize(e.target.value)}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: "#1a1a1a",
                  maxHeight: "300px",
                },
              },
            }}
          >
            {sizes.map((size) => (
              <MenuItem key={`jacket-${size}`} value={size} sx={menuItemStyle}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedJacketSize && (
          <h2 style={{ marginTop: "1rem", color: "#FFD700" }}>
            Selected: {selectedJacketSize}
          </h2>
        )}
      </div>

      {/* מכנסיים */}
      <div style={tableStyle}>
        <h1 style={{ fontSize: "1.8rem", marginBottom: "2rem", color: "#fff" }}>
          Choose Pants Size
        </h1>
        <FormControl sx={selectStyle}>
          <InputLabel id="pants-size-label">Pants Size</InputLabel>
          <Select
            labelId="pants-size-label"
            id="pants-size-select"
            value={selectedPantsSize}
            label="Pants Size"
            onChange={(e) => setSelectedPantsSize(e.target.value)}
            MenuProps={{
              PaperProps: {
                style: {
                  backgroundColor: "#1a1a1a",
                  maxHeight: "300px",
                },
              },
            }}
          >
            {sizes.map((size) => (
              <MenuItem key={`pants-${size}`} value={size} sx={menuItemStyle}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedPantsSize && (
          <h2 style={{ marginTop: "1rem", color: "#FFD700" }}>
            Selected: {selectedPantsSize}
          </h2>
        )}
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSaveSizes}
        style={saveButtonStyle}
        disabled={!selectedJacketSize || !selectedPantsSize}
      >
        Save Sizes
      </Button>
    </div>
  );
};

export default TakeSizes4;

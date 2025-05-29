import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ListAltIcon from "@mui/icons-material/ListAlt";

const TakeSizes4 = () => {
  const [selectedJacketSize, setSelectedJacketSize] = useState(null);
  const [selectedPantsSize, setSelectedPantsSize] = useState(null);
  const navigate = useNavigate();

  const sizes = Array.from({ length: 31 }, (_, i) => i + 30); // 30–60

  const tableStyle = {
    backgroundColor: "#111",
    border: "2px solid #444",
    borderRadius: "16px",
    padding: "2rem",
    marginBottom: "3rem",
    boxShadow: "0 0 20px rgba(255, 255, 255, 0.05)",
  };

  const buttonStyle = {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "1px solid #555",
    borderRadius: "10px",
    padding: "1rem",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.2s ease-in-out",
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
        <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem", color: "#fff" }}>
          choose jacket size
        </h1>
        {selectedJacketSize && (
          <h2 style={{ marginBottom: "1.5rem", color: "#FFD700" }}>
            chosen size: {selectedJacketSize}
          </h2>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
            gap: "1rem",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {sizes.map((size) => (
            <button
              key={`jacket-${size}`}
              onClick={() => setSelectedJacketSize(size)}
              style={{
                ...buttonStyle,
                backgroundColor:
                  selectedJacketSize === size ? "#FFD700" : "#1a1a1a",
                color: selectedJacketSize === size ? "#000" : "#fff",
                border:
                  selectedJacketSize === size
                    ? "2px solid #FFD700"
                    : "1px solid #555",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor =
                  selectedJacketSize === size ? "#FFD700" : "#333")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor =
                  selectedJacketSize === size ? "#FFD700" : "#1a1a1a")
              }
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* מכנסיים */}
      <div style={tableStyle}>
        <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem", color: "#fff" }}>
          choose pants size
        </h1>
        {selectedPantsSize && (
          <h2 style={{ marginBottom: "1.5rem", color: "#FFD700" }}>
            chosen size: {selectedPantsSize}
          </h2>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
            gap: "1rem",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {sizes.map((size) => (
            <button
              key={`pants-${size}`}
              onClick={() => setSelectedPantsSize(size)}
              style={{
                ...buttonStyle,
                backgroundColor:
                  selectedPantsSize === size ? "#FFD700" : "#1a1a1a",
                color: selectedPantsSize === size ? "#000" : "#fff",
                border:
                  selectedPantsSize === size
                    ? "2px solid #FFD700"
                    : "1px solid #555",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor =
                  selectedPantsSize === size ? "#FFD700" : "#333")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor =
                  selectedPantsSize === size ? "#FFD700" : "#1a1a1a")
              }
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TakeSizes4;

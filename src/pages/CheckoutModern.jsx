import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Divider,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Fade,
  Stack,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LockIcon from "@mui/icons-material/Lock";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";
import GetAllSuitFromData from "../components/GetAllSuitFromData";
import useProduct from "../Hooks/useProduct";
import { authUserAtom } from "../Utils";
import { useAtom } from "jotai";
import Checkout from "./CheckOut";
import { getLocalOrders } from "../api/orders";

// Props: all logic/state/handlers/data should be passed in from parent (see Payed.jsx)
const CheckoutModern = ({
  onPay,
  paymentWarning = "",
  onEditCart,
  loading = false,
}) => {
  // Updated color palette to match app design
  const highlight = "#C0D3CA"; // signature green
  const accent = "#A8C3B8"; // lighter green
  const error = "#FF5252";
  const darkBg = "#0a0a0a";
  const cardBg = "rgba(20, 20, 20, 0.95)";
  const border = "rgba(192, 211, 202, 0.15)";
  const text = "#fff";
  const muted = "rgba(255, 255, 255, 0.7)";

  const { data: products } = useProduct();
  const [user] = useAtom(authUserAtom);

  // State for selected suits and total price
  const [selectedSuits, setSelectedSuits] = useState(() => {
    const saved = localStorage.getItem("selectedSuits");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [totalPrice, setTotalPrice] = useState(() => {
    const saved = localStorage.getItem("totalPrice");
    return saved ? Number(saved) : 0;
  });
  const [shippingCost, setShippingCost] = useState(0);

  const [profileType, setProfileType] = useState("regular");
  const [sizeProfiles, setSizeProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [hasSizesTable, setHasSizesTable] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [localOrders, setLocalOrders] = useState([]);

  // Initialize profiles from data
  useEffect(() => {
    if (products?.sizes) {
      if (products.sizesTable) setHasSizesTable(true);

      const profiles = Object.entries(products.sizes).reduce(
        (acc, [key, value]) => {
          if (key.startsWith("profile_")) {
            const profileName = key.replace("profile_", "");
            acc.push({
              name: profileName,
              sizes: value || {},
            });
          }
          return acc;
        },
        []
      );
      setSizeProfiles(profiles);
      if (profiles.length > 0 && !selectedProfile) {
        setSelectedProfile(profiles[0]);
      }
    }
  }, [products]);

  // Automatically select all suits when entering the payment page
  useEffect(() => {
    if (products?.allSuitPart) {
      const allSuitIds = new Set(products.allSuitPart.map((suit) => suit._id));
      const total = products.allSuitPart.reduce(
        (sum, suit) => sum + suit.totalPrice,
        0
      );

      setSelectedSuits(allSuitIds);
      setTotalPrice(total);
    }
  }, [products]);

  // Save to localStorage whenever selectedSuits or totalPrice changes
  useEffect(() => {
    localStorage.setItem("selectedSuits", JSON.stringify([...selectedSuits]));
    localStorage.setItem("totalPrice", totalPrice.toString());
  }, [selectedSuits, totalPrice]);

  // Handle suit selection and price calculation
  const handleSelect = (suitId) => {
    const isSelected = selectedSuits.has(suitId);
    const newSet = new Set(selectedSuits);

    if (isSelected) {
      newSet.delete(suitId);
    } else {
      newSet.add(suitId);
    }

    setSelectedSuits(newSet);

    // Calculate total price based on selected suits
    if (products?.allSuitPart) {
      const newTotal = products.allSuitPart
        .filter((suit) => newSet.has(suit._id))
        .reduce((sum, suit) => sum + suit.totalPrice, 0);
      setTotalPrice(newTotal);
    }
  };

  // Handle shipping cost change
  const handleShippingChange = (newShippingCost) => {
    setShippingCost(newShippingCost);
  };

  // Calculate if user can pay (has address, phone, and selected suits)
  const canUserPay =
    user?.address && user?.phoneNumber && selectedSuits.size > 0;

  // Function to check local orders
  const checkLocalOrders = () => {
    const orders = getLocalOrders();
    setLocalOrders(orders);
    console.log("Local orders:", orders);
    alert(`נמצאו ${orders.length} הזמנות ב-localStorage`);
  };

  return (
    <Fade in timeout={600}>
      <Box
        sx={{ 
          marginTop: '100px', 
          minHeight: "100vh", 
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 30%, #0f0f0f 70%, #0a0a0a 100%)",
          position: "relative",
          overflow: "hidden",
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
          py: { xs: 2, md: 6 } 
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          {/* Debug button for checking local orders */}

          <Grid container spacing={4}>
            {/* Left: Order, Size, Delivery, Info */}
            <Grid item xs={12} md={7}>
              {/* Order Summary */}
              <Paper
                elevation={0}
                sx={{ 
                  background: "linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(20, 20, 20, 0.98) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(192, 211, 202, 0.15)",
                  p: 3, 
                  mb: 4, 
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
                }}
              >
                {/* Toggle view mode button */}

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <ShoppingBagIcon
                    sx={{ color: highlight, mr: 1, fontSize: 32 }}
                  />
                  <Typography
                    variant="h5"
                    sx={{ 
                      color: text, 
                      fontWeight: "300", 
                      letterSpacing: "0.1em",
                      fontFamily: "'Cormorant Garamond', serif",
                      textTransform: "uppercase"
                    }}
                  >
                    Order Summary
                  </Typography>
                  <Box flex={1} />
                  <Button
                    onClick={onEditCart}
                    size="small"
                    sx={{ 
                      color: highlight, 
                      fontWeight: "500",
                      "&:hover": {
                        backgroundColor: "rgba(192, 211, 202, 0.1)"
                      }
                    }}
                  >
                    Edit
                  </Button>
                </Box>
                <Divider sx={{ borderColor: border, mb: 2 }} />
                <Button
                  variant="outlined"
                  onClick={() =>
                    setViewMode(viewMode === "grid" ? "list" : "grid")
                  }
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    mb: 2,
                    borderColor: "rgba(192, 211, 202, 0.3)",
                    color: highlight,
                    "&:hover": {
                      borderColor: highlight,
                      backgroundColor: "rgba(192, 211, 202, 0.1)"
                    }
                  }}
                >
                  {viewMode === "grid" ? "הצג כרשימה" : "הצג ככרטיסים"}
                </Button>
                <Box
                  sx={{
                    maxHeight: "400px",
                    overflowY: "auto",
                    overflowX: "hidden",
                    "&::-webkit-scrollbar": {
                      width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "rgba(192, 211, 202, 0.1)",
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
                  <GetAllSuitFromData
                    viewMode={viewMode}
                    selectedSuits={selectedSuits}
                    onSelect={handleSelect}
                  />
                </Box>
              </Paper>

              {/* Size Selection */}
              <Paper
                elevation={0}
                sx={{ 
                  background: "linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(20, 20, 20, 0.98) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(192, 211, 202, 0.15)",
                  p: 3, 
                  mb: 4, 
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ 
                    color: text, 
                    fontWeight: "300", 
                    mb: 2,
                    fontFamily: "'Cormorant Garamond', serif",
                    letterSpacing: "0.05em"
                  }}
                >
                  Size Selection
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Button
                    onClick={() => setProfileType("regular")}
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      border:
                        profileType === "regular"
                          ? `2px solid ${highlight}`
                          : `1px solid ${border}`,
                      background:
                        profileType === "regular"
                          ? "linear-gradient(135deg, rgba(192, 211, 202, 0.1) 0%, rgba(168, 195, 184, 0.1) 100%)"
                          : "rgba(255, 255, 255, 0.02)",
                      boxShadow:
                        profileType === "regular"
                          ? `0 0 0 2px rgba(192, 211, 202, 0.2)`
                          : "none",
                      color: profileType === "regular" ? highlight : text,
                      fontWeight: "500",
                      fontSize: 16,
                      letterSpacing: "0.05em",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      transition: "all 0.3s ease",
                      minWidth: { xs: "100%", sm: 160 },
                      backdropFilter: "blur(10px)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)"
                      }
                    }}
                    startIcon={
                      <CheckCircleIcon
                        sx={{
                          color: profileType === "regular" ? highlight : border,
                        }}
                      />
                    }
                  >
                    Tailored Fit
                  </Button>
                  {hasSizesTable && (
                    <Button
                      onClick={() => setProfileType("sizesTable")}
                      sx={{
                        p: 2,
                        borderRadius: "12px",
                        border:
                          profileType === "sizesTable"
                            ? `2px solid ${accent}`
                            : `1px solid ${border}`,
                        background:
                          profileType === "sizesTable"
                            ? "linear-gradient(135deg, rgba(168, 195, 184, 0.1) 0%, rgba(192, 211, 202, 0.1) 100%)"
                            : "rgba(255, 255, 255, 0.02)",
                        boxShadow:
                          profileType === "sizesTable"
                            ? `0 0 0 2px rgba(168, 195, 184, 0.2)`
                            : "none",
                        color: profileType === "sizesTable" ? accent : text,
                        fontWeight: "500",
                        fontSize: 16,
                        letterSpacing: "0.05em",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        transition: "all 0.3s ease",
                        minWidth: { xs: "100%", sm: 160 },
                        backdropFilter: "blur(10px)",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)"
                        }
                      }}
                      startIcon={
                        <CheckCircleIcon
                          sx={{
                            color:
                              profileType === "sizesTable" ? accent : border,
                          }}
                        />
                      }
                    >
                      Standard Sizes
                    </Button>
                  )}
                </Box>
                {profileType === "regular" && (
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <Select
                      value={selectedProfile?.name || ""}
                      onChange={(e) => {
                        const profile = sizeProfiles.find(
                          (p) => p.name === e.target.value
                        );
                        setSelectedProfile(profile);
                      }}
                      sx={{
                        color: text,
                        background: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "8px",
                        fontWeight: "500",
                        fontSize: 16,
                        backdropFilter: "blur(10px)",
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(192, 211, 202, 0.3)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: highlight,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: highlight,
                        },
                      }}
                    >
                      {sizeProfiles.length === 0 ? (
                        <MenuItem disabled>
                          אין לך פרופילי מידות שמורים. צור אחד בפרופיל שלך.
                        </MenuItem>
                      ) : (
                        sizeProfiles.map((profile) => (
                          <MenuItem key={profile.name} value={profile.name}>
                            {profile.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                )}
                {profileType === "sizesTable" && products?.sizesTable && (
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ color: text }}>
                      Jacket Size: {products.sizesTable.jacket}
                    </Typography>
                    <Typography sx={{ color: text }}>
                      Pants Size: {products.sizesTable.pants}
                    </Typography>
                  </Box>
                )}
              </Paper>

              {/* Delivery Options */}
              <Paper
                elevation={0}
                sx={{ 
                  background: "linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(20, 20, 20, 0.98) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(192, 211, 202, 0.15)",
                  p: 3, 
                  mb: 4, 
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ 
                    color: text, 
                    fontWeight: "300", 
                    mb: 2,
                    fontFamily: "'Cormorant Garamond', serif",
                    letterSpacing: "0.05em"
                  }}
                >
                  Delivery Options
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Box
                      onClick={() => handleShippingChange(0)}
                      sx={{
                        p: 2,
                        borderRadius: "12px",
                        border:
                          shippingCost === 0
                            ? `2px solid ${accent}`
                            : `1px solid ${border}`,
                        background:
                          shippingCost === 0
                            ? "linear-gradient(135deg, rgba(168, 195, 184, 0.1) 0%, rgba(192, 211, 202, 0.1) 100%)"
                            : "rgba(255, 255, 255, 0.02)",
                        boxShadow:
                          shippingCost === 0 ? `0 0 0 2px rgba(168, 195, 184, 0.2)` : "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        transition: "all 0.3s ease",
                        position: "relative",
                        backdropFilter: "blur(10px)",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)"
                        }
                      }}
                    >
                      <LocalShippingIcon
                        sx={{ color: accent, fontSize: 28, mr: 1 }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ color: text, fontWeight: "500" }}
                        >
                          Standard Delivery
                        </Typography>
                        <Typography variant="body2" sx={{ color: muted }}>
                          3-5 business days
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: accent, fontWeight: "600" }}
                        >
                          Free
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box
                      onClick={() => handleShippingChange(15)}
                      sx={{
                        p: 2,
                        borderRadius: "12px",
                        border:
                          shippingCost === 15
                            ? `2px solid ${highlight}`
                            : `1px solid ${border}`,
                        background:
                          shippingCost === 15
                            ? "linear-gradient(135deg, rgba(192, 211, 202, 0.1) 0%, rgba(168, 195, 184, 0.1) 100%)"
                            : "rgba(255, 255, 255, 0.02)",
                        boxShadow:
                          shippingCost === 15
                            ? `0 0 0 2px rgba(192, 211, 202, 0.2)`
                            : "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        transition: "all 0.3s ease",
                        position: "relative",
                        backdropFilter: "blur(10px)",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)"
                        }
                      }}
                    >
                      <FlashOnIcon
                        sx={{ color: highlight, fontSize: 28, mr: 1 }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ color: text, fontWeight: "500" }}
                        >
                          Express Delivery
                        </Typography>
                        <Typography variant="body2" sx={{ color: muted }}>
                          1-2 business days
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: highlight, fontWeight: "600" }}
                        >
                          $15
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box
                      onClick={() => handleShippingChange(35)}
                      sx={{
                        p: 2,
                        borderRadius: "12px",
                        border:
                          shippingCost === 35
                            ? `2px solid #40C4FF`
                            : `1px solid ${border}`,
                        background:
                          shippingCost === 35
                            ? "linear-gradient(135deg, rgba(64, 196, 255, 0.1) 0%, rgba(64, 196, 255, 0.05) 100%)"
                            : "rgba(255, 255, 255, 0.02)",
                        boxShadow:
                          shippingCost === 35 ? `0 0 0 2px rgba(64, 196, 255, 0.2)` : "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        transition: "all 0.3s ease",
                        position: "relative",
                        backdropFilter: "blur(10px)",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)"
                        }
                      }}
                    >
                      <AccessTimeIcon
                        sx={{ color: "#40C4FF", fontSize: 28, mr: 1 }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ color: text, fontWeight: "500" }}
                        >
                          Same Day Delivery
                        </Typography>
                        <Typography variant="body2" sx={{ color: muted }}>
                          Within 6 hours
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: "#40C4FF", fontWeight: "600" }}
                        >
                          $35
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Contact Information */}
              <Paper
                elevation={0}
                sx={{ 
                  background: "linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(20, 20, 20, 0.98) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(192, 211, 202, 0.15)",
                  p: 3, 
                  mb: 4, 
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ 
                    color: text, 
                    fontWeight: "300", 
                    mb: 2,
                    fontFamily: "'Cormorant Garamond', serif",
                    letterSpacing: "0.05em"
                  }}
                >
                  Contact Information
                </Typography>
                <Box
                  sx={{
                    background: "rgba(192, 211, 202, 0.05)",
                    p: 2,
                    borderRadius: "12px",
                    border: "1px solid rgba(192, 211, 202, 0.1)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {user?.address ? (
                        <Box sx={{ mb: { xs: 1, sm: 0 } }}>
                          <Typography
                            sx={{
                              color: text,
                              fontWeight: "500",
                              fontSize: { xs: 13, sm: 15 },
                              wordBreak: "break-word",
                            }}
                          >
                            Address:
                          </Typography>
                          <Typography
                            sx={{
                              color: muted,
                              fontSize: { xs: 13, sm: 15 },
                              wordBreak: "break-word",
                            }}
                          >
                            {user.address}
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{ mb: { xs: 1, sm: 0 } }}>
                          <Typography
                            sx={{
                              color: error,
                              fontWeight: "500",
                              fontSize: { xs: 13, sm: 15 },
                            }}
                          >
                            Missing address, please add your address in your
                            account settings
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {user?.phoneNumber ? (
                        <Box>
                          <Typography
                            sx={{
                              color: text,
                              fontWeight: "500",
                              fontSize: { xs: 13, sm: 15 },
                              wordBreak: "break-word",
                            }}
                          >
                            Phone:
                          </Typography>
                          <Typography
                            sx={{
                              color: muted,
                              fontSize: { xs: 13, sm: 15 },
                              wordBreak: "break-word",
                            }}
                          >
                            {user.phoneNumber}
                          </Typography>
                        </Box>
                      ) : (
                        <Box>
                          <Typography
                            sx={{
                              color: error,
                              fontWeight: "500",
                              fontSize: { xs: 13, sm: 15 },
                            }}
                          >
                            Missing phone number, please add your phone in your
                            account settings
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Stack>
                  <Box sx={{ mt: 2 }}>
                    <Link
                      to="/account"
                      style={{
                        color: highlight,
                        fontWeight: "500",
                        textDecoration: "underline",
                      }}
                    >
                      Edit Contact Information
                    </Link>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Right: Payment Summary */}
            <Grid item xs={12} md={5}>
              <Paper
                elevation={0}
                sx={{ 
                  background: "linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(20, 20, 20, 0.98) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(192, 211, 202, 0.15)",
                  p: 3, 
                  borderRadius: "16px", 
                  mb: 4,
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ 
                    color: highlight, 
                    fontWeight: "300", 
                    mb: 2,
                    fontFamily: "'Cormorant Garamond', serif",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase"
                  }}
                >
                  Payment Summary
                </Typography>
                <Divider sx={{ borderColor: border, mb: 2 }} />
                <Stack spacing={1}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography sx={{ color: muted }}>Subtotal</Typography>
                    <Typography sx={{ color: text, fontWeight: "600" }}>
                      ${totalPrice}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography sx={{ color: muted }}>Shipping</Typography>
                    <Typography
                      sx={{
                        color:
                          shippingCost === 0
                            ? accent
                            : shippingCost === 15
                            ? highlight
                            : "#40C4FF",
                        fontWeight: "600",
                      }}
                    >
                      {shippingCost === 0 ? "Free" : `$${shippingCost}`}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: border, my: 1 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{ color: text, fontWeight: "600", fontSize: 18 }}
                    >
                      Total
                    </Typography>
                    <Typography
                      sx={{ color: highlight, fontWeight: "600", fontSize: 22 }}
                    >
                      ${totalPrice + shippingCost}
                    </Typography>
                  </Box>
                </Stack>
                <Box sx={{ mt: 3, mb: 2 }}>
                  <Alert
                    icon={<LockIcon fontSize="inherit" />}
                    severity="success"
                    sx={{
                      background: "rgba(192, 211, 202, 0.1)",
                      color: accent,
                      border: `1px solid ${accent}`,
                      borderRadius: "8px",
                    }}
                  >
                    Secure Payment — 256-bit SSL encryption protects your data
                  </Alert>
                </Box>
                {paymentWarning && (
                  <Alert
                    icon={<ErrorOutlineIcon fontSize="inherit" />}
                    severity="error"
                    sx={{
                      background: "rgba(255,82,82,0.1)",
                      color: error,
                      border: `1px solid ${error}`,
                      mb: 2,
                      borderRadius: "8px",
                    }}
                  >
                    {paymentWarning}
                  </Alert>
                )}

                {/* PayPal Payment Section */}
                {canUserPay && (
                  <Box sx={{ mt: 3, mb: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: text,
                        fontWeight: "300",
                        mb: 2,
                        textAlign: "center",
                        fontFamily: "'Cormorant Garamond', serif",
                        letterSpacing: "0.05em"
                      }}
                    >
                      בחר אמצעי תשלום
                    </Typography>

                    {/* PayPal Button */}
                    <Box sx={{ mb: 2 }}>
                      <Checkout
                        totalPrice={totalPrice + shippingCost}
                        user={user}
                        selectedSuits={selectedSuits}
                        shippingCost={shippingCost}
                        shippingSpeed={
                          shippingCost === 0
                            ? "STANDARD"
                            : shippingCost === 15
                            ? "EXPRESS"
                            : "SAME_DAY"
                        }
                        sizeProfile={selectedProfile?.name || null}
                        sizeMeasurements={selectedProfile?.sizes || {}}
                        onPaymentSuccess={(paymentDetails, userData) => {
                          console.log("Payment success:", paymentDetails);
                          console.log("User data saved:", userData);
                          // You can add additional logic here, like redirecting to success page
                          // or updating the UI state
                        }}
                      />
                    </Box>

                    <Divider sx={{ borderColor: border, my: 2 }}>
                      <Typography sx={{ color: muted, fontSize: 12 }}>
                        או
                      </Typography>
                    </Divider>

                    {/* Regular Payment Button */}
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      sx={{
                        background: canUserPay 
                          ? "linear-gradient(135deg, rgba(192, 211, 202, 0.1) 0%, rgba(168, 195, 184, 0.1) 100%)"
                          : "rgba(255, 255, 255, 0.05)",
                        border: canUserPay 
                          ? "1px solid rgba(192, 211, 202, 0.3)"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                        color: canUserPay ? highlight : muted,
                        fontWeight: "500",
                        fontSize: 18,
                        borderRadius: "12px",
                        boxShadow: canUserPay
                          ? "0 8px 25px rgba(192, 211, 202, 0.2)"
                          : "none",
                        py: 1.5,
                        transition: "all 0.3s ease",
                        backdropFilter: "blur(10px)",
                        "&:hover": {
                          background: canUserPay
                            ? "linear-gradient(135deg, rgba(192, 211, 202, 0.2) 0%, rgba(168, 195, 184, 0.2) 100%)"
                            : "rgba(255, 255, 255, 0.05)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 12px 35px rgba(192, 211, 202, 0.3)"
                        }
                      }}
                      disabled={!canUserPay || loading}
                      onClick={onPay}
                      startIcon={<LockIcon />}
                    >
                      {canUserPay
                        ? `תשלום רגיל $${totalPrice + shippingCost}`
                        : "Pay"}
                    </Button>
                  </Box>
                )}

                {!canUserPay && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    sx={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: muted,
                      fontWeight: "500",
                      fontSize: 18,
                      borderRadius: "12px",
                      py: 1.5,
                      mt: 1,
                      mb: 1,
                      transition: "all 0.3s ease",
                      backdropFilter: "blur(10px)",
                    }}
                    disabled={true}
                  >
                    Pay
                  </Button>
                )}

                <Typography
                  sx={{
                    color: muted,
                    fontSize: 13,
                    textAlign: "center",
                    mt: 1,
                  }}
                >
                  We accept major credit cards and PayPal
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Fade>
  );
};

export default CheckoutModern;

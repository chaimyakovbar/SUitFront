import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  CircularProgress,
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
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSuit } from "../api/suit";
import useProduct from "../Hooks/useProduct";
import { authUserAtom } from "../Utils";
import { useAtom } from "jotai";
import Checkout from "./CheckOut";
// import { getLocalOrders } from "../api/orders";

// Props: all logic/state/handlers/data should be passed in from parent (see Payed.jsx)
const CheckoutModern = ({
  onPay,
  paymentWarning = "",
  onEditCart,
  loading = false,
}) => {
  // Color palette - matching site theme
  const highlight = "#C0D3CA"; // site's primary color
  const accent = "#f093fb"; // site's accent color
  const error = "#FF5252";
  const cardBg = "rgba(20, 20, 20, 0.92)"; // site's card background
  const border = "rgba(192, 211, 202, 0.15)"; // site's border color
  const text = "#fff";
  const muted = "rgba(192, 211, 202, 0.7)"; // site's muted text

  const { data: products } = useProduct();
  const [user] = useAtom(authUserAtom);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteSuit,
  });

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
  // const [localOrders, setLocalOrders] = useState([]);

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
  }, [products, selectedProfile]);

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

  // Save to localStorage whenever selectedSuits or totalPrice changes - עם דבונסינג
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(
          "selectedSuits",
          JSON.stringify([...selectedSuits])
        );
        localStorage.setItem("totalPrice", totalPrice.toString());
      } catch (error) {
        console.warn("Failed to save to localStorage:", error);
      }
    }, 300); // דבונס של 300ms

    return () => clearTimeout(timeoutId);
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

  // -------- Suit images (like Account) --------
  const S3_BASE_URL = "https://ch-suits.s3.us-east-1.amazonaws.com";

  const buttonColorMap = useMemo(
    () => ({
      black: "blackGrey",
      grey: "greyLight",
    }),
    []
  );

  const loadImage = useCallback(async (key, path) => {
    if (!loadImage.cache) loadImage.cache = new Map();
    const cacheKey = `${key}-${path}`;
    if (loadImage.cache.has(cacheKey)) return loadImage.cache.get(cacheKey);
    const imageUrl = path;
    const result = await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ key, src: imageUrl });
      img.onerror = () => resolve({ key, src: null });
      img.src = imageUrl;
    });
    loadImage.cache.set(cacheKey, result);
    return result;
  }, []);

  const getZIndex = useCallback((key) => {
    const zIndexMap = {
      // Base layers
      baseSuit: 2,
      insideUp: 0,
      insideBottom: 0,
      sleeves: 3,
      bottom: 4,
      bottomKind3: 4,
      // Details (middle)
      button: 50,
      holeButton: 55,
      holeButtonUp: 56,
      poshetColor: 57,
      packetUp: 60,
      // Collar and pockets should be highest
      lapelCollar: 100,
      colar: 99,
      packetSide: 102,
      packetBottom: 102,
      default: 1,
    };
    return zIndexMap[key] || zIndexMap.default;
  }, []);

  const getImagePaths = useCallback(
    (item) => {
      const imagePaths = [
        {
          key: "baseSuit",
          path:
            item.baseSuitImagePath ||
            `${S3_BASE_URL}/assets/ragach/Kinds/${item.kind}/${item.color}.png`,
        },
        {
          key: "insideUp",
          path: `${S3_BASE_URL}/assets/ragach/insideUp/${item.insideColor}.png`,
        },
        {
          key: "lapelCollar",
          path: `${S3_BASE_URL}/assets/ragach/${item.lapelKind}/${item.lapelType}/${item.kind}/${item.color}.png`,
        },
        {
          key: "colar",
          path: `${S3_BASE_URL}/assets/ragach/colar/${item.color}.png`,
        },
        {
          key: "sleeves",
          path: `${S3_BASE_URL}/assets/ragach/sleeves/${item.color}.png`,
        },
        {
          key: "insideBottom",
          path: `${S3_BASE_URL}/assets/ragach/insideBottom/${item.color}.png`,
        },
        {
          key: "packetUp",
          path: `${S3_BASE_URL}/assets/ragach/packetUp/${item.color}.png`,
        },
      ];

      if (item?.bottomPart === "bottom") {
        imagePaths.push({
          key: "bottom",
          path: `${S3_BASE_URL}/assets/ragach/bottom/${item.color}.png`,
        });
      }
      if (item?.bottomPart === "bottomKind3") {
        imagePaths.push({
          key: "bottomKind3",
          path: `${S3_BASE_URL}/assets/ragach/bottomKind3/${item.color}.png`,
        });
      }
      if (item?.holeButtonColor) {
        imagePaths.push({
          key: "holeButton",
          path: `${S3_BASE_URL}/assets/adds/holesButton/${item.kind}/${item.holeButtonColor}.png`,
        });
      }
      if (item?.holeButtonUpColor) {
        imagePaths.push({
          key: "holeButtonUp",
          path: `${S3_BASE_URL}/assets/adds/holesButtonUp/${item.holeButtonUpColor}.png`,
        });
      }
      if (item.poshetColor) {
        imagePaths.push({
          key: "poshetColor",
          path: `${S3_BASE_URL}/assets/adds/poshet/${item.poshetColor}.png`,
        });
      }
      if (item.buttonColor) {
        const actualColor =
          buttonColorMap[item.buttonColor] || item.buttonColor;
        imagePaths.push({
          key: "button",
          path: `${S3_BASE_URL}/assets/ragach/button/${item.kind}/${actualColor}.png`,
        });
      }
      // Add packet based on selected kind/type (bottom pockets or side)
      if (item.packetType) {
        const packetKind = item.packetKind || "packetBottom";
        imagePaths.push({
          key: packetKind === "packetSide" ? "packetSide" : "packetBottom",
          path: `${S3_BASE_URL}/assets/ragach/packet/${packetKind}/${item.packetType}/${item.color}.png`,
        });
      }
      return imagePaths;
    },
    [buttonColorMap]
  );

  const fetchImages = useCallback(
    async (item) => {
      if (!item) return {};
      const imagePaths = getImagePaths(item);
      const images = await Promise.all(
        imagePaths.map(({ key, path }) => loadImage(key, path))
      );
      return images.reduce((acc, { key, src }) => {
        if (src) acc[key] = src;
        return acc;
      }, {});
    },
    [getImagePaths, loadImage]
  );

  const SuitCard = ({ suit }) => {
    const [images, setImages] = useState(null);
    const [imgLoading, setImgLoading] = useState(true);

    useEffect(() => {
      let mounted = true;
      (async () => {
        try {
          const res = await fetchImages(suit);
          if (mounted) setImages(res);
        } finally {
          if (mounted) setImgLoading(false);
        }
      })();
      return () => {
        mounted = false;
      };
    }, [suit]);

    return (
      <Box
        key={`suit-${suit._id}`}
        sx={{
          position: "relative",
          zIndex: 10000,
          width: "100%",
          height: viewMode === "list" ? 120 : 300,
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "#202020",
          mb: viewMode === "list" ? 1 : 2,
        }}
      >
        {imgLoading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <CircularProgress size={24} />
          </Box>
        ) : images && Object.keys(images).length > 0 ? (
          Object.entries(images)
            .sort((a, b) => getZIndex(a[0]) - getZIndex(b[0]))
            .map(([key, src]) => (
              <img
                key={`${suit._id}-${key}`}
                src={src}
                alt={`Suit part: ${key}`}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "80%",
                  height: "80%",
                  objectFit: "contain",
                  zIndex: getZIndex(key),
                }}
                loading="lazy"
              />
            ))
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            No image
          </Box>
        )}

        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1.5,
            backgroundColor: "#222222",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Typography
            sx={{ color: "#fff", fontFamily: "'Montserrat', sans-serif" }}
          >
            ${suit.totalPrice}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <input
              type="checkbox"
              checked={selectedSuits.has(suit._id)}
              onChange={() => handleSelect(suit._id)}
              style={{ width: 20, height: 20, cursor: "pointer" }}
            />
            <IconButton
              onClick={async () => {
                try {
                  await deleteMutation.mutateAsync(suit._id);
                  if (selectedSuits.has(suit._id)) {
                    const newSet = new Set(selectedSuits);
                    newSet.delete(suit._id);
                    setSelectedSuits(newSet);
                    setTotalPrice((prev) =>
                      Math.max(0, prev - (suit.totalPrice || 0))
                    );
                  }
                  queryClient.invalidateQueries(["useProduct"]);
                } catch (e) {
                  console.error("Failed to delete suit", e);
                }
              }}
              disabled={deleteMutation.isLoading}
              sx={{ color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}
              size="small"
            >
              {deleteMutation.isLoading ? (
                <CircularProgress size={18} />
              ) : (
                <DeleteIcon />
              )}
            </IconButton>
          </Box>
        </Box>
      </Box>
    );
  };

  // Handle shipping cost change
  const handleShippingChange = (newShippingCost) => {
    setShippingCost(newShippingCost);
  };

  // Calculate if user can pay (has address, phone, and selected suits)
  const canUserPay =
    user?.address && user?.phoneNumber && selectedSuits.size > 0;

  // const checkLocalOrders = () => {
  //   const orders = getLocalOrders();
  //   setLocalOrders(orders);
  //   alert(`נמצאו ${orders.length} הזמנות ב-localStorage`);
  // };

  return (
    <Fade in timeout={600}>
      <Box
        sx={{
          marginTop: "100px",
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 30%, #0f0f0f 70%, #0a0a0a 100%)",
          py: { xs: 2, md: 6 },
          position: "relative",
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
                  background:
                    "linear-gradient(135deg, rgba(20, 20, 20, 0.92) 0%, rgba(30, 30, 30, 0.95) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(192, 211, 202, 0.15)",
                  p: 3,
                  mb: 4,
                  borderRadius: "24px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background:
                      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    borderRadius: "24px 24px 0 0",
                  },
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
                      color: highlight,
                      fontWeight: 600,
                      letterSpacing: 1,
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.8rem",
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
                      fontWeight: 500,
                      borderRadius: "8px",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: "rgba(192, 211, 202, 0.1)",
                      },
                    }}
                  >
                    Edit
                  </Button>
                </Box>
                <Divider sx={{ borderColor: border, mb: 2, opacity: 0.3 }} />
                <Button
                  variant="outlined"
                  onClick={() =>
                    setViewMode(viewMode === "grid" ? "list" : "grid")
                  }
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    mb: 2,
                    borderColor: border,
                    color: text,
                    borderRadius: "12px",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: highlight,
                      background: "rgba(192, 211, 202, 0.05)",
                    },
                  }}
                >
                  {viewMode === "grid" ? "הצג כרשימה" : "הצג ככרטיסים"}
                </Button>
                <Box sx={{ mt: 1 }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        viewMode === "grid"
                          ? "repeat(auto-fill, minmax(300px, 1fr))"
                          : "1fr",
                      gap: viewMode === "grid" ? 2 : 1,
                    }}
                  >
                    {(products?.allSuitPart || []).map((suit) => (
                      <SuitCard key={suit._id} suit={suit} />
                    ))}
                  </Box>
                </Box>
              </Paper>

              {/* Size Selection */}
              <Paper
                elevation={0}
                sx={{
                  background:
                    "linear-gradient(135deg, rgba(20, 20, 20, 0.92) 0%, rgba(30, 30, 30, 0.95) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(192, 211, 202, 0.15)",
                  p: 3,
                  mb: 4,
                  borderRadius: "24px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background:
                      "linear-gradient(135deg, #C0D3CA 0%, #a8c4b8 100%)",
                    borderRadius: "24px 24px 0 0",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: highlight,
                    fontWeight: 600,
                    mb: 2,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.4rem",
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
                      borderRadius: "16px",
                      border:
                        profileType === "regular"
                          ? `2.5px solid ${highlight}`
                          : `1.5px solid ${border}`,
                      background:
                        profileType === "regular"
                          ? "rgba(192, 211, 202, 0.08)"
                          : cardBg,
                      boxShadow:
                        profileType === "regular"
                          ? `0 0 0 2px rgba(192, 211, 202, 0.3)`
                          : "none",
                      color: profileType === "regular" ? highlight : text,
                      fontWeight: 600,
                      fontSize: 16,
                      letterSpacing: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      transition: "all 0.3s ease",
                      minWidth: { xs: "100%", sm: 160 },
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow:
                          profileType === "regular"
                            ? `0 4px 20px rgba(192, 211, 202, 0.4)`
                            : `0 4px 20px rgba(0, 0, 0, 0.2)`,
                      },
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
                        borderRadius: "16px",
                        border:
                          profileType === "sizesTable"
                            ? `2.5px solid ${accent}`
                            : `1.5px solid ${border}`,
                        background:
                          profileType === "sizesTable"
                            ? "rgba(240, 147, 251, 0.08)"
                            : cardBg,
                        boxShadow:
                          profileType === "sizesTable"
                            ? `0 0 0 2px rgba(240, 147, 251, 0.3)`
                            : "none",
                        color: profileType === "sizesTable" ? accent : text,
                        fontWeight: 600,
                        fontSize: 16,
                        letterSpacing: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        transition: "all 0.3s ease",
                        minWidth: { xs: "100%", sm: 160 },
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow:
                            profileType === "sizesTable"
                              ? `0 4px 20px rgba(240, 147, 251, 0.4)`
                              : `0 4px 20px rgba(0, 0, 0, 0.2)`,
                        },
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
                        background: cardBg,
                        borderRadius: "12px",
                        fontWeight: 600,
                        fontSize: 16,
                        ".MuiOutlinedInput-notchedOutline": {
                          borderColor: highlight,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: accent,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: accent,
                        },
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            background: "#0a0a0a",
                            border: "1px solid rgba(192, 211, 202, 0.15)",
                            borderRadius: "12px",
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
                            "& .MuiMenuItem-root": {
                              color: text,
                              fontFamily: "'Montserrat', sans-serif",
                              "&:hover": {
                                background: "rgba(192, 211, 202, 0.1)",
                              },
                              "&.Mui-selected": {
                                background: "rgba(192, 211, 202, 0.2)",
                                color: highlight,
                              },
                            },
                          },
                        },
                      }}
                    >
                      {sizeProfiles.length === 0 ? (
                        <MenuItem disabled sx={{ color: muted }}>
                          אין לך פרופילי מידות שמורים. צור אחד בפרופיל שלך.
                        </MenuItem>
                      ) : (
                        sizeProfiles.map((profile) => (
                          <MenuItem
                            key={profile.name}
                            value={profile.name}
                            sx={{ color: text }}
                          >
                            {profile.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                )}
                {profileType === "sizesTable" && products?.sizesTable && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      sx={{
                        color: text,
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.9rem",
                      }}
                    >
                      Jacket Size: {products.sizesTable.jacket}
                    </Typography>
                    <Typography
                      sx={{
                        color: text,
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.9rem",
                      }}
                    >
                      Pants Size: {products.sizesTable.pants}
                    </Typography>
                  </Box>
                )}
              </Paper>

              {/* Delivery Options */}
              <Paper
                elevation={0}
                sx={{
                  background:
                    "linear-gradient(135deg, rgba(20, 20, 20, 0.92) 0%, rgba(30, 30, 30, 0.95) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(192, 211, 202, 0.15)",
                  p: 3,
                  mb: 4,
                  borderRadius: "24px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background:
                      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    borderRadius: "24px 24px 0 0",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: highlight,
                    fontWeight: 600,
                    mb: 2,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.4rem",
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
                        borderRadius: 3,
                        border:
                          shippingCost === 0
                            ? `2.5px solid ${accent}`
                            : `1.5px solid ${border}`,
                        background:
                          shippingCost === 0
                            ? "rgba(240, 147, 251, 0.08)"
                            : "rgba(20, 20, 20, 0.92)",
                        boxShadow:
                          shippingCost === 0 ? `0 0 0 2px ${accent}55` : "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        transition: "all 0.2s",
                        position: "relative",
                      }}
                    >
                      <LocalShippingIcon
                        sx={{ color: accent, fontSize: 28, mr: 1 }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: text,
                            fontWeight: 600,
                            fontFamily: "'Montserrat', sans-serif",
                          }}
                        >
                          Standard Delivery
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: muted,
                            fontFamily: "'Montserrat', sans-serif",
                          }}
                        >
                          3-5 business days
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: accent,
                            fontWeight: 700,
                            fontFamily: "'Cormorant Garamond', serif",
                          }}
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
                        borderRadius: 3,
                        border:
                          shippingCost === 15
                            ? `2.5px solid ${highlight}`
                            : `1.5px solid ${border}`,
                        background:
                          shippingCost === 15
                            ? "rgba(192, 211, 202, 0.08)"
                            : "rgba(20, 20, 20, 0.92)",
                        boxShadow:
                          shippingCost === 15
                            ? `0 0 0 2px ${highlight}55`
                            : "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        transition: "all 0.2s",
                        position: "relative",
                      }}
                    >
                      <FlashOnIcon
                        sx={{ color: highlight, fontSize: 28, mr: 1 }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: text,
                            fontWeight: 600,
                            fontFamily: "'Montserrat', sans-serif",
                          }}
                        >
                          Express Delivery
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: muted,
                            fontFamily: "'Montserrat', sans-serif",
                          }}
                        >
                          1-2 business days
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: highlight,
                            fontWeight: 700,
                            fontFamily: "'Cormorant Garamond', serif",
                          }}
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
                        borderRadius: 3,
                        border:
                          shippingCost === 35
                            ? `2.5px solid #40C4FF`
                            : `1.5px solid ${border}`,
                        background:
                          shippingCost === 35
                            ? "rgba(64, 196, 255, 0.08)"
                            : "rgba(20, 20, 20, 0.92)",
                        boxShadow:
                          shippingCost === 35 ? `0 0 0 2px #40C4FF55` : "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        transition: "all 0.2s",
                        position: "relative",
                      }}
                    >
                      <AccessTimeIcon
                        sx={{ color: "#40C4FF", fontSize: 28, mr: 1 }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: text,
                            fontWeight: 600,
                            fontFamily: "'Montserrat', sans-serif",
                          }}
                        >
                          Same Day Delivery
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: muted,
                            fontFamily: "'Montserrat', sans-serif",
                          }}
                        >
                          Within 6 hours
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "#40C4FF",
                            fontWeight: 700,
                            fontFamily: "'Cormorant Garamond', serif",
                          }}
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
                  background:
                    "linear-gradient(135deg, rgba(20, 20, 20, 0.92) 0%, rgba(30, 30, 30, 0.95) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(192, 211, 202, 0.15)",
                  p: 3,
                  mb: 4,
                  borderRadius: "24px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background:
                      "linear-gradient(135deg, #C0D3CA 0%, #a8c4b8 100%)",
                    borderRadius: "24px 24px 0 0",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: highlight,
                    fontWeight: 600,
                    mb: 2,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.4rem",
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
                  }}
                >
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {user?.address ? (
                        <Box sx={{ mb: { xs: 1, sm: 0 } }}>
                          <Typography
                            sx={{
                              color: text,
                              fontWeight: 500,
                              fontSize: { xs: 13, sm: 15 },
                              wordBreak: "break-word",
                              fontFamily: "'Montserrat', sans-serif",
                            }}
                          >
                            Address:
                          </Typography>
                          <Typography
                            sx={{
                              color: muted,
                              fontSize: { xs: 13, sm: 15 },
                              wordBreak: "break-word",
                              fontFamily: "'Montserrat', sans-serif",
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
                              fontWeight: 500,
                              fontSize: { xs: 13, sm: 15 },
                              fontFamily: "'Montserrat', sans-serif",
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
                              fontWeight: 500,
                              fontSize: { xs: 13, sm: 15 },
                              wordBreak: "break-word",
                              fontFamily: "'Montserrat', sans-serif",
                            }}
                          >
                            Phone:
                          </Typography>
                          <Typography
                            sx={{
                              color: muted,
                              fontSize: { xs: 13, sm: 15 },
                              wordBreak: "break-word",
                              fontFamily: "'Montserrat', sans-serif",
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
                              fontWeight: 500,
                              fontSize: { xs: 13, sm: 15 },
                              fontFamily: "'Montserrat', sans-serif",
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
                        fontWeight: 500,
                        textDecoration: "underline",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.9rem",
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
                  background:
                    "linear-gradient(135deg, rgba(20, 20, 20, 0.92) 0%, rgba(30, 30, 30, 0.95) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(192, 211, 202, 0.15)",
                  p: 3,
                  borderRadius: "24px",
                  mb: 4,
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background:
                      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    borderRadius: "24px 24px 0 0",
                  },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: highlight,
                    fontWeight: 700,
                    mb: 2,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.8rem",
                  }}
                >
                  Payment Summary
                </Typography>
                <Divider sx={{ borderColor: border, mb: 2, opacity: 0.3 }} />
                <Stack spacing={1}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color: muted,
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.9rem",
                      }}
                    >
                      Subtotal
                    </Typography>
                    <Typography
                      sx={{
                        color: highlight,
                        fontWeight: 600,
                        fontFamily: "'Cormorant Garamond', serif",
                      }}
                    >
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
                    <Typography
                      sx={{
                        color: muted,
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.9rem",
                      }}
                    >
                      Shipping
                    </Typography>
                    <Typography
                      sx={{
                        color:
                          shippingCost === 0
                            ? accent
                            : shippingCost === 15
                            ? highlight
                            : "#40C4FF",
                        fontWeight: 600,
                        fontFamily: "'Cormorant Garamond', serif",
                      }}
                    >
                      {shippingCost === 0 ? "Free" : `$${shippingCost}`}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: border, my: 1, opacity: 0.3 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color: text,
                        fontWeight: 700,
                        fontSize: 18,
                        fontFamily: "'Cormorant Garamond', serif",
                      }}
                    >
                      Total
                    </Typography>
                    <Typography
                      sx={{
                        color: highlight,
                        fontWeight: 800,
                        fontSize: 22,
                        fontFamily: "'Cormorant Garamond', serif",
                      }}
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
                      background: "rgba(192, 211, 202, 0.08)",
                      color: highlight,
                      border: `1.5px solid ${highlight}`,
                      borderRadius: "12px",
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
                      background: "rgba(255,82,82,0.08)",
                      color: error,
                      border: `1.5px solid ${error}`,
                      mb: 2,
                      borderRadius: "12px",
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
                        color: highlight,
                        fontWeight: 600,
                        mb: 2,
                        textAlign: "center",
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "1.4rem",
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
                        onPaymentSuccess={() => {
                          // You can add additional logic here, like redirecting to success page
                          // or updating the UI state
                        }}
                      />
                    </Box>

                    <Divider sx={{ borderColor: border, my: 2, opacity: 0.3 }}>
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
                        background: canUserPay ? highlight : border,
                        color: canUserPay ? "#0a0a0a" : muted,
                        fontWeight: 700,
                        fontSize: 18,
                        borderRadius: "12px",
                        boxShadow: canUserPay
                          ? `0 4px 20px rgba(192, 211, 202, 0.3)`
                          : "none",
                        py: 1.5,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: canUserPay ? "translateY(-2px)" : "none",
                          boxShadow: canUserPay
                            ? `0 6px 25px rgba(192, 211, 202, 0.4)`
                            : "none",
                        },
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
                      background: border,
                      color: muted,
                      fontWeight: 700,
                      fontSize: 18,
                      borderRadius: "12px",
                      py: 1.5,
                      mt: 1,
                      mb: 1,
                      transition: "all 0.3s ease",
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
                    fontFamily: "'Montserrat', sans-serif",
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

import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { authUserAtom } from "../Utils";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Badge,
  Divider,
} from "@mui/material";
import {
  Email as EmailIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ListAlt as ListAltIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  Height as HeightIcon,
  Scale as ScaleIcon,
  ShoppingBag as ShoppingBagIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  LocalShipping as LocalShippingIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Diamond as DiamondIcon,
  Star as StarIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  ErrorOutline as ErrorOutlineIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { bodyPoints } from "../consts/KindOfColors";
import useProduct from "../Hooks/useProduct";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { updateUser, deleteSizeProfile } from "../api/user";
import { useSnackbar } from "notistack";
import { getUserOrders } from "../api/orders";
import { useLanguage } from "../context/LanguageContext";

// Button color mapping extracted and expanded
const buttonColorMap = {
  black: "blackGrey",
  grey: "greyLight",
  // Add other mappings as needed
};

// Extracted to separate function with added caching mechanism (no CORS HEAD)
const loadImage = async (key, path) => {
  if (!loadImage.cache) loadImage.cache = new Map();
  const cacheKey = `${key}-${path}`;

  if (loadImage.cache.has(cacheKey)) {
    return loadImage.cache.get(cacheKey);
  }

  // Preload using HTMLImageElement to avoid CORS issues from fetch(HEAD)
  const imageUrl = path;
  const result = await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ key, src: imageUrl });
    img.onerror = () => resolve({ key, src: null });
    img.src = imageUrl;
  });

  if (!result.src) {
    console.warn(`⚠️ Missing image for ${key} at path: ${path}`);
  }

  loadImage.cache.set(cacheKey, result);
  return result;
};

const S3_BASE_URL = "https://ch-suits.s3.us-east-1.amazonaws.com";

const getImagePaths = (item) => {
  const imagePaths = [
    // Base suit image - use stored path if available, otherwise construct it
    {
      key: "baseSuit",
      path:
        item.baseSuitImagePath ||
        `${S3_BASE_URL}/assets_V3/Ragach/Kinds/${item.kind}/${item.color}.webp`,
    },
    {
      key: "insideUp",
      path: `${S3_BASE_URL}/assets_V3/Ragach/insideUp/${item.insideColor}.webp`,
    },
    {
      key: "lapelCollar",
      path: `${S3_BASE_URL}/assets_V3/Ragach/${item.lapelKind}/${item.lapelType}/${item.kind}/${item.color}.webp`,
    },
    {
      key: "colar",
      path: `${S3_BASE_URL}/assets_V3/Ragach/colar/${item.color}.webp`,
    },
    {
      key: "sleeves",
      path: `${S3_BASE_URL}/assets_V3/Ragach/sleeves/${item.color}.webp`,
    },
    {
      key: "insideBottom",
      path: `${S3_BASE_URL}/assets_V3/Ragach/insideBottom/${item.color}.webp`,
    },
    {
      key: "packetUp",
      path: `${S3_BASE_URL}/assets_V3/Ragach/packetUp/${item.color}.webp`,
    },
  ];

  // Add conditional parts
  if (item?.bottomPart === "bottom") {
    imagePaths.push({
      key: "bottom",
      path: `${S3_BASE_URL}/assets_V3/Ragach/bottom/${item.color}.webp`,
    });
  }

  if (item?.bottomPart === "bottomKind3") {
    imagePaths.push({
      key: "bottomKind3",
      path: `${S3_BASE_URL}/assets_V3/Ragach/bottomKind3/${item.color}.webp`,
    });
  }

  if (item?.holeButtonColor) {
    imagePaths.push({
      key: "holeButton",
      path: `${S3_BASE_URL}/assets_V3/adds/holesButton/${item.kind}/${item.holeButtonColor}.webp`,
    });
  }

  if (item?.holeButtonUpColor) {
    imagePaths.push({
      key: "holeButtonUp",
      path: `${S3_BASE_URL}/assets_V3/adds/holesButtonUp/${item.holeButtonUpColor}.webp`,
    });
  }

  if (item.poshetColor) {
    imagePaths.push({
      key: "poshetColor",
      path: `${S3_BASE_URL}/assets_V3/adds/poshet/${item.poshetColor}.webp`,
    });
  }

  if (item.buttonColor) {
    const actualColor = buttonColorMap[item.buttonColor] || item.buttonColor;
    imagePaths.push({
      key: "button",
      path: `${S3_BASE_URL}/assets_V3/Ragach/button/${item.kind}/${actualColor}.webp`,
    });
  }

  return imagePaths;
};

const fetchImages = async (item) => {
  if (!item) return {};

  const imagePaths = getImagePaths(item);
  const images = await Promise.all(
    imagePaths.map(({ key, path }) => loadImage(key, path)),
  );

  return images.reduce((acc, { key, src }) => {
    if (src) acc[key] = src;
    return acc;
  }, {});
};

// Get z-index for image layers
const getZIndex = (key) => {
  const zIndexMap = {
    packetBottom: 10,
    button: 8,
    holeButton: 7,
    holeButtonUp: 6,
    poshetColor: 5,
    // חליפה - כל החלקים
    baseSuit: 0, // התמונה הבסיסית של החליפה - הכי נמוך
    insideUp: 1,
    lapelCollar: 2,
    colar: 3,
    sleeves: 4,
    insideBottom: 5,
    packetUp: 6,
    bottom: 7,
    bottomKind3: 7,
    // חלקים נוספים
    suitBody: 0, // alias for baseSuit
    collar: 3, // alias for colar
    default: 1,
  };

  return zIndexMap[key] || zIndexMap.default;
};

// SuitImage Component
const SuitImage = ({ suit }) => {
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSuitImages = async () => {
      if (!suit) {
        setLoading(false);
        return;
      }

      try {
        const suitImages = await fetchImages(suit);
        setImages(suitImages);
      } catch (error) {
        console.error("Error loading suit images:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSuitImages();
  }, [suit]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "rgba(255, 255, 255, 0.7)",
        }}
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (Object.keys(images).length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "rgba(255, 255, 255, 0.5)",
          fontSize: "0.9rem",
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        No image available
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {Object.entries(images)
        .sort((a, b) => getZIndex(a[0]) - getZIndex(b[0]))
        .map(([key, src]) => (
          <img
            key={key}
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
        ))}
    </Box>
  );
};

const useStyles = makeStyles({
  root: {
    backgroundColor: "#0a0a0a",
    color: "#fff",
    minHeight: "100vh",
    paddingTop: "80px",
    paddingBottom: "80px",
    "@media (max-width: 768px)": {
      paddingTop: "70px",
      paddingBottom: "100px",
    },
  },
  sidebar: {
    backgroundColor: "rgba(10, 10, 10, 0.92) !important",
    border: "1px solid rgba(192, 211, 202, 0.12) !important",
    borderRadius: "2px !important",
    position: "sticky !important",
    top: "90px !important",
    backdropFilter: "blur(24px) !important",
    overflow: "hidden !important",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5) !important",
    "@media (max-width: 768px)": {
      position: "static !important",
      width: "100% !important",
      marginBottom: "1.5rem !important",
    },
  },
  mobileBottomNav: {
    display: "none",
    "@media (max-width: 900px)": {
      display: "flex !important",
      position: "fixed !important",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(8, 8, 8, 0.97) !important",
      backdropFilter: "blur(24px) !important",
      borderTop: "1px solid rgba(192, 211, 202, 0.1) !important",
      zIndex: 1000,
      padding: "0.4rem 0",
    },
  },
  mobileTabItem: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0.5rem 0.25rem",
    color: "rgba(255, 255, 255, 0.35) !important",
    textDecoration: "none",
    transition: "color 0.2s ease",
    "@media (max-width: 900px)": {
      "&.active": {
        color: "#C0D3CA !important",
      },
    },
  },
  mobileTabIcon: {
    fontSize: "1.3rem !important",
    marginBottom: "0.2rem",
    transition: "all 0.2s ease",
  },
  mobileTabLabel: {
    fontSize: "0.58rem !important",
    fontFamily: "'Montserrat', sans-serif !important",
    fontWeight: "500 !important",
    letterSpacing: "0.1em !important",
    textTransform: "uppercase",
  },
  mainContent: {
    paddingLeft: "2rem",
    "@media (max-width: 768px)": {
      paddingLeft: "0 !important",
    },
  },
  heading: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "3rem !important",
    fontWeight: "300 !important",
    marginBottom: "2.5rem !important",
    letterSpacing: "0.2em !important",
    color: "#fff !important",
    textAlign: "center",
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "1.6rem !important",
    fontWeight: "300 !important",
    marginBottom: "1.75rem !important",
    letterSpacing: "0.18em !important",
    color: "#fff !important",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    textTransform: "uppercase",
    paddingBottom: "1rem !important",
    borderBottom: "1px solid rgba(192, 211, 202, 0.1) !important",
    "& svg": { color: "#C0D3CA", fontSize: "1.3rem !important" },
    "@media (max-width: 768px)": {
      fontSize: "1.3rem !important",
      marginBottom: "1.25rem !important",
    },
  },
  card: {
    backgroundColor: "rgba(12, 12, 12, 0.88) !important",
    border: "1px solid rgba(192, 211, 202, 0.1) !important",
    borderRadius: "2px !important",
    marginBottom: "1.25rem !important",
    backdropFilter: "blur(20px) !important",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease !important",
    boxShadow: "0 4px 28px rgba(0,0,0,0.35) !important",
    "&:hover": {
      borderColor: "rgba(192, 211, 202, 0.22) !important",
      boxShadow: "0 16px 48px rgba(0,0,0,0.5) !important",
    },
    "& .MuiCardContent-root": {
      padding: "0 !important",
    },
  },
  avatar: {
    width: "80px !important",
    height: "80px !important",
    border: "1px solid rgba(192, 211, 202, 0.25) !important",
    backgroundColor: "transparent !important",
    color: "#C0D3CA !important",
    fontSize: "1.8rem !important",
    fontFamily: "'Cormorant Garamond', serif !important",
    fontWeight: "300 !important",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
    padding: "2rem 2.5rem",
    borderBottom: "1px solid rgba(192, 211, 202, 0.07)",
    "@media (max-width: 768px)": {
      flexDirection: "column !important",
      alignItems: "center !important",
      textAlign: "center !important",
      gap: "1rem !important",
      padding: "1.5rem !important",
    },
  },
  userName: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "2rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.08em !important",
    color: "#fff !important",
    lineHeight: "1.1 !important",
  },
  userEmail: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.78rem !important",
    fontWeight: "300 !important",
    color: "rgba(255, 255, 255, 0.38) !important",
    letterSpacing: "0.04em !important",
    marginTop: "0.25rem !important",
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    padding: "1.2rem 2.5rem",
    borderBottom: "1px solid rgba(192, 211, 202, 0.06)",
    "&:last-child": { borderBottom: "none" },
    "&:hover": { backgroundColor: "rgba(192,211,202,0.02)" },
    "@media (max-width: 768px)": {
      flexDirection: "column !important",
      alignItems: "flex-start !important",
      gap: "0.5rem !important",
      padding: "1rem 1.5rem !important",
    },
  },
  infoLabel: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.7rem !important",
    fontWeight: "600 !important",
    color: "#C0D3CA !important",
    minWidth: "120px",
    letterSpacing: "0.1em !important",
    textTransform: "uppercase",
  },
  infoValue: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    fontWeight: "300 !important",
    color: "#fff !important",
    flex: 1,
    letterSpacing: "0.02em",
  },
  missingInfo: {
    color: "rgba(255,255,255,0.2) !important",
    fontStyle: "italic",
    fontSize: "0.85rem !important",
  },
  editButton: {
    color: "rgba(192, 211, 202, 0.8) !important",
    backgroundColor: "transparent !important",
    border: "1px solid rgba(192, 211, 202, 0.2) !important",
    padding: "0.35rem 1rem !important",
    borderRadius: "2px !important",
    textTransform: "uppercase !important",
    fontSize: "0.68rem !important",
    fontWeight: "500 !important",
    fontFamily: "'Montserrat', sans-serif !important",
    letterSpacing: "0.1em !important",
    transition: "all 0.25s ease !important",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.07) !important",
      borderColor: "#C0D3CA !important",
      color: "#C0D3CA !important",
    },
  },
  measurementsGrid: {
    display: "grid !important",
    gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr)) !important",
    gap: "0.6rem !important",
    marginTop: "1.5rem !important",
    "@media (max-width: 480px)": {
      gridTemplateColumns: "repeat(3, 1fr) !important",
      gap: "0.4rem !important",
    },
  },
  measurementCard: {
    padding: "1.1rem 0.5rem !important",
    borderRadius: "2px !important",
    textAlign: "center",
    transition: "border-color 0.2s ease !important",
    "&:hover": {
      borderColor: "rgba(192, 211, 202, 0.3) !important",
    },
  },
  measurementValue: {
    fontSize: "1.5rem !important",
    fontWeight: "300 !important",
    color: "#fff !important",
    fontFamily: "'Cormorant Garamond', serif !important",
    letterSpacing: "0.02em !important",
    lineHeight: "1 !important",
    marginBottom: "0.4rem !important",
  },
  measurementLabel: {
    fontSize: "0.55rem !important",
    color: "rgba(255, 255, 255, 0.38) !important",
    textTransform: "uppercase !important",
    letterSpacing: "0.12em !important",
    fontFamily: "'Montserrat', sans-serif !important",
    fontWeight: "500 !important",
  },
  orderCard: {
    backgroundColor: "rgba(12, 12, 12, 0.88) !important",
    marginBottom: "0.75rem !important",
    borderRadius: "2px !important",
    border: "1px solid rgba(192, 211, 202, 0.1) !important",
    overflow: "hidden",
    backdropFilter: "blur(20px) !important",
    transition: "border-color 0.25s ease !important",
    "&:hover": {
      borderColor: "rgba(192, 211, 202, 0.22) !important",
    },
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.1rem 1.5rem",
    borderBottom: "1px solid rgba(192, 211, 202, 0.07) !important",
    "@media (max-width: 768px)": {
      flexDirection: "column !important",
      alignItems: "flex-start !important",
      gap: "0.75rem !important",
      padding: "1rem !important",
    },
  },
  orderNumber: {
    fontSize: "0.78rem !important",
    fontWeight: "500 !important",
    color: "#C0D3CA !important",
    fontFamily: "'Montserrat', sans-serif !important",
    letterSpacing: "0.12em !important",
    textTransform: "uppercase !important",
  },
  orderDate: {
    fontSize: "0.75rem !important",
    color: "rgba(255, 255, 255, 0.3) !important",
    fontFamily: "'Montserrat', sans-serif !important",
    letterSpacing: "0.04em !important",
    fontWeight: "300 !important",
  },
  orderStatus: {
    padding: "0.28rem 0.8rem !important",
    borderRadius: "20px !important",
    fontSize: "0.65rem !important",
    fontWeight: "600 !important",
    fontFamily: "'Montserrat', sans-serif !important",
    letterSpacing: "0.08em !important",
    textTransform: "uppercase !important",
  },
  statusPreparing: {
    backgroundColor: "rgba(255, 193, 7, 0.1) !important",
    color: "#FFC107 !important",
    border: "1px solid rgba(255, 193, 7, 0.22) !important",
  },
  statusShipped: {
    backgroundColor: "rgba(33, 150, 243, 0.1) !important",
    color: "#64B5F6 !important",
    border: "1px solid rgba(33, 150, 243, 0.22) !important",
  },
  statusCompleted: {
    backgroundColor: "rgba(192, 211, 202, 0.1) !important",
    color: "#C0D3CA !important",
    border: "1px solid rgba(192, 211, 202, 0.22) !important",
  },
  statusCancelled: {
    backgroundColor: "rgba(244, 67, 54, 0.1) !important",
    color: "#EF5350 !important",
    border: "1px solid rgba(244, 67, 54, 0.3)",
  },
  orderDetails: {
    padding: "1.5rem !important",
    backgroundColor: "rgba(30, 30, 30, 0.3) !important",
  },
  orderTotal: {
    fontSize: "1.1rem !important",
    fontWeight: "300 !important",
    color: "#fff !important",
    textAlign: "right !important",
    fontFamily: "'Cormorant Garamond', serif !important",
    letterSpacing: "0.05em !important",
  },
  logoutButton: {
    color: "rgba(255,255,255,0.4) !important",
    backgroundColor: "transparent !important",
    border: "none !important",
    padding: "1rem 1.5rem !important",
    borderRadius: "0 !important",
    textTransform: "uppercase !important",
    fontSize: "0.7rem !important",
    fontWeight: "400 !important",
    fontFamily: "'Montserrat', sans-serif !important",
    letterSpacing: "0.12em !important",
    transition: "color 0.2s ease !important",
    width: "100% !important",
    justifyContent: "flex-start !important",
    "&:hover": {
      color: "rgba(239,83,80,0.8) !important",
      backgroundColor: "rgba(239,83,80,0.04) !important",
    },
  },
  sidebarItem: {
    color: "rgba(255, 255, 255, 0.42) !important",
    borderBottom: "1px solid rgba(192, 211, 202, 0.06) !important",
    borderLeft: "3px solid transparent !important",
    padding: "1rem 1.5rem !important",
    transition: "all 0.22s ease !important",
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.72rem !important",
    fontWeight: "400 !important",
    letterSpacing: "0.1em !important",
    textTransform: "uppercase !important",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.04) !important",
      color: "rgba(255,255,255,0.75) !important",
      borderLeftColor: "rgba(192, 211, 202, 0.3) !important",
    },
    "&.active": {
      backgroundColor: "rgba(192, 211, 202, 0.06) !important",
      color: "#C0D3CA !important",
      borderLeftColor: "#C0D3CA !important",
      fontWeight: "600 !important",
    },
  },
  sidebarIcon: {
    color: "inherit !important",
    minWidth: "34px !important",
    "& svg": { fontSize: "1rem !important" },
  },
  sidebarText: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.72rem !important",
    fontWeight: "inherit !important",
    letterSpacing: "0.1em !important",
    textTransform: "uppercase !important",
    color: "inherit !important",
  },
  notLoggedIn: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "1.2rem !important",
    fontWeight: "300 !important",
    color: "#fff !important",
    textAlign: "center",
    letterSpacing: "0.05em !important",
  },
  luxuryBadge: {
    backgroundColor: "rgba(192, 211, 202, 0.1) !important",
    color: "#C0D3CA !important",
    border: "1px solid rgba(192, 211, 202, 0.3) !important",
    padding: "0.3rem 0.8rem !important",
    borderRadius: "20px !important",
    fontSize: "0.7rem !important",
    fontWeight: "600 !important",
    letterSpacing: "0.1em !important",
    textTransform: "uppercase",
  },
  productList: {
    margin: "1rem 0 !important",
    padding: "1rem !important",
    backgroundColor: "rgba(192, 211, 202, 0.02) !important",
    borderRadius: "4px !important",
    border: "1px solid rgba(192, 211, 202, 0.1) !important",
  },
  productItem: {
    display: "flex !important",
    alignItems: "center !important",
    gap: "0.5rem !important",
    padding: "0.5rem 0 !important",
    color: "rgba(255, 255, 255, 0.9) !important",
    fontSize: "0.9rem !important",
    fontFamily: "'Montserrat', sans-serif !important",
    letterSpacing: "0.02em !important",
    fontWeight: "300 !important",
  },
  deliveryInfo: {
    display: "flex !important",
    justifyContent: "space-between !important",
    alignItems: "center !important",
    marginTop: "1rem !important",
    padding: "1rem !important",
    backgroundColor: "rgba(192, 211, 202, 0.02) !important",
    borderRadius: "4px !important",
    border: "1px solid rgba(192, 211, 202, 0.1) !important",
  },
  deliveryText: {
    color: "rgba(255, 255, 255, 0.7) !important",
    fontSize: "0.9rem !important",
    fontFamily: "'Montserrat', sans-serif !important",
    letterSpacing: "0.02em !important",
    fontWeight: "300 !important",
  },
  profileSelectionContainer: {
    marginBottom: "3rem",
    "@media (max-width: 768px)": {
      marginBottom: "2rem !important",
    },
    "@media (max-width: 480px)": {
      marginBottom: "1.5rem !important",
    },
  },
  recommendedSizesContainer: {
    marginBottom: "3rem",
    "@media (max-width: 768px)": {
      marginBottom: "2rem !important",
    },
    "@media (max-width: 480px)": {
      marginBottom: "1.5rem !important",
    },
  },
  suitSpecCard: {
    backgroundColor: "rgba(192, 211, 202, 0.02) !important",
    border: "1px solid rgba(192, 211, 202, 0.1) !important",
    borderRadius: "4px !important",
    padding: "1rem",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    "&:hover": {
      border: "1px solid rgba(192, 211, 202, 0.2) !important",
      // transform: "translateY(-2px)",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
    },
    "@media (max-width: 768px)": {
      padding: "0.75rem !important",
      "&:hover": {
        transform: "none",
      },
    },
  },
  suitSpecLabel: {
    color: "rgba(255, 255, 255, 0.7) !important",
    fontSize: "0.85rem !important",
    fontFamily: "'Montserrat', sans-serif !important",
    fontWeight: "400 !important",
    letterSpacing: "0.02em !important",
  },
  suitSpecValue: {
    color: "#fff !important",
    fontSize: "0.85rem !important",
    fontFamily: "'Montserrat', sans-serif !important",
    fontWeight: "500 !important",
    letterSpacing: "0.02em !important",
  },
  suitSpecRow: {
    display: "flex !important",
    gap: 5,
    alignItems: "center !important",
    padding: "0.25rem 0 !important",
  },
});

function Account() {
  const classes = useStyles();
  const [user, setUser] = useAtom(authUserAtom);
  const { data } = useProduct();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderSortBy, setOrderSortBy] = useState("newest");

  // Dialog states
  const [openPhoneDialog, setOpenPhoneDialog] = useState(false);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [openNameDialog, setOpenNameDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openOrderDetailsDialog, setOpenOrderDetailsDialog] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [profileToDelete, setProfileToDelete] = useState(null);

  // Form states
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [address, setAddress] = useState(user?.address || "");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");

  // Update form states when user changes
  useEffect(() => {
    setPhoneNumber(user?.phoneNumber || "");
    setAddress(user?.address || "");
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
  }, [user]);

  // Size profiles state
  const [sizeProfiles, setSizeProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) {
        return;
      }

      setOrdersLoading(true);
      try {
        const response = await getUserOrders(user.email);

        if (response.success) {
          setOrders(response.orders || []);
        } else {
          console.error("❌ Failed to fetch orders:", response.message);
        }
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
        enqueueSnackbar("Failed to load order history", { variant: "error" });
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user?.email, enqueueSnackbar]);

  useEffect(() => {
    if (data?.sizes) {
      const profiles = Object.entries(data.sizes).reduce(
        (acc, [key, value]) => {
          if (key.startsWith("profile_")) {
            const profileName = key.replace("profile_", "");
            acc.push({
              name: profileName,
              sizes: value,
            });
          }
          return acc;
        },
        [],
      );
      setSizeProfiles(profiles);

      if (profiles.length > 0 && !selectedProfile) {
        setSelectedProfile(profiles[0]);
      }
    }
  }, [data]);

  const confirmLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim()) {
      enqueueSnackbar("Phone number cannot be empty", { variant: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await updateUser(user.email, { phoneNumber });
      setUser(updatedUser);
      enqueueSnackbar("Phone number updated successfully", {
        variant: "success",
      });
      setOpenPhoneDialog(false);
    } catch (error) {
      console.error("Error updating phone number:", error);
      enqueueSnackbar(error.message || "Failed to update phone number", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSubmit = async () => {
    if (!address.trim()) {
      enqueueSnackbar("Address cannot be empty", { variant: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await updateUser(user.email, { address });
      setUser(updatedUser);
      enqueueSnackbar("Address updated successfully", { variant: "success" });
      setOpenAddressDialog(false);
    } catch (error) {
      console.error("Error updating address:", error);
      enqueueSnackbar(error.message || "Failed to update address", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameSubmit = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      enqueueSnackbar("First and last name cannot be empty", {
        variant: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await updateUser(user.email, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        displayName: `${firstName.trim()} ${lastName.trim()}`,
      });
      setUser(updatedUser);
      enqueueSnackbar("Name updated successfully", { variant: "success" });
      setOpenNameDialog(false);
    } catch (error) {
      console.error("Error updating name:", error);
      enqueueSnackbar(error.message || "Failed to update name", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfile = (profileName) => {
    setProfileToDelete(profileName);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteProfile = async () => {
    if (!profileToDelete || !user?.email) {
      setOpenDeleteDialog(false);
      setProfileToDelete(null);
      return;
    }

    setIsLoading(true);
    try {
      // Delete profile from database
      await deleteSizeProfile(user.email, profileToDelete);

      // Update local state
      setSizeProfiles((prev) => prev.filter((p) => p.name !== profileToDelete));
      if (selectedProfile?.name === profileToDelete) {
        setSelectedProfile(
          sizeProfiles.find((p) => p.name !== profileToDelete) || null,
        );
      }

      enqueueSnackbar("Profile deleted successfully", { variant: "success" });
      setOpenDeleteDialog(false);
      setProfileToDelete(null);
    } catch (error) {
      console.error("Error deleting profile:", error);
      enqueueSnackbar(error.message || "Failed to delete profile", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "COMPLETED":
        return (
          <CheckCircleIcon style={{ color: "#4CAF50", fontSize: "1.2rem" }} />
        );
      case "PENDING":
        return (
          <ScheduleIcon style={{ color: "#FFC107", fontSize: "1.2rem" }} />
        );
      case "FAILED":
        return (
          <ErrorOutlineIcon style={{ color: "#F44336", fontSize: "1.2rem" }} />
        );
      case "CANCELLED":
        return <CancelIcon style={{ color: "#F44336", fontSize: "1.2rem" }} />;
      case "REFUNDED":
        return (
          <LocalShippingIcon style={{ color: "#2196F3", fontSize: "1.2rem" }} />
        );
      default:
        return (
          <ScheduleIcon style={{ color: "#FFC107", fontSize: "1.2rem" }} />
        );
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "COMPLETED":
        return classes.statusCompleted;
      case "PENDING":
        return classes.statusPreparing;
      case "FAILED":
      case "CANCELLED":
        return classes.statusCancelled;
      case "REFUNDED":
        return classes.statusShipped;
      default:
        return classes.statusPreparing;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const renderProfileSection = () => (
    <Box>
      <Typography className={classes.sectionTitle}>
        <PersonIcon style={{ fontSize: "2rem" }} /> {t("personalInformation")}
      </Typography>

      <Card className={classes.card}>
        <CardContent>
          <Box className={classes.userInfo}>
            <Avatar className={classes.avatar}>
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
            </Avatar>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-start" },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <Typography className={classes.userName}>
                {user?.displayName || user?.firstName || "User"}
              </Typography>
              <Typography className={classes.userEmail}>
                {user?.email}
              </Typography>
            </Box>
            <IconButton
              onClick={() => setOpenNameDialog(true)}
              style={{
                color: "#fff",
                marginLeft: "auto",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
              sx={{
                marginLeft: { xs: "0", md: "auto" },
                marginTop: { xs: "1rem", md: "0" },
              }}
            >
              <EditIcon />
            </IconButton>
          </Box>

          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>
              {t("firstName")}:
            </Typography>
            <Typography className={classes.infoValue}>
              {user?.firstName || t("notProvided")}
            </Typography>
          </Box>

          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>
              {t("lastName")}:
            </Typography>
            <Typography className={classes.infoValue}>
              {user?.lastName || t("notProvided")}
            </Typography>
          </Box>

          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>
              {t("emailAddress")}:
            </Typography>
            <Typography className={classes.infoValue}>{user?.email}</Typography>
          </Box>

          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>
              {t("phoneNumber")}:
            </Typography>
            <Typography
              className={`${classes.infoValue} ${
                !user?.phoneNumber ? classes.missingInfo : ""
              }`}
            >
              {user?.phoneNumber || t("missingPhoneNumber")}
            </Typography>
            <Button
              className={classes.editButton}
              onClick={() => setOpenPhoneDialog(true)}
            >
              {user?.phoneNumber ? t("edit") : t("add")}
            </Button>
          </Box>

          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>
              {t("deliveryAddress")}:
            </Typography>
            <Typography
              className={`${classes.infoValue} ${
                !user?.address ? classes.missingInfo : ""
              }`}
            >
              {user?.address || t("missingAddress")}
            </Typography>
            <Button
              className={classes.editButton}
              onClick={() => setOpenAddressDialog(true)}
            >
              {user?.address ? t("edit") : t("add")}
            </Button>
          </Box>

          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>
              {t("memberSince")}:
            </Typography>
            <Typography className={classes.infoValue}>
              {user?.metadata?.creationTime
                ? formatDate(user.metadata.creationTime)
                : "Unknown"}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  const renderMeasurementsSection = () => (
    <Box>
      <Typography className={classes.sectionTitle}>
        <HeightIcon style={{ fontSize: "2rem" }} /> {t("bodyMeasurements")}
      </Typography>

      <Card className={classes.card}>
        <CardContent sx={{ padding: { xs: "1rem", md: "1.5rem" } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: "1rem", md: 0 },
            }}
          >
            <Typography
              variant="h6"
              style={{
                color: "#fff",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.5rem",
              }}
              sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }}
            >
              {t("sizeProfiles")}
            </Typography>
            <Button
              className={classes.editButton}
              onClick={() => navigate("/sizes/measure")}
              sx={{
                fontSize: { xs: "0.8rem", md: "0.85rem" },
                padding: { xs: "0.5rem 1rem", md: "0.6rem 1.2rem" },
              }}
            >
              {t("editMeasurements")}
            </Button>
          </Box>

          {/* Recommended Sizes FIRST */}
          {data?.sizesTable && (
            <Box className={classes.recommendedSizesContainer}>
              <Typography
                variant="h6"
                style={{
                  color: "#C0D3CA",
                  mb: 2,
                  fontFamily: "'Cormorant Garamond', serif",
                }}
                sx={{
                  fontSize: { xs: "1.1rem", md: "1.3rem" },
                  mb: { xs: 1, md: 2 },
                }}
              >
                {t("recommendedSizes")}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Box className={classes.measurementCard}>
                  <Typography className={classes.measurementValue}>
                    {data.sizesTable.jacket}
                  </Typography>
                  <Typography className={classes.measurementLabel}>
                    {t("jacketSize")}
                  </Typography>
                </Box>
                <Box className={classes.measurementCard}>
                  <Typography className={classes.measurementValue}>
                    {data.sizesTable.pants}
                  </Typography>
                  <Typography className={classes.measurementLabel}>
                    {t("pantsSize")}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Select Profile SECOND */}
          {sizeProfiles.length > 0 && (
            <Box className={classes.profileSelectionContainer}>
              <Typography
                variant="subtitle2"
                style={{
                  color: "#fff",
                  mb: 1,
                  fontFamily: "'Montserrat', sans-serif",
                }}
                sx={{ fontSize: { xs: "0.85rem", md: "0.9rem" } }}
              >
                {t("selectProfile")}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {sizeProfiles.map((profile) => (
                    <Chip
                      key={profile.name}
                      label={profile.name}
                      onClick={() => setSelectedProfile(profile)}
                      variant={
                        selectedProfile?.name === profile.name
                          ? "filled"
                          : "outlined"
                      }
                      style={{
                        color: "#fff",
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        backgroundColor:
                          selectedProfile?.name === profile.name
                            ? "rgba(214, 64, 64, 0.3)"
                            : "transparent",
                      }}
                      sx={{
                        fontSize: { xs: "0.75rem", md: "0.8rem" },
                        height: { xs: "28px", md: "32px" },
                      }}
                    />
                  ))}
                </Box>
                {selectedProfile && (
                  <Button
                    onClick={() => handleDeleteProfile(selectedProfile.name)}
                    startIcon={<DeleteIcon />}
                    sx={{
                      color: "#ef5350",
                      border: "1px solid rgba(239, 83, 80, 0.3)",
                      backgroundColor: "rgba(239, 83, 80, 0.1)",
                      padding: "0.3rem 0.8rem",
                      fontSize: "0.8rem",
                      fontFamily: "'Montserrat', sans-serif",
                      height: "32px",
                      minWidth: "auto",
                      marginLeft: "1rem",
                      "&:hover": {
                        backgroundColor: "rgba(239, 83, 80, 0.2)",
                        border: "1px solid rgba(239, 83, 80, 0.5)",
                      },
                      "@media (max-width: 768px)": {
                        fontSize: "0.7rem",
                        padding: "0.2rem 0.6rem",
                        height: "28px",
                        marginLeft: "0.5rem",
                      },
                    }}
                  >
                    {t("deleteProfile")}
                  </Button>
                )}
              </Box>
            </Box>
          )}

          {/* Measurements Grid LAST */}
          {selectedProfile && (
            <Box className={classes.measurementsGrid}>
              {bodyPoints.map((point) => {
                const value = selectedProfile.sizes[point.category];
                return (
                  <Box
                    key={point.id}
                    className={classes.measurementCard}
                    style={{
                      backgroundColor: value
                        ? "rgba(255, 255, 255, 0.03)"
                        : "rgba(239, 83, 80, 0.1)",
                      border: value
                        ? "1px solid rgba(255, 255, 255, 0.08)"
                        : "1px solid rgba(239, 83, 80, 0.3)",
                    }}
                  >
                    <Typography className={classes.measurementValue}>
                      {value ? `${value} cm` : "?"}
                    </Typography>
                    <Typography className={classes.measurementLabel}>
                      {point.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );

  const renderOrderHistorySection = () => {
    // Sort orders based on selected criteria
    const sortedOrders = [...orders].sort((a, b) => {
      switch (orderSortBy) {
        case "newest":
          return new Date(b.paymentDate) - new Date(a.paymentDate);
        case "oldest":
          return new Date(a.paymentDate) - new Date(b.paymentDate);
        case "price-high":
          return (
            b.totalAmount + b.shippingCost - (a.totalAmount + a.shippingCost)
          );
        case "price-low":
          return (
            a.totalAmount + a.shippingCost - (b.totalAmount + b.shippingCost)
          );
        default:
          return new Date(b.paymentDate) - new Date(a.paymentDate);
      }
    });

    return (
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography className={classes.sectionTitle}>
            <ShoppingBagIcon style={{ fontSize: "2rem" }} /> {t("orderHistory")}
          </Typography>

          {/* Sort Dropdown */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
            }}
          >
            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "0.9rem",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: "500",
              }}
            >
              {t("sortBy")}
            </Typography>
            <Box
              component="select"
              value={orderSortBy}
              onChange={(e) => setOrderSortBy(e.target.value)}
              sx={{
                backgroundColor: "rgba(20,20,20,0.9)",
                color: "#fff",
                border: "1px solid rgba(192,211,202,0.3)",
                borderRadius: "4px",
                px: "14px",
                py: "8px",
                fontSize: "0.82rem",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 400,
                letterSpacing: "0.04em",
                cursor: "pointer",
                outline: "none",
                minWidth: "160px",
                appearance: "auto",
                "&:hover": {
                  borderColor: "rgba(192,211,202,0.6)",
                },
                "&:focus": {
                  borderColor: "#C0D3CA",
                },
                "& option": {
                  backgroundColor: "#1a1a1a",
                },
              }}
            >
              <option value="newest">{t("newestFirst")}</option>
              <option value="oldest">{t("oldestFirst")}</option>
              <option value="price-high">{t("priceHighToLow")}</option>
              <option value="price-low">{t("priceLowToHigh")}</option>
            </Box>
          </Box>
        </Box>

        {/* Order Summary */}
        {!ordersLoading && orders.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              p: 2,
              backgroundColor: "rgba(192, 211, 202, 0.02)",
              border: "1px solid rgba(192, 211, 202, 0.1)",
              borderRadius: "4px",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 1, sm: 0 },
            }}
          >
            <Typography
              sx={{
                color: "#C0D3CA",
                fontSize: "1rem",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: "500",
              }}
            >
              {t("totalOrders")}: {orders.length}
            </Typography>
            <Typography
              sx={{
                color: "#C0D3CA",
                fontSize: "1.1rem",
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: "400",
              }}
            >
              {t("totalSpent")}:{" "}
              {formatCurrency(
                orders.reduce(
                  (total, order) =>
                    total + order.totalAmount + order.shippingCost,
                  0,
                ),
              )}
            </Typography>
          </Box>
        )}

        {ordersLoading ? (
          <Card
            className={classes.card}
            sx={{
              backgroundColor: "rgba(30, 30, 30, 0.6) !important",
              border: "1px solid rgba(192, 211, 202, 0.2) !important",
              borderRadius: "4px !important",
            }}
          >
            <CardContent>
              <Typography
                style={{
                  textAlign: "center",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "1.1rem",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: "300",
                }}
              >
                {t("loadingOrders")}
              </Typography>
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card
            className={classes.card}
            sx={{
              backgroundColor: "rgba(30, 30, 30, 0.6) !important",
              border: "1px solid rgba(192, 211, 202, 0.2) !important",
              borderRadius: "4px !important",
            }}
          >
            <CardContent>
              <Typography
                style={{
                  textAlign: "center",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "1.1rem",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: "300",
                }}
              >
                {t("noOrdersFound")}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          sortedOrders.map((order) => (
            <Card
              key={order.orderId}
              className={classes.orderCard}
              sx={{
                backgroundColor: "rgba(30, 30, 30, 0.6) !important",
                border: "1px solid rgba(192, 211, 202, 0.2) !important",
                borderRadius: "4px !important",
                marginBottom: "1.5rem",
                transition: "all 0.4s ease",
                "&:hover": {
                  // transform: "translateY(-4px)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                  border: "1px solid rgba(192, 211, 202, 0.3) !important",
                },
              }}
            >
              <Box
                className={classes.orderHeader}
                sx={{
                  backgroundColor: "rgba(192, 211, 202, 0.02) !important",
                  borderBottom: "1px solid rgba(192, 211, 202, 0.1) !important",
                  padding: "1.5rem",
                }}
              >
                <Box>
                  <Typography className={classes.orderNumber}>
                    {t("order")} #{order.orderId.slice(-8).toUpperCase()}
                  </Typography>
                  <Typography className={classes.orderDate}>
                    {formatDate(order.paymentDate)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "white",
                  }}
                >
                  {getStatusIcon(order.status)}
                  <Chip
                    label={order.status}
                    className={getStatusClass(order.status)}
                    size="small"
                    sx={{
                      fontFamily: "'Montserrat', sans-serif",
                      // fontSize: "0.8rem",
                      // fontWeight: "600",
                      // letterSpacing: "0.05em",
                      // textTransform: "uppercase",
                      color: "white",
                    }}
                  />
                  {order.shippingSpeed === "EXPRESS" && (
                    <Chip
                      icon={<DiamondIcon />}
                      label={t("express")}
                      className={classes.luxuryBadge}
                      size="small"
                    />
                  )}
                </Box>
              </Box>

              <Box
                className={classes.orderDetails}
                sx={{
                  backgroundColor: "rgba(30, 30, 30, 0.3) !important",
                  padding: "1.5rem",
                }}
              >
                {/* Compact Suits Preview */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {order.selectedSuits.slice(0, 2).map((suit, index) => (
                    <Box
                      key={suit._id || index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "1rem",
                        backgroundColor: "rgba(192, 211, 202, 0.02)",
                        borderRadius: "8px",
                        border: "1px solid rgba(192, 211, 202, 0.1)",
                      }}
                    >
                      {/* Small Suit Image */}
                      <Box
                        sx={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <SuitImage suit={suit} />
                      </Box>

                      {/* Suit Info */}
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            color: "#C0D3CA",
                            fontSize: "1rem",
                            fontWeight: "600",
                            fontFamily: "'Montserrat', sans-serif",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {suit.kind === "kind1" && t("standardSuit")}
                          {suit.kind === "kind2" && t("premiumSuit")}
                          {suit.kind === "kind3" && t("luxurySuit")}
                          {suit.kind === "kind4" && t("customLuxurySuit")}
                          {!["kind1", "kind2", "kind3", "kind4"].includes(
                            suit.kind,
                          ) && suit.kind}
                        </Typography>
                        <Typography
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            fontSize: "0.9rem",
                            fontFamily: "'Montserrat', sans-serif",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {suit.color} • {suit.lapelType}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#C0D3CA",
                            fontSize: "1.1rem",
                            fontWeight: "600",
                            fontFamily: "'Cormorant Garamond', serif",
                          }}
                        >
                          {formatCurrency(suit.totalPrice || 0)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}

                  {
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "0.75rem",
                        borderTop: "1px solid rgba(192, 211, 202, 0.1)",
                        marginTop: "0.5rem",
                      }}
                    >
                      <Button
                        onClick={() => {
                          setSelectedOrder(order);
                          setOpenOrderDetailsDialog(true);
                        }}
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          fontSize: "0.85rem",
                          fontFamily: "'Montserrat', sans-serif",
                          fontWeight: "500",
                          textTransform: "none",
                          padding: "0.5rem 1rem",
                          backgroundColor: "rgba(192, 211, 202, 0.05)",
                          border: "1px solid rgba(192, 211, 202, 0.2)",
                          borderRadius: "6px",
                          "&:hover": {
                            backgroundColor: "rgba(192, 211, 202, 0.1)",
                            border: "1px solid rgba(192, 211, 202, 0.3)",
                          },
                          "@media (max-width: 768px)": {
                            fontSize: "0.8rem",
                            padding: "0.4rem 0.8rem",
                            width: "100%",
                          },
                        }}
                      >
                        {order.selectedSuits.length > 2
                          ? t("viewAllSuits").replace(
                              "{count}",
                              order.selectedSuits.length,
                            )
                          : t("viewMoreDetails")}
                      </Button>
                    </Box>
                  }
                </Box>
                <Box className={classes.deliveryInfo}>
                  <Typography className={classes.deliveryText}>
                    {t("estimatedDelivery")}{" "}
                    {order.estimatedDeliveryDate
                      ? formatDate(order.estimatedDeliveryDate)
                      : t("calculating")}
                  </Typography>
                  <Typography className={classes.orderTotal}>
                    {formatCurrency(order.totalAmount + order.shippingCost)}
                  </Typography>
                </Box>
              </Box>
            </Card>
          ))
        )}
      </Box>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSection();
      case "measurements":
        return renderMeasurementsSection();
      case "orders":
        return renderOrderHistorySection();
      default:
        return renderProfileSection();
    }
  };

  if (!user) {
    return (
      <Box
        sx={{
          backgroundColor: "#0a0a0a",
          color: "#fff",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: "80px",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            px: 4,
            py: 8,
            maxWidth: 480,
            border: "1px solid rgba(192,211,202,0.15)",
            borderRadius: "4px",
            backgroundColor: "rgba(30,30,30,0.5)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: { xs: "2rem", md: "2.8rem" },
              fontWeight: 300,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#fff",
              mb: 2,
            }}
          >
            {t("userProfile")}
          </Typography>
          <Box
            sx={{
              width: 40,
              height: "1px",
              backgroundColor: "rgba(192,211,202,0.4)",
              mx: "auto",
              mb: 3,
            }}
          />
          <Typography
            sx={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.9rem",
              fontWeight: 300,
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.05em",
              mb: 5,
            }}
          >
            {t("pleaseLogIn")}
          </Typography>
          <Box
            component="a"
            href="/LoginWithGoogle"
            sx={{
              display: "inline-block",
              border: "1px solid rgba(192,211,202,0.4)",
              color: "#C0D3CA",
              px: "36px",
              py: "12px",
              fontSize: "0.78rem",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(192,211,202,0.08)",
                borderColor: "#C0D3CA",
              },
            }}
          >
            Sign In
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className={classes.root}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 6, lg: 8 } }}>
        {/* ── Page header ───────────────────────────────────────────────────── */}
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
          <Typography
            sx={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: { xs: "1rem", md: "0.85rem" },
              fontWeight: 300,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#C0D3CA",
              mb: 1,
            }}
          >
            {t("userProfile")}
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              fontWeight: 300,
              letterSpacing: "0.1em",
              color: "#fff",
              lineHeight: 1.1,
            }}
          >
            {user?.displayName || user?.firstName || user?.email?.split("@")[0] || "Welcome"}
          </Typography>
          <Box
            sx={{
              width: 50,
              height: "1px",
              backgroundColor: "rgba(192,211,202,0.35)",
              mx: "auto",
              mt: 2.5,
            }}
          />
        </Box>

        {/* ── Stats bar ─────────────────────────────────────────────────────── */}
        <Box
          sx={{
            display: "flex",
            gap: { xs: 1.5, md: 3 },
            justifyContent: "center",
            mb: { xs: 4, md: 6 },
            flexWrap: "wrap",
          }}
        >
          {[
            { label: t("orderHistory"), value: orders.length || "—", section: "orders" },
            { label: t("bodyMeasurements"), value: sizeProfiles.length || "—", section: "measurements" },
            { label: "Member Since", value: user?.createdAt ? new Date(user.createdAt).getFullYear() : "2024", section: null },
          ].map(({ label, value, section }) => (
            <Box
              key={label}
              onClick={() => section && setActiveSection(section)}
              sx={{
                textAlign: "center",
                px: { xs: 3, md: 5 },
                py: 2,
                border: "1px solid rgba(192,211,202,0.1)",
                borderRadius: "2px",
                minWidth: 120,
                backgroundColor: "rgba(12,12,12,0.6)",
                backdropFilter: "blur(12px)",
                cursor: section ? "pointer" : "default",
                transition: "border-color 0.2s ease, background-color 0.2s ease",
                "&:hover": section ? {
                  borderColor: "rgba(192,211,202,0.3)",
                  backgroundColor: "rgba(192,211,202,0.05)",
                } : {},
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: { xs: "1.8rem", md: "2.2rem" },
                  fontWeight: 300,
                  color: "#fff",
                  lineHeight: 1,
                  mb: 0.5,
                }}
              >
                {value}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.6rem",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Grid container spacing={3}>
          {/* Sidebar - Hidden on Mobile */}
          <Grid
            item
            xs={12}
            md={3}
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <Paper
              className={classes.sidebar}
              elevation={0}
              sx={{ border: "none !important" }}
            >
              <List sx={{ p: 0 }}>
                <ListItem
                  className={`${classes.sidebarItem} ${
                    activeSection === "profile" ? "active" : ""
                  }`}
                  onClick={() => setActiveSection("profile")}
                  sx={{
                    borderBottom:
                      "1px solid rgba(192, 211, 202, 0.1) !important",
                    cursor: "pointer",
                  }}
                >
                  <ListItemIcon className={classes.sidebarIcon}>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={t("personalInformation")}
                    primaryTypographyProps={{ className: classes.sidebarText }}
                  />
                </ListItem>

                <ListItem
                  className={`${classes.sidebarItem} ${
                    activeSection === "measurements" ? "active" : ""
                  }`}
                  onClick={() => setActiveSection("measurements")}
                  sx={{
                    borderBottom:
                      "1px solid rgba(192, 211, 202, 0.1) !important",
                    cursor: "pointer",
                  }}
                >
                  <ListItemIcon className={classes.sidebarIcon}>
                    <HeightIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={t("bodyMeasurements")}
                    primaryTypographyProps={{ className: classes.sidebarText }}
                  />
                </ListItem>

                <ListItem
                  className={`${classes.sidebarItem} ${
                    activeSection === "orders" ? "active" : ""
                  }`}
                  onClick={() => setActiveSection("orders")}
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  <ListItemIcon className={classes.sidebarIcon}>
                    <Badge badgeContent={orders.length} color="error">
                      <ShoppingBagIcon />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary={t("orderHistory")}
                    primaryTypographyProps={{ className: classes.sidebarText }}
                  />
                </ListItem>
              </List>

              <Box
                sx={{
                  p: 2,
                  borderTop: "1px solid rgba(192, 211, 202, 0.1)",
                  backgroundColor: "rgba(192, 211, 202, 0.02)",
                }}
              >
                <Button
                  fullWidth
                  className={classes.logoutButton}
                  startIcon={<LogoutIcon />}
                  onClick={() => setOpenLogoutDialog(true)}
                >
                  Log Out
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <Box className={classes.mainContent}>{renderContent()}</Box>
          </Grid>
        </Grid>

        {/* Mobile Bottom Navigation */}
        <Box className={classes.mobileBottomNav}>
          <Box
            className={`${classes.mobileTabItem} ${
              activeSection === "profile" ? "active" : ""
            }`}
            onClick={() => setActiveSection("profile")}
          >
            <PersonIcon
              className={`${classes.mobileTabIcon} ${
                activeSection === "profile" ? "active" : ""
              }`}
            />
            <Typography
              className={`${classes.mobileTabLabel} ${
                activeSection === "profile" ? "active" : ""
              }`}
            >
              Profile
            </Typography>
          </Box>
          <Box
            className={`${classes.mobileTabItem} ${
              activeSection === "measurements" ? "active" : ""
            }`}
            onClick={() => setActiveSection("measurements")}
          >
            <HeightIcon
              className={`${classes.mobileTabIcon} ${
                activeSection === "measurements" ? "active" : ""
              }`}
            />
            <Typography
              className={`${classes.mobileTabLabel} ${
                activeSection === "measurements" ? "active" : ""
              }`}
            >
              Measurements
            </Typography>
          </Box>
          <Box
            className={`${classes.mobileTabItem} ${
              activeSection === "orders" ? "active" : ""
            }`}
            onClick={() => setActiveSection("orders")}
          >
            <Badge badgeContent={orders.length} color="error">
              <ShoppingBagIcon
                className={`${classes.mobileTabIcon} ${
                  activeSection === "orders" ? "active" : ""
                }`}
              />
            </Badge>
            <Typography
              className={`${classes.mobileTabLabel} ${
                activeSection === "orders" ? "active" : ""
              }`}
            >
              Orders
            </Typography>
          </Box>
          <Box
            className={classes.mobileTabItem}
            onClick={() => setOpenLogoutDialog(true)}
          >
            <LogoutIcon className={classes.mobileTabIcon} />
            <Typography className={classes.mobileTabLabel}>Logout</Typography>
          </Box>
        </Box>
      </Container>

      {/* Dialogs */}
      <Dialog
        open={openPhoneDialog}
        onClose={() => !isLoading && setOpenPhoneDialog(false)}
        PaperProps={{
          style: {
            backgroundColor: "#202020",
            color: "#fff",
            borderRadius: "4px",
            border: "1px solid rgba(192, 211, 202, 0.2)",
          },
        }}
      >
        <DialogTitle
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.5rem",
            color: "#C0D3CA",
          }}
        >
          Edit Phone Number
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Phone Number"
            type="tel"
            fullWidth
            variant="outlined"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": {
                  borderColor: "rgba(192, 211, 202, 0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(192, 211, 202, 0.5)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#C0D3CA",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(192, 211, 202, 0.7)",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenPhoneDialog(false)}
            sx={{ color: "#fff" }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePhoneSubmit}
            variant="contained"
            sx={{
              backgroundColor: "rgba(192, 211, 202, 0.1)",
              color: "#fff",
              border: "1px solid rgba(192, 211, 202, 0.3)",
              "&:hover": {
                backgroundColor: "rgba(192, 211, 202, 0.2)",
              },
            }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAddressDialog}
        onClose={() => !isLoading && setOpenAddressDialog(false)}
        PaperProps={{
          style: {
            backgroundColor: "#202020",
            color: "#fff",
            borderRadius: "4px",
            border: "1px solid rgba(192, 211, 202, 0.2)",
          },
        }}
      >
        <DialogTitle
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.5rem",
            color: "#C0D3CA",
          }}
        >
          Edit Address
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Address"
            type="text"
            fullWidth
            variant="outlined"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": {
                  borderColor: "rgba(192, 211, 202, 0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(192, 211, 202, 0.5)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#C0D3CA",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(192, 211, 202, 0.7)",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenAddressDialog(false)}
            sx={{ color: "#fff" }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddressSubmit}
            variant="contained"
            sx={{
              backgroundColor: "rgba(192, 211, 202, 0.1)",
              color: "#fff",
              border: "1px solid rgba(192, 211, 202, 0.3)",
              "&:hover": {
                backgroundColor: "rgba(192, 211, 202, 0.2)",
              },
            }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openNameDialog}
        onClose={() => !isLoading && setOpenNameDialog(false)}
        PaperProps={{
          style: {
            backgroundColor: "#202020",
            color: "#fff",
            borderRadius: "4px",
            border: "1px solid rgba(192, 211, 202, 0.2)",
          },
        }}
      >
        <DialogTitle
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.5rem",
            color: "#C0D3CA",
          }}
        >
          Edit Name
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            type="text"
            fullWidth
            variant="outlined"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": {
                  borderColor: "rgba(192, 211, 202, 0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(192, 211, 202, 0.5)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#C0D3CA",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(192, 211, 202, 0.7)",
              },
            }}
          />
          <TextField
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            variant="outlined"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": {
                  borderColor: "rgba(192, 211, 202, 0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(192, 211, 202, 0.5)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#C0D3CA",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(192, 211, 202, 0.7)",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenNameDialog(false)}
            sx={{ color: "#fff" }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleNameSubmit}
            variant="contained"
            sx={{
              backgroundColor: "rgba(192, 211, 202, 0.1)",
              color: "#fff",
              border: "1px solid rgba(192, 211, 202, 0.3)",
              "&:hover": {
                backgroundColor: "rgba(192, 211, 202, 0.2)",
              },
            }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Profile Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          style: {
            backgroundColor: "#202020",
            color: "#fff",
            borderRadius: "4px",
            border: "1px solid rgba(192, 211, 202, 0.2)",
            maxWidth: "400px",
            width: "100%",
          },
        }}
      >
        <DialogTitle
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.5rem",
            color: "#ef5350",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <CancelIcon style={{ color: "#ef5350" }} />
          Delete Profile
        </DialogTitle>
        <DialogContent>
          <Typography
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "1rem",
              color: "#fff",
              marginBottom: "1rem",
            }}
          >
            Are you sure you want to delete the profile{" "}
            <strong>"{profileToDelete}"</strong>?
          </Typography>
          <Typography
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.9rem",
              color: "rgba(255, 255, 255, 0.7)",
              fontStyle: "italic",
            }}
          >
            This action cannot be undone. All measurements associated with this
            profile will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            sx={{ color: "#fff" }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteProfile}
            variant="contained"
            disabled={isLoading}
            sx={{
              backgroundColor: "#ef5350",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#d32f2f",
              },
            }}
          >
            {isLoading ? <CircularProgress size={24} /> : "Delete Profile"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog
        open={openOrderDetailsDialog}
        onClose={() => setOpenOrderDetailsDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: "#202020",
            color: "#fff",
            borderRadius: "8px",
            border: "1px solid rgba(192, 211, 202, 0.2)",
            margin: "1rem",
            maxHeight: "90vh",
            overflow: "hidden",
          },
        }}
        sx={{
          "& .MuiDialog-paper": {
            "@media (max-width: 768px)": {
              margin: "0.5rem",
              maxHeight: "95vh",
              width: "calc(100% - 1rem)",
            },
          },
        }}
      >
        {selectedOrder && (
          <>
            <DialogTitle
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.8rem",
                color: "#C0D3CA",
                borderBottom: "1px solid rgba(192, 211, 202, 0.2)",
                padding: "1.5rem",
              }}
              sx={{
                "@media (max-width: 768px)": {
                  fontSize: "1.4rem",
                  padding: "1rem",
                },
              }}
            >
              Order Details - #{selectedOrder.orderId.slice(-8).toUpperCase()}
            </DialogTitle>
            <DialogContent
              sx={{
                padding: "1.5rem",
                "@media (max-width: 768px)": {
                  padding: "1rem",
                },
              }}
            >
              {/* Order Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                  padding: "1rem",
                  backgroundColor: "rgba(192, 211, 202, 0.02)",
                  borderRadius: "8px",
                  border: "1px solid rgba(192, 211, 202, 0.1)",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: "#C0D3CA",
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      fontFamily: "'Montserrat', sans-serif",
                      mb: 0.5,
                    }}
                  >
                    {formatDate(selectedOrder.paymentDate)}
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      fontSize: "0.9rem",
                      fontFamily: "'Montserrat', sans-serif",
                    }}
                  >
                    Total:{" "}
                    {formatCurrency(
                      selectedOrder.totalAmount + selectedOrder.shippingCost,
                    )}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {getStatusIcon(selectedOrder.status)}
                  <Chip
                    label={selectedOrder.status}
                    className={getStatusClass(selectedOrder.status)}
                    size="small"
                    sx={{ color: "white" }}
                  />
                  {selectedOrder.shippingSpeed === "EXPRESS" && (
                    <Chip
                      icon={<DiamondIcon />}
                      label={t("express")}
                      className={classes.luxuryBadge}
                      size="small"
                    />
                  )}
                </Box>
              </Box>

              {/* Detailed Suits */}
              <Typography
                variant="h6"
                sx={{
                  color: "#C0D3CA",
                  mb: 2,
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: "600",
                  fontSize: "1.3rem",
                }}
              >
                Suits ({selectedOrder.selectedSuits.length})
              </Typography>

              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
              >
                {selectedOrder.selectedSuits.map((suit, index) => (
                  <Card
                    key={suit._id || index}
                    sx={{
                      backgroundColor: "rgba(192, 211, 202, 0.02)",
                      border: "1px solid rgba(192, 211, 202, 0.1)",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        p: 2,
                        "@media (max-width: 768px)": {
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                        },
                      }}
                    >
                      {/* Large Suit Image */}
                      <Box
                        sx={{
                          width: "150px",
                          height: "150px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 2,
                          flexShrink: 0,
                          "@media (max-width: 768px)": {
                            width: "120px",
                            height: "120px",
                            mr: 0,
                            mb: 1,
                          },
                        }}
                      >
                        <SuitImage suit={suit} />
                      </Box>

                      {/* Suit Details */}
                      <Box
                        sx={{
                          flex: 1,
                          "@media (max-width: 768px)": {
                            width: "100%",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#C0D3CA",
                            fontSize: "1.3rem",
                            fontWeight: "600",
                            fontFamily: "'Montserrat', sans-serif",
                            mb: 1,
                          }}
                        >
                          Suit #{index + 1} -{" "}
                          {suit.kind === "kind1" && t("standardSuit")}
                          {suit.kind === "kind2" && t("premiumSuit")}
                          {suit.kind === "kind3" && t("luxurySuit")}
                          {suit.kind === "kind4" && t("customLuxurySuit")}
                          {!["kind1", "kind2", "kind3", "kind4"].includes(
                            suit.kind,
                          ) && suit.kind}
                        </Typography>

                        <Typography
                          sx={{
                            color: "#C0D3CA",
                            fontSize: "1.4rem",
                            fontWeight: "600",
                            fontFamily: "'Cormorant Garamond', serif",
                            mb: 2,
                          }}
                        >
                          {formatCurrency(suit.totalPrice || 0)}
                        </Typography>

                        {/* Specifications Grid */}
                        <Grid
                          container
                          spacing={2}
                          sx={{
                            "@media (max-width: 768px)": {
                              spacing: 1,
                            },
                          }}
                        >
                          {suit.color && (
                            <Grid item xs={12} sm={6}>
                              <Box className={classes.suitSpecRow}>
                                <Typography className={classes.suitSpecLabel}>
                                  Color:
                                </Typography>
                                <Typography
                                  className={classes.suitSpecValue}
                                  sx={{ textTransform: "capitalize" }}
                                >
                                  {suit.color}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                          {suit.lapelType && (
                            <Grid item xs={12} sm={6}>
                              <Box className={classes.suitSpecRow}>
                                <Typography className={classes.suitSpecLabel}>
                                  Lapel:
                                </Typography>
                                <Typography className={classes.suitSpecValue}>
                                  {suit.lapelType}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                          {suit.lapelKind && (
                            <Grid item xs={12} sm={6}>
                              <Box className={classes.suitSpecRow}>
                                <Typography className={classes.suitSpecLabel}>
                                  Collar:
                                </Typography>
                                <Typography className={classes.suitSpecValue}>
                                  {suit.lapelKind === "collarTight"
                                    ? "Tight Collar"
                                    : "Wide Collar"}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                          {suit.insideColor && (
                            <Grid item xs={12} sm={6}>
                              <Box className={classes.suitSpecRow}>
                                <Typography className={classes.suitSpecLabel}>
                                  Lining:
                                </Typography>
                                <Typography
                                  className={classes.suitSpecValue}
                                  sx={{ textTransform: "capitalize" }}
                                >
                                  {suit.insideColor}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                          {suit.buttonColor && (
                            <Grid item xs={12} sm={6}>
                              <Box className={classes.suitSpecRow}>
                                <Typography className={classes.suitSpecLabel}>
                                  Buttons:
                                </Typography>
                                <Typography
                                  className={classes.suitSpecValue}
                                  sx={{ textTransform: "capitalize" }}
                                >
                                  {suit.buttonColor}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                          {suit.poshetColor && (
                            <Grid item xs={12} sm={6}>
                              <Box className={classes.suitSpecRow}>
                                <Typography className={classes.suitSpecLabel}>
                                  Pocket Square:
                                </Typography>
                                <Typography
                                  className={classes.suitSpecValue}
                                  sx={{ textTransform: "capitalize" }}
                                >
                                  {suit.poshetColor}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    </Box>
                  </Card>
                ))}
              </Box>

              {/* Size Profile & Measurements */}
              {(selectedOrder.sizeProfile ||
                selectedOrder.sizeMeasurements) && (
                <Box
                  sx={{
                    mt: 3,
                    padding: "1.5rem",
                    backgroundColor: "rgba(192, 211, 202, 0.02)",
                    borderRadius: "8px",
                    border: "1px solid rgba(192, 211, 202, 0.1)",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#C0D3CA",
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      fontFamily: "'Montserrat', sans-serif",
                      mb: 2,
                    }}
                  >
                    Size Profile & Measurements
                  </Typography>

                  {selectedOrder.sizeProfile && (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          fontSize: "0.9rem",
                          fontFamily: "'Montserrat', sans-serif",
                          mb: 0.5,
                        }}
                      >
                        Profile Used:
                      </Typography>
                      <Typography
                        sx={{
                          color: "#C0D3CA",
                          fontSize: "1rem",
                          fontWeight: "600",
                          fontFamily: "'Montserrat', sans-serif",
                        }}
                      >
                        {selectedOrder.sizeProfile}
                      </Typography>
                    </Box>
                  )}

                  {selectedOrder.sizeMeasurements &&
                    Object.keys(selectedOrder.sizeMeasurements).length > 0 && (
                      <Box>
                        <Typography
                          sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            fontSize: "0.9rem",
                            fontFamily: "'Montserrat', sans-serif",
                            mb: 1,
                          }}
                        >
                          Measurements:
                        </Typography>
                        <Grid container spacing={2}>
                          {Object.entries(selectedOrder.sizeMeasurements).map(
                            ([key, value]) => (
                              <Grid item xs={12} sm={6} md={4} key={key}>
                                <Box
                                  sx={{
                                    padding: "0.75rem",
                                    backgroundColor:
                                      "rgba(255, 255, 255, 0.03)",
                                    borderRadius: "6px",
                                    border:
                                      "1px solid rgba(255, 255, 255, 0.08)",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      color: "rgba(255, 255, 255, 0.7)",
                                      fontSize: "0.8rem",
                                      fontFamily: "'Montserrat', sans-serif",
                                      textTransform: "capitalize",
                                      mb: 0.25,
                                    }}
                                  >
                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      color: "#C0D3CA",
                                      fontSize: "1rem",
                                      fontWeight: "600",
                                      fontFamily: "'Montserrat', sans-serif",
                                    }}
                                  >
                                    {value} cm
                                  </Typography>
                                </Box>
                              </Grid>
                            ),
                          )}
                        </Grid>
                      </Box>
                    )}
                </Box>
              )}

              {/* Delivery Info */}
              <Box
                sx={{
                  mt: 3,
                  padding: "1rem",
                  backgroundColor: "rgba(192, 211, 202, 0.02)",
                  borderRadius: "8px",
                  border: "1px solid rgba(192, 211, 202, 0.1)",
                }}
              >
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "0.9rem",
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  {t("estimatedDelivery")}{" "}
                  {selectedOrder.estimatedDeliveryDate
                    ? formatDate(selectedOrder.estimatedDeliveryDate)
                    : t("calculating")}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions
              sx={{
                padding: "1.5rem",
                borderTop: "1px solid rgba(192, 211, 202, 0.2)",
                "@media (max-width: 768px)": {
                  padding: "1rem",
                  flexDirection: "column",
                  gap: "0.5rem",
                },
              }}
            >
              <Button
                onClick={() => setOpenOrderDetailsDialog(false)}
                sx={{
                  color: "#fff",
                  "@media (max-width: 768px)": {
                    width: "100%",
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
        PaperProps={{
          style: {
            backgroundColor: "#202020",
            color: "#fff",
            borderRadius: "8px",
            border: "1px solid rgba(192, 211, 202, 0.2)",
            maxWidth: "400px",
            width: "100%",
          },
        }}
      >
        <DialogTitle
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.5rem",
            color: "#C0D3CA",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <LogoutIcon style={{ color: "#C0D3CA" }} />
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <Typography
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "1rem",
              color: "#fff",
              marginBottom: "1rem",
            }}
          >
            Are you sure you want to log out?
          </Typography>
          <Typography
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.9rem",
              color: "rgba(255, 255, 255, 0.7)",
              fontStyle: "italic",
            }}
          >
            You will need to log in again to access your account.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenLogoutDialog(false)}
            sx={{ color: "#fff" }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmLogout}
            variant="contained"
            sx={{
              backgroundColor: "#ef5350",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#d32f2f",
              },
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Account;

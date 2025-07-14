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
} from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { bodyPoints } from "../consts/KindOfColors";
import useProduct from "../Hooks/useProduct";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../api/user";
import { useSnackbar } from "notistack";
import { getUserOrders } from "../api/orders";

// Button color mapping extracted and expanded
const buttonColorMap = {
  black: "blackGrey",
  grey: "greyLight",
  // Add other mappings as needed
};

// Extracted to separate function with added caching mechanism
const loadImage = async (key, path) => {
  // Use URL cache to avoid redundant HEAD requests
  if (!loadImage.cache) loadImage.cache = new Map();
  const cacheKey = `${key}-${path}`;

  if (loadImage.cache.has(cacheKey)) {
    return loadImage.cache.get(cacheKey);
  }

  try {
    const imageUrl = path;
    const response = await fetch(imageUrl, { method: "HEAD" });

    const result = response.ok ? { key, src: imageUrl } : { key, src: null };

    if (!response.ok) {
      console.warn(`⚠️ Missing image for ${key} at path: ${path}`);
    }

    loadImage.cache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.warn(`⚠️ Error loading image for ${key} at path: ${path}:`, error);
    const result = { key, src: null };
    loadImage.cache.set(cacheKey, result);
    return result;
  }
};

const getImagePaths = (item) => {
  const imagePaths = [
    {
      key: "insideUp",
      path: `/assets/ragach/insideUp/${item.insideColor}.png`,
    },
    {
      key: "lapelCollar",
      path: `/assets/ragach/${item.lapelKind}/${item.lapelType}/${item.kind}/${item.color}.png`,
    },
    { key: "colar", path: `/assets/ragach/colar/${item.color}.png` },
    { key: "sleeves", path: `/assets/ragach/sleeves/${item.color}.png` },
    {
      key: "insideBottom",
      path: `/assets/ragach/insideBottom/${item.color}.png`,
    },
    { key: "packetUp", path: `/assets/ragach/packetUp/${item.color}.png` },
  ];

  // Add conditional parts
  if (item?.bottomPart === "bottom") {
    imagePaths.push({
      key: "bottom",
      path: `/assets/ragach/bottom/${item.color}.png`,
    });
  }

  if (item?.bottomPart === "bottomKind3") {
    imagePaths.push({
      key: "bottomKind3",
      path: `/assets/ragach/bottomKind3/${item.color}.png`,
    });
  }

  if (item?.holeButtonColor) {
    imagePaths.push({
      key: "holeButton",
      path: `/assets/adds/holesButton/${item.kind}/${item.holeButtonColor}.png`,
    });
  }

  if (item?.holeButtonUpColor) {
    imagePaths.push({
      key: "holeButtonUp",
      path: `/assets/adds/holesButtonUp/${item.holeButtonUpColor}.png`,
    });
  }

  if (item.poshetColor) {
    imagePaths.push({
      key: "poshetColor",
      path: `/assets/adds/poshet/${item.poshetColor}.png`,
    });
  }

  if (item.buttonColor) {
    const actualColor = buttonColorMap[item.buttonColor] || item.buttonColor;
    imagePaths.push({
      key: "button",
      path: `/assets/ragach/button/${item.kind}/${actualColor}.png`,
    });
  }

  return imagePaths;
};

const fetchImages = async (item) => {
  if (!item) return {};

  const imagePaths = getImagePaths(item);
  const images = await Promise.all(
    imagePaths.map(({ key, path }) => loadImage(key, path))
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
    paddingTop: "120px",
    paddingBottom: "80px",
    "@media (max-width: 768px)": {
      paddingTop: "100px",
      paddingBottom: "120px",
    },
  },
  sidebar: {
    width: 320,
    backgroundColor: "rgba(30, 30, 30, 0.6) !important",
    borderRight: "1px solid rgba(192, 211, 202, 0.2) !important",
    height: "calc(100vh - 200px)",
    position: "sticky",
    top: 120,
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    borderRadius: "4px",
    marginRight: "2rem",
    "@media (max-width: 768px)": {
      width: "100% !important",
      height: "auto !important",
      position: "static !important",
      marginRight: "0 !important",
      marginBottom: "2rem !important",
      borderRadius: "4px !important",
    },
  },
  mobileBottomNav: {
    display: "none",
    "@media (max-width: 768px)": {
      display: "flex !important",
      position: "fixed !important",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(30, 30, 30, 0.95) !important",
      backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(192, 211, 202, 0.2) !important",
      zIndex: 1000,
      padding: "0.5rem 0",
    },
  },
  mobileTabItem: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0.5rem",
    color: "rgba(255, 255, 255, 0.6) !important",
    textDecoration: "none",
    transition: "all 0.3s ease",
    borderRadius: "8px",
    margin: "0 0.25rem",
    "@media (max-width: 768px)": {
      "&.active": {
        color: "#C0D3CA !important",
        backgroundColor: "rgba(192, 211, 202, 0.1) !important",
        border: "1px solid rgba(192, 211, 202, 0.3) !important",
        transform: "translateY(-2px)",
        boxShadow: "0 4px 12px rgba(192, 211, 202, 0.2)",
      },
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        transform: "translateY(-1px)",
      },
    },
  },
  mobileTabIcon: {
    fontSize: "1.5rem !important",
    marginBottom: "0.25rem",
    transition: "all 0.3s ease",
    "@media (max-width: 768px)": {
      fontSize: "1.2rem !important",
      "&.active": {
        transform: "scale(1.1)",
      },
    },
  },
  mobileTabLabel: {
    fontSize: "0.7rem !important",
    fontFamily: "'Montserrat', sans-serif !important",
    fontWeight: "400 !important",
    letterSpacing: "0.05em !important",
    textTransform: "uppercase",
    transition: "all 0.3s ease",
    "@media (max-width: 768px)": {
      fontSize: "0.65rem !important",
      "&.active": {
        fontWeight: "600 !important",
        transform: "scale(1.05)",
      },
    },
  },
  mainContent: {
    flex: 1,
    paddingLeft: "2.5rem",
    "@media (max-width: 768px)": {
      paddingLeft: "0 !important",
    },
  },
  heading: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "3.5rem !important",
    fontWeight: "300 !important",
    marginBottom: "3rem !important",
    letterSpacing: "0.15em !important",
    color: "#fff !important",
    textAlign: "center",
    textTransform: "uppercase",
    "@media (max-width: 768px)": {
      fontSize: "2.5rem !important",
      marginBottom: "2rem !important",
    },
  },
  sectionTitle: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "2.2rem !important",
    fontWeight: "300 !important",
    marginBottom: "2rem !important",
    letterSpacing: "0.1em !important",
    color: "#C0D3CA !important",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    textTransform: "uppercase",
    "@media (max-width: 768px)": {
      fontSize: "1.8rem !important",
      marginBottom: "1.5rem !important",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "0.5rem",
    },
  },
  card: {
    backgroundColor: "rgba(30, 30, 30, 0.6) !important",
    border: "1px solid rgba(192, 211, 202, 0.2) !important",
    borderRadius: "4px !important",
    marginBottom: "2rem",
    transition: "all 0.4s ease",
    backdropFilter: "blur(10px)",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
      border: "1px solid rgba(192, 211, 202, 0.3) !important",
    },
    "@media (max-width: 768px)": {
      marginBottom: "1.5rem !important",
      "& .MuiCardContent-root": {
        padding: "1rem !important",
      },
    },
    "@media (max-width: 480px)": {
      marginBottom: "1rem !important",
      "& .MuiCardContent-root": {
        padding: "0.75rem !important",
      },
    },
  },
  avatar: {
    width: 100,
    height: 100,
    border: "3px solid rgba(192, 211, 202, 0.3)",
    backgroundColor: "rgba(192, 211, 202, 0.05)",
    backdropFilter: "blur(10px)",
    "@media (max-width: 768px)": {
      width: 80,
      height: 80,
      border: "2px solid rgba(192, 211, 202, 0.3)",
    },
    "@media (max-width: 480px)": {
      width: 70,
      height: 70,
    },
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    marginBottom: "2rem",
    padding: "1.5rem",
    backgroundColor: "rgba(192, 211, 202, 0.02)",
    borderRadius: "4px",
    border: "1px solid rgba(192, 211, 202, 0.1)",
    "@media (max-width: 768px)": {
      flexDirection: "column !important",
      alignItems: "center !important",
      textAlign: "center !important",
      gap: "1rem !important",
      padding: "1rem !important",
      marginBottom: "1.5rem !important",
    },
  },
  userName: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "2.5rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.1em !important",
    color: "#fff !important",
    "@media (max-width: 768px)": {
      fontSize: "2rem !important",
      textAlign: "center !important",
    },
    "@media (max-width: 480px)": {
      fontSize: "1.8rem !important",
    },
  },
  userEmail: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "1rem !important",
    fontWeight: "300 !important",
    color: "rgba(255, 255, 255, 0.7) !important",
    letterSpacing: "0.05em !important",
    "@media (max-width: 768px)": {
      fontSize: "0.9rem !important",
      textAlign: "center !important",
    },
    "@media (max-width: 480px)": {
      fontSize: "0.85rem !important",
    },
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    padding: "1.2rem 0",
    borderBottom: "1px solid rgba(192, 211, 202, 0.1)",
    "&:last-child": {
      borderBottom: "none",
    },
    "@media (max-width: 768px)": {
      flexDirection: "column !important",
      alignItems: "flex-start !important",
      gap: "0.5rem !important",
      padding: "1rem 0 !important",
    },
  },
  infoLabel: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.95rem !important",
    fontWeight: "500 !important",
    color: "#C0D3CA !important",
    minWidth: "140px",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    "@media (max-width: 768px)": {
      minWidth: "auto !important",
      fontSize: "0.85rem !important",
      fontWeight: "600 !important",
    },
    "@media (max-width: 480px)": {
      fontSize: "0.8rem !important",
    },
  },
  infoValue: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "1rem !important",
    fontWeight: "300 !important",
    color: "#fff !important",
    flex: 1,
    letterSpacing: "0.02em",
    "@media (max-width: 768px)": {
      fontSize: "0.9rem !important",
      width: "100% !important",
      textAlign: "left !important",
    },
    "@media (max-width: 480px)": {
      fontSize: "0.85rem !important",
    },
  },
  missingInfo: {
    color: "#ef5350 !important",
    fontStyle: "italic",
  },
  editButton: {
    color: "#fff !important",
    backgroundColor: "rgba(192, 211, 202, 0.1) !important",
    border: "1px solid rgba(192, 211, 202, 0.3) !important",
    padding: "0.6rem 1.2rem",
    borderRadius: "0",
    textTransform: "none",
    fontSize: "0.85rem",
    fontWeight: "500",
    fontFamily: "'Montserrat', sans-serif !important",
    letterSpacing: "0.05em !important",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.2) !important",
      transform: "translateY(-2px)",
      boxShadow: "0 8px 20px rgba(192, 211, 202, 0.2)",
    },
    "@media (max-width: 768px)": {
      fontSize: "0.8rem !important",
      padding: "0.5rem 1rem !important",
      width: "100% !important",
      marginTop: "0.5rem !important",
    },
    "@media (max-width: 480px)": {
      fontSize: "0.75rem !important",
      padding: "0.4rem 0.8rem !important",
    },
  },
  measurementsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.5rem",
    marginTop: "1.5rem",
    "@media (max-width: 768px)": {
      gridTemplateColumns: "repeat(2, 1fr) !important",
      gap: "0.75rem !important",
      marginTop: "1rem !important",
    },
    "@media (max-width: 480px)": {
      gridTemplateColumns: "repeat(2, 1fr) !important",
      gap: "0.5rem !important",
    },
  },
  measurementCard: {
    backgroundColor: "rgba(192, 211, 202, 0.02)",
    padding: "1.5rem",
    borderRadius: "4px",
    border: "1px solid rgba(192, 211, 202, 0.1)",
    textAlign: "center",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
      border: "1px solid rgba(192, 211, 202, 0.2)",
    },
    "@media (max-width: 768px)": {
      padding: "0.75rem !important",
      "&:hover": {
        transform: "none",
      },
    },
    "@media (max-width: 480px)": {
      padding: "0.5rem !important",
    },
  },
  measurementValue: {
    fontSize: "1.8rem",
    fontWeight: "300",
    color: "#C0D3CA",
    marginBottom: "0.8rem",
    fontFamily: "'Cormorant Garamond', serif",
    letterSpacing: "0.05em",
    "@media (max-width: 768px)": {
      fontSize: "1.2rem !important",
      marginBottom: "0.3rem !important",
    },
    "@media (max-width: 480px)": {
      fontSize: "1rem !important",
      marginBottom: "0.2rem !important",
    },
  },
  measurementLabel: {
    fontSize: "0.85rem",
    color: "rgba(255, 255, 255, 0.7)",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: "500",
    "@media (max-width: 768px)": {
      fontSize: "0.65rem !important",
      letterSpacing: "0.05em !important",
    },
    "@media (max-width: 480px)": {
      fontSize: "0.6rem !important",
      letterSpacing: "0.02em !important",
    },
  },
  orderCard: {
    backgroundColor: "rgba(30, 30, 30, 0.6) !important",
    marginBottom: "1.5rem",
    borderRadius: "4px !important",
    border: "1px solid rgba(192, 211, 202, 0.2) !important",
    overflow: "hidden",
    transition: "all 0.4s ease",
    backdropFilter: "blur(10px)",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
      border: "1px solid rgba(192, 211, 202, 0.3) !important",
    },
    "@media (max-width: 768px)": {
      marginBottom: "1rem !important",
      "&:hover": {
        transform: "none",
      },
    },
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem",
    borderBottom: "1px solid rgba(192, 211, 202, 0.1) !important",
    backgroundColor: "rgba(192, 211, 202, 0.02) !important",
    "@media (max-width: 768px)": {
      flexDirection: "column !important",
      alignItems: "flex-start !important",
      gap: "1rem !important",
      padding: "1rem !important",
    },
  },
  orderNumber: {
    fontSize: "1.3rem !important",
    fontWeight: "400 !important",
    color: "#C0D3CA !important",
    fontFamily: "'Cormorant Garamond', serif !important",
    letterSpacing: "0.05em !important",
    "@media (max-width: 768px)": {
      fontSize: "1.1rem !important",
    },
  },
  orderDate: {
    fontSize: "0.9rem !important",
    color: "rgba(255, 255, 255, 0.6) !important",
    fontFamily: "'Montserrat', sans-serif !important",
    letterSpacing: "0.02em !important",
    fontWeight: "300 !important",
    "@media (max-width: 768px)": {
      fontSize: "0.8rem !important",
    },
  },
  orderStatus: {
    padding: "0.4rem 1rem !important",
    borderRadius: "25px !important",
    fontSize: "0.8rem !important",
    fontWeight: "600 !important",
    fontFamily: "'Montserrat', sans-serif !important",
    letterSpacing: "0.05em !important",
    textTransform: "uppercase !important",
  },
  statusPreparing: {
    backgroundColor: "rgba(255, 193, 7, 0.15)",
    color: "#FFC107",
    border: "1px solid rgba(255, 193, 7, 0.3)",
  },
  statusShipped: {
    backgroundColor: "rgba(33, 150, 243, 0.15)",
    color: "#2196F3",
    border: "1px solid rgba(33, 150, 243, 0.3)",
  },
  statusCompleted: {
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    color: "#4CAF50",
    border: "1px solid rgba(76, 175, 80, 0.3)",
  },
  statusCancelled: {
    backgroundColor: "rgba(244, 67, 54, 0.15)",
    color: "#F44336",
    border: "1px solid rgba(244, 67, 54, 0.3)",
  },
  orderDetails: {
    padding: "1.5rem !important",
    backgroundColor: "rgba(30, 30, 30, 0.3) !important",
  },
  orderTotal: {
    fontSize: "1.4rem !important",
    fontWeight: "400 !important",
    color: "#C0D3CA !important",
    textAlign: "right !important",
    fontFamily: "'Cormorant Garamond', serif !important",
    letterSpacing: "0.05em !important",
  },
  logoutButton: {
    color: "#fff !important",
    backgroundColor: "rgba(192, 211, 202, 0.1) !important",
    border: "1px solid rgba(192, 211, 202, 0.3) !important",
    padding: "1rem 2rem !important",
    borderRadius: "0 !important",
    textTransform: "none !important",
    fontSize: "0.9rem !important",
    fontWeight: "500 !important",
    fontFamily: "'Montserrat', sans-serif !important",
    letterSpacing: "0.05em !important",
    transition: "all 0.3s ease !important",
    width: "100% !important",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.2) !important",
      transform: "translateY(-2px) !important",
      boxShadow: "0 8px 25px rgba(192, 211, 202, 0.2) !important",
    },
  },
  sidebarItem: {
    color: "rgba(255, 255, 255, 0.7) !important",
    borderBottom: "1px solid rgba(192, 211, 202, 0.1) !important",
    padding: "1.2rem 1.5rem !important",
    transition: "all 0.3s ease !important",
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    fontWeight: "400 !important",
    letterSpacing: "0.05em !important",
    textTransform: "uppercase !important",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.05) !important",
      color: "#fff !important",
      paddingLeft: "2rem !important",
      transform: "translateX(4px)",
    },
    "&.active": {
      backgroundColor: "rgba(192, 211, 202, 0.1) !important",
      color: "#fff !important",
      borderLeft: "4px solid #C0D3CA !important",
      paddingLeft: "2rem !important",
      fontWeight: "500 !important",
    },
  },
  sidebarIcon: {
    color: "inherit !important",
    marginRight: "1rem !important",
    fontSize: "1.2rem !important",
  },
  sidebarText: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    fontWeight: "400 !important",
    letterSpacing: "0.05em !important",
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
      transform: "translateY(-2px)",
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
    justifyContent: "space-between !important",
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
  const [profileToDelete, setProfileToDelete] = useState(null);

  // Form states
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [address, setAddress] = useState(user?.address || "");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");

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
        []
      );
      setSizeProfiles(profiles);

      if (profiles.length > 0 && !selectedProfile) {
        setSelectedProfile(profiles[0]);
      }
    }
  }, [data]);

  const handleLogout = async () => {
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

  const confirmDeleteProfile = () => {
    if (profileToDelete) {
      setSizeProfiles((prev) => prev.filter((p) => p.name !== profileToDelete));
      if (selectedProfile?.name === profileToDelete) {
        setSelectedProfile(
          sizeProfiles.find((p) => p.name !== profileToDelete) || null
        );
      }
      setOpenDeleteDialog(false);
      setProfileToDelete(null);
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
        <PersonIcon style={{ fontSize: "2rem" }} /> Personal Information
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
            <Typography className={classes.infoLabel}>First Name:</Typography>
            <Typography className={classes.infoValue}>
              {user?.firstName || "Not provided"}
            </Typography>
          </Box>

          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>Last Name:</Typography>
            <Typography className={classes.infoValue}>
              {user?.lastName || "Not provided"}
            </Typography>
          </Box>

          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>
              Email Address:
            </Typography>
            <Typography className={classes.infoValue}>{user?.email}</Typography>
          </Box>

          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>Phone Number:</Typography>
            <Typography
              className={`${classes.infoValue} ${
                !user?.phoneNumber ? classes.missingInfo : ""
              }`}
            >
              {user?.phoneNumber || "Missing phone number"}
            </Typography>
            <Button
              className={classes.editButton}
              onClick={() => setOpenPhoneDialog(true)}
            >
              {user?.phoneNumber ? "Edit" : "Add"}
            </Button>
          </Box>

          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>
              Delivery Address:
            </Typography>
            <Typography
              className={`${classes.infoValue} ${
                !user?.address ? classes.missingInfo : ""
              }`}
            >
              {user?.address || "Missing address"}
            </Typography>
            <Button
              className={classes.editButton}
              onClick={() => setOpenAddressDialog(true)}
            >
              {user?.address ? "Edit" : "Add"}
            </Button>
          </Box>

          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>Member Since:</Typography>
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
        <HeightIcon style={{ fontSize: "2rem" }} /> Body Measurements
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
              Size Profiles
            </Typography>
            <Button
              className={classes.editButton}
              onClick={() => navigate("/sizes/measure")}
              sx={{
                fontSize: { xs: "0.8rem", md: "0.85rem" },
                padding: { xs: "0.5rem 1rem", md: "0.6rem 1.2rem" },
              }}
            >
              Edit Measurements
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
                Recommended Sizes
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Box className={classes.measurementCard}>
                  <Typography className={classes.measurementValue}>
                    {data.sizesTable.jacket}
                  </Typography>
                  <Typography className={classes.measurementLabel}>
                    Jacket Size
                  </Typography>
                </Box>
                <Box className={classes.measurementCard}>
                  <Typography className={classes.measurementValue}>
                    {data.sizesTable.pants}
                  </Typography>
                  <Typography className={classes.measurementLabel}>
                    Pants Size
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
                Select Profile:
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
                    Delete Profile
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
            <ShoppingBagIcon style={{ fontSize: "2rem" }} /> Order History
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
              Sort by:
            </Typography>
            <select
              value={orderSortBy}
              onChange={(e) => setOrderSortBy(e.target.value)}
              style={{
                backgroundColor: "rgba(30, 30, 30, 0.8)",
                color: "#fff",
                border: "1px solid rgba(192, 211, 202, 0.3)",
                borderRadius: "4px",
                padding: "0.5rem 1rem",
                fontSize: "0.85rem",
                fontFamily: "'Montserrat', sans-serif",
                cursor: "pointer",
                outline: "none",
                minWidth: "150px",
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
            </select>
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
              Total Orders: {orders.length}
            </Typography>
            <Typography
              sx={{
                color: "#C0D3CA",
                fontSize: "1.1rem",
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: "400",
              }}
            >
              Total Spent:{" "}
              {formatCurrency(
                orders.reduce(
                  (total, order) =>
                    total + order.totalAmount + order.shippingCost,
                  0
                )
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
                Loading orders...
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
                No orders found. Start shopping to see your order history here.
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
                  transform: "translateY(-4px)",
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
                    Order #{order.orderId.slice(-8).toUpperCase()}
                  </Typography>
                  <Typography className={classes.orderDate}>
                    {formatDate(order.paymentDate)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {getStatusIcon(order.status)}
                  <Chip
                    label={order.status}
                    className={getStatusClass(order.status)}
                    size="small"
                    sx={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  />
                  {order.shippingSpeed === "EXPRESS" && (
                    <Chip
                      icon={<DiamondIcon />}
                      label="Express"
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
                <Typography
                  variant="subtitle2"
                  style={{
                    color: "#C0D3CA",
                    mb: 1,
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  Suits ({order.selectedSuits.length})
                </Typography>

                {/* Suits Grid */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(auto-fit, minmax(280px, 1fr))",
                      md: "repeat(auto-fit, minmax(300px, 1fr))",
                    },
                    gap: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {order.selectedSuits.map((suit, index) => (
                    <Card
                      key={suit._id || index}
                      className={classes.suitSpecCard}
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                        minHeight: "300px",
                      }}
                    >
                      {/* Suit Image */}
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          height: "200px",
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 2,
                        }}
                      >
                        <SuitImage suit={suit} />
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1,
                          px: 2,
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#C0D3CA",
                            fontSize: "1rem",
                            fontWeight: "600",
                            fontFamily: "'Montserrat', sans-serif",
                          }}
                        >
                          Suit #{index + 1}
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

                      {/* Suit Specifications */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                          px: 2,
                          pb: 2,
                        }}
                      >
                        {/* Suit Type */}
                        {suit.kind && (
                          <Box className={classes.suitSpecRow}>
                            <Typography className={classes.suitSpecLabel}>
                              Type:
                            </Typography>
                            <Typography className={classes.suitSpecValue}>
                              {suit.kind === "kind1" && "Standard Suit"}
                              {suit.kind === "kind2" && "Premium Suit"}
                              {suit.kind === "kind3" && "Luxury Suit"}
                              {suit.kind === "kind4" && "Custom Luxury Suit"}
                              {!["kind1", "kind2", "kind3", "kind4"].includes(
                                suit.kind
                              ) && suit.kind}
                            </Typography>
                          </Box>
                        )}

                        {/* Main Color */}
                        {suit.color && (
                          <Box className={classes.suitSpecRow}>
                            <Typography className={classes.suitSpecLabel}>
                              Main Color:
                            </Typography>
                            <Typography
                              className={classes.suitSpecValue}
                              sx={{ textTransform: "capitalize" }}
                            >
                              {suit.color}
                            </Typography>
                          </Box>
                        )}

                        {/* Lapel Type */}
                        {suit.lapelType && (
                          <Box className={classes.suitSpecRow}>
                            <Typography className={classes.suitSpecLabel}>
                              Lapel:
                            </Typography>
                            <Typography className={classes.suitSpecValue}>
                              {suit.lapelType}
                            </Typography>
                          </Box>
                        )}

                        {/* Collar Type */}
                        {suit.lapelKind && (
                          <Box className={classes.suitSpecRow}>
                            <Typography className={classes.suitSpecLabel}>
                              Collar:
                            </Typography>
                            <Typography className={classes.suitSpecValue}>
                              {suit.lapelKind === "collarTight" &&
                                "Tight Collar"}
                              {suit.lapelKind === "collarDistant" &&
                                "Wide Collar"}
                              {!["collarTight", "collarDistant"].includes(
                                suit.lapelKind
                              ) && suit.lapelKind}
                            </Typography>
                          </Box>
                        )}

                        {/* Pocket Type */}
                        {suit.packetType && (
                          <Box className={classes.suitSpecRow}>
                            <Typography className={classes.suitSpecLabel}>
                              Pockets:
                            </Typography>
                            <Typography className={classes.suitSpecValue}>
                              {suit.packetType === "packet1" && "Standard"}
                              {suit.packetType === "packet2" && "Enhanced"}
                              {suit.packetType === "packet3" && "Premium"}
                              {!["packet1", "packet2", "packet3"].includes(
                                suit.packetType
                              ) && suit.packetType}
                            </Typography>
                          </Box>
                        )}

                        {/* Inside Color */}
                        {suit.insideColor && (
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
                        )}

                        {/* Button Color */}
                        {suit.buttonColor && (
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
                        )}

                        {/* Pocket Square */}
                        {suit.poshetColor && (
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
                        )}

                        {/* Button Holes */}
                        {(suit.holeButtonColor || suit.holeButtonUpColor) && (
                          <Box className={classes.suitSpecRow}>
                            <Typography className={classes.suitSpecLabel}>
                              Button Holes:
                            </Typography>
                            <Typography
                              className={classes.suitSpecValue}
                              sx={{ textTransform: "capitalize" }}
                            >
                              {suit.holeButtonColor && suit.holeButtonUpColor
                                ? `${suit.holeButtonColor}, ${suit.holeButtonUpColor}`
                                : suit.holeButtonColor ||
                                  suit.holeButtonUpColor}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Card>
                  ))}
                </Box>

                <Box className={classes.deliveryInfo}>
                  <Typography className={classes.deliveryText}>
                    Estimated Delivery:{" "}
                    {order.estimatedDeliveryDate
                      ? formatDate(order.estimatedDeliveryDate)
                      : "Calculating..."}
                  </Typography>
                  <Typography className={classes.orderTotal}>
                    {formatCurrency(order.totalAmount + order.shippingCost)}
                  </Typography>
                </Box>

                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
                >
                  <Button
                    className={classes.editButton}
                    startIcon={<VisibilityIcon />}
                    size="small"
                  >
                    View Details
                  </Button>
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
      <Box className={classes.root}>
        <Container maxWidth="md">
          <Typography className={classes.notLoggedIn}>
            Please log in to view your account details
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box className={classes.root}>
      <Container maxWidth="lg">
        <Typography className={classes.heading}>User Profile</Typography>

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
              sx={{
                backgroundColor: "rgba(30, 30, 30, 0.6) !important",
                border: "1px solid rgba(192, 211, 202, 0.2) !important",
                borderRadius: "4px !important",
              }}
            >
              <List sx={{ p: 0 }}>
                <ListItem
                  button
                  className={`${classes.sidebarItem} ${
                    activeSection === "profile" ? "active" : ""
                  }`}
                  onClick={() => setActiveSection("profile")}
                  sx={{
                    borderBottom:
                      "1px solid rgba(192, 211, 202, 0.1) !important",
                  }}
                >
                  <ListItemIcon className={classes.sidebarIcon}>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Personal Information"
                    primaryTypographyProps={{ className: classes.sidebarText }}
                  />
                </ListItem>

                <ListItem
                  button
                  className={`${classes.sidebarItem} ${
                    activeSection === "measurements" ? "active" : ""
                  }`}
                  onClick={() => setActiveSection("measurements")}
                  sx={{
                    borderBottom:
                      "1px solid rgba(192, 211, 202, 0.1) !important",
                  }}
                >
                  <ListItemIcon className={classes.sidebarIcon}>
                    <HeightIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Measurements"
                    primaryTypographyProps={{ className: classes.sidebarText }}
                  />
                </ListItem>

                <ListItem
                  button
                  className={`${classes.sidebarItem} ${
                    activeSection === "orders" ? "active" : ""
                  }`}
                  onClick={() => setActiveSection("orders")}
                >
                  <ListItemIcon className={classes.sidebarIcon}>
                    <Badge badgeContent={orders.length} color="error">
                      <ShoppingBagIcon />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary="Order History"
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
                  onClick={handleLogout}
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
          <Box className={classes.mobileTabItem} onClick={handleLogout}>
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
            sx={{
              backgroundColor: "#ef5350",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#d32f2f",
              },
            }}
          >
            Delete Profile
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Account;

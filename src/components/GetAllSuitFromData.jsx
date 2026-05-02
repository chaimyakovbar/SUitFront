import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useProduct from "../Hooks/useProduct";
import { deleteSuit } from "../api/suit";
import { makeStyles } from "@mui/styles";
import { Typography, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Virtual scrolling hook
const useVirtualScrolling = (
  items,
  itemHeight = 300,
  containerHeight = 600,
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    offsetY,
    totalHeight: items.length * itemHeight,
    onScroll: (e) => setScrollTop(e.target.scrollTop),
  };
};

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2rem",
    paddingTop: "1rem",
  },
  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "2rem",
    width: "100%",
    maxWidth: "1200px",
  },
  cardsContainerList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "100%",
    maxWidth: "1200px",
  },
  card: {
    backgroundColor: "#202020",
    position: "relative",
    width: "100%",
    height: "300px",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    overflow: "hidden",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    "&:hover": {
      border: "1px solid rgba(255,255,255,0.3)",
      transform: "translateY(-4px)",
      boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
    },
  },
  cardList: {
    backgroundColor: "#202020",
    position: "relative",
    width: "100%",
    height: "120px",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    overflow: "hidden",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "row",
    "&:hover": {
      border: "1px solid rgba(255,255,255,0.3)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    },
  },
  photo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "80%",
    objectFit: "contain",
  },
  photoList: {
    position: "absolute",
    top: "50%",
    left: "60px",
    transform: "translateY(-50%)",
    width: "80px",
    height: "80px",
    objectFit: "contain",
  },
  cardControls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    backgroundColor: "#222222",
    backdropFilter: "blur(4px)",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },
  cardControlsList: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    backgroundColor: "#222222",
    backdropFilter: "blur(4px)",
    borderLeft: "1px solid rgba(255,255,255,0.1)",
    minWidth: "200px",
  },
  cardInfo: {
    position: "absolute",
    left: "160px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#fff",
    fontFamily: "'Montserrat', sans-serif",
  },
  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "4px",
  },
  cardDetails: {
    fontSize: "0.9rem",
    color: "rgba(255,255,255,0.7)",
  },
  checkbox: {
    width: "20px",
    height: "20px",
    cursor: "pointer",
    accentColor: "#a8a8ff",
  },
  deleteButton: {
    padding: "4px",
    backgroundColor: "red",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.1)",
      border: "1px solid rgba(255,255,255,0.5)",
    },
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
  priceTag: {
    color: "#fff",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.85rem",
    letterSpacing: "0.1em",
    fontWeight: "500",
  },
  priceTagList: {
    color: "#fff",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "1.1rem",
    letterSpacing: "0.1em",
    fontWeight: "600",
  },
  controlsWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4rem",
    color: "#fff",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.9rem",
    letterSpacing: "0.1em",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    color: "#ff4444",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.9rem",
    letterSpacing: "0.1em",
  },
  emptyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    color: "#fff",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.9rem",
    letterSpacing: "0.1em",
  },
  deleteLoadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1001,
  },
  viewToggleContainer: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    justifyContent: "center",
  },
  viewToggleButton: {
    padding: "12px 24px",
    backgroundColor: "#333333",
    color: "#fff",
    border: "2px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#444444",
      border: "2px solid rgba(255,255,255,0.4)",
    },
    "&.active": {
      backgroundColor: "#a8a8ff",
      color: "#000",
      border: "2px solid #a8a8ff",
    },
  },
});

// Simple in-memory cache for resolved image paths
const imagePathCache = new Map();

// Extracted to separate function with added caching mechanism (no CORS HEAD)
const loadImage = async (key, path) => {
  if (imagePathCache.has(path)) {
    return imagePathCache.get(path);
  }

  try {
    // Try WebP first, fallback to original
    const webpPath = path.replace(/\.(png|jpg|jpeg)$/i, ".webp");

    // Check if WebP is supported
    const supportsWebP = await checkWebPSupport();
    const finalPath = supportsWebP ? webpPath : path;

    const result = await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ key, src: finalPath });
      img.onerror = () => {
        // fallback to original if webp failed
        if (finalPath !== path) {
          const img2 = new Image();
          img2.onload = () => resolve({ key, src: path });
          img2.onerror = () => resolve({ key, src: null });
          img2.src = path;
        } else {
          resolve({ key, src: null });
        }
      };
      img.src = finalPath;
    });

    imagePathCache.set(path, result);
    return result;
  } catch (error) {
    console.warn(`⚠️ Error loading image for ${key} at path: ${path}:`, error);
    const result = { key, src: null };
    imagePathCache.set(path, result);
    return result;
  }
};

// Check WebP support
const checkWebPSupport = () => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src =
      "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  });
};

// Button color mapping extracted and expanded
const buttonColorMap = {
  black: "blackGrey",
  grey: "greyLight",
  // Add other mappings as needed
};

const getImagePaths = (item, viewType = "suit") => {
  const S3_BASE_URL = "https://ch-suits.s3.us-east-1.amazonaws.com";

  const imagePaths = [];

  if (viewType === "suit") {
    imagePaths.push(
      {
        key: "baseSuit",
        path: `${S3_BASE_URL}/assets_V3/Ragach/Kinds/${item.kind}/${item.color}.webp`,
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
    );

    // Add packet based on packet type and kind - only what user selected

    if (item.packetType) {
      const packetType = item.packetType;
      // Use packetKind if exists, otherwise default to "packetBottom"
      const packetKind = item.packetKind || "packetBottom"; // ברירת מחדל

      imagePaths.push({
        key: packetKind === "packetSide" ? "packetSide" : "packetBottom",
        path: `${S3_BASE_URL}/assets_V3/Ragach/packet/${packetKind}/${packetType}/${item.color}.webp`,
      });
    } else {
      console.warn("⚠️ Missing packetType for suit:", item._id);
      console.warn("  packetType:", item.packetType);
    }

    // Add conditional parts for suit
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

    // Add sleeve buttons if exists
    // if (item.sleeveButtons && item.sleeveButtons !== "none") {
    //   imagePaths.push({
    //     key: "sleeveButtons",
    //     path: `public/assets/adds/sleevseButton/${item.sleeveButtons}/${item.color}.webp`,
    //   });
    // }

    // Add text inside if exists
    if (item.textInsideText) {
      imagePaths.push({
        key: "textInside",
        path: `${S3_BASE_URL}/assets_V3/adds/TextInside.webp`,
      });
    }
  } else if (viewType === "pants") {
    // מכנסיים - רק החלקים הרלוונטיים
    // Use pantsColor if exists, otherwise use suit color
    const pantsColor = item.pantsColor || item.color;

    // Base pants layer - always active
    imagePaths.push({
      key: "pants",
      path: `${S3_BASE_URL}/assets_V3/Pants/allPants/${pantsColor}.webp`,
    });

    // Add kind layer if exists (not regularBase)
    if (item.pantsKind && item.pantsKind !== "regularBase") {
      imagePaths.push({
        key: "pantsKind",
        path: `${S3_BASE_URL}/assets_V3/Pants/kind/${item.pantsKind}/${pantsColor}.webp`,
      });
    }

    // Add button layer if exists
    if (item.pantsButtonKind && item.pantsButtonKind !== "none") {
      let buttonPath = null;
      switch (item.pantsKind || "regularBase") {
        case "regularBase":
          buttonPath =
            item.pantsButtonKind === "regularButton" ? "regularButton" : null;
          break;
        case "longRegular":
          buttonPath =
            item.pantsButtonKind === "longMidleButton"
              ? "longMidleButton"
              : null;
          break;
        case "longWide":
          if (item.pantsButtonKind === "longWideButton")
            buttonPath = "longWideButton";
          else if (item.pantsButtonKind === "longWideTwoButton")
            buttonPath = "longWideTwoButton";
          break;
        case "wide":
          if (item.pantsButtonKind === "wideButton") buttonPath = "wideButton";
          else if (item.pantsButtonKind === "wideTowButton")
            buttonPath = "wideTowButton";
          break;
        case "MiddleWide":
          if (item.pantsButtonKind === "middleWideButton")
            buttonPath = "longWideButton";
          else if (item.pantsButtonKind === "middleWideTwoButton")
            buttonPath = "longWideTwoButton";
          break;
      }
      if (buttonPath) {
        imagePaths.push({
          key: "pantsButton",
          path: `${S3_BASE_URL}/assets_V3/Pants/button/${buttonPath}/${pantsColor}.webp`,
        });
      }
    }

    // Add loops layer if exists
    if (item.pantsLoops && item.pantsLoops !== "none") {
      let loopsPath = null;
      const kind = item.pantsKind || "regularBase";
      if (kind === "regularBase" || kind === "longRegular") {
        if (item.pantsLoops === "loop") loopsPath = "loop";
        else if (item.pantsLoops === "twoLoop") loopsPath = "twoLoop";
      } else if (kind === "longWide" || kind === "wide") {
        if (item.pantsLoops === "wideOneIoop") loopsPath = "wideOneIoop";
        else if (item.pantsLoops === "wideTwoLoop") loopsPath = "wideTwoLoop";
      } else if (kind === "MiddleWide") {
        if (item.pantsLoops === "wideMiddleLoop") loopsPath = "wideMiddleLoop";
        else if (item.pantsLoops === "wideMiddleTowLoop")
          loopsPath = "wideMiddleTowLoop";
      }
      if (loopsPath) {
        imagePaths.push({
          key: "pantsLoops",
          path: `${S3_BASE_URL}/assets_V3/Pants/loops/${loopsPath}/${pantsColor}.webp`,
        });
      }
    }

    // Add iron layer if exists
    if (item.pantsIron && item.pantsIron !== "none") {
      let ironPath = null;
      const kind = item.pantsKind || "regularBase";
      if (kind === "regularBase" || kind === "longRegular") {
        if (item.pantsIron === "regularIron") ironPath = "regularIron";
        else if (item.pantsIron === "oneIron") ironPath = "oneIron";
        else if (item.pantsIron === "oneIronTwoButton")
          ironPath = "oneIronTwoButton";
      } else if (
        kind === "longWide" ||
        kind === "wide" ||
        kind === "MiddleWide"
      ) {
        ironPath = item.pantsIron === "wideIron" ? "wideIron" : null;
      }
      if (ironPath) {
        imagePaths.push({
          key: "pantsIron",
          path: `${S3_BASE_URL}/assets_V3/Pants/iron/${ironPath}/${pantsColor}.webp`,
        });
      }
    }

    // Add hem layer if exists
    if (item.pantsHem && item.pantsHem !== "none") {
      imagePaths.push({
        key: "pantsHem",
        path: `${S3_BASE_URL}/assets_V3/Pants/hem/hem/${pantsColor}.webp`,
      });
    }

    // Add sleeve buttons if exists
    if (item.sleeveButtons && item.sleeveButtons !== "none") {
      imagePaths.push({
        key: "sleeveButtons",
        path: `${S3_BASE_URL}/assets_V3/adds/sleevseButton/${item.sleeveButtons}/${pantsColor}.webp`,
      });
    }

    // Add poshet for pants if exists
    if (item.poshetColor) {
      imagePaths.push({
        key: "poshetColor",
        path: `${S3_BASE_URL}/assets_V3/adds/poshet/${item.poshetColor}.webp`,
      });
    }

    // Add text inside if exists
    if (item.textInsideText) {
      imagePaths.push({
        key: "textInside",
        path: `${S3_BASE_URL}/assets_V3/adds/TextInside.webp`,
      });
    }
  }

  return imagePaths;
};

const fetchImages = async (item, viewType = "suit") => {
  if (!item) return {};

  const imagePaths = getImagePaths(item, viewType);
  const images = await Promise.all(
    imagePaths.map(({ key, path }) => loadImage(key, path)),
  );

  return images.reduce((acc, { key, src }) => {
    if (src) acc[key] = src;
    return acc;
  }, {});
};

// Main component
const DynamicImage = ({
  onSelect,
  selectedSuits: parentSelectedSuits,
  viewMode = "grid",
  sortBy = "newest",
}) => {
  const classes = useStyles();
  const { data, isLoading: productLoading, error } = useProduct();
  const allSuits = useMemo(() => data?.allSuitPart || [], [data?.allSuitPart]);
  const [deletingSuitId, setDeletingSuitId] = useState(null);
  const [cardViewTypes, setCardViewTypes] = useState({}); // Store view type for each card

  // Get z-index for image layers - מועבר ל-memoized function
  const getZIndex = useCallback((key) => {
    const zIndexMap = {
      packetBottom: 20,
      packetSide: 15,
      button: 8,
      holeButton: 7,
      holeButtonUp: 6,
      poshetColor: 5,
      pantsHem: 4,
      pantsHoleButton: 3,
      pantsLines: 2,
      textInside: 1,
      sleeveButtons: 1,
      pants: 1,
      baseSuit: 0,
      insideUp: 1,
      lapelCollar: 2,
      colar: 3,
      sleeves: 4,
      insideBottom: 5,
      packetUp: 6,
      bottom: 7,
      bottomKind3: 7,
      suitBody: 0,
      collar: 3,
      default: 1,
    };

    return zIndexMap[key] || zIndexMap.default;
  }, []);

  // Memoized sorted images for each suit
  const getSortedImages = useCallback(
    (images) => {
      if (!images) return [];

      return Object.entries(images)
        .filter(([key]) => key !== "textInside")
        .sort((a, b) => getZIndex(a[0]) - getZIndex(b[0]))
        .map(([key, src]) => ({
          key,
          src,
          zIndex: getZIndex(key),
        }));
    },
    [getZIndex],
  );

  // Sort suits based on sortBy prop
  const sortedSuits = useMemo(() => {
    const suits = [...allSuits];
    switch (sortBy) {
      case "price-low":
        return suits.sort((a, b) => a.totalPrice - b.totalPrice);
      case "price-high":
        return suits.sort((a, b) => b.totalPrice - a.totalPrice);
      case "newest":
      default:
        return suits.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        );
    }
  }, [allSuits, sortBy]);

  // Use parent's selectedSuits if provided
  const [selectedSuits, setSelectedSuits] = useState(() => {
    if (parentSelectedSuits) return parentSelectedSuits;
    const saved = localStorage.getItem("selectedSuits");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [totalPrice, setTotalPrice] = useState(() => {
    const saved = localStorage.getItem("totalPrice");
    return saved ? Number(saved) : 0;
  });

  const queryClient = useQueryClient();

  // Save to localStorage whenever selectedSuits or totalPrice changes
  useEffect(() => {
    localStorage.setItem("selectedSuits", JSON.stringify([...selectedSuits]));
    localStorage.setItem("totalPrice", totalPrice.toString());
  }, [selectedSuits, totalPrice]);

  const deleteMutation = useMutation({
    mutationFn: deleteSuit,
    onSuccess: () => {
      queryClient.invalidateQueries(["product"]);
    },
    onError: (error) => {
      console.error("Error deleting suit:", error);
    },
  });

  // Use refs for cache/loading to avoid triggering re-render loops
  const imagesCacheRef = useRef({});
  const loadingStateRef = useRef({});
  const [cacheVersion, setCacheVersion] = useState(0);

  // Function to load images for a specific suit and view type
  const loadImagesForSuit = useCallback(
    async (suitId, viewType) => {
      const cacheKey = `${suitId}-${viewType}`;

      if (imagesCacheRef.current[cacheKey] || loadingStateRef.current[cacheKey]) {
        return imagesCacheRef.current[cacheKey] || null;
      }

      loadingStateRef.current[cacheKey] = true;

      try {
        const suit = sortedSuits.find((s) => s._id === suitId);
        if (!suit) return null;

        const images = await fetchImages(suit, viewType);
        imagesCacheRef.current[cacheKey] = images;
        setCacheVersion((v) => v + 1);
        return images;
      } catch (error) {
        console.error(`Error loading images for ${suitId}:`, error);
        return null;
      } finally {
        loadingStateRef.current[cacheKey] = false;
      }
    },
    [sortedSuits],
  );

  // Lazy loading with Intersection Observer - רק טוען תמונות כשהכרטיס נראה
  const [visibleSuits, setVisibleSuits] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const suitId = entry.target.dataset.suitId;
          if (entry.isIntersecting && suitId) {
            setVisibleSuits((prev) => new Set([...prev, suitId]));
          }
        });
      },
      { threshold: 0.1, rootMargin: "100px" },
    );

    // Observe all suit cards
    const cards = document.querySelectorAll("[data-suit-id]");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [sortedSuits]);

  // Load images only for visible suits
  useEffect(() => {
    if (visibleSuits.size === 0) return;

    visibleSuits.forEach((suitId) => {
      const suit = sortedSuits.find((s) => s._id === suitId);
      if (suit) {
        const viewType = cardViewTypes[suitId] || "suit";
        loadImagesForSuit(suitId, viewType);
      }
    });
  }, [visibleSuits, sortedSuits, cardViewTypes, loadImagesForSuit]);

  // cacheVersion triggers re-render when images load (via setCacheVersion in loadImagesForSuit)
  void cacheVersion;
  const imagesData = sortedSuits.map((suit) => {
    const viewType = cardViewTypes[suit._id] || "suit";
    const cacheKey = `${suit._id}-${viewType}`;
    return imagesCacheRef.current[cacheKey] || null;
  });

  const isLoading =
    productLoading || Object.values(loadingStateRef.current).some(Boolean);

  const handleSelect = (suitId, price) => {
    const isSelected = selectedSuits.has(suitId);
    setSelectedSuits((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(suitId)) {
        newSet.delete(suitId);
      } else {
        newSet.add(suitId);
      }
      if (onSelect) onSelect(suitId);
      return newSet;
    });
    setTotalPrice((prev) => isSelected ? prev - price : prev + price);
  };

  const handleDelete = async (suitId) => {
    if (!suitId) return;
    const suit = sortedSuits.find((s) => s._id === suitId);
    try {
      setDeletingSuitId(suitId);
      await Promise.all([
        deleteMutation.mutateAsync(suitId),
        new Promise((resolve) => setTimeout(resolve, 500)),
      ]);
      // Remove from selected if it was checked
      if (selectedSuits.has(suitId)) {
        setSelectedSuits((prev) => {
          const next = new Set(prev);
          next.delete(suitId);
          return next;
        });
        setTotalPrice((prev) => prev - (suit?.totalPrice || 0));
      }
    } catch (error) {
      console.error("Failed to delete suit:", error);
    } finally {
      setDeletingSuitId(null);
    }
  };

  // Virtual scrolling hook must be called before any early returns
  const virtualScroll = useVirtualScrolling(sortedSuits, 300, 600);
  const startIndex = Math.floor(virtualScroll.offsetY / 300);

  // Handle loading state
  if (isLoading) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress
          color="inherit"
          size={24}
          style={{ marginBottom: "1rem" }}
        />
        <Typography>Loading suits...</Typography>
      </div>
    );
  }

  // Handle error states
  if (error) {
    return (
      <div className={classes.errorContainer}>
        <Typography>Error loading suits. Please try again later.</Typography>
      </div>
    );
  }

  // Handle empty state
  if (!sortedSuits.length) {
    return (
      <div className={classes.emptyContainer}>
        <Typography>No suits found.</Typography>
      </div>
    );
  }

  const renderCard = (item, index) => {
    const isListView = viewMode === "list";
    const cardClass = isListView ? classes.cardList : classes.card;
    const photoClass = isListView ? classes.photoList : classes.photo;
    const controlsClass = isListView
      ? classes.cardControlsList
      : classes.cardControls;
    const priceClass = isListView ? classes.priceTagList : classes.priceTag;

    // Get view type for this specific card
    const cardViewType = cardViewTypes[item._id] || "suit";

    const toggleCardViewType = () => {
      const newViewType = cardViewType === "suit" ? "pants" : "suit";
      setCardViewTypes((prev) => ({ ...prev, [item._id]: newViewType }));
      loadImagesForSuit(item._id, newViewType);
    };

    return (
      <div
        key={`suit-${item._id}`}
        className={cardClass}
        data-suit-id={item._id}
      >
        {deletingSuitId === item._id && (
          <div className={classes.deleteLoadingOverlay}>
            <CircularProgress
              color="inherit"
              size={24}
              style={{ marginBottom: "1rem" }}
            />
            <Typography style={{ color: "#fff" }}>Deleting suit...</Typography>
          </div>
        )}

        {imagesData?.[index] && (
          <>
            {getSortedImages(imagesData[index]).map(({ key, src, zIndex }) => (
              <img
                key={`${item._id}-${key}`}
                src={src}
                alt={`Suit part: ${key}`}
                className={photoClass}
                style={{ zIndex }}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ))}
          </>
        )}

        {/* {isListView && (
          <div className={classes.cardInfo}>
            <div className={classes.cardTitle}>
              {item.color} {item.kind} Suit
            </div>
            <div className={classes.cardDetails}>
              {item.lapelType} • {item.lapelKind} •{" "}
              {item.collarType || "Standard"}
            </div>
          </div>
        )} */}

        <div className={controlsClass}>
          <div className={priceClass}>₪{item.totalPrice?.toLocaleString()}</div>
          <div className={classes.controlsWrapper}>
            {/* View Type Toggle Button */}
            <button
              onClick={toggleCardViewType}
              className={classes.viewToggleButton}
              style={{
                padding: "4px 8px",
                fontSize: "0.7rem",
                marginRight: "8px",
              }}
            >
              {cardViewType === "suit" ? "מכנסיים" : "חליפה"}
            </button>

            <input
              type="checkbox"
              checked={selectedSuits.has(item._id)}
              onChange={() => handleSelect(item._id, item.totalPrice)}
              className={classes.checkbox}
            />
            <button
              onClick={() => handleDelete(item._id)}
              className={classes.deleteButton}
              disabled={deleteMutation.isLoading}
            >
              {deleteMutation.isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <DeleteIcon />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={classes.container}>
      <div
        className={
          viewMode === "list"
            ? classes.cardsContainerList
            : classes.cardsContainer
        }
        style={{
          height: viewMode === "list" ? "600px" : "auto",
          overflow: viewMode === "list" ? "auto" : "visible",
        }}
        onScroll={viewMode === "list" ? virtualScroll.onScroll : undefined}
      >
        {viewMode === "list" ? (
          <div
            style={{ height: virtualScroll.totalHeight, position: "relative" }}
          >
            <div
              style={{ transform: `translateY(${virtualScroll.offsetY}px)` }}
            >
              {virtualScroll.visibleItems.map((item, index) =>
                renderCard(item, startIndex + index),
              )}
            </div>
          </div>
        ) : (
          sortedSuits.map((item, index) => renderCard(item, index))
        )}
      </div>
    </div>
  );
};

export default DynamicImage;

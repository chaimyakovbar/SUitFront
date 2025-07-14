import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useProduct from "../Hooks/useProduct";
import { deleteSuit } from "../api/suit";
import { makeStyles } from "@mui/styles";
import { Typography, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

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

// Button color mapping extracted and expanded
const buttonColorMap = {
  black: "blackGrey",
  grey: "greyLight",
  // Add other mappings as needed
};

const getImagePaths = (item, viewType = "suit") => {
  const imagePaths = [];

  if (viewType === "suit") {
    // חליפה - כל החלקים
    imagePaths.push(
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
      { key: "packetUp", path: `/assets/ragach/packetUp/${item.color}.png` }
    );

    // Add packet based on packet type and kind - only what user selected

    if (item.packetType) {
      const packetType = item.packetType;
      // Use packetKind if exists, otherwise default to "packetBottom"
      const packetKind = item.packetKind || "packetBottom"; // ברירת מחדל

      imagePaths.push({
        key: packetKind === "packetSide" ? "packetSide" : "packetBottom",
        path: `/assets/ragach/packet/${packetKind}/${packetType}/${item.color}.png`,
      });
    } else {
      console.warn("⚠️ Missing packetType for suit:", item._id);
      console.warn("  packetType:", item.packetType);
    }

    // Add conditional parts for suit
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

    // Add sleeve buttons if exists
    if (item.sleeveButtons && item.sleeveButtons !== "none") {
      imagePaths.push({
        key: "sleeveButtons",
        path: `/assets/ragach/sleevseButton/${item.sleeveButtons}/${item.color}.png`,
      });
    }

    // Add text inside if exists
    if (item.textInsideText) {
      imagePaths.push({
        key: "textInside",
        path: `/assets/adds/TextInside.png`,
      });
    }
  } else if (viewType === "pants") {
    // מכנסיים - רק החלקים הרלוונטיים
    // Use pantsColor if exists, otherwise use suit color
    const pantsColor = item.pantsColor || item.color;

    imagePaths.push({
      key: "pants",
      path: `/assets/pants/AllPants/${pantsColor}.png`,
    });

    // Add lines if exists
    if (item.pantsLines && item.pantsLines !== "none") {
      imagePaths.push({
        key: "pantsLines",
        path: `/assets/pants/lines/${item.pantsLines}/${pantsColor}.png`,
      });
    }

    // Add hole and button - always show (default is Regular)
    const holeButtonType = item.pantsHoleButton || "Regular"; // ברירת מחדל
    imagePaths.push({
      key: "pantsHoleButton",
      path: `/assets/pants/HoleAndButton/${holeButtonType}/${pantsColor}.png`,
    });

    // Add hem if exists
    if (item.pantsHem && item.pantsHem !== "none") {
      imagePaths.push({
        key: "pantsHem",
        path: `/assets/pants/Hem/${pantsColor}.png`,
      });
    }

    // Add sleeve buttons if exists
    if (item.sleeveButtons && item.sleeveButtons !== "none") {
      imagePaths.push({
        key: "sleeveButtons",
        path: `/assets/ragach/sleevseButton/${item.sleeveButtons}/${pantsColor}.png`,
      });
    }

    // Add poshet for pants if exists
    if (item.poshetColor) {
      imagePaths.push({
        key: "poshetColor",
        path: `/assets/adds/poshet/${item.poshetColor}.png`,
      });
    }

    // Add text inside if exists
    if (item.textInsideText) {
      imagePaths.push({
        key: "textInside",
        path: `/assets/adds/TextInside.png`,
      });
    }
  }

  return imagePaths;
};

const fetchImages = async (item, viewType = "suit") => {
  if (!item) return {};

  const imagePaths = getImagePaths(item, viewType);
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
    packetBottom: 20, // הכי גבוה - הכיסים התחתונים
    packetSide: 15, // גבוה - הכיסים הצדדיים
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
    default: 1,
  };

  return zIndexMap[key] || zIndexMap.default;
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
  console.log("Received suits data:", allSuits); // Debug log

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
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
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

  // Create a cache for images
  const [imagesCache, setImagesCache] = useState({});
  const [loadingStates, setLoadingStates] = useState({});

  // Function to load images for a specific suit and view type
  const loadImagesForSuit = useCallback(
    async (suitId, viewType) => {
      const cacheKey = `${suitId}-${viewType}`;

      // Check if already in cache
      if (imagesCache[cacheKey]) {
        return imagesCache[cacheKey];
      }

      // Set loading state
      setLoadingStates((prev) => ({ ...prev, [cacheKey]: true }));

      try {
        const suit = sortedSuits.find((s) => s._id === suitId);
        if (!suit) return null;

        const images = await fetchImages(suit, viewType);

        // Cache the result
        setImagesCache((prev) => ({ ...prev, [cacheKey]: images }));
        return images;
      } catch (error) {
        console.error(`Error loading images for ${suitId}:`, error);
        return null;
      } finally {
        setLoadingStates((prev) => ({ ...prev, [cacheKey]: false }));
      }
    },
    [sortedSuits, imagesCache]
  );

  // Load images for all suits on mount
  useEffect(() => {
    sortedSuits.forEach((suit) => {
      const viewType = cardViewTypes[suit._id] || "suit";
      loadImagesForSuit(suit._id, viewType);
    });
  }, [sortedSuits, loadImagesForSuit]);

  // Get images data for display
  const imagesData = sortedSuits.map((suit) => {
    const viewType = cardViewTypes[suit._id] || "suit";
    const cacheKey = `${suit._id}-${viewType}`;
    return imagesCache[cacheKey] || null;
  });

  // Check loading state
  const isLoading =
    productLoading || Object.values(loadingStates).some(Boolean);

  const handleSelect = (suitId, price) => {
    setSelectedSuits((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(suitId)) {
        newSet.delete(suitId);
        setTotalPrice((prevPrice) => prevPrice - price);
      } else {
        newSet.add(suitId);
        setTotalPrice((prevPrice) => prevPrice + price);
      }
      // Call parent's onSelect if provided
      if (onSelect) {
        onSelect(suitId);
      }
      return newSet;
    });
  };

  const handleDelete = async (suitId) => {
    if (!suitId) {
      console.error("No suit ID provided for deletion");
      return;
    }
    try {
      setDeletingSuitId(suitId);
      // Start both the deletion and delay in parallel
      await Promise.all([
        deleteMutation.mutateAsync(suitId),
        new Promise((resolve) => setTimeout(resolve, 500)),
      ]);
    } catch (error) {
      console.error("Failed to delete suit:", error);
    } finally {
      setDeletingSuitId(null);
    }
  };

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

    // Function to toggle view type for this card
    const toggleCardViewType = async () => {
      const newViewType = cardViewType === "suit" ? "pants" : "suit";

      setCardViewTypes((prev) => ({
        ...prev,
        [item._id]: newViewType,
      }));

      // Load images for the new view type if not in cache
      const cacheKey = `${item._id}-${newViewType}`;
      if (!imagesCache[cacheKey]) {
        await loadImagesForSuit(item._id, newViewType);
      }
    };

    return (
      <div key={`suit-${item._id}`} className={cardClass}>
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

        {imagesData?.[index] &&
          Object.entries(imagesData[index])
            .filter(([key]) => key !== "textInside") // Remove textInside from display
            .sort((a, b) => getZIndex(a[0]) - getZIndex(b[0]))
            .map(([key, src]) => (
              <img
                key={key}
                src={src}
                alt={`Suit part: ${key}`}
                className={photoClass}
                style={{ zIndex: getZIndex(key) }}
                loading="lazy"
              />
            ))}

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
          <div className={priceClass}>{item.totalPrice}$</div>
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
      >
        {sortedSuits.map((item, index) => renderCard(item, index))}
      </div>
    </div>
  );
};

export default DynamicImage;

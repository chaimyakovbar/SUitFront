import React, { useMemo, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    padding: "2rem",
  },
  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "2rem",
    width: "100%",
    maxWidth: "1200px",
  },
  card: {
    backgroundColor: "#202020",
    position: "relative",
    width: "100%",
    height: "300px",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "0",
    overflow: "hidden",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    "&:hover": {
      border: "1px solid rgba(255,255,255,0.3)",
      transform: "translateY(-4px)",
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
  cardControls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    // backgroundColor: "rgba(0,0,0,0.7)",
    backgroundColor: "#222222",
    backdropFilter: "blur(4px)",
    borderTop: "1px solid rgba(255,255,255,0.1)",
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
    // {
    //   key: "packetBottom",
    //   // path: `/assets/ragach/packetBottom/${item.packetType}/${item.color}.png`,
    //   path: `/assets/ragach/packet/${item.packetKind}/packet1/${item.color}.png`,
    // },
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

// Main component
const DynamicImage = ({ onSelect, selectedSuits: parentSelectedSuits }) => {
  const classes = useStyles();
  const { data, isLoading: productLoading, error } = useProduct();
  const allSuits = useMemo(() => data?.allSuitPart || [], [data?.allSuitPart]);
  const [deletingSuitId, setDeletingSuitId] = useState(null);
  console.log("Received suits data:", allSuits); // Debug log

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

  // Create a stable queryKey by memoizing the MongoDB _ids
  const suitsQueryKey = useMemo(
    () => ["images", allSuits.map((item) => item._id).join("-")],
    [allSuits]
  );

  const {
    data: imagesData,
    isLoading: imagesLoading,
    error: imagesError,
  } = useQuery({
    queryKey: suitsQueryKey,
    queryFn: () => Promise.all(allSuits.map((item) => fetchImages(item))),
    enabled: allSuits.length > 0 && !productLoading,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    retry: 2,
  });

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
        onSelect(suitId, price);
      }
      return newSet;
    });
  };

  const handleDelete = async (suitId) => {
    console.log("Deleting suit with ID:", suitId); // Debug log
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
  if (productLoading || imagesLoading) {
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
  if (error || imagesError) {
    return (
      <div className={classes.errorContainer}>
        <Typography>Error loading suits. Please try again later.</Typography>
      </div>
    );
  }

  // Handle empty state
  if (!allSuits.length) {
    return (
      <div className={classes.emptyContainer}>
        <Typography>No suits found.</Typography>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.cardsContainer}>
        {allSuits.map((item, index) => (
          <div key={`suit-${item._id}`} className={classes.card}>
            {deletingSuitId === item._id && (
              <div className={classes.deleteLoadingOverlay}>
                <CircularProgress
                  color="inherit"
                  size={24}
                  style={{ marginBottom: "1rem" }}
                />
                <Typography style={{ color: "#fff" }}>
                  Deleting suit...
                </Typography>
              </div>
            )}
            {imagesData?.[index] &&
              Object.entries(imagesData[index])
                .sort((a, b) => getZIndex(a[0]) - getZIndex(b[0]))
                .map(([key, src]) => (
                  <img
                    key={key}
                    src={src}
                    alt={`Suit part: ${key}`}
                    className={classes.photo}
                    style={{ zIndex: getZIndex(key) }}
                    loading="lazy"
                  />
                ))}
            <div className={classes.cardControls}>
              <div className={classes.priceTag}>{item.totalPrice}$</div>
              <div className={classes.controlsWrapper}>
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
        ))}
      </div>
    </div>
  );
};

export default DynamicImage;

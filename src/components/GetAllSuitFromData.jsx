import React, { useMemo, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useProduct from "../Hooks/useProduct";
import { deleteSuit } from "../api/suit";
// import { Button } from "@mui/material";

// Define styles using object patterns for better readability
const styles = {
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
    position: "relative",
    width: "100%",
    height: "200px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    overflow: "hidden",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-4px)",
    },
  },
  photo: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "50%",
    height: "100%",
    objectFit: "contain",
  },
  cardControls: {
    position: "absolute",
    top: "10px",
    right: "10px",
    display: "flex",
    gap: "8px",
    zIndex: 100,
  },
  checkbox: {
    width: "20px",
    height: "20px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "4px 8px",
    backgroundColor: "#ff4444",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#cc0000",
    },
  },
  selectedCount: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    borderRadius: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
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
    {
      key: "packetBottom",
      path: `/assets/ragach/packetBottom/${item.packetType}/${item.color}.png`,
    },
    { key: "packetUp", path: `/assets/ragach/packetUp/${item.color}.png` },
  ];

  // Add conditional parts
  if (item.parts?.bottom) {
    imagePaths.push({
      key: "bottom",
      path: `/assets/ragach/bottom/${item.color}.png`,
    });
  }

  if (item.parts?.bottomKind3) {
    imagePaths.push({
      key: "bottomKind3",
      path: `/assets/ragach/bottomKind3/${item.color}.png`,
    });
  }

  if (item.parts?.holeButtonColor) {
    imagePaths.push({
      key: "holeButton",
      path: `/assets/adds/holesButton/${item.kind}/${item.holeButtonColor}.png`,
    });
  }

  if (item.parts?.holeButtonUpColor) {
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
    // Add more specific z-indexes as needed
    default: 1,
  };

  return zIndexMap[key] || zIndexMap.default;
};

// Main component
const DynamicImage = ({ onSelect, selectedSuits: parentSelectedSuits }) => {
  const { data, isLoading: productLoading, error } = useProduct();
  const allSuits = useMemo(() => data?.allSuitPart || [], [data?.allSuitPart]);
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
      await deleteMutation.mutateAsync(suitId);
    } catch (error) {
      console.error("Failed to delete suit:", error);
    }
  };

  // Handle loading state
  if (productLoading || imagesLoading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>Loading suits...</p>
      </div>
    );
  }

  // Handle error states
  if (error || imagesError) {
    return (
      <div style={{ color: "red", padding: "1rem", textAlign: "center" }}>
        <p>Error loading suits. Please try again later.</p>
      </div>
    );
  }

  // Handle empty state
  if (!allSuits.length) {
    return (
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <p>No suits found.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.cardsContainer}>
        {allSuits.map((item, index) => (
          <div key={`suit-${item._id}`} style={styles.card}>
            <div style={styles.cardControls}>
              <input
                type="checkbox"
                checked={selectedSuits.has(item._id)}
                onChange={() => handleSelect(item._id, item.totalPrice)}
                style={styles.checkbox}
              />
              <button
                onClick={() => handleDelete(item._id)}
                style={styles.deleteButton}
                disabled={deleteMutation.isLoading}
              >
                {deleteMutation.isLoading ? "Deleting..." : "Delete"}
              </button>
              <p
                style={{
                  position: "absolute",
                  top: "40px",
                  left: "25px",
                  border: "1px solid black",
                  padding: "5px",
                  borderRadius: "5px",
                }}
              >
                {item.totalPrice}$
              </p>
            </div>
            {imagesData?.[index] &&
              Object.entries(imagesData[index])
                .sort((a, b) => getZIndex(a[0]) - getZIndex(b[0]))
                .map(([key, src]) => (
                  <img
                    key={key}
                    src={src}
                    alt={`Suit part: ${key}`}
                    style={{
                      ...styles.photo,
                      zIndex: getZIndex(key),
                    }}
                    loading="lazy"
                  />
                ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicImage;

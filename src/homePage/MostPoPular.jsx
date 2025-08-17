import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { baseURL } from "../config/api";

import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";
import sec from "../assets/places/sec.png";

const useStyles = makeStyles({
  container: {
    width: "100%",
  },
  productCard: {
    position: "relative",
    overflow: "hidden",
    height: "450px",
    cursor: "pointer",
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "grayscale(20%)",
    transition: "all 0.7s ease",
  },
  productOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    padding: "30px 25px",
    zIndex: 1000,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)",
    transition: "all 0.5s ease",
  },
  productTitle: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "1.7rem !important",
    fontWeight: "300 !important",
    color: "#fff !important",
    marginBottom: "8px !important",
    letterSpacing: "0.05em !important",
  },
  productPrice: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "1rem !important",
    fontWeight: "300 !important",
    color: "#fff !important",
    marginBottom: "15px !important",
    letterSpacing: "0.05em !important",
  },
  productDescription: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.8rem !important",
    fontWeight: "300 !important",
    color: "#ccc !important",
    marginBottom: "20px !important",
    maxHeight: "0",
    opacity: "0",
    overflow: "hidden",
    transition: "all 0.5s ease",
    lineHeight: "1.6 !important",
  },
  productButton: {
    backgroundColor: "transparent !important",
    color: "#fff !important",
    border: "1px solid #fff !important",
    padding: "8px 20px !important",
    fontSize: "0.7rem !important",
    borderRadius: "0 !important",
    fontWeight: "400 !important",
    letterSpacing: "0.15em !important",
    textTransform: "uppercase !important",
    fontFamily: "'Montserrat', sans-serif !important",
    opacity: "0",
    transform: "translateY(20px)",
    transition: "all 0.5s ease",
    "&:hover": {
      backgroundColor: "#fff !important",
      color: "#000 !important",
    },
  },
  hoverCard: {
    "&:hover $productImage": {
      transform: "scale(1.05)",
      filter: "grayscale(0%)",
    },
    "&:hover $productOverlay": {
      background:
        "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)",
    },
    "&:hover $productDescription": {
      maxHeight: "80px",
      opacity: "1",
      marginBottom: "20px",
    },
    "&:hover $productButton": {
      opacity: "1",
      transform: "translateY(0)",
    },
  },
  // חדש - סגנונות לקרוסלה
  carouselSection: {
    marginTop: "60px",
    marginBottom: "60px",
  },
  carouselTitle: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "2.5rem !important",
    fontWeight: "300 !important",
    color: "#C0D3CA !important",
    textAlign: "center !important",
    marginBottom: "10px !important",
    letterSpacing: "0.05em !important",
  },
  carouselSubtitle: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "1.1rem !important",
    fontWeight: "300 !important",
    color: "rgba(255, 255, 255, 0.7) !important",
    textAlign: "center !important",
    marginBottom: "40px !important",
    letterSpacing: "0.02em !important",
  },
  carouselContainer: {
    position: "relative",
    maxWidth: "100%",
    margin: "0 auto",
    overflow: "hidden",
  },
  carousel: {
    display: "flex",
    transition: "transform 0.3s ease-out",
    height: "50vh",
    willChange: "transform", // שיפור ביצועים לאנימציה
  },
  carouselItem: {
    minWidth: "100%",
    position: "relative",
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0",
    flex: "0 0 auto",
  },
  suitImageContainer: {
    position: "relative",
    width: "100%",
    height: "150%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  suitImage: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "80%",
    objectFit: "contain",
  },
  suitInfo: {
    textAlign: "center",
    marginBottom: "20px",
  },
  suitTitle: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "1.3rem !important",
    color: "#C0D3CA !important",
    marginBottom: "10px !important",
    fontWeight: "400 !important",
  },
  suitDetails: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    color: "rgba(255, 255, 255, 0.7) !important",
    marginBottom: "15px !important",
  },
  suitPrice: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "1.2rem !important",
    color: "#C0D3CA !important",
    fontWeight: "500 !important",
  },
  likeButton: {
    background: "none !important",
    border: "2px solid rgba(192, 211, 202, 0.3) !important",
    color: "rgba(192, 211, 202, 0.7) !important",
    padding: "10px 20px !important",
    borderRadius: "25px !important",
    cursor: "pointer !important",
    fontSize: "1rem !important",
    transition: "all 0.3s ease !important",
    display: "flex !important",
    alignItems: "center !important",
    gap: "8px !important",
    "&:hover": {
      borderColor: "#C0D3CA !important",
      color: "#C0D3CA !important",
      transform: "translateY(-2px) !important",
    },
    "&.liked": {
      background: "#C0D3CA !important",
      color: "#1e1e1e !important",
      borderColor: "#C0D3CA !important",
      "&:hover": {
        background: "rgba(192, 211, 202, 0.8) !important",
      },
    },
  },
  carouselNav: {
    position: "absolute !important",
    top: "50% !important",
    transform: "translateY(-50%) !important",
    background: "rgba(30, 30, 30, 0.8) !important",
    border: "1px solid rgba(192, 211, 202, 0.2) !important",
    color: "#C0D3CA !important",
    width: "50px !important",
    height: "50px !important",
    borderRadius: "50% !important",
    cursor: "pointer !important",
    display: "flex !important",
    alignItems: "center !important",
    justifyContent: "center !important",
    fontSize: "1.5rem !important",
    transition: "all 0.3s ease !important",
    zIndex: 10,
    "&:hover": {
      background: "rgba(192, 211, 202, 0.1) !important",
      borderColor: "#C0D3CA !important",
    },
    "&.prev": {
      left: "20px !important",
    },
    "&.next": {
      right: "20px !important",
    },
  },
  carouselDots: {
    display: "flex !important",
    justifyContent: "center !important",
    gap: "10px !important",
    marginTop: "20px !important",
  },
  dot: {
    width: "12px !important",
    height: "12px !important",
    borderRadius: "50% !important",
    background: "rgba(192, 211, 202, 0.3) !important",
    cursor: "pointer !important",
    transition: "all 0.3s ease !important",
    "&.active": {
      background: "#C0D3CA !important",
    },
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    color: "rgba(255, 255, 255, 0.7)",
  },
  emptyContainer: {
    textAlign: "center",
    padding: "40px",
    color: "rgba(255, 255, 255, 0.7)",
  },
  infiniteCarousel: {
    position: "relative",
    width: "100%",
    overflow: "hidden",
  },
  carouselTrack: {
    display: "flex",
    width: "fit-content",
  },
});

const MostPoPular = () => {
  const classes = useStyles();
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [suits, setSuits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suitImages, setSuitImages] = useState({});
  const [likedSuits, setLikedSuits] = useState(
    new Set(JSON.parse(localStorage.getItem("likedSuits") || "[]"))
  );

  // טעינת חליפות מהזמנות
  useEffect(() => {
    loadSuitsFromOrders();
  }, []);

  // אנימציה אוטומטית לקרוסלה - כל 4 שניות
  useEffect(() => {
    if (suits.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % suits.length);
    }, 4000); // 4 שניות

    return () => clearInterval(interval);
  }, [suits.length]);

  // טעינת תמונות רק לחליפות הנראות - Lazy Loading
  useEffect(() => {
    let isMounted = true;

    const loadVisibleSuitImages = async () => {
      const imagesMap = {};

      // טען רק את החליפה הנוכחית בקרוסלה + 2 הבאות
      const visibleSuits = suits.slice(currentIndex, currentIndex + 3);

      await Promise.all(
        visibleSuits.map(async (suit) => {
          if (!isMounted) return;

          const suitId = suit._id || suit.orderId;
          if (suitId && !suitImages[suitId]) {
            try {
              imagesMap[suitId] = await fetchSuitImages(suit);
            } catch (error) {
              console.warn(`Failed to load images for suit ${suitId}:`, error);
            }
          }
        })
      );

      if (isMounted) {
        setSuitImages((prev) => ({ ...prev, ...imagesMap }));
      }
    };

    if (suits.length > 0) {
      loadVisibleSuitImages();
    }

    return () => {
      isMounted = false;
    };
  }, [suits, currentIndex]); // תלוי ב-currentIndex במקום ב-suits

  // יצירת רשימת חליפות פופולריות לפי לייקים - עם useMemo לשיפור ביצועים
  const popularItems = useMemo(() => {
    if (suits.length === 0) return [];

    // הוספת מספר לייקים לכל חליפה מה-localStorage
    const suitsWithLikes = suits.map((suit) => {
      const suitId = suit._id || suit.orderId;
      const likedSuitsArray = JSON.parse(
        localStorage.getItem("likedSuits") || "[]"
      );
      const isLiked = likedSuitsArray.includes(suitId);

      return {
        ...suit,
        likes: isLiked ? 1 : 0, // אם החליפה אהובה, יש לה לייק אחד
      };
    });

    // מיון חליפות לפי מספר לייקים (יורד)
    const sortedSuits = [...suitsWithLikes].sort((a, b) => {
      const aLikes = a.likes || 0;
      const bLikes = b.likes || 0;
      return bLikes - aLikes;
    });

    // לקיחת 3 הראשונות
    const top3Suits = sortedSuits.slice(0, 3);

    // יצירת אובייקטים בפורמט הנדרש עם מפתחות ייחודיים
    return top3Suits.map((suit, index) => {
      const suitId = suit._id || suit.orderId;
      const images = suitImages[suitId] || {};
      const mainImage = Object.values(images)[0] || sec; // תמונה ראשונה או ברירת מחדל

      // יצירת מפתח ייחודי על ידי שילוב של suitId ו-index
      const uniqueId = suitId ? `${suitId}_${index}` : `suit_${index}`;

      return {
        id: uniqueId,
        originalId: suitId,
        image: mainImage,
        title: `${suit.color || "חליפה"} ${suit.kind || "קלאסית"}`,
        description: `חליפה מותאמת אישית עם ${
          suit.lapelType || "לפל סטנדרטי"
        } ו${suit.packetType || "כיסים קלאסיים"}`,
        price: `$${suit.totalPrice || 599}`,
        link: `/collection/${suitId || index + 1}`,
        likes: suit.likes || 0,
      };
    });
  }, [suits, suitImages, likedSuits]); // הוספתי likedSuits כדי שיתעדכן כשיש לייקים חדשים

  const loadSuitsFromOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      // נסה לטעון מהשרת לפי הקונפיגורציה
      const response = await fetch(`${baseURL}/orders/all-suits`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
      });
      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data);
        if (data.success) {
          setSuits(data.suits || []);
        } else {
          console.log(
            "Server returned success: false, falling back to localStorage"
          );
          // נסה לטעון מ-localStorage
          loadFromLocalStorage();
        }
      } else {
        console.log("Server returned error status:", response.status);
        // נסה לטעון מ-localStorage
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error("שגיאה בטעינת חליפות:", error);
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      const allSuits = [];

      orders.forEach((order) => {
        if (order.selectedSuits && Array.isArray(order.selectedSuits)) {
          order.selectedSuits.forEach((suit) => {
            if (suit && typeof suit === "object") {
              allSuits.push({
                ...suit,
                orderId: order.orderId,
                orderDate: order.paymentDate,
              });
            }
          });
        }
      });
      setSuits(allSuits);
    } catch (error) {
      console.error("שגיאה בטעינה מ-localStorage:", error);
      setSuits([]);
    }
  };

  // פונקציה ליצירת נתיבי תמונה לכל החלקים של החליפה - מופחתת
  const getImagePaths = (suit) => {
    const imagePaths = [];

    // חליפה - רק החלקים החשובים ביותר
    imagePaths.push(
      // Base suit image - use stored path if available, otherwise construct it
      {
        key: "baseSuit",
        path:
          suit.baseSuitImagePath ||
          `/assets/ragach/Kinds/${suit.kind || "kind1"}/${
            suit.color || "blackGrey"
          }.png`,
      },
      {
        key: "lapelCollar",
        path: `/assets/ragach/${suit.lapelKind || "collarTight"}/${
          suit.lapelType || "Standard"
        }/${suit.kind || "kind1"}/${suit.color || "blackGrey"}.png`,
      },
      {
        key: "colar",
        path: `/assets/ragach/colar/${suit.color || "blackGrey"}.png`,
      },
      {
        key: "sleeves",
        path: `/assets/ragach/sleeves/${suit.color || "blackGrey"}.png`,
      }
    );

    // Add packet based on packet type and kind
    if (suit.packetType) {
      const packetType = suit.packetType;
      const packetKind = suit.packetKind || "packetBottom";

      imagePaths.push({
        key: packetKind === "packetSide" ? "packetSide" : "packetBottom",
        path: `/assets/ragach/packet/${packetKind}/${packetType}/${
          suit.color || "blackGrey"
        }.png`,
      });
    }

    // Add conditional parts for suit
    if (suit?.bottomPart === "bottom") {
      imagePaths.push({
        key: "bottom",
        path: `/assets/ragach/bottom/${suit.color || "blackGrey"}.png`,
      });
    }

    if (suit?.bottomPart === "bottomKind3") {
      imagePaths.push({
        key: "bottomKind3",
        path: `/assets/ragach/bottomKind3/${suit.color || "blackGrey"}.png`,
      });
    }

    if (suit?.holeButtonColor) {
      imagePaths.push({
        key: "holeButton",
        path: `/assets/adds/holesButton/${suit.kind || "kind1"}/${
          suit.holeButtonColor
        }.png`,
      });
    }

    if (suit?.holeButtonUpColor) {
      imagePaths.push({
        key: "holeButtonUp",
        path: `/assets/adds/holesButtonUp/${suit.holeButtonUpColor}.png`,
      });
    }

    if (suit.poshetColor) {
      imagePaths.push({
        key: "poshetColor",
        path: `/assets/adds/poshet/${suit.poshetColor}.png`,
      });
    }

    if (suit.buttonColor) {
      const buttonColorMap = {
        black: "blackGrey",
        grey: "greyLight",
      };
      const actualColor = buttonColorMap[suit.buttonColor] || suit.buttonColor;
      imagePaths.push({
        key: "button",
        path: `/assets/ragach/button/${
          suit.kind || "kind1"
        }/${actualColor}.png`,
      });
    }

    return imagePaths;
  };

  // פונקציה לטעינת תמונות - עם cache
  const imagePathCache = useMemo(() => new Map(), []);

  const loadImage = async (key, path) => {
    // בדיקה אם הנתיב כבר נבדק
    if (imagePathCache.has(path)) {
      return imagePathCache.get(path);
    }

    try {
      const response = await fetch(path, { method: "HEAD" });
      const result = response.ok ? { key, src: path } : { key, src: null };

      // שמירה ב-cache
      imagePathCache.set(path, result);

      return result;
    } catch (error) {
      console.warn(
        `⚠️ Error loading image for ${key} at path: ${path}:`,
        error
      );
      const result = { key, src: null };
      imagePathCache.set(path, result);
      return result;
    }
  };

  // פונקציה לטעינת כל התמונות של חליפה - עם cache
  const imageCache = useMemo(() => new Map(), []);

  const fetchSuitImages = async (suit) => {
    if (!suit) return {};

    const suitId = suit._id || suit.orderId;
    const cacheKey = `${suitId}-${JSON.stringify(suit)}`;

    // בדיקה אם התמונות כבר בק cache
    if (imageCache.has(cacheKey)) {
      return imageCache.get(cacheKey);
    }

    const imagePaths = getImagePaths(suit);
    const images = await Promise.all(
      imagePaths.map(({ key, path }) => loadImage(key, path))
    );

    const result = images.reduce((acc, { key, src }) => {
      if (src) acc[key] = src;
      return acc;
    }, {});

    // שמירה ב-cache
    imageCache.set(cacheKey, result);

    // ניקוי cache אם הוא גדול מדי
    if (imageCache.size > 50) {
      const firstKey = imageCache.keys().next().value;
      imageCache.delete(firstKey);
    }

    return result;
  };

  // Get z-index for image layers
  const getZIndex = (key) => {
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

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % suits.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + suits.length) % suits.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const toggleLike = useCallback(
    (suitId) => {
      const newLikedSuits = new Set(likedSuits);
      if (newLikedSuits.has(suitId)) {
        newLikedSuits.delete(suitId);
      } else {
        newLikedSuits.add(suitId);
      }

      setLikedSuits(newLikedSuits);
      localStorage.setItem("likedSuits", JSON.stringify([...newLikedSuits]));
    },
    [likedSuits]
  );

  return (
    <Box className={classes.container}>
      {/* חליפות פופולריות קיימות */}
      <div>
        <Grid container spacing={3}>
          {popularItems.map((item) => {
            // מציאת החליפה המקורית לפי ID
            const originalSuit = suits.find((suit) => {
              const suitId = suit._id || suit.orderId;
              return suitId === item.originalId;
            });

            // קבלת התמונות של החליפה
            const suitImagesForItem = originalSuit
              ? suitImages[item.originalId] || {}
              : {};

            return (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <div className={`${classes.productCard} ${classes.hoverCard}`}>
                  {/* הצגת כל החלקים של החליפה */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {Object.keys(suitImagesForItem).length > 0 ? (
                      Object.entries(suitImagesForItem)
                        .sort((a, b) => getZIndex(a[0]) - getZIndex(b[0]))
                        .map(([key, src]) => (
                          <img
                            key={key}
                            src={src}
                            alt={`Suit part: ${key}`}
                            className={classes.productImage}
                            style={{
                              zIndex: getZIndex(key),
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: "80%",
                              height: "80%",
                              objectFit: "contain",
                            }}
                            loading="lazy"
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        ))
                    ) : (
                      // Fallback אם אין תמונות
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(30, 30, 30, 0.8)",
                          color: "#C0D3CA",
                          fontSize: "1.2rem",
                          fontFamily: "'Montserrat', sans-serif",
                        }}
                      >
                        {originalSuit?.color || "חליפה"}{" "}
                        {originalSuit?.kind || "קלאסית"}
                      </div>
                    )}
                  </div>
                  <div className={classes.productOverlay}>
                    <Typography variant="h4" className={classes.productTitle}>
                      {item.title}
                    </Typography>
                    <Typography variant="h6" className={classes.productPrice}>
                      {item.price}
                    </Typography>
                    <Typography
                      variant="body2"
                      className={classes.productDescription}
                    >
                      {item.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{
                        color: "#C0D3CA",
                        fontSize: "0.8rem",
                        marginBottom: "10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <FavoriteIcon style={{ fontSize: "1rem" }} />
                      {item.likes || 0} לייקים
                    </Typography>
                    <Button
                      component={Link}
                      to={item.link}
                      className={classes.productButton}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Grid>
            );
          })}
        </Grid>
      </div>

      {/* קרוסלה של חליפות מהזמנות */}
      <Box className={classes.carouselSection}>
        {loading ? (
          <Box className={classes.loadingContainer}>
            <CircularProgress
              color="inherit"
              size={24}
              style={{ marginBottom: "1rem" }}
            />
            <Typography>{t("loadingSuits")}</Typography>
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            style={{ maxWidth: "800px", margin: "0 auto" }}
          >
            {error}
          </Alert>
        ) : suits.length === 0 ? (
          <Box className={classes.emptyContainer}>
            <Typography variant="h6">{t("noSuitsFound")}</Typography>
            <Typography variant="body2" style={{ marginTop: "10px" }}>
              {t("noSuitsMessage")}
            </Typography>
          </Box>
        ) : (
          <>
            <Box className={classes.carouselContainer}>
              <Box
                className={classes.carousel}
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {suits.map((suit, index) => {
                  const suitId = suit._id || suit.orderId;
                  const images = suitImages[suitId] || {};

                  return (
                    <Box
                      key={`carousel-${suitId}-${index}`}
                      className={classes.carouselItem}
                    >
                      <Box className={classes.suitImageContainer}>
                        {Object.entries(images)
                          .sort((a, b) => getZIndex(a[0]) - getZIndex(b[0]))
                          .map(([key, src]) => (
                            <img
                              key={`${suitId}-${key}`}
                              src={src}
                              alt={`Suit part: ${key}`}
                              className={classes.suitImage}
                              style={{ zIndex: getZIndex(key) }}
                              loading="lazy"
                              onError={(e) => (e.target.style.display = "none")}
                            />
                          ))}
                      </Box>

                      {/* כפתור לייק */}
                      <Button
                        className={`${classes.likeButton} ${
                          likedSuits.has(suitId) ? "liked" : ""
                        }`}
                        onClick={() => toggleLike(suitId)}
                        startIcon={
                          likedSuits.has(suitId) ? (
                            <FavoriteIcon />
                          ) : (
                            <FavoriteBorderIcon />
                          )
                        }
                        style={{
                          position: "absolute",
                          bottom: "20px",
                          right: "20px",
                          zIndex: 1000,
                        }}
                      >
                        {likedSuits.has(suitId)
                          ? t("likedButton")
                          : t("likeButton")}
                      </Button>
                    </Box>
                  );
                })}
              </Box>

              {/* חצים לניווט */}
              {suits.length > 1 && (
                <>
                  <IconButton
                    className={`${classes.carouselNav} prev`}
                    onClick={prevSlide}
                    style={{ display: currentIndex === 0 ? "none" : "flex" }}
                  >
                    <ChevronLeftIcon />
                  </IconButton>
                  <IconButton
                    className={`${classes.carouselNav} next`}
                    onClick={nextSlide}
                    style={{
                      display:
                        currentIndex === suits.length - 1 ? "none" : "flex",
                    }}
                  >
                    <ChevronRightIcon />
                  </IconButton>
                </>
              )}
            </Box>

            {/* נקודות לניווט */}
            {suits.length > 1 && (
              <Box className={classes.carouselDots}>
                {suits.map((_, index) => (
                  <Box
                    key={index}
                    className={`${classes.dot} ${
                      index === currentIndex ? "active" : ""
                    }`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default MostPoPular;

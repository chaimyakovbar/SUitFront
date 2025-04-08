import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../Utils";
import HaveUser from "../components/HaveUser";
import {
  userSizes,
  sizesCollectionExpleines,
  bodyPoints,
} from "../consts/KindOfColors";
import YouTubeIcon from "@mui/icons-material/YouTube";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  Box,
  TextField,
  Button,
  Dialog,
  Slide,
  Tooltip,
  Paper,
  Typography,
  IconButton,
  Drawer,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useProduct from "../Hooks/UseProduct.jsx";
import tai from "../assets/sizes/humen/tai.png";
import suit from "../assets/sizes/humen/suit.png";
import head from "../assets/sizes/humen/head.png";
import pants from "../assets/sizes/humen/pants.png";
import shirt from "../assets/sizes/humen/shirt.png";
import shoose from "../assets/sizes/humen/shoose.png";
import sleevs from "../assets/sizes/humen/sleevs.png";
import bottomSuit from "../assets/sizes/humen/bottomSuit.png";

const arrayOfImg = [shirt, tai, bottomSuit, sleevs, suit];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TakeSizes = () => {
  const { data, isLoading } = useProduct();
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);
  const [sizes, setSizes] = useState({});
  const [dialogType, setDialogType] = useState(null);
  const [dialogContent, setDialogContent] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [completedPoints, setCompletedPoints] = useState([]);
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && data && data.sizes) {
      setSizes(prevSizes => ({
        ...prevSizes,
        ...data.sizes
      }));
    }
  }, [isLoading, data]);

  useEffect(() => {
    if (!bodyPoints) return;

    const completed = bodyPoints.filter(point => {
      if (sizes[point.category] && sizes[point.category].toString().trim() !== "" && 
          Number(sizes[point.category]) > 0) {
        return true;
      }
      
      if (data && data.sizes && 
          data.sizes[point.category] && 
          data.sizes[point.category].toString().trim() !== "" && 
          Number(data.sizes[point.category]) > 0) {
        return true;
      }
      
      return false;
    }).map(point => point.id);

    setCompletedPoints(completed);
  }, [sizes, data]);

  if (!user) return <HaveUser />;

  const handleSizeChange = (category, value) => {
    setSizes(prev => ({ ...prev, [category]: value }));
  };

  const handlePointClick = (point) => {
    setSelectedPoint(point);
  };

  const handleOpenDialog = (type, content) => {
    setDialogType(type);
    setDialogContent(content);
  };

  const handleClose = () => {
    setDialogType(null);
    setDialogContent(null);
  };

  const handleClosePoint = () => {
    setSelectedPoint(null);
  };

  const toggleSideDrawer = () => {
    setSideDrawerOpen(!sideDrawerOpen);
  };

  // Get the effective value for a measurement (from either local state or database)
  const getEffectiveValue = (category) => {
    // First check local state (prioritize local changes)
    if (sizes[category] !== undefined && sizes[category] !== "") {
      return sizes[category];
    }
    
    // Then fall back to database value if available
    if (data && data.sizes && data.sizes[category] !== undefined && data.sizes[category] !== "") {
      return data.sizes[category];
    }
    
    // Return empty string as default
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(sizes).length === 0) {
      alert("אנא מלא את כל המידות הנדרשות");
      return;
    }

    try {
      // Combine existing database values with local changes for the save
      const combinedSizes = data && data.sizes 
        ? { ...data.sizes, ...sizes } 
        : sizes;
        
      await axios.post("http://localhost:3020/product", {
        email: user.email,
        sizes: combinedSizes,
      });
      alert("המידות נשמרו בהצלחה!");
    } catch (error) {
      console.error("שגיאה בשליחת הנתונים:", error);
      alert("שגיאה בשמירת המידות.");
    }
  };

  const findExplanation = (category) => {
    const index = userSizes.indexOf(category);
    return index >= 0 ? sizesCollectionExpleines[index] : null;
  };

  const getPointStatus = (pointId) => {
    // Find the corresponding body point
    const point = bodyPoints.find(p => p.id === pointId);
    if (!point) return "pending";
    
    // Check if the measurement is completed
    const value = getEffectiveValue(point.category);
    return (value && value.toString().trim() !== "" && Number(value) > 0) 
      ? "completed" 
      : "pending";
  };

  if (isLoading) return <p>טוען נתונים...</p>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          onClick={() => navigate("/")}
          sx={{ borderRadius: 2 }}
        >
          ← חזרה לדף הראשי
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/Shopping")}
          sx={{ borderRadius: 2 }}
        >
       לך לקניות
        </Button>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          מדידת מידות התפירה שלך
        </Typography>
        <Button variant="contained" color="primary" onClick={toggleSideDrawer}>
          הצג את כל המידות
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: 1,
          position: "relative",
          width: "100%",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 500,
            height: 600,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "350px",
              height: "550px",
              left: "20%",
            }}
          >
            <img
              src={head}
              style={{
                position: "absolute",
                top: 20,
                left: 0,
                width: "300px",
                height: "700px",
              }}
            />
            {arrayOfImg.map((item, index) => (
              <img
                key={index}
                src={item}
                alt={`image-${index}`}
                style={{
                  position: "absolute",
                  top: 100,
                  left: 0,
                  width: "300px",
                  height: "320px",
                  zIndex: 100,
                }}
              />
            ))}
            <img
              src={pants}
              style={{
                position: "absolute",
                top: 270,
                left: 0,
                width: "300px",
                height: "500px",
                zIndex: 99,
              }}
            />
            <img
              src={shoose}
              style={{
                position: "absolute",
                top: 400,
                left: 0,
                width: "300px",
                height: "400px",
              }}
            />
          </div>

          {bodyPoints.map((point) => (
            <Tooltip key={point.id} title={point.label} placement="top">
              <Box
                onClick={() => handlePointClick(point)}
                sx={{
                  position: "absolute",
                  top: `${point.y}%`,
                  left: `${point.x}%`,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor:
                    getPointStatus(point.id) === "completed" ? "green" : "red",
                  border: "2px solid white",
                  boxShadow: "0 0 5px rgba(0,0,0,0.5)",
                  cursor: "pointer",
                  transform: "translate(-50%, -50%)",
                  zIndex: 110,
                  "&:hover": {
                    boxShadow: "0 0 10px rgba(0,0,0,0.7)",
                    transform: "translate(-50%, -50%) scale(1.2)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              />
            </Tooltip>
          ))}

          <Box sx={{ position: "absolute", bottom: 16, right: 16 }}>
            <Typography variant="body2">
              {completedPoints.length}/{bodyPoints.length} מידות הושלמו
            </Typography>
          </Box>
        </Paper>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4, width: 200 }}
          onClick={handleSubmit}
        >
          שמירת המידות
        </Button>
      </Box>

      {selectedPoint && (
        <Dialog
          open={true}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClosePoint}
          maxWidth="sm"
          fullWidth
        >
          <Box sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}
            >
              {selectedPoint.label}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <TextField
                type="number"
                label="הכנס מידה (ס״מ)"
                value={getEffectiveValue(selectedPoint.category)}
                onChange={(e) =>
                  handleSizeChange(selectedPoint.category, e.target.value)
                }
                variant="outlined"
                fullWidth
                sx={{ ml: 2 }}
              />
            </Box>

            {findExplanation(selectedPoint.category) && (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  מתקשה במדידה? יש לנו עזרה בשבילך:
                </Typography>

                <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                  <Tooltip title="צפה בסרטון הדרכה" placement="top">
                    <IconButton
                      color="error"
                      onClick={() =>
                        handleOpenDialog(
                          "YouTube",
                          findExplanation(selectedPoint.category).video
                        )
                      }
                    >
                      <YouTubeIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="הסבר מפורט" placement="top">
                    <IconButton
                      onClick={() =>
                        handleOpenDialog(
                          "Error",
                          findExplanation(selectedPoint.category).title
                        )
                      }
                    >
                      <HelpOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                {findExplanation(selectedPoint.category).img && (
                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <img
                      src={findExplanation(selectedPoint.category).img}
                      alt={findExplanation(selectedPoint.category).title}
                      style={{
                        maxWidth: "100%",
                        maxHeight: 150,
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                )}
              </Box>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button onClick={handleClosePoint}>שמור</Button>
            </Box>
          </Box>
        </Dialog>
      )}

      {/* Help content dialog */}
      {dialogType && (
        <Dialog
          open={dialogType !== null}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
        >
          <Box padding={3}>
            {dialogType === "YouTube" ? (
              <Typography>כאן יוצג סרטון ההדרכה: {dialogContent}</Typography>
            ) : (
              <Typography>{dialogContent}</Typography>
            )}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button onClick={handleClose}>סגור</Button>
            </Box>
          </Box>
        </Dialog>
      )}

      <Drawer anchor="right" open={sideDrawerOpen} onClose={toggleSideDrawer}>
        <Box sx={{ width: 300, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            כל המידות
          </Typography>

          {bodyPoints.map((point) => {
            const effectiveValue = getEffectiveValue(point.category);
            const isCompleted = effectiveValue && 
                               effectiveValue.toString().trim() !== "" && 
                               Number(effectiveValue) > 0;
            
            return (
              <Box
                key={point.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  p: 1,
                  borderRadius: 1,
                  bgcolor: isCompleted
                    ? "rgba(76, 175, 80, 0.1)"
                    : "rgba(255, 235, 235, 0.5)",
                }}
              >
                <Typography>{point.label}</Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    type="number"
                    size="small"
                    value={effectiveValue}
                    onChange={(e) => handleSizeChange(point.category, e.target.value)}
                    sx={{ width: 80 }}
                  />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ס״מ
                  </Typography>
                </Box>
              </Box>
            );
          })}
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            שמור את כל המידות
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default TakeSizes;
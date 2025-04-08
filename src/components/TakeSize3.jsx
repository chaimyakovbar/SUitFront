import React, { useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  PerspectiveCamera,
  Html,
  SpotLight,
} from "@react-three/drei";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { bodyPoints, buttons } from "../consts/KindOfColors";
import { userAtom } from "../../Utils";
import { useAtom } from "jotai";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import useProduct from "../Hooks/useProduct";
import axios from "axios";

// Create a mapping from button ID to bodyPoint category
const createButtonCategoryMap = () => {
  const map = {};
  buttons.forEach((button) => {
    const bodyPoint = bodyPoints.find((point) => point.id === button.id);
    map[button.id] = bodyPoint ? bodyPoint.category : button.name;
  });
  return map;
};

// Precompute the mapping
const buttonCategoryMap = createButtonCategoryMap();

// The Doll component with the model
const Doll = (props) => {
  const modelRef = useRef();
  const { scene } = useGLTF("models/bane_male.glb");
  
  // Set the scale on first render without useEffect
  const clonedScene = React.useMemo(() => {
    const clone = scene.clone();
    return clone;
  }, [scene]);

  return (
    <primitive
      ref={modelRef}
      object={clonedScene}
      dispose={null}
      scale={[1, 1, 1]}
      {...props}
    />
  );
};

const DollDisplay = () => {
  const [user] = useAtom(userAtom);
  const { data, isLoading } = useProduct();
  
  // All state declarations
  const [sizes, setSizes] = useState(() => isLoading ? {} : data?.sizes || {});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [dialogContent, setDialogContent] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [activePoints, setActivePoints] = useState([]);

  // Compute completedPoints based on current sizes and data
  const completedPoints = React.useMemo(() => {
    // Combine local sizes and server data sizes
    const allSizes = { ...(data?.sizes || {}), ...sizes };
    
    // Create a list of completed point IDs
    return buttons.filter(button => {
      const category = buttonCategoryMap[button.id];
      const value = allSizes[category];
      return value && value.toString().trim() !== "" && Number(value) > 0;
    }).map(button => button.id);
  }, [sizes, data?.sizes]);

  // Update sizes when data loads (only once)
  React.useEffect(() => {
    if (!isLoading && data?.sizes && Object.keys(sizes).length === 0) {
      setSizes(data.sizes);
    }
  }, [isLoading, data]);

  const handleSizeChange = (category, value) => {
    setSizes(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleButtonClick = (button) => {
    setSelectedButton(button);
    
    // Get the category for this button
    const category = buttonCategoryMap[button.id];
    
    // Set the input value to the current size if it exists
    const existingSize = sizes[category] || (data?.sizes ? data.sizes[category] : "");
    setInputValue(existingSize || "");
    
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedButton(null);
  };

  const handleClose2 = () => {
    setDialogType(null);
    setDialogContent(null);
  };

  const handleOpenDialog = (type, content) => {
    setDialogType(type);
    setDialogContent(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(sizes).length === 0) {
      alert("אנא מלא את כל המידות הנדרשות");
      return;
    }

    try {
      const combinedSizes = data?.sizes ? { ...data.sizes, ...sizes } : sizes;

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

  // Handle point click to temporarily highlight a specific point
  const handlePointClick = (pointId) => {
    setActivePoints(prev => 
      prev.includes(pointId) 
        ? prev.filter(id => id !== pointId) 
        : [pointId]
    );
  };

  return (
    <div>
      <Box sx={{ position: "absolute", bottom: 16, right: 16 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4, width: 200 }}
          onClick={handleSubmit}
        >
          שמירת המידות
        </Button>
        <Typography variant="body2">
          {completedPoints.length}/{bodyPoints.length} מידות הושלמו
        </Typography>
      </Box>

      <div style={{ position: "relative" }}>
        <div style={{ marginTop: "100px", width: "100%", height: "150vh" }}>
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[10, 20, 20]} />
            <ambientLight intensity={0.5} />
            <OrbitControls />
            <Doll position={[10, 30, 10]} color="red" />
            <ButtonArray
              onButtonClick={handleButtonClick}
              onPointClick={handlePointClick}
              activePoints={activePoints}
              completedPoints={completedPoints}
            />
            <gridHelper args={[10, 10]} />
          </Canvas>
        </div>

        {/* Dialog for detailed info */}
        <Dialog open={dialogOpen} onClose={handleClose} keepMounted>
          <DialogTitle sx={{ backgroundColor: "#F5F5F7", fontWeight: "bold" }}>
            {selectedButton ? selectedButton.label : "Button Info"}
          </DialogTitle>

          <DialogContent
            sx={{
              backgroundColor: "#F5F5F7",
              padding: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minWidth: "300px",
            }}
          >
            {selectedButton ? (
              <Box
                sx={{
                  padding: "20px",
                  width: "100%",
                  maxWidth: "300px",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <TextField
                    type="number"
                    label="הכנס מידה (ס״מ)"
                    value={inputValue}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setInputValue(newValue);

                      const category = buttonCategoryMap[selectedButton.id];
                      handleSizeChange(category, newValue);
                    }}
                    variant="outlined"
                    fullWidth
                  />
                </Box>

                <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                  <img
                    src={selectedButton.img}
                    alt={selectedButton.title}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "contain",
                    }}
                  />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center", boxShadow: 3, borderRadius: "12px", width: '70%', margin: '0 auto'}}>
                  <Tooltip title="לחץ לצפייה" placement="top">
                    <Button
                      onClick={() =>
                        handleOpenDialog("YouTube", selectedButton.video)
                      }
                    >
                      <YouTubeIcon sx={{ color: "red" }} />
                    </Button>
                  </Tooltip>
                  <Tooltip title="לחץ להסבר מפורט" placement="top">
                    <Button
                      onClick={() =>
                        handleOpenDialog("Error", selectedButton.title)
                      }
                    >
                      <ErrorOutlineIcon />
                    </Button>
                  </Tooltip>
                </Box>
              </Box>
            ) : (
              <p>No button selected</p>
            )}
          </DialogContent>

          <DialogActions
            sx={{ backgroundColor: "#F5F5F7", padding: "10px 24px" }}
          >
            <Button onClick={handleClose} color="primary" variant="outlined">
              סגור
            </Button>
          </DialogActions>
        </Dialog>

        {/* Secondary dialog for videos and extra content */}
        <Dialog open={!!dialogType} onClose={handleClose2}>
          <DialogTitle>{dialogType}</DialogTitle>
          <DialogContent>
            <Box padding={2}>{dialogContent}</Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose2}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

// Component for the array of buttons
const ButtonArray = ({
  onButtonClick,
  onPointClick,
  activePoints,
  completedPoints,
}) => {
  const { camera } = useThree();

  return (
    <>
      {buttons.map((button) => (
        <Tooltip key={button.id} title={button.label}>
          <RedButton
            button={button}
            camera={camera}
            onClick={() => onButtonClick(button)}
            onPointClick={() => onPointClick(button.id)}
            isActive={activePoints.includes(button.id)}
            isCompleted={completedPoints.includes(button.id)}
          />
        </Tooltip>
      ))}
    </>
  );
};

// Individual Red Button component
const RedButton = ({
  button,
  camera,
  onClick,
  onPointClick,
  isActive,
  isCompleted,
}) => {
  const { position, size } = button;
  const buttonRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (buttonRef.current) {
      buttonRef.current.position.set(...position);
      buttonRef.current.lookAt(camera.position);
    }
  });

  // Determine button color based on state
  const buttonColor = isCompleted 
    ? "#66FF66"  // Green if completed
    : isActive 
      ? "#3399FF"  // Blue if active
      : hovered 
        ? "#FF6666"  // Light red if hovered
        : "#FF4C4C"; // Default red

  return (
    <mesh
      ref={buttonRef}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
        onPointClick();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <circleGeometry args={[size, 32]} />
      <meshStandardMaterial color={buttonColor} />
    </mesh>
  );
};

export default DollDisplay;
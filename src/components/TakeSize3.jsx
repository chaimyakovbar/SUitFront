import React, { useRef, useState, Suspense, useEffect } from "react";
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
  Drawer,
  Chip,
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { bodyPoints, buttons } from "../consts/KindOfColors";
import { authUserAtom } from "../Utils";
import { useAtom } from "jotai";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PersonIcon from "@mui/icons-material/Person";
import useProduct from "../Hooks/useProduct";
import { postProduct } from "../api/suit";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BodyCaptureCamera from "./BodyCaptureCamera";
import ARAvatar from "./ARAvatar";

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
  const { scene } = useGLTF("/models/bane_male.glb", true);

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
  const isMobile = useMediaQuery("(max-width:600px)");
  const [user] = useAtom(authUserAtom);
  const { data, isLoading } = useProduct();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [sizes, setSizes] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [dialogContent, setDialogContent] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [activePoints, setActivePoints] = useState([]);
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [sizeProfiles, setSizeProfiles] = useState([]);
  const [newProfileName, setNewProfileName] = useState("");
  const [openNewProfileDialog, setOpenNewProfileDialog] = useState(false);
  const [isARMode, setIsARMode] = useState(false);
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const [aiMeasurements, setAiMeasurements] = useState(null);

  // Initialize profiles from data
  useEffect(() => {
    if (!data?.sizes) return;

    const profiles = Object.entries(data.sizes).reduce((acc, [key, value]) => {
      if (key.startsWith("profile_")) {
        const profileName = key.replace("profile_", "");
        acc.push({
          name: profileName,
          sizes: value || {},
        });
      }
      return acc;
    }, []);

    setSizeProfiles(profiles);

    // If no profiles exist, create a default one
    if (profiles.length === 0) {
      const defaultProfile = {
        name: "Default",
        sizes: {},
      };
      setSizeProfiles([defaultProfile]);
      setSelectedProfile(defaultProfile);
      setSizes({});
    } else if (!selectedProfile) {
      setSelectedProfile(profiles[0]);
      setSizes(profiles[0].sizes || {});
    }
  }, [data]);

  // Update sizes when selected profile changes
  useEffect(() => {
    if (!selectedProfile || !data?.sizes) return;

    const profileKey = `profile_${selectedProfile.name}`;
    const profileSizes = data.sizes[profileKey] || {};
    setSizes(profileSizes);
  }, [selectedProfile, data]);

  const handleCreateNewProfile = async () => {
    if (!newProfileName.trim()) {
      enqueueSnackbar("Please enter a profile name", { variant: "error" });
      return;
    }

    const newProfile = {
      name: newProfileName.trim(),
      sizes: {},
    };

    try {
      const updatedSizes = {
        ...data?.sizes,
        [`profile_${newProfileName.trim()}`]: newProfile.sizes,
      };

      await postProduct({
        email: user.email,
        sizes: updatedSizes,
      });

      setSizeProfiles([...sizeProfiles, newProfile]);
      setSelectedProfile(newProfile);
      setNewProfileName("");
      setOpenNewProfileDialog(false);
      enqueueSnackbar("New profile created successfully", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error creating new profile:", error);
      enqueueSnackbar("Failed to create new profile", { variant: "error" });
    }
  };

  const handleSizeChange = (category, value) => {
    if (!selectedProfile) return;

    setSizes((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProfile) {
      enqueueSnackbar("Please select a profile first");
      return;
    }

    try {
      const updatedSizes = {
        ...(data?.sizes || {}),
        [`profile_${selectedProfile.name}`]: sizes,
      };

      await postProduct({
        email: user.email,
        sizes: updatedSizes,
      });

      setDialogOpen(false);
      setSelectedButton(null);
      enqueueSnackbar("Measurements saved successfully");
    } catch (error) {
      console.error("Error saving measurements:", error);
      enqueueSnackbar("Error saving measurements");
    }
  };

  const toggleSideDrawer = () => {
    setSideDrawerOpen(!sideDrawerOpen);
  };

  const completedPoints = React.useMemo(() => {
    if (!selectedProfile || !sizes) return [];

    return buttons
      .filter((button) => {
        const category = buttonCategoryMap[button.id];
        const value = sizes[category];
        return value && value.toString().trim() !== "" && Number(value) > 0;
      })
      .map((button) => button.id);
  }, [selectedProfile, sizes]);

  React.useEffect(() => {
    if (!isLoading && data?.sizes && Object.keys(sizes).length === 0) {
      setSizes(data.sizes);
    }
  }, [isLoading, data, sizes]);

  const handleButtonClick = (button) => {
    setSelectedButton(button);

    const category = buttonCategoryMap[button.id];
    const existingSize = sizes?.[category] || "";
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

  // Handle point click to temporarily highlight a specific point
  const handlePointClick = (pointId) => {
    setActivePoints((prev) =>
      prev.includes(pointId) ? prev.filter((id) => id !== pointId) : [pointId]
    );
  };

  // Handle AI measurement extraction
  const handleMeasurementsExtracted = (extractedMeasurements) => {
    setAiMeasurements(extractedMeasurements);
    
    // Convert AI measurements to match your existing measurement categories
    const convertedMeasurements = {};
    Object.entries(extractedMeasurements).forEach(([key, value]) => {
      // Map AI measurements to your existing categories
      const categoryMap = {
        'Chest': 'Chest',
        'Waist': 'Waist',
        'Seat': 'Seat',
        'Jacket Length': 'Jacket Length',
        'Front Width': 'Front Width',
        'Rear Width': 'Rear Width',
        'Armhole': 'Armhole',
        'Biceps': 'Biceps',
        'Shoulder': 'Shoulder',
        'Sleeve Length': 'Sleeve Length',
        'Trousers Length': 'Trousers Length',
        'Waistband': 'Waistband',
        'Stride Length': 'Stride Length',
        'Thigh': 'Thigh',
        'Knee': 'Knee',
        'Ankles': 'Ankles'
      };
      
      if (categoryMap[key]) {
        convertedMeasurements[categoryMap[key]] = value;
      }
    });

    // Update sizes with AI measurements
    setSizes(prev => ({
      ...prev,
      ...convertedMeasurements
    }));

    setShowCameraCapture(false);
    enqueueSnackbar('AI measurements extracted and applied successfully!', { variant: 'success' });
  };

  // Toggle AR mode
  const toggleARMode = () => {
    setIsARMode(!isARMode);
    if (!isARMode) {
      enqueueSnackbar('AR Avatar mode activated!', { variant: 'info' });
    }
  };

  // Handle camera capture request
  const handleCameraCaptureRequest = () => {
    setShowCameraCapture(true);
  };

  // Add error boundary for the Canvas
  if (modelError) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: "20px",
        }}
      >
        <ErrorOutlineIcon style={{ fontSize: "60px", color: "red" }} />
        <Typography variant="h5" color="error">
          Failed to load 3D model
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          startIcon={<ArrowBackIcon />}
        >
          Reload Page
        </Button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#F5F5F7", minHeight: "100vh" }}>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
      {/* Header */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: "white",
          borderBottom: "1px solid #ddd",
          padding: isMobile ? "10px" : "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIcon />}
            sx={{ color: "#333" }}
          >
            Back
          </Button>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Body Measurements
          </Typography>
        </Box>

        <Box display="flex" gap={1}>
          <Button
            onClick={toggleSideDrawer}
            startIcon={<ListAltIcon />}
            sx={{ color: "#333" }}
          >
            Measurements
          </Button>
        </Box>
      </Box>

      {/* Camera Capture Dialog */}
      {showCameraCapture && (
        <BodyCaptureCamera
          onMeasurementsExtracted={handleMeasurementsExtracted}
          onClose={() => setShowCameraCapture(false)}
        />
      )}

      {/* Floating AR Control Panel */}
      <Box
        sx={{
          position: "fixed",
          top: isMobile ? "auto" : "120px",
          bottom: isMobile ? "20px" : "auto",
          right: isMobile ? "20px" : "20px",
          left: isMobile ? "20px" : "auto",
          zIndex: 999,
          display: "flex",
          flexDirection: isMobile ? "row" : "column",
          gap: 2,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: 2,
          padding: 2,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* AR Mode Toggle */}
        <Tooltip title={isARMode ? "Exit AR mode and return to default avatar" : "Switch to AR mode with personalized avatar"} placement="left">
          <Button
            variant={isARMode ? "contained" : "outlined"}
            startIcon={<PersonIcon />}
            onClick={toggleARMode}
            size="medium"
            sx={{
              backgroundColor: isARMode ? "primary.main" : "transparent",
              color: isARMode ? "white" : "primary.main",
              minWidth: "120px",
              "&:hover": {
                backgroundColor: isARMode ? "primary.dark" : "rgba(25, 118, 210, 0.04)",
              },
            }}
          >
            {isARMode ? "Exit AR" : "AR Mode"}
          </Button>
        </Tooltip>

        {/* Camera Capture Button */}
        <Tooltip title="Capture photo and extract body measurements using AI" placement="left">
          <Button
            variant="contained"
            startIcon={<CameraAltIcon />}
            onClick={handleCameraCaptureRequest}
            size="medium"
            sx={{
              backgroundColor: "#2196F3",
              color: "white",
              minWidth: "120px",
              "&:hover": {
                backgroundColor: "#1976D2",
              },
            }}
          >
            AI Capture
          </Button>
        </Tooltip>

        {/* AR Status Indicator */}
        {isARMode && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              padding: "8px 12px",
              backgroundColor: "rgba(76, 175, 80, 0.1)",
              borderRadius: 1,
              border: "1px solid rgba(76, 175, 80, 0.3)",
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#4CAF50",
                animation: "pulse 2s infinite",
              }}
            />
            <Typography variant="caption" sx={{ color: "#4CAF50", fontWeight: "bold" }}>
              AR Active
            </Typography>
          </Box>
        )}
      </Box>

      {/* Main Content */}
      <div style={{ marginTop: "100px" }}>
        <div style={{ position: "relative" }}>
          <div style={{ marginTop: "70px", width: "100%", height: "150vh" }}>
            {isARMode ? (
              <ARAvatar
                measurements={aiMeasurements}
                onCaptureRequest={handleCameraCaptureRequest}
                isARMode={isARMode}
                showCaptureButton={!aiMeasurements}
              />
            ) : (
              <Canvas shadows onError={() => setModelError(true)}>
                <PerspectiveCamera makeDefault position={[10, 20, 20]} />
                <ambientLight intensity={0.5} />
                <OrbitControls />
                <Suspense
                  fallback={
                    <mesh>
                      <boxGeometry args={[1, 1, 1]} />
                      <meshStandardMaterial color="gray" />
                    </mesh>
                  }
                >
                  <Doll position={[10, 30, 10]} color="red" />
                </Suspense>
                <ButtonArray
                  onButtonClick={handleButtonClick}
                  onPointClick={handlePointClick}
                  activePoints={activePoints}
                  completedPoints={completedPoints}
                />
                <gridHelper args={[10, 10]} />
              </Canvas>
            )}
          </div>

          {/* Dialog for detailed info */}
          <Dialog open={dialogOpen} onClose={handleClose} keepMounted>
            <DialogTitle
              sx={{ backgroundColor: "#F5F5F7", fontWeight: "bold" }}
            >
              {selectedButton ? selectedButton.label : "Button Info"}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Measurement Value (cm)"
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<YouTubeIcon />}
                    onClick={() =>
                      handleOpenDialog("video", selectedButton?.videoUrl)
                    }
                  >
                    Watch Tutorial
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ErrorOutlineIcon />}
                    onClick={() =>
                      handleOpenDialog("info", selectedButton?.description)
                    }
                  >
                    How to Measure
                  </Button>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                onClick={() => {
                  const category = buttonCategoryMap[selectedButton?.id];
                  if (category) {
                    handleSizeChange(category, inputValue);
                  }
                  handleClose();
                }}
                variant="contained"
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Info Dialog */}
          <Dialog open={!!dialogType} onClose={handleClose2} maxWidth="md">
            <DialogTitle>
              {dialogType === "video" ? "Measurement Tutorial" : "How to Measure"}
            </DialogTitle>
            <DialogContent>
              {dialogType === "video" && dialogContent && (
                <Box sx={{ mt: 2 }}>
                  <iframe
                    width="100%"
                    height="315"
                    src={dialogContent}
                    title="Measurement Tutorial"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </Box>
              )}
              {dialogType === "info" && (
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {dialogContent || "No information available."}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose2}>Close</Button>
            </DialogActions>
          </Dialog>

          {/* New Profile Dialog */}
          <Dialog open={openNewProfileDialog} onClose={() => setOpenNewProfileDialog(false)}>
            <DialogTitle>Create New Profile</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Profile Name"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenNewProfileDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateNewProfile} variant="contained">
                Create
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        {/* Side Drawer for Measurements */}
        <Drawer
          anchor="right"
          open={sideDrawerOpen}
          onClose={toggleSideDrawer}
          PaperProps={{
            sx: {
              width: isMobile ? "100%" : 400,
              backgroundColor: "#F5F5F7",
            },
          }}
        >
          <Box sx={{ p: isMobile ? 2 : 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Measurements
              </Typography>
              <Button
                onClick={() => setOpenNewProfileDialog(true)}
                variant="outlined"
                size="small"
              >
                New Profile
              </Button>
            </Box>

            {/* Profile Selector */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                Select Profile:
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {sizeProfiles.map((profile) => (
                  <Chip
                    key={profile.name}
                    label={profile.name}
                    onClick={() => setSelectedProfile(profile)}
                    color={selectedProfile?.name === profile.name ? "primary" : "default"}
                    variant={selectedProfile?.name === profile.name ? "filled" : "outlined"}
                  />
                ))}
              </Box>
            </Box>

            {/* Measurements Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                  gap: 2,
                  mb: 3,
                }}
              >
                {bodyPoints.map((point) => (
                  <TextField
                    key={point.id}
                    label={point.label}
                    type="number"
                    value={sizes[point.category] || ""}
                    onChange={(e) => handleSizeChange(point.category, e.target.value)}
                    fullWidth
                    size="small"
                    InputProps={{
                      endAdornment: <Typography variant="caption">cm</Typography>,
                    }}
                  />
                ))}
              </Box>

              <Box
                sx={{
                  mt: isMobile ? 1 : 3,
                  display: "flex",
                  justifyContent: "center",
                  gap: isMobile ? 1 : 2,
                  borderTop: "1px solid #ddd",
                  paddingTop: isMobile ? 1 : 2,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSubmit}
                  sx={{
                    py: isMobile ? 1 : 1.5,
                    fontWeight: "bold",
                    fontSize: isMobile ? "0.9rem" : "1.1rem",
                  }}
                >
                  שמור את כל המידות
                </Button>
              </Box>
            </Box>
          </Box>
        </Drawer>
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
    ? "#66FF66" // Green if completed
    : isActive
    ? "#3399FF" // Blue if active
    : hovered
    ? "#FF6666" // Light red if hovered
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

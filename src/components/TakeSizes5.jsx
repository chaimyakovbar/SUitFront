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
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { bodyPointsSuit, buttonsSuit } from "../consts/KindOfColors";
// import { authUserAtom } from "../Utils"; // Not needed for new DB
// import { useAtom } from "jotai"; // Not needed for new DB
import YouTubeIcon from "@mui/icons-material/YouTube";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// Create a mapping from button ID to bodyPoint category
const createButtonCategoryMap = () => {
  const map = {};
  buttonsSuit.forEach((button) => {
    const bodyPoint = bodyPointsSuit.find((point) => point.id === button.id);
    map[button.id] = bodyPoint ? bodyPoint.category : button.name;
  });
  return map;
};

// Precompute the mapping
const buttonCategoryMap = createButtonCategoryMap();

// The Doll component with the model
const Doll = (props) => {
  const modelRef = useRef();
  const { scene } = useGLTF("/models/suit_jacket.glb", true);

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
      scale={[5, 5, 5]}
      {...props}
    />
  );
};

// The second Doll component with a different model
const Doll2 = (props) => {
  const modelRef = useRef();
  const { scene } = useGLTF("/models/allSuit.glb", true); // שנה את הנתיב למודל השני שלך

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
      scale={[5, 5, 5]}
      {...props}
    />
  );
};

const TakeSizes5 = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  // const [user] = useAtom(authUserAtom); // Not needed for new DB
  const data = null;
  const isLoading = false;
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

      // TODO: Add new database connection here
      console.log("Creating new profile:", updatedSizes);

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

      // TODO: Add new database connection here
      console.log("Saving measurements:", updatedSizes);

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

    return buttonsSuit
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

  // Add error boundary for the Canvas
  if (modelError) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          color: "#fff",
          backgroundColor: "#000",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2>Error loading 3D model</h2>
        <p>Please try refreshing the page</p>
        <Button
          onClick={() => window.location.reload()}
          variant="contained"
          style={{ marginTop: "20px" }}
        >
          Refresh Page
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          position: "absolute",
          left: "20px",
          top: "120px",
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: isMobile ? "grid" : "flex",
            gap: isMobile ? "2px" : "10px",
            width: isMobile ? "130px" : "100%",
          }}
        >
          <Button
            onClick={() => navigate("/indexSizes")}
            style={{
              color: "#fff",
              backgroundColor: "#333",
              "&:hover": {
                backgroundColor: "#444",
              },
            }}
          >
            <ArrowBackIcon style={{ marginRight: "8px" }} />
            Back
          </Button>

          <Button
            onClick={toggleSideDrawer}
            style={{
              color: "#fff",
              backgroundColor: "#333",
              "&:hover": {
                backgroundColor: "#444",
              },
            }}
          >
            <ListAltIcon style={{ marginRight: "8px" }} />
            All Sizes
          </Button>
          <Button
            onClick={() => navigate("/Shopping")}
            style={{
              color: "#fff",
              backgroundColor: "#333",
              "&:hover": {
                backgroundColor: "#444",
              },
            }}
          >
            <ShoppingCartIcon style={{ marginRight: "8px" }} />
            Shopping
          </Button>
        </div>
        <div>
          <Typography variant="body2">
            {completedPoints.length}/{bodyPointsSuit.length} measurements
            completed
          </Typography>
        </div>
      </div>

      {/* Profile Selection */}
      <div
        style={{
          position: "absolute",
          right: "20px",
          top: "120px",
          zIndex: 100,
        }}
      >
        <Box
          sx={{
            display: isMobile ? "grid" : "flex",
            gap: isMobile ? "2px" : "10px",
            alignItems: "center",
            width: isMobile ? "70px" : "100%",
          }}
        >
          <Button
            variant="contained"
            onClick={() => setOpenNewProfileDialog(true)}
            style={{
              backgroundColor: "#333",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#444",
              },
            }}
          >
            New Profile
          </Button>
          <select
            value={selectedProfile?.name || ""}
            onChange={(e) => {
              const profile = sizeProfiles.find(
                (p) => p.name === e.target.value
              );
              setSelectedProfile(profile);
            }}
            style={{
              backgroundColor: "#333",
              color: "#fff",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            {sizeProfiles.map((profile) => (
              <option key={profile.name} value={profile.name}>
                {profile.name}
              </option>
            ))}
          </select>
          <Typography variant="body2" sx={{ color: "black" }}>
            Select Profile:
          </Typography>
        </Box>
      </div>

      {/* New Profile Dialog */}
      <Dialog
        open={openNewProfileDialog}
        onClose={() => setOpenNewProfileDialog(false)}
        PaperProps={{
          style: {
            backgroundColor: "#1e1e1e",
            color: "#fff",
          },
        }}
      >
        <DialogTitle>Create New Size Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Profile Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.7)",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenNewProfileDialog(false)}
            sx={{ color: "#fff" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateNewProfile}
            variant="contained"
            sx={{ backgroundColor: "#333" }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <div style={{ marginTop: "100px" }}>
        <div style={{ position: "relative" }}>
          <div style={{ marginTop: "70px", width: "100%", height: "150vh" }}>
            <Canvas shadows onError={() => setModelError(true)}>
              <PerspectiveCamera makeDefault position={[10, 20, 30]} />
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
                <Doll position={[0, 5, 0]} color="red" />
                <Doll2 position={[10, 5, 0]} color="blue" />
              </Suspense>
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
            <DialogTitle
              sx={{ backgroundColor: "#F5F5F7", fontWeight: "bold" }}
            >
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
                      label="Enter measurement (cm)"
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

                  <Box
                    sx={{ mb: 2, display: "flex", justifyContent: "center" }}
                  >
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

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      boxShadow: 3,
                      borderRadius: "12px",
                      width: "70%",
                      margin: "0 auto",
                    }}
                  >
                    <Tooltip title="Click to watch" placement="top">
                      <Button
                        onClick={() =>
                          handleOpenDialog("YouTube", selectedButton.video)
                        }
                      >
                        <YouTubeIcon sx={{ color: "red" }} />
                      </Button>
                    </Tooltip>
                    <Tooltip
                      title="Click for detailed explanation"
                      placement="top"
                    >
                      <Button
                        onClick={() =>
                          handleOpenDialog("Error", selectedButton.explain)
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
              <Button onClick={handleSubmit} color="primary" variant="outlined">
                Save
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

        <Drawer
          style={{ zIndex: 20001, width: isMobile ? "80%" : "400px" }}
          anchor="right"
          open={sideDrawerOpen}
          onClose={toggleSideDrawer}
        >
          <Box
            sx={{
              width: isMobile ? "270px" : "400px",
              p: isMobile ? 1 : 3,
              backgroundColor: "#f5f5f5",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: isMobile ? 1 : 3,
                textAlign: "center",
                fontWeight: "bold",
                fontSize: isMobile ? "1.2rem" : "1.5rem",
              }}
            >
              כל המידות
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: isMobile ? 1 : 2,
                maxHeight: "80vh",
                overflowY: "auto",
                padding: isMobile ? "5px" : "10px",
              }}
            >
              {bodyPointsSuit.map((point) => {
                const effectiveValue = sizes?.[point.category] || "";
                const isCompleted =
                  effectiveValue &&
                  effectiveValue.toString().trim() !== "" &&
                  Number(effectiveValue) > 0;

                return (
                  <Box
                    key={point.id}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      p: isMobile ? 1 : 2,
                      borderRadius: 2,
                      bgcolor: isCompleted
                        ? "rgba(76, 175, 80, 0.1)"
                        : "rgba(255, 235, 235, 0.5)",
                      border: "1px solid",
                      borderColor: isCompleted
                        ? "success.light"
                        : "error.light",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 2,
                      },
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: isMobile ? 0.5 : 1,
                        fontWeight: "bold",
                        fontSize: isMobile ? "0.9rem" : "1rem",
                      }}
                    >
                      {point.label}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <TextField
                        type="number"
                        size="small"
                        value={effectiveValue}
                        onChange={(e) =>
                          handleSizeChange(point.category, e.target.value)
                        }
                        sx={{
                          width: isMobile ? "80px" : "100px",
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "white",
                            height: isMobile ? "32px" : "40px",
                          },
                        }}
                        InputProps={{
                          endAdornment: (
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: isMobile ? "0.75rem" : "0.875rem",
                              }}
                            >
                              cm
                            </Typography>
                          ),
                        }}
                      />
                      {isCompleted && (
                        <Box sx={{ color: "success.main" }}>✓</Box>
                      )}
                    </Box>
                  </Box>
                );
              })}
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
      {buttonsSuit.map((button) => (
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

export default TakeSizes5;

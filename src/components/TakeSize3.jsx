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
import { bodyPoints, buttons } from "../consts/KindOfColors";
import { authUserAtom } from "../Utils";
import { useAtom } from "jotai";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import useProduct from "../Hooks/useProduct";
import { postProduct } from "../api/suit";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

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

    // Make all materials with custom color
    clone.traverse((child) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            mat.color.setHex(0x525650); // Custom color #E2EBDD
            mat.emissive.setHex(0x000000);
            mat.roughness = 0.9; // Make it less shiny
            mat.metalness = 0.05; // Reduce metallic appearance
          });
        } else {
          child.material.color.setHex(0x525650); // Custom color #E2EBDD
          child.material.emissive.setHex(0x000000);
          child.material.roughness = 0.9; // Make it less shiny
          child.material.metalness = 0.05; // Reduce metallic appearance
        }
      }
    });

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

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div
      style={{
        maxHeight: "100vh",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 30%, #0f0f0f 70%, #0a0a0a 100%)",
        color: "#C0D3CA",
      }}
    >
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
            {/* {completedPoints.length}/{bodyPoints.length} measurements completed */}
            {completedPoints.length}/{"15"} measurements completed
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
          <Typography variant="body5" sx={{ color: "white" }}>
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
            <Canvas
              shadows
              onError={() => setModelError(true)}
              style={{ background: "#000000" }}
            >
              <PerspectiveCamera makeDefault position={[10, 20, 20]} />

              {/* Super Bright Lighting Setup */}
              <ambientLight intensity={3.0} />
              <directionalLight
                position={[10, 10, 5]}
                intensity={4.0}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              <directionalLight
                position={[-10, 10, -5]}
                intensity={3.0}
                color="#ffffff"
              />
              <pointLight
                position={[0, 15, 0]}
                intensity={2.5}
                color="#ffffff"
              />
              <pointLight
                position={[0, 0, 10]}
                intensity={2.0}
                color="#ffffff"
              />
              <pointLight
                position={[0, 0, -10]}
                intensity={2.0}
                color="#ffffff"
              />

              {/* Debug: Add a bright sphere to test lighting */}
              <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial color="red" />
              </mesh>

              <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableRotate={true}
                minDistance={1}
                maxDistance={100}
                minPolarAngle={0}
                maxPolarAngle={Math.PI}
              />
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
                padding: isMobile ? "15px" : "30px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minWidth: isMobile ? "250px" : "300px",
              }}
            >
              {selectedButton ? (
                <Box
                  sx={{
                    padding: isMobile ? "10px" : "20px",
                    width: "100%",
                    maxWidth: isMobile ? "250px" : "300px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: isMobile ? 2 : 3,
                    }}
                  >
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
                      size={isMobile ? "small" : "medium"}
                    />
                  </Box>

                  <Box
                    sx={{
                      mb: isMobile ? 1 : 2,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={selectedButton.img}
                      alt={selectedButton.title}
                      style={{
                        width: "100%",
                        height: isMobile ? "100px" : "150px",
                        objectFit: "contain",
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      gap: "10px",
                      display: "flex",
                      justifyContent: "center",
                      boxShadow: 3,
                      borderRadius: "12px",
                      width: "90%",
                      height: isMobile ? "80px" : "100px",
                      margin: "0 auto",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <Typography
                        variant={isMobile ? "body2" : "subtitle1"}
                        sx={{
                          marginBottom: isMobile ? "4px" : "8px",
                          color: "black",
                          fontSize: isMobile ? "0.8rem" : "inherit",
                        }}
                      >
                        Video
                        <br />
                        Explanation
                      </Typography>
                      <Tooltip title="Click to watch video" placement="top">
                        <Button
                          variant="outlined"
                          onClick={() =>
                            handleOpenDialog("YouTube", selectedButton.video)
                          }
                          size={isMobile ? "small" : "medium"}
                          sx={{
                            borderColor: "#ff0000",
                            minWidth: isMobile ? "40px" : "auto",
                            height: isMobile ? "32px" : "auto",
                            "&:hover": {
                              borderColor: "#cc0000",
                              backgroundColor: "rgba(255, 0, 0, 0.04)",
                            },
                          }}
                        >
                          <YouTubeIcon
                            sx={{
                              color: "red",
                              fontSize: isMobile ? "1.2rem" : "inherit",
                            }}
                          />
                        </Button>
                      </Tooltip>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <Typography
                        variant={isMobile ? "body2" : "subtitle1"}
                        sx={{
                          marginBottom: isMobile ? "4px" : "8px",
                          color: "black",
                          fontSize: isMobile ? "0.8rem" : "inherit",
                        }}
                      >
                        Text
                        <br />
                        Explanation
                      </Typography>
                      <Tooltip
                        title="Click to read instructions"
                        placement="top"
                      >
                        <Button
                          variant="outlined"
                          onClick={() =>
                            handleOpenDialog("Text", selectedButton.explain)
                          }
                          size={isMobile ? "small" : "medium"}
                          sx={{
                            // borderColor: "#1a73e8",
                            minWidth: isMobile ? "40px" : "auto",
                            height: isMobile ? "32px" : "auto",
                            "&:hover": {
                              borderColor: "#1557b0",
                              backgroundColor: "rgba(26, 115, 232, 0.04)",
                            },
                          }}
                        >
                          <ErrorOutlineIcon
                            sx={{
                              color: "#1a73e8",
                              fontSize: isMobile ? "1.2rem" : "inherit",
                            }}
                          />
                        </Button>
                      </Tooltip>
                    </div>
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
          <Dialog
            open={!!dialogType}
            onClose={handleClose2}
            maxWidth={isMobile ? "xs" : "md"}
            fullWidth
            PaperProps={{
              sx: {
                minHeight: isMobile ? "40vh" : "50vh",
                maxHeight: "90vh",
                backgroundColor: "#f5f5f7",
                margin: isMobile ? "16px" : "auto",
              },
            }}
          >
            <DialogTitle
              sx={{
                textAlign: "center",
                fontSize: isMobile ? "1.2rem" : "1.5rem",
                fontWeight: "bold",
                borderBottom: "1px solid #e0e0e0",
                backgroundColor: "#fff",
                padding: isMobile ? "16px" : "24px",
              }}
            >
              {dialogType === "YouTube"
                ? "Video Tutorial"
                : selectedButton?.label
                ? `Measurement Instructions - ${selectedButton.label}`
                : "Measurement Instructions"}
            </DialogTitle>
            <DialogContent>
              {dialogType === "YouTube" ? (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    py: 2,
                  }}
                >
                  <Typography
                    variant={isMobile ? "subtitle1" : "h6"}
                    sx={{
                      fontWeight: "bold",
                      color: "#333",
                      fontSize: isMobile ? "1rem" : "inherit",
                      textAlign: "center",
                    }}
                  >
                    Watch the tutorial video
                  </Typography>
                  <video
                    controls
                    autoPlay
                    style={{
                      width: "100%",
                      maxHeight: isMobile ? "50vh" : "70vh",
                      objectFit: "contain",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                    src={dialogContent}
                  >
                    Your browser does not support the video tag.
                  </video>
                </Box>
              ) : (
                <Box
                  sx={{
                    padding: isMobile ? 2 : 3,
                    "& p": {
                      marginBottom: isMobile ? 1 : 2,
                      fontSize: isMobile ? "0.9rem" : "1.1rem",
                      lineHeight: 1.6,
                    },
                    "& ul": {
                      marginBottom: isMobile ? 1 : 2,
                      paddingLeft: isMobile ? 2 : 3,
                    },
                    "& li": {
                      marginBottom: isMobile ? 0.5 : 1,
                      fontSize: isMobile ? "0.9rem" : "1.1rem",
                      lineHeight: 1.6,
                    },
                  }}
                >
                  {dialogContent?.split("\n")?.map((line, index) => {
                    // If the line starts with "step" or a number, add a heading
                    if (
                      line.trim().startsWith("step") ||
                      /^\d+\./.test(line.trim())
                    ) {
                      return (
                        <Typography
                          key={`step-${index}-${line.trim().substring(0, 10)}`}
                          variant={isMobile ? "subtitle1" : "h6"}
                          sx={{
                            fontWeight: "bold",
                            color: "#1a73e8",
                            marginTop: isMobile ? 1 : 2,
                            marginBottom: isMobile ? 0.5 : 1,
                            fontSize: isMobile ? "1rem" : "inherit",
                          }}
                        >
                          {line.trim()}
                        </Typography>
                      );
                    }
                    // Otherwise, display as regular text
                    if (line.trim()) {
                      return (
                        <Typography
                          key={`text-${index}-${line.trim().substring(0, 10)}`}
                          sx={{
                            marginBottom: isMobile ? 0.5 : 1,
                            color: "#333",
                            fontSize: isMobile ? "0.9rem" : "inherit",
                          }}
                        >
                          {line.trim()}
                        </Typography>
                      );
                    }
                    return null;
                  })}
                </Box>
              )}
            </DialogContent>
            <DialogActions
              sx={{
                borderTop: "1px solid #e0e0e0",
                padding: isMobile ? 1 : 2,
                backgroundColor: "#fff",
              }}
            >
              <Button
                onClick={handleClose2}
                variant="contained"
                size={isMobile ? "small" : "medium"}
                sx={{
                  backgroundColor: "#1a73e8",
                  color: "#fff",
                  fontSize: isMobile ? "0.9rem" : "inherit",
                  "&:hover": {
                    backgroundColor: "#1557b0",
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        <Drawer
          style={{ zIndex: 20001 }}
          anchor="right"
          open={sideDrawerOpen}
          onClose={toggleSideDrawer}
          PaperProps={{ sx: { width: "75vw" } }}
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
              All Measurements
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
              {bodyPoints.map((point) => {
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
            ></Box>
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
      {buttons.map((button) => {
        const buttonKey = `button-${button.id}`;
        return (
          <Tooltip key={buttonKey} title={button.label}>
            <RedButton
              button={button}
              camera={camera}
              onClick={() => onButtonClick(button)}
              onPointClick={() => onPointClick(button.id)}
              isActive={activePoints.includes(button.id)}
              isCompleted={completedPoints.includes(button.id)}
            />
          </Tooltip>
        );
      })}
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
    ? "#0d930d" // Dark green if completed
    : isActive
    ? "#3399FF" // Blue if active
    : hovered
    ? "#FF6666" // Light red if hovered
    : "#FF4C4C"; // Default red

  // Increase size by 50% for better touch interaction
  const buttonSize = size * 1.5;

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
      onPointerDown={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
    >
      <circleGeometry args={[buttonSize, 32]} />
      <meshStandardMaterial color={buttonColor} />
    </mesh>
  );
};

export default DollDisplay;

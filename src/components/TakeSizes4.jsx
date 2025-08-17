import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { authUserAtom } from "../Utils";
import { postProduct, getAllProducts } from "../api/suit";
import { useSnackbar } from "notistack";

const TakeSizes4 = () => {
  const [selectedJacketSize, setSelectedJacketSize] = useState("");
  const [selectedPantsSize, setSelectedPantsSize] = useState("");
  const [user] = useAtom(authUserAtom);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const sizes = Array.from({ length: 31 }, (_, i) => i + 30); // 30–60

  useEffect(() => {
    const loadExistingSizes = async () => {
      if (!user?.email) return;

      try {
        const response = await getAllProducts(user.email);
        console.log("Response data:", response.data);
        const userData = response.data;

        // Check for sizes in the profile_chaim object
        if (userData?.sizesTable) {
          console.log("Found sizesTable:", userData.sizesTable);
          const { jacket, pants } = userData.sizesTable;
          console.log("Jacket size:", jacket, "Pants size:", pants);

          // Convert to numbers and set the states
          const jacketSize = parseInt(jacket);
          const pantsSize = parseInt(pants);

          console.log(
            "Setting sizes - Jacket:",
            jacketSize,
            "Pants:",
            pantsSize
          );

          setSelectedJacketSize(jacketSize);
          setSelectedPantsSize(pantsSize);

          enqueueSnackbar("Loaded your saved sizes", { variant: "info" });
        } else {
          console.log("No sizesTable found in data");
        }
      } catch (error) {
        console.error("Error loading sizes:", error);
      }
    };

    loadExistingSizes();
  }, [user?.email, enqueueSnackbar]);

  const handleSaveSizes = async () => {
    if (!selectedJacketSize || !selectedPantsSize) {
      enqueueSnackbar("Please select both jacket and pants sizes", {
        variant: "warning",
      });
      return;
    }

    if (!user?.email) {
      enqueueSnackbar("Please log in to save sizes", { variant: "error" });
      return;
    }

    try {
      const sizesTable = {
        jacket: selectedJacketSize.toString(),
        pants: selectedPantsSize.toString(),
      };

      await postProduct({
        email: user.email,
        sizesTable, // Send directly without nesting in sizes
      });
      enqueueSnackbar("Sizes saved successfully!", { variant: "success" });
      navigate("/Shopping");
    } catch (error) {
      console.error("Error saving sizes:", error);
      enqueueSnackbar("Failed to save sizes. Please try again.", {
        variant: "error",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 30%, #0f0f0f 70%, #0a0a0a 100%)",
        pt: { xs: 12, md: 16 },
        pb: 8
      }}
    >
      <Container maxWidth="md">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <Box
            component={motion.div}
            variants={cardVariants}
            sx={{
              textAlign: "center",
              mb: { xs: 4, md: 6 }
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 700,
                color: "#C0D3CA",
                fontFamily: "'Cormorant Garamond', serif",
                mb: 2,
                textShadow: "0 4px 20px rgba(192, 211, 202, 0.3)"
              }}
            >
              Regular Sizes
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1rem", md: "1.25rem" },
                color: "rgba(192, 211, 202, 0.8)",
                fontWeight: 300,
                maxWidth: "600px",
                mx: "auto",
                lineHeight: 1.6
              }}
            >
              Select your standard jacket and pants sizes for a perfect fit.
            </Typography>
          </Box>

          {/* Navigation Buttons */}
          <Box
            component={motion.div}
            variants={cardVariants}
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              mb: 4,
              flexWrap: "wrap"
            }}
          >
            <Button
              onClick={() => navigate("/indexSizes")}
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              sx={{
                color: "#C0D3CA",
                borderColor: "rgba(192, 211, 202, 0.3)",
                borderRadius: "12px",
                px: 3,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 500,
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
                background: "rgba(192, 211, 202, 0.05)",
                "&:hover": {
                  borderColor: "#C0D3CA",
                  background: "rgba(192, 211, 202, 0.1)",
                  transform: "translateY(-2px)"
                }
              }}
            >
              Back to Options
            </Button>
            <Button
              onClick={() => navigate("/Shopping")}
              variant="outlined"
              startIcon={<ShoppingCartIcon />}
              sx={{
                color: "#C0D3CA",
                borderColor: "rgba(192, 211, 202, 0.3)",
                borderRadius: "12px",
                px: 3,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 500,
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
                background: "rgba(192, 211, 202, 0.05)",
                "&:hover": {
                  borderColor: "#C0D3CA",
                  background: "rgba(192, 211, 202, 0.1)",
                  transform: "translateY(-2px)"
                }
              }}
            >
              Shopping Cart
            </Button>
          </Box>

          {/* Size Selection Cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)"
              },
              gap: { xs: 3, md: 4 },
              maxWidth: "900px",
              mx: "auto"
            }}
          >
            {/* Jacket Size Card */}
            <motion.div variants={cardVariants}>
              <Box
                sx={{
                  background: "linear-gradient(135deg, rgba(20, 20, 20, 0.9) 0%, rgba(30, 30, 30, 0.95) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(192, 211, 202, 0.15)",
                  borderRadius: "24px",
                  p: { xs: 3, md: 4 },
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "24px 24px 0 0"
                  }
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: "1.75rem", md: "2rem" },
                    fontWeight: 600,
                    color: "#C0D3CA",
                    mb: 3,
                    textAlign: "center",
                    fontFamily: "'Cormorant Garamond', serif"
                  }}
                >
                  Jacket Size
                </Typography>

                <FormControl
                  fullWidth
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      color: "#C0D3CA",
                      borderRadius: "12px",
                      background: "rgba(192, 211, 202, 0.05)",
                      "& fieldset": {
                        borderColor: "rgba(192, 211, 202, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(192, 211, 202, 0.4)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#C0D3CA",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(192, 211, 202, 0.7)",
                      "&.Mui-focused": {
                        color: "#C0D3CA",
                      },
                    },
                    "& .MuiSelect-icon": {
                      color: "#C0D3CA",
                    },
                  }}
                >
                  <InputLabel>Select Jacket Size</InputLabel>
                  <Select
                    value={selectedJacketSize}
                    label="Select Jacket Size"
                    onChange={(e) => setSelectedJacketSize(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          background: "rgba(20, 20, 20, 0.95)",
                          backdropFilter: "blur(20px)",
                          border: "1px solid rgba(192, 211, 202, 0.2)",
                          borderRadius: "12px",
                          maxHeight: "300px",
                          "& .MuiMenuItem-root": {
                            color: "#C0D3CA",
                            "&:hover": {
                              background: "rgba(192, 211, 202, 0.1)",
                            },
                            "&.Mui-selected": {
                              background: "rgba(192, 211, 202, 0.2)",
                              color: "#fff",
                              "&:hover": {
                                background: "rgba(192, 211, 202, 0.3)",
                              },
                            },
                          },
                        },
                      },
                    }}
                  >
                    {sizes.map((size) => (
                      <MenuItem key={`jacket-${size}`} value={size}>
                        Size {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {selectedJacketSize && (
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 2,
                      background: "rgba(192, 211, 202, 0.1)",
                      borderRadius: "12px",
                      border: "1px solid rgba(192, 211, 202, 0.2)"
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#C0D3CA",
                        fontSize: "1.1rem",
                        fontWeight: 600
                      }}
                    >
                      Selected: Size {selectedJacketSize}
                    </Typography>
                  </Box>
                )}
              </Box>
            </motion.div>

            {/* Pants Size Card */}
            <motion.div variants={cardVariants}>
              <Box
                sx={{
                  background: "linear-gradient(135deg, rgba(20, 20, 20, 0.9) 0%, rgba(30, 30, 30, 0.95) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(192, 211, 202, 0.15)",
                  borderRadius: "24px",
                  p: { xs: 3, md: 4 },
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    borderRadius: "24px 24px 0 0"
                  }
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: "1.75rem", md: "2rem" },
                    fontWeight: 600,
                    color: "#C0D3CA",
                    mb: 3,
                    textAlign: "center",
                    fontFamily: "'Cormorant Garamond', serif"
                  }}
                >
                  Pants Size
                </Typography>

                <FormControl
                  fullWidth
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      color: "#C0D3CA",
                      borderRadius: "12px",
                      background: "rgba(192, 211, 202, 0.05)",
                      "& fieldset": {
                        borderColor: "rgba(192, 211, 202, 0.2)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(192, 211, 202, 0.4)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#C0D3CA",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(192, 211, 202, 0.7)",
                      "&.Mui-focused": {
                        color: "#C0D3CA",
                      },
                    },
                    "& .MuiSelect-icon": {
                      color: "#C0D3CA",
                    },
                  }}
                >
                  <InputLabel>Select Pants Size</InputLabel>
                  <Select
                    value={selectedPantsSize}
                    label="Select Pants Size"
                    onChange={(e) => setSelectedPantsSize(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          background: "rgba(20, 20, 20, 0.95)",
                          backdropFilter: "blur(20px)",
                          border: "1px solid rgba(192, 211, 202, 0.2)",
                          borderRadius: "12px",
                          maxHeight: "300px",
                          "& .MuiMenuItem-root": {
                            color: "#C0D3CA",
                            "&:hover": {
                              background: "rgba(192, 211, 202, 0.1)",
                            },
                            "&.Mui-selected": {
                              background: "rgba(192, 211, 202, 0.2)",
                              color: "#fff",
                              "&:hover": {
                                background: "rgba(192, 211, 202, 0.3)",
                              },
                            },
                          },
                        },
                      },
                    }}
                  >
                    {sizes.map((size) => (
                      <MenuItem key={`pants-${size}`} value={size}>
                        Size {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {selectedPantsSize && (
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 2,
                      background: "rgba(192, 211, 202, 0.1)",
                      borderRadius: "12px",
                      border: "1px solid rgba(192, 211, 202, 0.2)"
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#C0D3CA",
                        fontSize: "1.1rem",
                        fontWeight: 600
                      }}
                    >
                      Selected: Size {selectedPantsSize}
                    </Typography>
                  </Box>
                )}
              </Box>
            </motion.div>
          </Box>

          {/* Save Button */}
          <Box
            component={motion.div}
            variants={cardVariants}
            sx={{
              textAlign: "center",
              mt: 6
            }}
          >
            <Button
              onClick={handleSaveSizes}
              disabled={!selectedJacketSize || !selectedPantsSize}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #C0D3CA 0%, #A8C5B8 100%)",
                color: "#000",
                borderRadius: "16px",
                px: 6,
                py: 2,
                fontSize: "1.1rem",
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 8px 32px rgba(192, 211, 202, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #D0E3DA 0%, #B8D5C8 100%)",
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 40px rgba(192, 211, 202, 0.4)"
                },
                "&:disabled": {
                  background: "rgba(192, 211, 202, 0.2)",
                  color: "rgba(255, 255, 255, 0.5)",
                  transform: "none",
                  boxShadow: "none"
                }
              }}
            >
              Save Sizes & Continue
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default TakeSizes4;

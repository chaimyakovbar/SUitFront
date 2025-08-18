import React from "react";
import { useMediaQuery, Box, Typography, Container, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import imgFor from "../assets/takeSizesM.png";
import imgFor2 from "../assets/takeSizesR.png";
import imgFor3 from "../assets/suitMeasur.jpeg";

const IndexSizes = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const measurementOptions = [
    {
      id: "regular",
      title: "Regular Sizes",
      subtitle: "Choose from standard sizes",
      description: "Perfect if you know your standard suit size",
      image: imgFor2,
      path: "/sizes/regular",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      id: "measure",
      title: "Measure Your Body",
      subtitle: "Custom measurements",
      description: "Get precise measurements for a perfect fit",
      image: imgFor,
      path: "/sizes/measure",
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      id: "suitMeasure",
      title: "Suit Measurement",
      subtitle: "Professional fitting",
      description: "Advanced measurement system for optimal fit",
      image: imgFor3,
      path: "/sizes/suitMeasur",
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    }
  ];

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
      <Container maxWidth="lg">
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
              Choose Your Measurement Method
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
              Select the measurement approach that works best for you. 
              Each method ensures a perfect fit for your custom suit.
            </Typography>
          </Box>

          {/* Options Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)"
              },
              gap: { xs: 3, md: 4 },
              maxWidth: "1200px",
              mx: "auto"
            }}
          >
            {measurementOptions.map((option, index) => (
              <motion.div
                key={option.id}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Box
                  onClick={() => navigate(option.path)}
                  sx={{
                    cursor: "pointer",
                    background: "linear-gradient(135deg, rgba(20, 20, 20, 0.9) 0%, rgba(30, 30, 30, 0.95) 100%)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(192, 211, 202, 0.15)",
                    borderRadius: "24px",
                    p: { xs: 3, md: 4 },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
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
                      background: option.color,
                      borderRadius: "24px 24px 0 0"
                    },
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
                      border: "1px solid rgba(192, 211, 202, 0.3)"
                    }
                  }}
                >
                  {/* Image */}
                  <Box
                    sx={{
                      width: "100%",
                      height: { xs: "200px", md: "250px" },
                      borderRadius: "16px",
                      overflow: "hidden",
                      mb: 3,
                      position: "relative",
                      background: "rgba(0, 0, 0, 0.2)"
                    }}
                  >
                    <img
                      src={option.image}
                      alt={option.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                      }}
                    />
                  </Box>

                  {/* Content */}
                  <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: { xs: "1.5rem", md: "1.75rem" },
                        fontWeight: 600,
                        color: "#C0D3CA",
                        mb: 1,
                        fontFamily: "'Cormorant Garamond', serif"
                      }}
                    >
                      {option.title}
                    </Typography>
                    
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontSize: { xs: "1rem", md: "1.1rem" },
                        fontWeight: 500,
                        color: "rgba(192, 211, 202, 0.9)",
                        mb: 2
                      }}
                    >
                      {option.subtitle}
                    </Typography>
                    
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: "0.9rem", md: "1rem" },
                        color: "rgba(192, 211, 202, 0.7)",
                        lineHeight: 1.6,
                        mb: 3,
                        flex: 1
                      }}
                    >
                      {option.description}
                    </Typography>

                    {/* Action Button */}
                    <Box
                      sx={{
                        mt: "auto",
                        pt: 2,
                        borderTop: "1px solid rgba(192, 211, 202, 0.1)"
                      }}
                    >
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 1,
                          color: "#C0D3CA",
                          fontSize: { xs: "0.9rem", md: "1rem" },
                          fontWeight: 500,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            color: "#fff",
                            gap: 2
                          }
                        }}
                      >
                        Get Started
                        <Box
                          component="span"
                          sx={{
                            fontSize: "1.2em",
                            transition: "transform 0.2s ease"
                          }}
                        >
                          →
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default IndexSizes;

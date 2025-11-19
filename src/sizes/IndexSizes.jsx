import React from "react";
import {
  useMediaQuery,
  Box,
  Typography,
  Container,
  useTheme,
} from "@mui/material";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

import imgFor2 from "../assets/icons/background/takeSizesM.webp";
import imgFor from "../assets/icons/background/takeSizesR.webp";

const IndexSizes = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const { t } = useLanguage();

  const measurementOptions = [
    {
      id: "measure",
      titleKey: "measureYourBody",
      subtitleKey: "customMeasurements",
      descriptionKey: "measureDescription",
      image: imgFor,
      path: "/sizes/measure",
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      id: "regular",
      titleKey: "regularSizes",
      subtitleKey: "chooseStandardSizes",
      descriptionKey: "regularDescription",
      image: imgFor2,
      path: "/sizes/regular",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    // {
    //   id: "suitMeasure",
    //   title: "Suit Measurement",
    //   subtitle: "Professional fitting",
    //   description: "Advanced measurement system for optimal fit",
    //   image: imgFor3,
    //   path: "/sizes/suitMeasur",
    //   color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    // }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.6,
        staggerChildren: prefersReducedMotion ? 0 : 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 24,
      scale: prefersReducedMotion ? 1 : 0.97,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 30%, #0f0f0f 70%, #0a0a0a 100%)",
        pt: { xs: 12, md: 16 },
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial={prefersReducedMotion ? false : "hidden"}
          animate="visible"
        >
          {/* Header */}
          <Box
            component={motion.div}
            variants={cardVariants}
            sx={{
              textAlign: "center",
              mb: { xs: 4, md: 6 },
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
                textShadow: "0 4px 20px rgba(192, 211, 202, 0.3)",
              }}
            >
              {t("chooseMeasurementMethod")}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1rem", md: "1.25rem" },
                color: "rgba(192, 211, 202, 0.8)",
                fontWeight: 300,
                maxWidth: "600px",
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              {t("measurementMethodSubtitle")}
            </Typography>
          </Box>

          {/* Options Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(2, minmax(0, 1fr))",
              },
              gap: { xs: 3, md: 4 },
              maxWidth: "1100px",
              mx: "auto",
              justifyContent: "center",
            }}
          >
            {measurementOptions.map((option) => (
              <motion.div
                key={option.id}
                variants={cardVariants}
                whileHover={
                  isMobile || prefersReducedMotion
                    ? undefined
                    : { scale: 1.02, transition: { duration: 0.2 } }
                }
                whileTap={isMobile ? undefined : { scale: 0.985 }}
              >
                <Box
                  onClick={() => navigate(option.path)}
                  sx={{
                    cursor: "pointer",
                    background:
                      "linear-gradient(135deg, rgba(20, 20, 20, 0.92) 0%, rgba(30, 30, 30, 0.95) 100%)",
                    border: "1px solid rgba(192, 211, 202, 0.15)",
                    borderRadius: "24px",
                    p: { xs: 3, md: 4 },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    overflow: "hidden",
                    transition:
                      "transform 0.25s ease, box-shadow 0.25s ease, border 0.25s ease",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                    willChange: "transform",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: option.color,
                      borderRadius: "24px 24px 0 0",
                    },
                    "&:hover": {
                      transform: isMobile ? "none" : "translateY(-6px)",
                      boxShadow: "0 18px 48px rgba(0, 0, 0, 0.38)",
                      border: "1px solid rgba(192, 211, 202, 0.3)",
                    },
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
                      background: "rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <img
                      src={option.image}
                      alt={option.title}
                      loading="lazy"
                      decoding="async"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>

                  {/* Content */}
                  <Box
                    sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: { xs: "1.5rem", md: "1.75rem" },
                        fontWeight: 600,
                        color: "#C0D3CA",
                        mb: 1,
                        fontFamily: "'Cormorant Garamond', serif",
                      }}
                    >
                      {t(option.titleKey)}
                    </Typography>

                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontSize: { xs: "1rem", md: "1.1rem" },
                        fontWeight: 500,
                        color: "rgba(192, 211, 202, 0.9)",
                        mb: 2,
                      }}
                    >
                      {t(option.subtitleKey)}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: "0.9rem", md: "1rem" },
                        color: "rgba(192, 211, 202, 0.7)",
                        lineHeight: 1.6,
                        mb: 3,
                        flex: 1,
                      }}
                    >
                      {t(option.descriptionKey)}
                    </Typography>

                    {/* Action Button */}
                    <Box
                      sx={{
                        mt: "auto",
                        pt: 2,
                        borderTop: "1px solid rgba(192, 211, 202, 0.1)",
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
                            gap: 2,
                          },
                        }}
                      >
                        {t("getStarted")}
                        <Box
                          component="span"
                          sx={{
                            fontSize: "1.2em",
                            transition: "transform 0.2s ease",
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

export default React.memo(IndexSizes);

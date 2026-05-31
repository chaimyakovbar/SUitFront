import React, { useState, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import SignalWifi1BarIcon from "@mui/icons-material/SignalWifi1Bar";
import { motion, AnimatePresence } from "framer-motion";

const OfflineIndicator = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setIsSlowConnection(false);
    };

    const checkConnectionQuality = () => {
      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

      if (!connection) {
        setIsSlowConnection(false);
        return;
      }

      const effectiveType = connection.effectiveType;
      const downlink = connection.downlink;
      const rtt = connection.rtt;

      // בדיקה אם החיבור חלש
      const isSlow =
        effectiveType === "slow-2g" ||
        effectiveType === "2g" ||
        (effectiveType === "3g" && (downlink < 1 || rtt > 600)) ||
        (downlink && downlink < 0.5) ||
        (rtt && rtt > 1000);

      setIsSlowConnection(isSlow && !isOffline);
    };

    // Set initial state
    setIsOffline(!navigator.onLine);
    checkConnectionQuality();

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check connection quality periodically
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    if (connection) {
      connection.addEventListener("change", checkConnectionQuality);
    }

    // Cleanup
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (connection) {
        connection.removeEventListener("change", checkConnectionQuality);
      }
    };
  }, [isOffline]);

  return (
    <>
      <AnimatePresence>
        {isOffline && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 9999,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                backgroundColor: "#d32f2f",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "0 0 8px 8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                minWidth: { xs: "180px", md: "200px" },
              }}
            >
              <WifiOffIcon sx={{ fontSize: 20 }} />
              <Box
                component="span"
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                No Internet Connection
              </Box>
            </Box>
          </Box>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSlowConnection && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 9999,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                backgroundColor: "rgba(0, 0, 0, 0.15)",
                backdropFilter: "blur(10px)",
                color: "#ffc107",
                padding: "8px 16px",
                borderRadius: "0 0 8px 8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                minWidth: { xs: "180px", md: "200px" },
                border: "1px solid rgba(255, 193, 7, 0.3)",
              }}
            >
              <SignalWifi1BarIcon sx={{ fontSize: 20, color: "#ffc107" }} />
              <Box
                component="span"
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  fontFamily: "'Montserrat', sans-serif",
                  color: "#ffc107",
                }}
              >
                Slow Internet Connection
              </Box>
            </Box>
          </Box>
        )}
      </AnimatePresence>
    </>
  );
};

export default OfflineIndicator;

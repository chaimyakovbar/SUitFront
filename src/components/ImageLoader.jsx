import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { loadImageWithFallback } from "../utils/imageUtils";

/**
 * קומפוננט לטעינת תמונות עם fallback למקרה של שגיאות
 */
const ImageLoader = ({
  src,
  alt,
  fallbackSrc = null,
  style = {},
  className = "",
  showErrorMessage = false,
  enableFallback = true,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  // Load image with fallback on mount
  useEffect(() => {
    if (enableFallback && src) {
      loadImageWithFallback(src)
        .then((workingUrl) => {
          if (workingUrl && workingUrl !== src) {
            setCurrentSrc(workingUrl);
          }
        })
        .catch(() => {
          // Fallback failed, will be handled by handleError
        });
    }
  }, [src, enableFallback]);

  const handleError = () => {
    setLoading(false);

    // אם יש fallback ולא ניסינו אותו עדיין
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setLoading(true); // נסה לטעון את ה-fallback
      return;
    }

    setError(true);
  };

  if (error && !showErrorMessage) {
    return null; // החזר null אם יש שגיאה ולא רוצים להציג הודעה
  }

  return (
    <Box position="relative" style={style} className={className}>
      {loading && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <CircularProgress size={20} />
        </Box>
      )}

      {error && showErrorMessage ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
          sx={{
            backgroundColor: "#f5f5f5",
            border: "1px dashed #ccc",
            borderRadius: 1,
            p: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            לא ניתן לטעון תמונה
          </Typography>
        </Box>
      ) : (
        <img
          src={currentSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            ...style,
            opacity: loading ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
          {...props}
        />
      )}
    </Box>
  );
};

export default ImageLoader;

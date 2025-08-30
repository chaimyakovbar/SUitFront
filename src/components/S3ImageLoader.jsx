import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { loadImageWithFallback } from "../utils/imageUtils";

/**
 * קומפוננט מיוחד לטעינת תמונות S3 עם fallback אוטומטי
 */
const S3ImageLoader = ({
  src,
  alt,
  style = {},
  className = "",
  showErrorMessage = false,
  placeholder = null,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(null);

  useEffect(() => {
    if (!src) {
      setLoading(false);
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);

    // נסה לטעון את התמונה עם fallback
    loadImageWithFallback(src)
      .then((workingUrl) => {
        if (workingUrl) {
          setCurrentSrc(workingUrl);
          setLoading(false);
        } else {
          setError(true);
          setLoading(false);
        }
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [src]);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  if (error && !showErrorMessage && !placeholder) {
    return null;
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
      ) : error && placeholder ? (
        <img
          src={placeholder}
          alt={alt}
          style={{
            ...style,
            opacity: 1,
          }}
          {...props}
        />
      ) : currentSrc ? (
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
      ) : null}
    </Box>
  );
};

export default S3ImageLoader;

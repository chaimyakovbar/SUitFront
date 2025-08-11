import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import UploadIcon from "@mui/icons-material/Upload";

// MediaPipe Pose detection
let poseDetection = null;

const BodyCaptureCamera = ({ onMeasurementsExtracted, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [measurements, setMeasurements] = useState(null);
  const [error, setError] = useState(null);
  const [isMediaPipeLoaded, setIsMediaPipeLoaded] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Load MediaPipe
  useEffect(() => {
    const loadMediaPipe = async () => {
      try {
        const { Pose } = await import("@mediapipe/pose");
        
        poseDetection = new Pose({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
          },
        });

        poseDetection.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        setIsMediaPipeLoaded(true);
      } catch (err) {
        console.error("Failed to load MediaPipe:", err);
        setError("Failed to load AI measurement tools");
      }
    };

    loadMediaPipe();
  }, []);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setError(null);
      setIsStartingCamera(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
        setIsStartingCamera(false);
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setIsStartingCamera(false);
      setError("Camera access denied. Please allow camera permissions.");
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  }, []);

  // Start countdown timer
  const startCountdown = useCallback(() => {
    setIsCountingDown(true);
    setCountdown(5);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCountingDown(false);
          capturePhoto();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return timer;
  }, []);

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      stopCamera();
    }
  }, [stopCamera]);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      setError(null);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (JPEG, PNG, etc.)');
        setIsUploading(false);
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file is too large. Please select an image smaller than 10MB.');
        setIsUploading(false);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setError('Failed to read image file. Please try again.');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Extract measurements from image (camera or uploaded)
  const extractMeasurements = useCallback(async (imageSrc) => {
    if (!imageSrc || !poseDetection) return;

    setIsProcessing(true);
    setError(null);

    try {
      const img = new Image();
      img.src = imageSrc;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const results = await new Promise((resolve) => {
        poseDetection.onResults((results) => {
          resolve(results);
        });
        poseDetection.send({ image: img });
      });

      if (results.poseLandmarks) {
        const extractedMeasurements = calculateMeasurements(results.poseLandmarks, img.width, img.height);
        setMeasurements(extractedMeasurements);
        
        if (onMeasurementsExtracted) {
          onMeasurementsExtracted(extractedMeasurements);
        }
      } else {
        setError('No body detected. Please ensure your full body is visible in the image.');
      }
    } catch (err) {
      console.error('Measurement extraction error:', err);
      setError('Failed to extract measurements. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [poseDetection, onMeasurementsExtracted]);

  // Calculate measurements from pose landmarks
  const calculateMeasurements = (landmarks, imageWidth, imageHeight) => {
    const POSE_LANDMARKS = {
      NOSE: 0,
      LEFT_SHOULDER: 11,
      RIGHT_SHOULDER: 12,
      LEFT_ELBOW: 13,
      RIGHT_ELBOW: 14,
      LEFT_WRIST: 15,
      RIGHT_WRIST: 16,
      LEFT_HIP: 23,
      RIGHT_HIP: 24,
      LEFT_KNEE: 25,
      RIGHT_KNEE: 26,
      LEFT_ANKLE: 27,
      RIGHT_ANKLE: 28
    };

    const calculateDistance = (point1, point2) => {
      const dx = (point1.x - point2.x) * imageWidth;
      const dy = (point1.y - point2.y) * imageHeight;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const pixelToCmRatio = 0.026;
    const measurements = {};

    try {
      // Shoulder width
      if (landmarks[POSE_LANDMARKS.LEFT_SHOULDER] && landmarks[POSE_LANDMARKS.RIGHT_SHOULDER]) {
        const shoulderWidth = calculateDistance(
          landmarks[POSE_LANDMARKS.LEFT_SHOULDER],
          landmarks[POSE_LANDMARKS.RIGHT_SHOULDER]
        ) * pixelToCmRatio;
        measurements['Shoulder'] = Math.round(shoulderWidth);
      }

      // Chest circumference
      if (measurements['Shoulder']) {
        measurements['Chest'] = Math.round(measurements['Shoulder'] * 2.5);
      }

      // Waist
      if (measurements['Chest']) {
        measurements['Waist'] = Math.round(measurements['Chest'] * 0.85);
      }

      // Hip/Seat
      if (measurements['Waist']) {
        measurements['Seat'] = Math.round(measurements['Waist'] * 1.1);
      }

      // Arm measurements
      if (landmarks[POSE_LANDMARKS.LEFT_SHOULDER] && landmarks[POSE_LANDMARKS.LEFT_ELBOW]) {
        const upperArmLength = calculateDistance(
          landmarks[POSE_LANDMARKS.LEFT_SHOULDER],
          landmarks[POSE_LANDMARKS.LEFT_ELBOW]
        ) * pixelToCmRatio;
        measurements['Biceps'] = Math.round(upperArmLength * 0.8);
      }

      if (landmarks[POSE_LANDMARKS.LEFT_ELBOW] && landmarks[POSE_LANDMARKS.LEFT_WRIST]) {
        const forearmLength = calculateDistance(
          landmarks[POSE_LANDMARKS.LEFT_ELBOW],
          landmarks[POSE_LANDMARKS.LEFT_WRIST]
        ) * pixelToCmRatio;
        measurements['Sleeve Length'] = Math.round(forearmLength * 1.2);
      }

      // Leg measurements
      if (landmarks[POSE_LANDMARKS.LEFT_HIP] && landmarks[POSE_LANDMARKS.LEFT_KNEE]) {
        const thighLength = calculateDistance(
          landmarks[POSE_LANDMARKS.LEFT_HIP],
          landmarks[POSE_LANDMARKS.LEFT_KNEE]
        ) * pixelToCmRatio;
        measurements['Thigh'] = Math.round(thighLength * 0.6);
      }

      if (landmarks[POSE_LANDMARKS.LEFT_KNEE] && landmarks[POSE_LANDMARKS.LEFT_ANKLE]) {
        const calfLength = calculateDistance(
          landmarks[POSE_LANDMARKS.LEFT_KNEE],
          landmarks[POSE_LANDMARKS.LEFT_ANKLE]
        ) * pixelToCmRatio;
        measurements['Trousers Length'] = Math.round(calfLength * 1.5);
      }

      // Jacket length
      if (landmarks[POSE_LANDMARKS.NOSE] && landmarks[POSE_LANDMARKS.LEFT_ANKLE]) {
        const totalHeight = calculateDistance(
          landmarks[POSE_LANDMARKS.NOSE],
          landmarks[POSE_LANDMARKS.LEFT_ANKLE]
        ) * pixelToCmRatio;
        measurements['Jacket Length'] = Math.round(totalHeight * 0.4);
      }

      // Additional measurements
      if (measurements['Chest']) {
        measurements['Front Width'] = Math.round(measurements['Chest'] * 0.4);
        measurements['Rear Width'] = Math.round(measurements['Chest'] * 0.45);
        measurements['Armhole'] = Math.round(measurements['Chest'] * 0.25);
      }

      if (measurements['Waist']) {
        measurements['Waistband'] = Math.round(measurements['Waist'] * 0.9);
      }

      if (measurements['Trousers Length']) {
        measurements['Stride Length'] = Math.round(measurements['Trousers Length'] * 0.3);
      }

      measurements['Ankles'] = Math.round(25);

    } catch (err) {
      console.error('Error calculating measurements:', err);
    }

    return measurements;
  };

  // Reset state
  const resetCapture = () => {
    setCapturedImage(null);
    setUploadedImage(null);
    setMeasurements(null);
    setError(null);
    setIsProcessing(false);
    setCountdown(0);
    setIsCountingDown(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}
      </style>
      
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <CameraAltIcon />
          <Typography variant="h6">Body Measurement Capture</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          {error && (
            <Alert severity="error" icon={<ErrorIcon />}>
              {error}
            </Alert>
          )}

          {!isMediaPipeLoaded && (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Loading AI measurement tools...</Typography>
            </Box>
          )}

          {isMediaPipeLoaded && (
            <>
              {/* Tab Navigation */}
              <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab 
                  label="Camera Capture" 
                  icon={<CameraAltIcon />} 
                  iconPosition="start"
                />
                <Tab 
                  label="Upload Image" 
                  icon={<UploadIcon />} 
                  iconPosition="start"
                />
              </Tabs>

              {/* Camera Tab Content */}
              {activeTab === 0 && (
                <>
                  {!capturedImage && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        Position yourself 2-3 meters from the camera with your full body visible. 
                        Wear fitted clothing for better accuracy.
                      </Typography>
                      
                      <Box position="relative" display="flex" justifyContent="center">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          style={{
                            width: "100%",
                            maxWidth: "500px",
                            height: "auto",
                            border: "2px solid #ddd",
                            borderRadius: "8px",
                          }}
                        />
                        <canvas ref={canvasRef} style={{ display: "none" }} />
                        
                        {/* Countdown Timer Overlay */}
                        {isCountingDown && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              zIndex: 10,
                            }}
                          >
                            <Box
                              sx={{
                                width: 120,
                                height: 120,
                                borderRadius: "50%",
                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "4px solid #fff",
                                animation: countdown > 3 ? "pulse 1s infinite" : "none",
                              }}
                            >
                              <Typography
                                variant="h1"
                                sx={{
                                  color: "#fff",
                                  fontWeight: "bold",
                                  fontSize: "3rem",
                                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                                }}
                              >
                                {countdown}
                              </Typography>
                            </Box>
                            <Typography
                              variant="h6"
                              sx={{
                                color: "#fff",
                                mt: 2,
                                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                                fontWeight: "bold",
                              }}
                            >
                              {countdown > 1 ? "Get Ready!" : "Smile!"}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )}

                  {capturedImage && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        Captured image - Ready to extract measurements
                      </Typography>
                      <img
                        src={capturedImage}
                        alt="Captured body"
                        style={{
                          width: "100%",
                          maxWidth: "500px",
                          height: "auto",
                          border: "2px solid #ddd",
                          borderRadius: "8px",
                        }}
                      />
                    </Box>
                  )}
                </>
              )}

              {/* Upload Image Tab Content */}
              {activeTab === 1 && (
                <>
                  {!uploadedImage && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        Upload a photo of yourself with your full body visible. 
                        Make sure you're standing straight and wearing fitted clothing for better accuracy.
                      </Typography>
                      
                      <Box
                        sx={{
                          border: "2px dashed #ccc",
                          borderRadius: 2,
                          p: 4,
                          textAlign: "center",
                          backgroundColor: "#fafafa",
                        }}
                      >
                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id="image-upload"
                          type="file"
                          onChange={handleImageUpload}
                        />
                        <label htmlFor="image-upload">
                          <Button
                            component="span"
                            variant="outlined"
                            startIcon={<UploadIcon />}
                            disabled={isUploading}
                            sx={{ mb: 2 }}
                          >
                            {isUploading ? "Uploading..." : "Choose Image"}
                          </Button>
                        </label>
                        <Typography variant="body2" color="text.secondary">
                          Supported formats: JPEG, PNG, WebP (Max 10MB)
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {uploadedImage && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        Uploaded image - Ready to extract measurements
                      </Typography>
                      <img
                        src={uploadedImage}
                        alt="Uploaded body"
                        style={{
                          width: "100%",
                          maxWidth: "500px",
                          height: "auto",
                          border: "2px solid #ddd",
                          borderRadius: "8px",
                        }}
                      />
                    </Box>
                  )}
                </>
              )}

              {/* Measurements Display */}
              {measurements && (
                <Box>
                  <Typography variant="h6" mb={2}>
                    <CheckCircleIcon sx={{ mr: 1, color: "success.main" }} />
                    Measurements Extracted
                  </Typography>
                  <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={2}>
                    {Object.entries(measurements).map(([key, value]) => (
                      <Box key={key} p={2} border="1px solid #ddd" borderRadius={1}>
                        <Typography variant="body2" color="text.secondary">{key}</Typography>
                        <Typography variant="h6">{value} cm</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        {!capturedImage && !uploadedImage && activeTab === 0 && (
          <>
            {!isCapturing ? (
              <Button 
                onClick={startCamera} 
                variant="contained" 
                color="primary"
                disabled={isStartingCamera}
              >
                {isStartingCamera ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Starting Camera...
                  </>
                ) : (
                  'Start Camera'
                )}
              </Button>
            ) : (
              <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
                <Button 
                  onClick={startCountdown} 
                  variant="contained" 
                  color="primary"
                  disabled={isCountingDown}
                  size="large"
                >
                  {isCountingDown ? `Capturing in ${countdown}s...` : 'Start Countdown & Capture'}
                </Button>
                <Button 
                  onClick={capturePhoto} 
                  variant="outlined" 
                  color="primary"
                  disabled={isCountingDown}
                  size="small"
                >
                  Capture Now
                </Button>
              </Box>
            )}
          </>
        )}

        {(capturedImage || uploadedImage) && !measurements && (
          <Button 
            onClick={() => extractMeasurements(capturedImage || uploadedImage)} 
            variant="contained" 
            color="primary"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Processing...
              </>
            ) : (
              'Extract Measurements'
            )}
          </Button>
        )}

        {measurements && (
          <Button onClick={onClose} variant="contained" color="success">
            Use These Measurements
          </Button>
        )}

        <Button onClick={() => {
          resetCapture();
          if (capturedImage || uploadedImage) {
            onClose();
          }
        }}>
          {capturedImage || uploadedImage ? 'Cancel' : 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BodyCaptureCamera;

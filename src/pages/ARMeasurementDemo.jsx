import React, { useState } from 'react';
import { Box, Typography, Button, Container, Paper, Grid } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PersonIcon from '@mui/icons-material/Person';
import ARAvatar from '../components/ARAvatar';
import BodyCaptureCamera from '../components/BodyCaptureCamera';

const ARMeasurementDemo = () => {
  const [measurements, setMeasurements] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isARMode, setIsARMode] = useState(false);

  const handleMeasurementsExtracted = (extractedMeasurements) => {
    setMeasurements(extractedMeasurements);
    setShowCamera(false);
  };

  const handleCaptureRequest = () => {
    setShowCamera(true);
  };

  const toggleARMode = () => {
    setIsARMode(!isARMode);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        AI-Powered Body Measurement System
      </Typography>

      <Grid container spacing={4}>
        {/* Left Panel - Controls */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h5" gutterBottom>
              Measurement Tools
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<CameraAltIcon />}
                onClick={handleCaptureRequest}
                sx={{ py: 2 }}
              >
                Capture Body Measurements
              </Button>

              <Button
                variant={isARMode ? "contained" : "outlined"}
                size="large"
                startIcon={<PersonIcon />}
                onClick={toggleARMode}
                sx={{ py: 2 }}
              >
                {isARMode ? "Exit AR Mode" : "Enter AR Mode"}
              </Button>
            </Box>

            {measurements && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Extracted Measurements
                </Typography>
                <Box sx={{ display: 'grid', gap: 1 }}>
                  {Object.entries(measurements).map(([key, value]) => (
                    <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                      <Typography variant="body2">{key}</Typography>
                      <Typography variant="body2" fontWeight="bold">{value} cm</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Panel - 3D Avatar */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ height: '600px', position: 'relative', overflow: 'hidden' }}>
            <ARAvatar
              measurements={measurements}
              onCaptureRequest={handleCaptureRequest}
              isARMode={isARMode}
              showCaptureButton={!measurements}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Camera Capture Dialog */}
      {showCamera && (
        <BodyCaptureCamera
          onMeasurementsExtracted={handleMeasurementsExtracted}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Information Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom align="center">
          How It Works
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <CameraAltIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                1. Capture Photo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Position yourself 2-3 meters from the camera with your full body visible. 
                Wear fitted clothing for better accuracy.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <PersonIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                2. AI Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our AI uses MediaPipe Pose detection to analyze your body structure 
                and extract precise measurements automatically.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                3. Personalized Avatar
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View your personalized 3D avatar with your exact measurements. 
                Perfect for virtual try-ons and custom suit fitting.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Features Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom align="center">
          Key Features
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1" fontWeight="bold">AI-Powered</Typography>
              <Typography variant="body2" color="text.secondary">
                Advanced computer vision for accurate measurements
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1" fontWeight="bold">Real-time</Typography>
              <Typography variant="body2" color="text.secondary">
                Instant measurement extraction and avatar generation
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1" fontWeight="bold">AR Ready</Typography>
              <Typography variant="body2" color="text.secondary">
                Augmented reality mode for immersive experience
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1" fontWeight="bold">Precise</Typography>
              <Typography variant="body2" color="text.secondary">
                Millimeter-accurate body measurements
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ARMeasurementDemo; 
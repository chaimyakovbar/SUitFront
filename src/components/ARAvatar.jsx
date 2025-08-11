import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  PerspectiveCamera, 
  Html,
  Box,
  Sphere,
  Cylinder
} from '@react-three/drei';
import { Box as MuiBox, Button, Typography, Chip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

// Personalized Avatar Component
const PersonalizedAvatar = ({ measurements, isARMode }) => {
  const avatarRef = useRef();
  const [avatarGeometry, setAvatarGeometry] = useState(null);

  // Generate avatar geometry based on measurements
  useEffect(() => {
    if (!measurements) return;

    const generateAvatarGeometry = () => {
      const geometry = {
        head: { radius: 12, position: [0, 0, 0] },
        neck: { radius: 8, height: 10, position: [0, -15, 0] },
        torso: { width: measurements.Chest / 2 || 25, height: measurements['Jacket Length'] || 70, depth: measurements['Front Width'] || 20, position: [0, -50, 0] },
        leftArm: { radius: measurements.Biceps / 3 || 8, height: measurements['Sleeve Length'] || 60, position: [-35, -45, 0] },
        rightArm: { radius: measurements.Biceps / 3 || 8, height: measurements['Sleeve Length'] || 60, position: [35, -45, 0] },
        leftLeg: { radius: measurements.Thigh / 3 || 12, height: measurements['Trousers Length'] || 80, position: [-15, -120, 0] },
        rightLeg: { radius: measurements.Thigh / 3 || 12, height: measurements['Trousers Length'] || 80, position: [15, -120, 0] },
        leftFoot: { width: 10, height: 5, depth: 25, position: [-15, -200, 5] },
        rightFoot: { width: 10, height: 5, depth: 25, position: [15, -200, 5] }
      };

      setAvatarGeometry(geometry);
    };

    generateAvatarGeometry();
  }, [measurements]);

  // Animate avatar in AR mode
  useFrame((state) => {
    if (avatarRef.current && isARMode) {
      // Subtle breathing animation
      const time = state.clock.getElapsedTime();
      const breathingScale = 1 + Math.sin(time * 2) * 0.02;
      avatarRef.current.scale.setScalar(breathingScale);
    }
  });

  if (!avatarGeometry) {
    return null;
  }

  return (
    <group ref={avatarRef}>
      {/* Head */}
      <Sphere args={[avatarGeometry.head.radius, 16, 16]} position={avatarGeometry.head.position}>
        <meshStandardMaterial color="#f4d03f" />
      </Sphere>

      {/* Neck */}
      <Cylinder 
        args={[avatarGeometry.neck.radius, avatarGeometry.neck.radius, avatarGeometry.neck.height, 8]} 
        position={avatarGeometry.neck.position}
      >
        <meshStandardMaterial color="#f4d03f" />
      </Cylinder>

      {/* Torso */}
      <Box 
        args={[avatarGeometry.torso.width, avatarGeometry.torso.height, avatarGeometry.torso.depth]} 
        position={avatarGeometry.torso.position}
      >
        <meshStandardMaterial color="#3498db" />
      </Box>

      {/* Arms */}
      <Cylinder 
        args={[avatarGeometry.leftArm.radius, avatarGeometry.leftArm.radius, avatarGeometry.leftArm.height, 8]} 
        position={avatarGeometry.leftArm.position}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial color="#f4d03f" />
      </Cylinder>

      <Cylinder 
        args={[avatarGeometry.rightArm.radius, avatarGeometry.rightArm.radius, avatarGeometry.rightArm.height, 8]} 
        position={avatarGeometry.rightArm.position}
        rotation={[0, 0, -Math.PI / 2]}
      >
        <meshStandardMaterial color="#f4d03f" />
      </Cylinder>

      {/* Legs */}
      <Cylinder 
        args={[avatarGeometry.leftLeg.radius, avatarGeometry.leftLeg.radius, avatarGeometry.leftLeg.height, 8]} 
        position={avatarGeometry.leftLeg.position}
      >
        <meshStandardMaterial color="#34495e" />
      </Cylinder>

      <Cylinder 
        args={[avatarGeometry.rightLeg.radius, avatarGeometry.rightLeg.radius, avatarGeometry.rightLeg.height, 8]} 
        position={avatarGeometry.rightLeg.position}
      >
        <meshStandardMaterial color="#34495e" />
      </Cylinder>

      {/* Feet */}
      <Box 
        args={[avatarGeometry.leftFoot.width, avatarGeometry.leftFoot.height, avatarGeometry.leftFoot.depth]} 
        position={avatarGeometry.leftFoot.position}
      >
        <meshStandardMaterial color="#2c3e50" />
      </Box>

      <Box 
        args={[avatarGeometry.rightFoot.width, avatarGeometry.rightFoot.height, avatarGeometry.rightFoot.depth]} 
        position={avatarGeometry.rightFoot.position}
      >
        <meshStandardMaterial color="#2c3e50" />
      </Box>
    </group>
  );
};

// Default Avatar Component (fallback)
const DefaultAvatar = () => {
  const { scene } = useGLTF("/models/bane_male.glb", true);
  
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    return clone;
  }, [scene]);

  return (
    <primitive
      object={clonedScene}
      dispose={null}
      scale={[1, 1, 1]}
      position={[10, 30, 10]}
    />
  );
};

// Main AR Avatar Component
const ARAvatar = ({ 
  measurements, 
  onCaptureRequest, 
  isARMode = false,
  showCaptureButton = true 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCaptureRequest = () => {
    if (onCaptureRequest) {
      setIsLoading(true);
      onCaptureRequest();
    }
  };

  return (
    <MuiBox sx={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* AR Mode Indicator */}
      {isARMode && (
        <MuiBox
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 1000,
            display: 'flex',
            gap: 1,
            alignItems: 'center'
          }}
        >
          <Chip
            icon={<PersonIcon />}
            label="AR Avatar Mode"
            color="primary"
            variant="filled"
            sx={{ backgroundColor: 'rgba(52, 152, 219, 0.9)' }}
          />
        </MuiBox>
      )}

      {/* Capture Button */}
      {showCaptureButton && !measurements && (
        <MuiBox
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            textAlign: 'center'
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<CameraAltIcon />}
            onClick={handleCaptureRequest}
            disabled={isLoading}
            sx={{
              backgroundColor: 'rgba(52, 152, 219, 0.9)',
              color: 'white',
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: 'rgba(52, 152, 219, 1)'
              }
            }}
          >
            {isLoading ? 'Loading...' : 'Capture Body Measurements'}
          </Button>
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: 300,
              textAlign: 'center'
            }}
          >
            Use AI to automatically extract your body measurements and create a personalized 3D avatar
          </Typography>
        </MuiBox>
      )}

      {/* Measurements Display */}
      {measurements && (
        <MuiBox
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: 2,
            p: 2,
            maxWidth: 250,
            maxHeight: 400,
            overflow: 'auto'
          }}
        >
          <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
            Your Measurements
          </Typography>
          {Object.entries(measurements).slice(0, 8).map(([key, value]) => (
            <MuiBox key={key} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {key}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                {value} cm
              </Typography>
            </MuiBox>
          ))}
          {Object.keys(measurements).length > 8 && (
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              +{Object.keys(measurements).length - 8} more measurements
            </Typography>
          )}
        </MuiBox>
      )}

      {/* 3D Canvas */}
      <Canvas shadows style={{ width: '100%', height: '100%' }}>
        <PerspectiveCamera makeDefault position={[10, 20, 20]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        
        {/* Grid for reference */}
        <gridHelper args={[20, 20]} />
        
        {/* Avatar */}
        {measurements ? (
          <PersonalizedAvatar measurements={measurements} isARMode={isARMode} />
        ) : (
          <DefaultAvatar />
        )}
      </Canvas>
    </MuiBox>
  );
};

export default ARAvatar; 
import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { 
  counterAtom, 
  currentColorAtom 
} from '../../../Utils';
import { suitsColors } from '../../../consts/KindOfColors';

const FabricSelection = ({ isMobile }) => {
  const [counterArray, setCounterArray] = useAtom(counterAtom);
  const [currentColor, setCurrentColor] = useAtom(currentColorAtom);
  const [selectedFabric, setSelectedFabric] = useState(null);

  const handleFabricSelect = (fabric) => {
    setSelectedFabric(fabric);
    setCurrentColor(fabric.colorName);
    
    // Mark step as validated
    const updatedCounter = [...counterArray];
    updatedCounter[0] = { step1Validated: true };
    setCounterArray(updatedCounter);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const fabricVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Mobile horizontal layout
  if (isMobile) {
    return (
      <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          gap: 3,
          minWidth: 'fit-content'
        }}
      >
        {suitsColors.map((fabric, index) => {
          const isSelected = selectedFabric?.colorId === fabric.colorId;
          
          return (
            <motion.div
              key={fabric.colorId}
              variants={fabricVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Box
                onClick={() => handleFabricSelect(fabric)}
                sx={{
                  position: 'relative',
                  cursor: 'pointer',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  width: '120px',
                  height: '120px',
                  border: isSelected 
                    ? '3px solid #C0D3CA'
                    : '2px solid rgba(192, 211, 202, 0.2)',
                  boxShadow: isSelected 
                    ? '0 8px 32px rgba(192, 211, 202, 0.4)'
                    : '0 4px 16px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  background: `url(${fabric.color})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  flexShrink: 0,
                  '&:hover': {
                    border: '2px solid rgba(192, 211, 202, 0.5)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: isSelected 
                      ? 'linear-gradient(135deg, rgba(192, 211, 202, 0.2) 0%, transparent 100%)'
                      : 'linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, transparent 100%)',
                    pointerEvents: 'none'
                  }
                }}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <Box
                    component={motion.div}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, ease: "backOut" }}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #C0D3CA 0%, #A8C3B8 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                      zIndex: 2
                    }}
                  >
                    <CheckCircleIcon 
                      sx={{ 
                        fontSize: 18, 
                        color: '#000' 
                      }} 
                    />
                  </Box>
                )}

                {/* Fabric Name Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
                    padding: '12px 8px 8px',
                    zIndex: 1
                  }}
                >
                  <Typography
                    sx={{
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      textAlign: 'center',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                      letterSpacing: '0.02em',
                      lineHeight: 1.2
                    }}
                  >
                    {fabric.name}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          );
        })}
      </Box>
    );
  }

  // Desktop vertical layout
  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{ width: '100%', height: '100%' }}
    >
      {/* Description */}
      <Typography
        sx={{
          fontSize: '1rem',
          color: 'rgba(192, 211, 202, 0.8)',
          textAlign: 'center',
          mb: 4,
          fontWeight: 300,
          lineHeight: 1.5
        }}
      >
        Select from our collection of premium fabrics.
        <br />
        Each fabric is carefully chosen for quality and elegance.
      </Typography>

      {/* Fabric Grid */}
      <Grid container spacing={3}>
        {suitsColors.map((fabric, index) => {
          const isSelected = selectedFabric?.colorId === fabric.colorId;
          
          return (
            <Grid item xs={6} sm={4} md={6} key={fabric.colorId}>
              <motion.div
                variants={fabricVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Box
                  onClick={() => handleFabricSelect(fabric)}
                  sx={{
                    position: 'relative',
                    cursor: 'pointer',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    aspectRatio: '1',
                    border: isSelected 
                      ? '3px solid #C0D3CA'
                      : '2px solid rgba(192, 211, 202, 0.2)',
                    boxShadow: isSelected 
                      ? '0 8px 32px rgba(192, 211, 202, 0.4)'
                      : '0 4px 16px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                    background: `url(${fabric.color})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    '&:hover': {
                      border: '2px solid rgba(192, 211, 202, 0.5)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: isSelected 
                        ? 'linear-gradient(135deg, rgba(192, 211, 202, 0.2) 0%, transparent 100%)'
                        : 'linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, transparent 100%)',
                      pointerEvents: 'none'
                    }
                  }}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <Box
                      component={motion.div}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, ease: "backOut" }}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #C0D3CA 0%, #A8C3B8 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        zIndex: 2
                      }}
                    >
                      <CheckCircleIcon 
                        sx={{ 
                          fontSize: 20, 
                          color: '#000' 
                        }} 
                      />
                    </Box>
                  )}

                  {/* Fabric Name Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
                      padding: '16px 12px 10px',
                      zIndex: 1
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#fff',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        textAlign: 'center',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                        letterSpacing: '0.02em'
                      }}
                    >
                      {fabric.name}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>

      {/* Selection Status */}
      {selectedFabric && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Box
            sx={{
              mt: 4,
              padding: '16px 20px',
              background: 'linear-gradient(135deg, rgba(192, 211, 202, 0.1) 0%, rgba(76, 175, 80, 0.1) 100%)',
              border: '1px solid rgba(192, 211, 202, 0.3)',
              borderRadius: '12px',
              textAlign: 'center'
            }}
          >
            <Typography
              sx={{
                color: '#C0D3CA',
                fontSize: '1rem',
                fontWeight: 500
              }}
            >
              ✓ Selected: {selectedFabric.name}
            </Typography>
          </Box>
        </motion.div>
      )}
    </Box>
  );
};

export default FabricSelection;

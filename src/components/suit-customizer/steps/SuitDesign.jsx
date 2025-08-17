import React, { useState } from 'react';
import { Box, Typography, Button, Slider, Divider, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import {
  currentKindAtom,
  selectedCollarAtom,
  selectedLapelTypeAtom,
  selectedPacketTypeAtom,
  selectedKindTypeAtom,
  counterAtom
} from '../../../Utils';

// Import images
import kind1Img from '/assets/kinds/kind1.png';
import kind2Img from '/assets/kinds/kind2.png';
import kind3Img from '/assets/kinds/kind3.png';
import kind4Img from '/assets/kinds/kind4.png';
import collarTight from '/assets/kinds/collarTight.png';
import collarDistant from '/assets/kinds/collarDistant.png';
import packet1 from '/assets/kinds/1.png';
import packet2 from '/assets/kinds/2.png';
import packet3 from '/assets/kinds/3.png';

const SuitDesign = ({ isMobile }) => {
  const [selectedKind, setSelectedKind] = useAtom(currentKindAtom);
  const [selectedCollar, setSelectedCollar] = useAtom(selectedCollarAtom);
  const [selectedLapelType, setSelectedLapelType] = useAtom(selectedLapelTypeAtom);
  const [selectedPacketType, setSelectedPacketType] = useAtom(selectedPacketTypeAtom);
  const [selectedKindType, setSelectedKindType] = useAtom(selectedKindTypeAtom);
  const [counterArray, setCounterArray] = useAtom(counterAtom);
  
  const [selectedPocketStyle, setSelectedPocketStyle] = useState(true); // true = straight, false = crooked

  // Validate step 2 when user makes selections
  const validateStep = () => {
    if (selectedKind && selectedCollar && selectedLapelType && selectedPacketType) {
      const newCounterArray = [...counterArray];
      newCounterArray[1] = { ...newCounterArray[1], step2Validated: true };
      setCounterArray(newCounterArray);
    }
  };

  // Validate step whenever selections change
  React.useEffect(() => {
    validateStep();
  }, [selectedKind, selectedCollar, selectedLapelType, selectedPacketType]);

  const suitTypes = [
    { name: 'kind1', image: kind1Img, label: 'Classic Single' },
    { name: 'kind2', image: kind2Img, label: 'Modern Double' },
    { name: 'kind3', image: kind3Img, label: 'Contemporary' },
    { name: 'kind4', image: kind4Img, label: 'Traditional' }
  ];

  const collarStyles = [
    { name: 'collarTight', image: collarTight, label: 'Narrow Lapel' },
    { name: 'collarDistant', image: collarDistant, label: 'Wide Lapel' },
    { name: 'collarCircel', image: collarDistant, label: 'Rounded Lapel' }
  ];

  const lapelLevels = [
    { value: 1, label: 'Slim' },
    { value: 2, label: 'Standard' },
    { value: 3, label: 'Wide' },
    { value: 4, label: 'Extra Wide' }
  ];

  const pocketTypesStraight = [
    { name: 'packet1', image: packet1, label: 'Classic' },
    { name: 'packet2', image: packet2, label: 'Modern' },
    { name: 'packet3', image: packet3, label: 'Elegant' },
    { name: 'packet4', image: packet1, label: 'Traditional' },
    { name: 'packet5', image: packet2, label: 'Contemporary' }
  ];

  const pocketTypesCrooked = [
    { name: 'packet1', image: packet1, label: 'Angled Classic' },
    { name: 'packet2', image: packet2, label: 'Angled Modern' },
    { name: 'packet4', image: packet1, label: 'Angled Traditional' },
    { name: 'packet5', image: packet2, label: 'Angled Contemporary' }
  ];

  const handlePocketStyleChange = (isStraight) => {
    setSelectedPocketStyle(isStraight);
    setSelectedKindType(isStraight ? 'packetBottom' : 'packetSide');
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  const OptionButton = ({ item, isSelected, onSelect, size = 'medium' }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Box
        onClick={() => onSelect(item)}
        sx={{
          position: 'relative',
          cursor: 'pointer',
          borderRadius: '12px',
          border: isSelected 
            ? '2px solid #C0D3CA'
            : '1px solid rgba(192, 211, 202, 0.2)',
          background: 'rgba(30, 30, 30, 0.6)',
          transition: 'all 0.3s ease',
          boxShadow: isSelected 
            ? '0 8px 24px rgba(192, 211, 202, 0.3)'
            : '0 4px 12px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          '&:hover': {
            border: '2px solid rgba(192, 211, 202, 0.5)',
            background: 'rgba(192, 211, 202, 0.1)'
          }
        }}
      >
        <Box
          sx={{
            width: size === 'small' ? { xs: 60, md: 80 } : { xs: 80, md: 100 },
            height: size === 'small' ? { xs: 60, md: 80 } : { xs: 80, md: 100 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1
          }}
        >
          <img
            src={item.image}
            alt={item.label}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'brightness(1.2) contrast(0.8) invert(1) sepia(0) saturate(0) hue-rotate(0deg)'
            }}
          />
        </Box>
        
        {isSelected && (
          <Box
            component={motion.div}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: '#C0D3CA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 16, color: '#000' }} />
          </Box>
        )}
        
        <Typography
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
            color: '#fff',
            fontSize: { xs: '0.7rem', md: '0.8rem' },
            fontWeight: 500,
            textAlign: 'center',
            py: 0.5,
            px: 0.5
          }}
        >
          {item.label}
        </Typography>
      </Box>
    </motion.div>
  );

  // Mobile horizontal layout
  if (isMobile) {
    return (
      <Box
        component={motion.div}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          gap: 4,
          minWidth: 'fit-content'
        }}
      >
        {/* Suit Type Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#C0D3CA',
              textAlign: 'center',
              mb: 1
            }}
          >
            Suit Style
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {suitTypes.map((type) => (
              <motion.div
                key={type.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Box
                  onClick={() => setSelectedKind(type.name)}
                  sx={{
                    position: 'relative',
                    cursor: 'pointer',
                    borderRadius: '16px',
                    border: selectedKind === type.name 
                      ? '2px solid #C0D3CA'
                      : '1px solid rgba(192, 211, 202, 0.2)',
                    background: 'rgba(30, 30, 30, 0.6)',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedKind === type.name 
                      ? '0 8px 24px rgba(192, 211, 202, 0.3)'
                      : '0 4px 12px rgba(0, 0, 0, 0.2)',
                    overflow: 'hidden',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    '&:hover': {
                      border: '2px solid rgba(192, 211, 202, 0.5)',
                      background: 'rgba(192, 211, 202, 0.1)'
                    }
                  }}
                >
                  <img
                    src={type.image}
                    alt={type.label}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'contain',
                      filter: 'brightness(1.2) contrast(0.8) invert(1) sepia(0) saturate(0) hue-rotate(0deg)'
                    }}
                  />
                  
                  {selectedKind === type.name && (
                    <Box
                      component={motion.div}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: '#C0D3CA',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 14, color: '#000' }} />
                    </Box>
                  )}
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>

        {/* Collar Style Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#C0D3CA',
              textAlign: 'center',
              mb: 1
            }}
          >
            Lapel Style
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {collarStyles.map((style) => (
              <motion.div
                key={style.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Box
                  onClick={() => setSelectedCollar(style.name)}
                  sx={{
                    position: 'relative',
                    cursor: 'pointer',
                    borderRadius: '16px',
                    border: selectedCollar === style.name 
                      ? '2px solid #C0D3CA'
                      : '1px solid rgba(192, 211, 202, 0.2)',
                    background: 'rgba(30, 30, 30, 0.6)',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedCollar === style.name 
                      ? '0 8px 24px rgba(192, 211, 202, 0.3)'
                      : '0 4px 12px rgba(0, 0, 0, 0.2)',
                    overflow: 'hidden',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    '&:hover': {
                      border: '2px solid rgba(192, 211, 202, 0.5)',
                      background: 'rgba(192, 211, 202, 0.1)'
                    }
                  }}
                >
                  <img
                    src={style.image}
                    alt={style.label}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'contain',
                      filter: 'brightness(1.2) contrast(0.8) invert(1) sepia(0) saturate(0) hue-rotate(0deg)'
                    }}
                  />
                  
                  {selectedCollar === style.name && (
                    <Box
                      component={motion.div}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: '#C0D3CA',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 14, color: '#000' }} />
                    </Box>
                  )}
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>

        {/* Pocket Style Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#C0D3CA',
              textAlign: 'center',
              mb: 1
            }}
          >
            Pocket Style
          </Typography>
          
          {/* Pocket Toggle - Compact */}
          <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5 }}>
            <Box
              onClick={() => handlePocketStyleChange(true)}
              sx={{
                cursor: 'pointer',
                px: 1.5,
                py: 0.5,
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 500,
                color: selectedPocketStyle ? '#000' : '#C0D3CA',
                backgroundColor: selectedPocketStyle ? '#C0D3CA' : 'rgba(192, 211, 202, 0.1)',
                border: '1px solid rgba(192, 211, 202, 0.3)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: selectedPocketStyle ? '#D0E3DA' : 'rgba(192, 211, 202, 0.2)'
                }
              }}
            >
              Straight
            </Box>
            <Box
              onClick={() => handlePocketStyleChange(false)}
              sx={{
                cursor: 'pointer',
                px: 1.5,
                py: 0.5,
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 500,
                color: !selectedPocketStyle ? '#000' : '#C0D3CA',
                backgroundColor: !selectedPocketStyle ? '#C0D3CA' : 'rgba(192, 211, 202, 0.1)',
                border: '1px solid rgba(192, 211, 202, 0.3)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: !selectedPocketStyle ? '#D0E3DA' : 'rgba(192, 211, 202, 0.2)'
                }
              }}
            >
              Angled
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
            {(selectedPocketStyle ? pocketTypesStraight : pocketTypesCrooked).slice(0, 3).map((pocket) => (
              <motion.div
                key={pocket.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Box
                  onClick={() => setSelectedPacketType(pocket.name)}
                  sx={{
                    position: 'relative',
                    cursor: 'pointer',
                    borderRadius: '12px',
                    border: selectedPacketType === pocket.name 
                      ? '2px solid #C0D3CA'
                      : '1px solid rgba(192, 211, 202, 0.2)',
                    background: 'rgba(30, 30, 30, 0.6)',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedPacketType === pocket.name 
                      ? '0 8px 24px rgba(192, 211, 202, 0.3)'
                      : '0 4px 12px rgba(0, 0, 0, 0.2)',
                    overflow: 'hidden',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    '&:hover': {
                      border: '2px solid rgba(192, 211, 202, 0.5)',
                      background: 'rgba(192, 211, 202, 0.1)'
                    }
                  }}
                >
                  <img
                    src={pocket.image}
                    alt={pocket.label}
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'contain',
                      filter: 'brightness(1.2) contrast(0.8) invert(1) sepia(0) saturate(0) hue-rotate(0deg)'
                    }}
                  />
                  
                  {selectedPacketType === pocket.name && (
                    <Box
                      component={motion.div}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      sx={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: '#C0D3CA',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 12, color: '#000' }} />
                    </Box>
                  )}
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  // Desktop vertical layout
  return (
    <Box
      component={motion.div}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      sx={{ width: '100%', height: '100%' }}
    >
      {/* Suit Type Selection */}
      <Box component={motion.div} variants={sectionVariants} sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: '1.25rem',
            fontWeight: 500,
            color: '#C0D3CA',
            mb: 2,
            textAlign: 'center'
          }}
        >
          Suit Style
        </Typography>
        
        <Grid container spacing={2} justifyContent="center">
          {suitTypes.map((type) => (
            <Grid item key={type.name}>
              <OptionButton
                item={type}
                isSelected={selectedKind === type.name}
                onSelect={(item) => setSelectedKind(item.name)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ backgroundColor: 'rgba(192, 211, 202, 0.2)', my: 3 }} />

      {/* Collar Style */}
      <Box component={motion.div} variants={sectionVariants} sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: '1.25rem',
            fontWeight: 500,
            color: '#C0D3CA',
            mb: 2,
            textAlign: 'center'
          }}
        >
          Lapel Style
        </Typography>
        
        <Grid container spacing={2} justifyContent="center">
          {collarStyles.map((style) => (
            <Grid item key={style.name}>
              <OptionButton
                item={style}
                isSelected={selectedCollar === style.name}
                onSelect={(item) => setSelectedCollar(item.name)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Lapel Width Slider */}
      <Box sx={{ px: 2, mb: 4 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontSize: '1.1rem',
            fontWeight: 500,
            color: '#C0D3CA',
            mb: 2,
            textAlign: 'center'
          }}
        >
          Lapel Width
        </Typography>
        
        <Slider
          defaultValue={2}
          step={1}
          marks={lapelLevels}
          min={1}
          max={4}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => 
            lapelLevels.find(level => level.value === value)?.label || 'Standard'
          }
          onChange={(_, newValue) => {
            const selectedLevel = lapelLevels.find(level => level.value === newValue);
            setSelectedLapelType(selectedLevel?.label || 'Standard');
          }}
          sx={{
            color: '#C0D3CA',
            '& .MuiSlider-track': {
              backgroundColor: '#C0D3CA'
            },
            '& .MuiSlider-rail': {
              backgroundColor: 'rgba(192, 211, 202, 0.3)'
            },
            '& .MuiSlider-thumb': {
              backgroundColor: '#C0D3CA',
              border: '2px solid #0a0a0a'
            },
            '& .MuiSlider-mark': {
              backgroundColor: 'rgba(192, 211, 202, 0.5)'
            },
            '& .MuiSlider-markLabel': {
              color: '#C0D3CA',
              fontSize: '0.8rem'
            }
          }}
        />
      </Box>

      <Divider sx={{ backgroundColor: 'rgba(192, 211, 202, 0.2)', my: 3 }} />

      {/* Pocket Style */}
      <Box component={motion.div} variants={sectionVariants}>
        <Typography
          variant="h6"
          sx={{
            fontSize: '1.25rem',
            fontWeight: 500,
            color: '#C0D3CA',
            mb: 2,
            textAlign: 'center'
          }}
        >
          Pocket Style
        </Typography>
        
        {/* Pocket Orientation Toggle */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
          <Button
            onClick={() => handlePocketStyleChange(true)}
            variant={selectedPocketStyle ? 'contained' : 'outlined'}
            sx={{
              borderRadius: '12px',
              px: 3,
              py: 1,
              color: selectedPocketStyle ? '#000' : '#C0D3CA',
              backgroundColor: selectedPocketStyle ? '#C0D3CA' : 'transparent',
              borderColor: '#C0D3CA',
              '&:hover': {
                backgroundColor: selectedPocketStyle ? '#D0E3DA' : 'rgba(192, 211, 202, 0.1)'
              }
            }}
          >
            Straight
          </Button>
          <Button
            onClick={() => handlePocketStyleChange(false)}
            variant={!selectedPocketStyle ? 'contained' : 'outlined'}
            sx={{
              borderRadius: '12px',
              px: 3,
              py: 1,
              color: !selectedPocketStyle ? '#000' : '#C0D3CA',
              backgroundColor: !selectedPocketStyle ? '#C0D3CA' : 'transparent',
              borderColor: '#C0D3CA',
              '&:hover': {
                backgroundColor: !selectedPocketStyle ? '#D0E3DA' : 'rgba(192, 211, 202, 0.1)'
              }
            }}
          >
            Angled
          </Button>
        </Box>
        
        {/* Pocket Type Options */}
        <Grid container spacing={1.5} justifyContent="center">
          {(selectedPocketStyle ? pocketTypesStraight : pocketTypesCrooked).map((pocket) => (
            <Grid item key={pocket.name}>
              <OptionButton
                item={pocket}
                isSelected={selectedPacketType === pocket.name}
                onSelect={(item) => setSelectedPacketType(item.name)}
                size="small"
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default SuitDesign;

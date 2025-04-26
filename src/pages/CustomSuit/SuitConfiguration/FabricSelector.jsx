import React, { useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, useMediaQuery } from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { currentColorAtom, currentKindAtom, counterAtom } from '../../../Utils';
import { suitsColors } from "../../../consts/KindOfColors";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Custom components
import CustomAccordion from '../../../components/ui/Accordion';

const ColorButton = styled(Box)(({ theme, selected }) => ({
  backgroundSize: "cover",
  backgroundPosition: "center",
  width: "70px",
  height: "70px",
  borderRadius: "50%",
  cursor: "pointer",
  position: "relative",
  transition: "all 0.3s ease",
  border: selected ? "2px solid #C0D3CA" : "2px solid transparent",
  boxShadow: selected ? "0 5px 15px rgba(192, 211, 202, 0.3)" : "none",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
  },
  '@media (max-width: 600px)': {
    width: "50px",
    height: "50px",
  },
}));

const CheckIcon = styled(CheckCircleIcon)({
  position: "absolute",
  top: "-8px",
  right: "-8px",
  color: "#C0D3CA",
  backgroundColor: "#0a0a0a",
  borderRadius: "50%",
  padding: "2px",
  fontSize: "20px",
});

const FabricCard = styled(Card)(({ theme, selected }) => ({
  backgroundColor: selected ? 'rgba(192, 211, 202, 0.1)' : 'rgba(30, 30, 30, 0.6)',
  borderRadius: '4px',
  border: selected ? '1px solid rgba(192, 211, 202, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
  marginBottom: '10px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(192, 211, 202, 0.05)',
    transform: 'translateY(-2px)',
  },
}));

const FabricTitle = styled(Typography)({
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '1rem',
  fontWeight: 300,
  color: '#C0D3CA',
  marginBottom: '8px',
});

const FabricDescription = styled(Typography)({
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '0.8rem',
  fontWeight: 300,
  color: 'rgba(255, 255, 255, 0.7)',
});

const SectionTitle = styled(Typography)({
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '0.9rem',
  fontWeight: 400,
  letterSpacing: '0.05em',
  color: '#fff',
  marginBottom: '15px',
  textTransform: 'uppercase',
});

const ColorName = styled(Typography)({
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '0.8rem',
  fontWeight: 300,
  color: '#e0e0e0',
  marginTop: '8px',
  textAlign: 'center',
  letterSpacing: '0.05em',
  '@media (max-width: 600px)': {
    fontSize: '0.7rem',
  },
});

const fabrics = [
  { 
    id: 'kind1',
    name: 'Premium Wool',
    description: 'Luxurious 100% wool with excellent drape and natural wrinkle resistance.',
    price: '899'
  },
  {
    id: 'kind2',
    name: 'Wool-Silk Blend',
    description: 'Elegant blend with a subtle sheen and superior comfort.',
    price: '1199'
  },
  {
    id: 'kind3',
    name: 'Cashmere Blend',
    description: 'Exceptionally soft fabric with a luxurious hand feel and warmth.',
    price: '1499'
  },
  {
    id: 'kind4',
    name: 'Merino Wool',
    description: 'Fine, lightweight wool with natural stretch and breathability.',
    price: '1299'
  },
];

const FabricSelector = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [currentColor, setCurrentColor] = useAtom(currentColorAtom);
  const [currentKind, setCurrentKind] = useAtom(currentKindAtom);
  const [counterArray, setCounterArray] = useAtom(counterAtom);
  const [selectedColor, setSelectedColor] = useState(null);

  const handleColorClick = (color) => {
    setSelectedColor(color);
    setCurrentColor(color.colorName);
    // Update validation state
    const updatedCounter = [...counterArray];
    updatedCounter[0] = { step1Validated: true };
    setCounterArray(updatedCounter);
  };

  return (
    <Box>
      <CustomAccordion title="Fabric Type" initiallyOpen={true}>
        <Grid container spacing={2}>
          {fabrics.map((fabric, index) => (
            <Grid item xs={12} sm={6} key={fabric.id}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <FabricCard 
                  selected={currentKind === fabric.id}
                  onClick={() => setCurrentKind(fabric.id)}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <FabricTitle>{fabric.name}</FabricTitle>
                      <Typography color="#C0D3CA" fontWeight="500">
                        ${fabric.price}
                      </Typography>
                    </Box>
                    <FabricDescription>{fabric.description}</FabricDescription>
                  </CardContent>
                </FabricCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </CustomAccordion>

      <CustomAccordion title="Fabric Color" initiallyOpen={true}>
        <SectionTitle>Select Color</SectionTitle>
        <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
          {suitsColors.map((color, index) => (
            <Grid item key={color.colorId}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <ColorButton 
                    style={{ backgroundImage: `url(${color.color})` }}
                    selected={color.colorName === currentColor || selectedColor?.colorId === color.colorId}
                    onClick={() => handleColorClick(color)}
                  >
                    {(color.colorName === currentColor || selectedColor?.colorId === color.colorId) && (
                      <CheckIcon />
                    )}
                  </ColorButton>
                  <ColorName>
                    {color.name}
                  </ColorName>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </CustomAccordion>
    </Box>
  );
};

export default FabricSelector; 
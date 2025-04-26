import React, { useState } from 'react';
import { Box, Grid, Typography, Card, CardMedia, CardContent, useMediaQuery, Tab, Tabs } from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { 
  selectedInsideTypeAtom, 
  selectedButtonAtom, 
  selectedPoshetAtom, 
  selectedHolesButtonAtom,
  selectedHolesButtonUpAtom
} from '../../../Utils';

// Import the data constants
import { 
  imagesInsideUp, 
  imagesPoshet, 
  imageButton, 
  imagesHoles, 
  imagesHolesUp 
} from '../../../consts/KindOfColors';

// Import icons for categories
import inside from "/assets/kinds/insid.svg";
import poshet from "/assets/kinds/poshet.svg";
import button from "/assets/kinds/button.svg";
import holes from "/assets/kinds/AllSuit2.png";

// Custom components
import CustomAccordion from '../../../components/ui/Accordion';

const DetailCard = styled(Card)(({ theme, selected }) => ({
  backgroundColor: selected ? 'rgba(192, 211, 202, 0.1)' : 'rgba(30, 30, 30, 0.6)',
  borderRadius: '4px',
  border: selected ? '1px solid rgba(192, 211, 202, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: 'rgba(192, 211, 202, 0.05)',
    transform: 'translateY(-2px)',
  },
}));

const DetailImage = styled(CardMedia)(({ theme }) => ({
  height: '80px',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& img': {
    maxHeight: '100%',
    maxWidth: '100%',
    objectFit: 'contain',
  },
  '@media (max-width: 600px)': {
    height: '60px',
  },
}));

const DetailTitle = styled(Typography)({
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '0.75rem',
  fontWeight: 300,
  color: '#C0D3CA',
  textAlign: 'center',
});

const CategoryCard = styled(Card)(({ theme, selected }) => ({
  backgroundColor: selected ? 'rgba(192, 211, 202, 0.1)' : 'rgba(30, 30, 30, 0.6)',
  borderRadius: '4px',
  border: selected ? '1px solid rgba(192, 211, 202, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '10px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(192, 211, 202, 0.1)',
    transform: 'translateY(-3px)',
  }
}));

const CategoryImage = styled('img')({
  width: '70px',
  height: '70px',
  objectFit: 'contain',
  filter: 'brightness(0.9) contrast(1.1)',
  '@media (max-width: 600px)': {
    width: '50px',
    height: '50px',
  },
});

const CategoryTitle = styled(Typography)({
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '0.8rem',
  fontWeight: 400,
  color: '#e0e0e0',
  marginTop: '8px',
  textAlign: 'center',
  letterSpacing: '0.05em',
});

const ColorBox = styled(Box)(({ theme, selected }) => ({
  width: '35px',
  height: '35px',
  borderRadius: '4px',
  border: selected ? '2px solid #C0D3CA' : '1px solid rgba(255, 255, 255, 0.2)',
  cursor: 'pointer',
  boxShadow: selected ? '0 0 10px rgba(192, 211, 202, 0.5)' : 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 0 8px rgba(192, 211, 202, 0.4)',
  },
  '@media (max-width: 600px)': {
    width: '30px',
    height: '30px',
  },
}));

const FabricSwatch = styled(Box)(({ theme, selected }) => ({
  width: '70px',
  height: '70px',
  borderRadius: '4px',
  border: selected ? '2px solid #C0D3CA' : '1px solid rgba(255, 255, 255, 0.2)',
  overflow: 'hidden',
  cursor: 'pointer',
  boxShadow: selected ? '0 0 10px rgba(192, 211, 202, 0.5)' : 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 0 8px rgba(192, 211, 202, 0.4)',
  },
  '@media (max-width: 600px)': {
    width: '50px',
    height: '50px',
  },
}));

const FabricImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
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

const DetailsSelector = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [selectedInsideType, setSelectedInsideType] = useAtom(selectedInsideTypeAtom);
  const [selectedButton, setSelectedButton] = useAtom(selectedButtonAtom);
  const [selectedPoshet, setSelectedPoshet] = useAtom(selectedPoshetAtom);
  const [selectedHolesButton, setSelectedHolesButton] = useAtom(selectedHolesButtonAtom);
  const [selectedHolesButtonUp, setSelectedHolesButtonUp] = useAtom(selectedHolesButtonUpAtom);
  
  // Local state for detail category tab
  const [detailTab, setDetailTab] = useState(0);
  const [activeCategoryDetail, setActiveCategoryDetail] = useState(null);

  const handleDetailTabChange = (event, newValue) => {
    setDetailTab(newValue);
    setActiveCategoryDetail(null);
  };

  const categories = [
    { key: "imagesInsideUp", label: "Inner Lining", image: inside },
    { key: "imagesPoshet", label: "Pocket Square", image: poshet },
    { key: "imageButton", label: "Button Style", image: button },
    { key: "imagesHoles", label: "Button Holes", image: holes },
  ];

  const handleSelectInsideLining = (name) => {
    setSelectedInsideType(name);
  };

  const handleSelectButtonStyle = (name) => {
    setSelectedButton(name);
  };

  const handleSelectPocketSquare = (name) => {
    setSelectedPoshet(name);
  };

  const handleSelectButtonHoles = (name) => {
    setSelectedHolesButton(name);
  };

  const handleSelectButtonHolesUp = (name) => {
    setSelectedHolesButtonUp(name);
  };

  const handleCategoryClick = (key) => {
    setActiveCategoryDetail(key);
  };

  const renderCategoryContent = () => {
    switch (activeCategoryDetail) {
      case 'imagesInsideUp':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SectionTitle>Inner Lining Selection</SectionTitle>
            <Grid container spacing={2}>
              {imagesInsideUp.map((item, index) => (
                <Grid item key={item.name} xs={4} sm={3}>
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
                      <FabricSwatch 
                        selected={selectedInsideType === item.name}
                        onClick={() => handleSelectInsideLining(item.name)}
                      >
                        <FabricImage src={item.img} alt={item.name} />
                      </FabricSwatch>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontSize: '0.7rem', 
                          color: selectedInsideType === item.name ? '#C0D3CA' : 'rgba(255, 255, 255, 0.7)'
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        );
        
      case 'imagesPoshet':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SectionTitle>Pocket Square Selection</SectionTitle>
            <Grid container spacing={2}>
              {imagesPoshet.map((item, index) => (
                <Grid item key={item.name} xs={4} sm={3}>
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
                      <FabricSwatch 
                        selected={selectedPoshet === item.name}
                        onClick={() => handleSelectPocketSquare(item.name)}
                      >
                        <FabricImage src={item.img} alt={item.name} />
                      </FabricSwatch>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontSize: '0.7rem', 
                          color: selectedPoshet === item.name ? '#C0D3CA' : 'rgba(255, 255, 255, 0.7)'
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        );
        
      case 'imageButton':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SectionTitle>Button Style Selection</SectionTitle>
            <Grid container spacing={2}>
              {imageButton.map((item, index) => (
                <Grid item key={item.name} xs={4} sm={3}>
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
                      <FabricSwatch 
                        selected={selectedButton === item.name}
                        onClick={() => handleSelectButtonStyle(item.name)}
                      >
                        <FabricImage src={item.img} alt={item.name} />
                      </FabricSwatch>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontSize: '0.7rem', 
                          color: selectedButton === item.name ? '#C0D3CA' : 'rgba(255, 255, 255, 0.7)'
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        );
        
      case 'imagesHoles':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CustomAccordion title="Button Holes (Front)" initiallyOpen={true}>
              <Grid container spacing={2}>
                {imagesHoles.map((item, index) => (
                  <Grid item key={item.name} xs={3} sm={2}>
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
                        <ColorBox 
                          sx={{ backgroundColor: item.color }}
                          selected={selectedHolesButton === item.name}
                          onClick={() => handleSelectButtonHoles(item.name)}
                        />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontSize: '0.7rem', 
                            color: selectedHolesButton === item.name ? '#C0D3CA' : 'rgba(255, 255, 255, 0.7)'
                          }}
                        >
                          {item.name}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </CustomAccordion>
            
            <CustomAccordion title="Button Holes (Sleeve)" initiallyOpen={true}>
              <Grid container spacing={2}>
                {imagesHolesUp.map((item, index) => (
                  <Grid item key={item.name} xs={3} sm={2}>
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
                        <ColorBox 
                          sx={{ backgroundColor: item.color }}
                          selected={selectedHolesButtonUp === item.name}
                          onClick={() => handleSelectButtonHolesUp(item.name)}
                        />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontSize: '0.7rem', 
                            color: selectedHolesButtonUp === item.name ? '#C0D3CA' : 'rgba(255, 255, 255, 0.7)'
                          }}
                        >
                          {item.name}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </CustomAccordion>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Box>
      {activeCategoryDetail ? (
        <Box>
          <Box sx={{ display: 'flex', mb: 2 }}>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Typography 
                onClick={() => setActiveCategoryDetail(null)}
                sx={{ 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center',
                  color: '#C0D3CA',
                  fontFamily: "'Montserrat', sans-serif",
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                ← Back to Categories
              </Typography>
            </motion.div>
          </Box>
          {renderCategoryContent()}
        </Box>
      ) : (
        <Grid container spacing={2}>
          {categories.map((category, index) => (
            <Grid item xs={6} sm={3} key={category.key}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <CategoryCard
                  onClick={() => handleCategoryClick(category.key)}
                  selected={activeCategoryDetail === category.key}
                >
                  <CategoryImage src={category.image} alt={category.label} />
                  <CategoryTitle>{category.label}</CategoryTitle>
                </CategoryCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default DetailsSelector; 
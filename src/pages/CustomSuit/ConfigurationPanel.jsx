import React from 'react';
import { Box, Paper, Typography, Tabs, Tab, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/system';
import { useAtom } from 'jotai';
import { currentIndexAtom } from '../../Utils';

// Configuration components
import FabricSelector from './SuitConfiguration/FabricSelector';
import StyleSelector from './SuitConfiguration/StyleSelector';
import DetailsSelector from './SuitConfiguration/DetailsSelector';

const PanelContainer = styled(Paper)(({ theme }) => ({
  flex: '1 0 40%',
  backgroundColor: 'rgba(20, 20, 20, 0.8)',
  borderRadius: '4px',
  border: '1px solid rgba(192, 211, 202, 0.2)',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '80vh',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
}));

const StyledTabs = styled(Tabs)({
  marginBottom: '20px',
  '& .MuiTabs-indicator': {
    backgroundColor: '#C0D3CA',
  },
});

const StyledTab = styled(Tab)({
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '0.85rem',
  fontWeight: 300,
  letterSpacing: '0.05em',
  color: 'rgba(255, 255, 255, 0.7)',
  '&.Mui-selected': {
    color: '#C0D3CA',
  },
});

const ContentArea = styled(Box)({
  flex: 1,
  overflow: 'auto',
  scrollbarWidth: 'thin',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(192, 211, 202, 0.3)',
    borderRadius: '3px',
    '&:hover': {
      backgroundColor: 'rgba(192, 211, 202, 0.5)',
    }
  }
});

const ConfigurationPanel = () => {
  const [currentIndex, setCurrentIndex] = useAtom(currentIndexAtom);

  const handleChange = (event, newValue) => {
    setCurrentIndex(newValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      style={{ flex: '1 0 40%' }}
    >
      <PanelContainer>
        <StyledTabs
          value={currentIndex}
          onChange={handleChange}
          variant="fullWidth"
        >
          <StyledTab label="Fabric" />
          <StyledTab label="Style" />
          <StyledTab label="Details" />
        </StyledTabs>

        <Divider sx={{ backgroundColor: 'rgba(192, 211, 202, 0.2)', mb: 2 }} />

        <ContentArea>
          {currentIndex === 0 && <FabricSelector />}
          {currentIndex === 1 && <StyleSelector />}
          {currentIndex === 2 && <DetailsSelector />}
        </ContentArea>
      </PanelContainer>
    </motion.div>
  );
};

export default ConfigurationPanel; 
import React, { useState } from 'react';
import { Paper, Box, useMediaQuery } from '@mui/material';
import { styled } from '@mui/system';
import { useAtom } from 'jotai';
import { currentIndexAtom } from '../../Utils';
import MobileTab from '../../components/ui/MobileTab';
import BottomDrawer from '../../components/ui/BottomDrawer';

// Configuration components
import FabricSelector from './SuitConfiguration/FabricSelector';
import StyleSelector from './SuitConfiguration/StyleSelector';
import DetailsSelector from './SuitConfiguration/DetailsSelector';

// Icons
import PaletteIcon from '@mui/icons-material/Palette';
import StyleIcon from '@mui/icons-material/Style';
import TuneIcon from '@mui/icons-material/Tune';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const TabBarContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'space-around',
  backgroundColor: 'rgba(10, 10, 10, 0.95)',
  borderTop: '1px solid rgba(192, 211, 202, 0.2)',
  padding: '5px 0',
  boxShadow: '0 -5px 10px rgba(0, 0, 0, 0.2)',
}));

const CartButton = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: '80px',
  right: '20px',
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  backgroundColor: '#C0D3CA',
  color: '#0a0a0a',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
  zIndex: 999,
  cursor: 'pointer',
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    backgroundColor: '#d0e3da',
  },
}));

const MobileTabBar = () => {
  const [currentIndex, setCurrentIndex] = useAtom(currentIndexAtom);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const handleTabClick = (index) => {
    setCurrentIndex(index);
    setDrawerOpen(true);
  };
  
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };
  
  const getDrawerTitle = () => {
    switch (currentIndex) {
      case 0:
        return 'Select Fabric';
      case 1:
        return 'Customize Style';
      case 2:
        return 'Finishing Details';
      default:
        return '';
    }
  };
  
  const getDrawerContent = () => {
    switch (currentIndex) {
      case 0:
        return <FabricSelector />;
      case 1:
        return <StyleSelector />;
      case 2:
        return <DetailsSelector />;
      default:
        return null;
    }
  };

  return (
    <>
      <CartButton>
        <ShoppingCartIcon />
      </CartButton>
      
      <TabBarContainer elevation={3}>
        <MobileTab 
          icon={<PaletteIcon />} 
          label="Fabric" 
          active={currentIndex === 0} 
          onClick={() => handleTabClick(0)} 
        />
        <MobileTab 
          icon={<StyleIcon />} 
          label="Style" 
          active={currentIndex === 1} 
          onClick={() => handleTabClick(1)} 
        />
        <MobileTab 
          icon={<TuneIcon />} 
          label="Details" 
          active={currentIndex === 2} 
          onClick={() => handleTabClick(2)} 
        />
      </TabBarContainer>
      
      <BottomDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        title={getDrawerTitle()}
        height="60vh"
      >
        {getDrawerContent()}
      </BottomDrawer>
    </>
  );
};

export default MobileTabBar; 
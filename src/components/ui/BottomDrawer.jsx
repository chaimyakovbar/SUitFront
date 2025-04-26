import React from 'react';
import { Drawer, Box, IconButton, Typography, Divider } from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DragHandleIcon from '@mui/icons-material/DragHandle';

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 16px',
  backgroundColor: '#121212',
  borderBottom: '1px solid rgba(192, 211, 202, 0.2)',
}));

const DrawerTitle = styled(Typography)({
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '1.2rem',
  fontWeight: 300,
  color: '#C0D3CA',
  letterSpacing: '0.05em',
});

const DrawerContent = styled(Box)(({ theme }) => ({
  padding: '16px',
  overflowY: 'auto',
  backgroundColor: '#0a0a0a',
  height: '100%',
  scrollbarWidth: 'thin',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(192, 211, 202, 0.3)',
    borderRadius: '4px',
  },
}));

const DragHandle = styled(Box)({
  width: '40px',
  height: '4px',
  borderRadius: '2px',
  backgroundColor: 'rgba(192, 211, 202, 0.3)',
  margin: '10px auto',
});

const BottomDrawer = ({ 
  open, 
  onClose, 
  title, 
  children, 
  height = '50vh', 
  fullHeight = false 
}) => {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          maxHeight: fullHeight ? '100vh' : height,
          borderTopLeftRadius: '15px',
          borderTopRightRadius: '15px',
          border: 'none',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'none',
          overflow: 'visible',
        },
      }}
    >
      <DragHandle />
      <DrawerHeader>
        <DrawerTitle>{title}</DrawerTitle>
        <IconButton onClick={onClose} sx={{ color: '#C0D3CA' }} size="small">
          <CloseIcon />
        </IconButton>
      </DrawerHeader>
      <DrawerContent>
        {children}
      </DrawerContent>
    </Drawer>
  );
};

export default BottomDrawer; 
import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/system';

const TabContainer = styled(Box)(({ theme, active }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 5px',
  minWidth: '70px',
  cursor: 'pointer',
  position: 'relative',
  color: active ? '#C0D3CA' : 'rgba(255, 255, 255, 0.6)',
  transition: 'all 0.3s',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '20%',
    width: active ? '60%' : '0%',
    height: '2px',
    backgroundColor: '#C0D3CA',
    transition: 'all 0.3s ease'
  },
  '&:hover': {
    color: '#C0D3CA',
  }
}));

const TabLabel = styled(Typography)({
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '0.75rem',
  marginTop: '4px',
  fontWeight: 300,
  textAlign: 'center',
  whiteSpace: 'nowrap',
  letterSpacing: '0.03em'
});

const MobileTab = ({ icon, label, active, onClick }) => {
  return (
    <TabContainer active={active} onClick={onClick}>
      <IconButton 
        sx={{ 
          color: 'inherit', 
          p: 0.5,
          '&:hover': {
            backgroundColor: 'transparent'
          }
        }}
        disableRipple
      >
        {icon}
      </IconButton>
      <TabLabel variant="caption">
        {label}
      </TabLabel>
    </TabContainer>
  );
};

export default MobileTab; 
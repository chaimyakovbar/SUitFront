import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingFallback = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#F5F5F7',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingFallback;

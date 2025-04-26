import React from 'react';
import { Box, Paper, Typography, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/system';
import ImageFilterComponent from '../../components/ImageCollector';
import { useAtomValue } from 'jotai';
import { priceAllSuitAtom } from '../../Utils';

const PreviewContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(30, 30, 30, 0.4)',
  borderRadius: '4px',
  border: '1px solid rgba(192, 211, 202, 0.2)',
  padding: '20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  height: '100%',
  minHeight: '500px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
  '@media (max-width: 600px)': {
    padding: '10px',
    minHeight: '350px',
  },
}));

const PriceTag = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: '16px',
  bottom: '16px',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '4px',
  zIndex: 100,
  fontSize: '1.2rem',
  fontWeight: 'bold',
  fontFamily: "'Montserrat', sans-serif",
  '@media (max-width: 600px)': {
    fontSize: '1rem',
    padding: '6px 12px',
    right: '10px',
    bottom: '10px',
  },
}));

const SuitPreview = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const totalPrice = useAtomValue(priceAllSuitAtom);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      style={{ height: '100%' }}
    >
      <PreviewContainer elevation={3}>
        <ImageFilterComponent />
        <PriceTag>
          ${totalPrice}
        </PriceTag>
      </PreviewContainer>
    </motion.div>
  );
};

export default SuitPreview; 
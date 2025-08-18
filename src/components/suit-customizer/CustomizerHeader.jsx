import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const CustomizerHeader = () => {
  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.2 }
    }
  };

  return (
    <Box
      sx={{
        textAlign: 'center',
        position: 'relative',
        marginTop: '25px',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-16px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #C0D3CA, transparent)',
          borderRadius: '1px'
        }
      }}
    >
      {/* <Typography
        component={motion.h1}
        variants={titleVariants}
        sx={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
          fontWeight: 300,
          background: 'linear-gradient(135deg, #ffffff 0%, #C0D3CA 50%, #ffffff 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundSize: '200% 200%',
          animation: 'shimmer 3s ease-in-out infinite',
          letterSpacing: '0.02em',
          lineHeight: 1.2,
          mb: 2,
          '@keyframes shimmer': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' }
          }
        }}
      >
        Craft Your Perfect Suit
      </Typography>
      
      <Typography
        component={motion.p}
        variants={subtitleVariants}
        sx={{
          fontFamily: "'Inter', sans-serif",
          fontSize: { xs: '1rem', md: '1.125rem' },
          fontWeight: 300,
          color: 'rgba(192, 211, 202, 0.9)',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: 1.6,
          letterSpacing: '0.01em'
        }}
      >
        Design a bespoke suit tailored to your exact specifications.
        <br />
        Choose premium fabrics, customize every detail, and achieve the perfect fit.
      </Typography> */}
    </Box>
  );
};

export default CustomizerHeader;

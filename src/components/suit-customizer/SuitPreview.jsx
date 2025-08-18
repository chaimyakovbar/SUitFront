import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import ImageFilterComponent from '../ImageCollector';
import ImageFilterComponentForPants from '../ImageCollectorForPants';

const SuitPreview = ({ isPantsMode, isMobile }) => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const previewVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        delay: 0.2
      }
    }
  };

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxWidth: { xs: '100%', md: '600px' },
        mx: 'auto'
      }}
    >
      {/* Preview Container with Elegant Border */}
      <Box
        component={motion.div}
        variants={previewVariants}
        sx={{
          position: 'relative',
          background: isMobile 
            ? 'transparent'
            : 'linear-gradient(135deg, rgba(30, 30, 30, 0.4) 0%, rgba(20, 20, 20, 0.6) 100%)',
          backdropFilter: isMobile ? 'none' : 'blur(20px)',
          border: isMobile 
            ? 'none' 
            : '1px solid rgba(192, 211, 202, 0.15)',
          borderRadius: isMobile ? '0' : '32px',
          padding: isMobile ? '0' : '24px',
          boxShadow: isMobile 
            ? 'none'
            : '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          '&::before': !isMobile ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(192, 211, 202, 0.03) 0%, transparent 50%, rgba(192, 211, 202, 0.02) 100%)',
            pointerEvents: 'none',
            borderRadius: 'inherit'
          } : {},
          // Subtle glow effect
          '&::after': !isMobile ? {
            content: '""',
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            right: '-2px',
            bottom: '-2px',
            background: 'linear-gradient(45deg, transparent, rgba(192, 211, 202, 0.1), transparent)',
            borderRadius: 'inherit',
            zIndex: -1,
            opacity: 0.5
          } : {}
        }}
      >
        {/* Suit/Pants Display */}
        <Box
          sx={{
            position: 'relative',
            borderRadius: isMobile ? '16px' : '20px',
            overflow: 'hidden',
            background: isMobile 
              ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.3) 0%, rgba(20, 20, 20, 0.5) 100%)'
              : 'transparent',
            boxShadow: isMobile 
              ? '0 8px 32px rgba(0, 0, 0, 0.3)'
              : 'none'
          }}
        >
          <motion.div
            key={isPantsMode ? 'pants' : 'suit'}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {isPantsMode ? (
              <ImageFilterComponentForPants />
            ) : (
              <ImageFilterComponent />
            )}
          </motion.div>
        </Box>

        {/* Floating Elements for Visual Interest */}
        {!isMobile && (
          <>
            <Box
              sx={{
                position: 'absolute',
                top: '10%',
                right: '10%',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'rgba(192, 211, 202, 0.6)',
                animation: 'float 3s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                  '50%': { transform: 'translateY(-10px) rotate(180deg)' }
                }
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: '15%',
                left: '15%',
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                background: 'rgba(192, 211, 202, 0.4)',
                animation: 'float 4s ease-in-out infinite reverse',
              }}
            />
          </>
        )}
      </Box>

      {/* Mobile: Additional subtle frame */}
      {isMobile && (
        <Box
          sx={{
            position: 'absolute',
            top: '-8px',
            left: '-8px',
            right: '-8px',
            bottom: '-8px',
            border: '1px solid rgba(192, 211, 202, 0.1)',
            borderRadius: '24px',
            pointerEvents: 'none'
          }}
        />
      )}
    </Box>
  );
};

export default SuitPreview;

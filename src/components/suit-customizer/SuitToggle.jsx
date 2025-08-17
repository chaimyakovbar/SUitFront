import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const SuitToggle = ({ isPantsMode, onToggle, mobile }) => {
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    tap: { scale: 0.95 }
  };

  const iconVariants = {
    suit: { 
      opacity: isPantsMode ? 0.4 : 1,
      scale: isPantsMode ? 0.8 : 1,
      rotate: isPantsMode ? -5 : 0
    },
    pants: { 
      opacity: isPantsMode ? 1 : 0.4,
      scale: isPantsMode ? 1 : 0.8,
      rotate: isPantsMode ? 0 : 5
    }
  };

  return (
    <Box
      component={motion.div}
      variants={buttonVariants}
      initial="hidden"
      animate="visible"
      sx={{
        position: 'absolute',
        top: mobile ? '20px' : '24px',
        right: mobile ? '20px' : '32px',
        zIndex: 1000
      }}
    >
      <Tooltip 
        title={`Switch to ${isPantsMode ? 'Suit' : 'Pants'} View`}
        placement="left"
        arrow
      >
        <IconButton
          component={motion.button}
          variants={buttonVariants}
          whileTap="tap"
          onClick={onToggle}
          sx={{
            width: { xs: 56, md: 64 },
            height: { xs: 56, md: 64 },
            background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(20, 20, 20, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(192, 211, 202, 0.2)',
            borderRadius: '50%',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(40, 40, 40, 0.8) 0%, rgba(30, 30, 30, 0.9) 100%)',
              border: '1px solid rgba(192, 211, 202, 0.4)',
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
            }
          }}
        >
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <AnimatePresence mode="wait">
              {isPantsMode ? (
                <motion.img
                  key="suit-icon"
                  variants={iconVariants.suit}
                  animate="suit"
                  exit={{ opacity: 0, scale: 0.5, rotate: -10 }}
                  transition={{ duration: 0.2 }}
                  src="/assets/kinds/kind2.png"
                  alt="Switch to Suit"
                  style={{
                    width: mobile ? '28px' : '32px',
                    height: mobile ? '35px' : '40px',
                    filter: 'brightness(0) invert(1)',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <motion.img
                  key="pants-icon"
                  variants={iconVariants.pants}
                  animate="pants"
                  exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                  transition={{ duration: 0.2 }}
                  src="/assets/kinds/pantsIcon.svg"
                  alt="Switch to Pants"
                  style={{
                    width: mobile ? '28px' : '32px',
                    height: mobile ? '35px' : '40px',
                    filter: 'brightness(0) invert(1)',
                    objectFit: 'contain'
                  }}
                />
              )}
            </AnimatePresence>

            {/* Subtle indicator dot */}
            <Box
              sx={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: isPantsMode 
                  ? 'linear-gradient(135deg, #FF6B6B, #FF5252)'
                  : 'linear-gradient(135deg, #4CAF50, #45a049)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(20, 20, 20, 0.8)'
              }}
            />
          </Box>
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default SuitToggle;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AccordionContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  borderRadius: '4px',
  overflow: 'hidden',
  backgroundColor: 'rgba(20, 20, 20, 0.8)',
  border: '1px solid rgba(192, 211, 202, 0.2)',
  marginBottom: '10px',
}));

const AccordionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  cursor: 'pointer',
  userSelect: 'none',
}));

const AccordionTitle = styled(Typography)({
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '1.1rem',
  fontWeight: 300,
  color: '#C0D3CA',
  letterSpacing: '0.05em',
});

const AccordionContent = styled(motion.div)(({ theme }) => ({
  padding: '0 16px 16px',
}));

const CustomAccordion = ({ title, children, initiallyOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <AccordionContainer>
      <AccordionHeader onClick={toggleAccordion}>
        <AccordionTitle variant="h6">{title}</AccordionTitle>
        <IconButton
          component={motion.button}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          sx={{ color: '#C0D3CA', padding: '4px' }}
          size="small"
        >
          <ExpandMoreIcon />
        </IconButton>
      </AccordionHeader>

      <AnimatePresence>
        {isOpen && (
          <AccordionContent
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </AccordionContent>
        )}
      </AnimatePresence>
    </AccordionContainer>
  );
};

export default CustomAccordion; 
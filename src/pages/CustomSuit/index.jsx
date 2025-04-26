import React, { useState } from 'react';
import { Box, Container, Typography, Divider, useMediaQuery, Fab } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/system';
import { useAtom } from 'jotai';
import { currentIndexAtom } from '../../Utils';

// Custom components
import SuitPreview from './SuitPreview';
import ConfigurationPanel from './ConfigurationPanel';
import MobileTabBar from './MobileTabBar';
import Stepper2 from '../../components/Stepper';

// Icons
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

const PageContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#0a0a0a',
  color: '#fff',
  minHeight: '100vh',
  paddingTop: '80px',
  paddingBottom: '80px', // Extra space for bottom navigation on mobile
}));

const MainHeading = styled(Typography)({
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '2.5rem',
  fontWeight: 300,
  marginBottom: '1rem',
  letterSpacing: '0.05em',
  textAlign: 'center',
  '@media (max-width: 600px)': {
    fontSize: '1.8rem',
  },
});

const Subheading = styled(Typography)({
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '0.9rem',
  fontWeight: 300,
  marginBottom: '2rem',
  letterSpacing: '0.05em',
  color: '#C0D3CA',
  textAlign: 'center',
  maxWidth: '600px',
  margin: '0 auto 2rem',
  '@media (max-width: 600px)': {
    fontSize: '0.8rem',
    padding: '0 16px',
  },
});

const ContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  position: 'relative',
  minHeight: '70vh',
  gap: '20px',
  '@media (max-width: 900px)': {
    flexDirection: 'column',
  },
}));

const PreviewSection = styled(Box)(({ theme, expanded }) => ({
  flex: expanded ? '1 0 100%' : '1 0 55%',
  position: 'relative',
  transition: 'all 0.3s ease',
  '@media (max-width: 900px)': {
    flex: '1 0 auto',
    height: '50vh',
  },
}));

const ExpandButton = styled(Fab)(({ theme }) => ({
  position: 'absolute',
  bottom: '16px',
  right: '16px',
  backgroundColor: 'rgba(20, 20, 20, 0.8)',
  color: '#C0D3CA',
  zIndex: 10,
  '&:hover': {
    backgroundColor: 'rgba(40, 40, 40, 0.9)',
  },
}));

const CustomSuit = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const [currentIndex, setCurrentIndex] = useAtom(currentIndexAtom);
  const [previewExpanded, setPreviewExpanded] = useState(false);

  const togglePreviewExpansion = () => {
    setPreviewExpanded(!previewExpanded);
  };

  return (
    <PageContainer>
      <Container maxWidth="lg">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <MainHeading variant="h1">
            Design Your Custom Suit
          </MainHeading>
          <Subheading variant="body1">
            Create a bespoke suit tailored to your exact preferences. Select from premium fabrics, 
            customize every detail, and achieve the perfect fit.
          </Subheading>
        </motion.div>
        
        <Divider sx={{ 
          backgroundColor: 'rgba(192, 211, 202, 0.2)', 
          margin: '2rem 0',
        }} />
        
        <ContentWrapper>
          <PreviewSection expanded={previewExpanded}>
            <SuitPreview />
            <ExpandButton 
              size="small" 
              onClick={togglePreviewExpansion}
              aria-label="Expand preview"
            >
              <ZoomOutMapIcon fontSize="small" />
            </ExpandButton>
          </PreviewSection>
          
          {!previewExpanded && !isMobile && (
            <ConfigurationPanel />
          )}
        </ContentWrapper>
      </Container>
      
      {isMobile && <MobileTabBar />}
      <Stepper2 />
    </PageContainer>
  );
};

export default CustomSuit; 
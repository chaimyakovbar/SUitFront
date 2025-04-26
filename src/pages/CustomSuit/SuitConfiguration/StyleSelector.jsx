import React, { useState } from 'react';
import { Box, Typography, Button, Divider, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { 
  currentKindAtom,
  selectedCollarAtom, 
  selectedLapelTypeAtom, 
  selectedPacketTypeAtom 
} from '../../../Utils';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Import style images
import wide from "/assets/kinds/wide.png";
import slim from "/assets/kinds/slim.png";
import standard from "/assets/kinds/standard.png";
import kind1Img from "/assets/kinds/kind1.png";
import kind2Img from "/assets/kinds/kind2.png";
import kind3Img from "/assets/kinds/kind3.png";
import kind4Img from "/assets/kinds/kind4.png";
import collarTight from "/assets/kinds/collarTight.png";
import collarDistant from "/assets/kinds/collarDistant.png";
import packet1 from "/assets/kinds/1.png";
import packet2 from "/assets/kinds/2.png";
import packet3 from "/assets/kinds/3.png";

// Custom components
import CustomAccordion from '../../../components/ui/Accordion';

const SectionTitle = styled(Typography)({
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '1.3rem',
  fontWeight: 300,
  marginBottom: '1rem',
  color: '#C0D3CA',
  textAlign: 'center',
  letterSpacing: '0.05em',
});

const OptionsContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  justifyContent: 'center',
  marginBottom: '20px',
});

const OptionButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'selected'
})(({ theme, selected }) => ({
  backgroundColor: selected ? 'rgba(192, 211, 202, 0.1)' : 'rgba(30, 30, 30, 0.6)',
  border: selected ? '1px solid rgba(192, 211, 202, 0.5)' : '1px solid rgba(192, 211, 202, 0.2)',
  borderRadius: '4px',
  padding: '8px',
  position: 'relative',
  transition: 'all 0.3s ease',
  boxShadow: selected ? '0 5px 15px rgba(0, 0, 0, 0.2)' : 'none',
  '&:hover': {
    backgroundColor: 'rgba(192, 211, 202, 0.1)',
    transform: 'translateY(-3px)',
  },
}));

const OptionImage = styled('img')({
  height: '50px',
  width: 'auto',
  objectFit: 'contain',
  filter: 'brightness(0.9) contrast(1.1)',
});

const CheckIcon = styled(CheckCircleIcon)({
  position: 'absolute',
  top: '-8px',
  right: '-8px',
  color: '#C0D3CA',
  backgroundColor: '#0a0a0a',
  borderRadius: '50%',
  padding: '2px',
  fontSize: '20px',
});

const StyledDivider = styled(Divider)({
  backgroundColor: 'rgba(192, 211, 202, 0.2)',
  margin: '1.5rem 0',
});

const StyleSelector = () => {
  const [selectedKind, setSelectedKind] = useState(null);
  const [currentKind, setCurrentKind] = useAtom(currentKindAtom);
  const [selectedCollar, setSelectedCollar] = useAtom(selectedCollarAtom);
  const [selectedLapelType, setSelectedLapelType] = useAtom(selectedLapelTypeAtom);
  const [selectedPacketType, setSelectedPacketType] = useAtom(selectedPacketTypeAtom);

  // Define style options
  const suitKinds = [
    { name: "kind1", image: kind1Img },
    { name: "kind2", image: kind2Img },
    { name: "kind3", image: kind3Img },
    { name: "kind4", image: kind4Img },
  ];

  const lapelKinds = [
    { name: "collarTight", image: collarTight },
    { name: "collarDistant", image: collarDistant },
  ];

  const collarTypes = [
    { name: "Slim", image: slim },
    { name: "Standard", image: standard },
    { name: "Wide", image: wide },
  ];

  const packetTypes = [
    { name: "packet1", image: packet1 },
    { name: "packet2", image: packet2 },
    { name: "packet3", image: packet3 },
  ];

  const handleSuitKindSelect = (kind) => {
    setCurrentKind(kind);
    setSelectedKind(kind);
  };

  return (
    <Box>
      <CustomAccordion title="Suit Type" initiallyOpen={true}>
        <OptionsContainer>
          {suitKinds.map((kind, index) => (
            <motion.div
              key={kind.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <OptionButton
                onClick={() => handleSuitKindSelect(kind.name)}
                selected={selectedKind === kind.name || currentKind === kind.name}
              >
                <OptionImage src={kind.image} alt={kind.name} />
                {(selectedKind === kind.name || currentKind === kind.name) && (
                  <CheckIcon />
                )}
              </OptionButton>
            </motion.div>
          ))}
        </OptionsContainer>
      </CustomAccordion>

      <CustomAccordion title="Collar Style" initiallyOpen={true}>
        <OptionsContainer>
          {lapelKinds.map((kind, index) => (
            <motion.div
              key={kind.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
            >
              <OptionButton
                onClick={() => setSelectedCollar(kind.name)}
                selected={selectedCollar === kind.name}
              >
                <OptionImage src={kind.image} alt={kind.name} />
                {selectedCollar === kind.name && <CheckIcon />}
              </OptionButton>
            </motion.div>
          ))}
        </OptionsContainer>
      </CustomAccordion>

      <CustomAccordion title="Lapel Type" initiallyOpen={true}>
        <OptionsContainer>
          {collarTypes.map((kind, index) => (
            <motion.div
              key={kind.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
            >
              <OptionButton
                onClick={() => setSelectedLapelType(kind.name)}
                selected={selectedLapelType === kind.name}
              >
                <OptionImage src={kind.image} alt={kind.name} />
                {selectedLapelType === kind.name && <CheckIcon />}
              </OptionButton>
            </motion.div>
          ))}
        </OptionsContainer>
      </CustomAccordion>

      <CustomAccordion title="Pocket Style" initiallyOpen={true}>
        <OptionsContainer>
          {packetTypes.map((kind, index) => (
            <motion.div
              key={kind.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
            >
              <OptionButton
                onClick={() => setSelectedPacketType(kind.name)}
                selected={selectedPacketType === kind.name}
              >
                <OptionImage src={kind.image} alt={kind.name} />
                {selectedPacketType === kind.name && <CheckIcon />}
              </OptionButton>
            </motion.div>
          ))}
        </OptionsContainer>
      </CustomAccordion>
    </Box>
  );
};

export default StyleSelector; 
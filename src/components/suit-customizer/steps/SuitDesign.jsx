import React, { useCallback, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Slider,
  Divider,
  Grid,
  Drawer,
} from "@mui/material";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { useLanguage } from "../../../context/LanguageContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
  currentKindAtom,
  selectedCollarAtom,
  selectedLapelTypeAtom,
  selectedPacketTypeAtom,
  selectedKindTypeAtom,
  counterAtom,
} from "../../../Utils";

// S3 Assets URLs
// const S3_BASE_URL = "https://ch-suits.s3.us-east-1.amazonaws.com";

import kind1Img from "../../../assets/icons/suit/suitsKind/kind1.webp";
import kind2Img from "../../../assets/icons/suit/suitsKind/kind2.webp";
import kind3Img from "../../../assets/icons/suit/suitsKind/kind3.webp";
import kind4Img from "../../../assets/icons/suit/suitsKind/kind4.webp";

// Collar images
import collarTight from "../../../assets/icons/suit/lapels/regular.webp";
import collarDistant from "../../../assets/icons/suit/lapels/peak.webp";
import collarSmook from "../../../assets/icons/suit/lapels/smook.webp";

// Packet images
import packet1 from "../../../assets/icons/suit/packets/patch.webp";
import packet2 from "../../../assets/icons/suit/packets/regular.webp";
import packet3 from "../../../assets/icons/suit/packets/welt.webp";

// Helper function to get translated labels
const getSuitTypes = (t) => [
  { name: "kind1", image: kind1Img, label: t("classicSingle") },
  { name: "kind2", image: kind2Img, label: t("modernDouble") },
  { name: "kind3", image: kind3Img, label: t("contemporary") },
  { name: "kind4", image: kind4Img, label: t("traditional") },
];

const getCollarStyles = (t) => [
  { name: "collarTight", image: collarTight, label: t("narrowLapel") },
  { name: "collarDistant", image: collarDistant, label: t("wideLapel") },
  { name: "collarCircel", image: collarSmook, label: t("roundedLapel") },
];

const getLapelLevels = (t) => [
  { value: 1, label: t("slim"), name: "Slim" },
  { value: 2, label: t("standard"), name: "Standard" },
  { value: 3, label: t("wide"), name: "Wide" },
  { value: 4, label: t("extraWide"), name: "Extra Wide" },
];

const getPocketTypesStraight = (t) => [
  { name: "packet1", image: packet1, label: t("classic") },
  { name: "packet2", image: packet2, label: t("modern") },
  { name: "packet3", image: packet3, label: t("elegant") },
  { name: "packet4", image: packet1, label: t("traditional") },
  { name: "packet5", image: packet2, label: t("contemporary") },
];

const getPocketTypesCrooked = (t) => [
  { name: "packet1", image: packet1, label: t("angledClassic") },
  { name: "packet2", image: packet2, label: t("angledModern") },
  { name: "packet4", image: packet1, label: t("angledTraditional") },
  { name: "packet5", image: packet2, label: t("angledContemporary") },
];

// Animation variants (module scope for reuse)
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
};

const OptionButton = React.memo(
  function OptionButton({ item, isSelected, onSelectName, size = "medium" }) {
    const handleClick = useCallback(
      () => onSelectName(item.name),
      [onSelectName, item.name]
    );
    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Box
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleClick();
            }
          }}
          sx={{
            position: "relative",
            cursor: "pointer",
            borderRadius: "12px",
            border: isSelected
              ? "2px solid #C0D3CA"
              : "1px solid rgba(192, 211, 202, 0.2)",
            background: "rgba(30, 30, 30, 0.6)",
            transition: "all 0.3s ease",
            boxShadow: isSelected
              ? "0 8px 24px rgba(192, 211, 202, 0.3)"
              : "0 4px 12px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
            "&:hover": {
              border: "2px solid rgba(192, 211, 202, 0.5)",
              background: "rgba(192, 211, 202, 0.1)",
            },
          }}
        >
          <Box
            sx={{
              width:
                size === "small" ? { xs: 60, md: 80 } : { xs: 80, md: 100 },
              height:
                size === "small" ? { xs: 60, md: 80 } : { xs: 80, md: 100 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1,
            }}
          >
            <img
              src={item.image}
              alt={item.label}
              width={size === "small" ? 80 : 100}
              height={size === "small" ? 80 : 100}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                aspectRatio: "1 / 1",
                filter:
                  "brightness(0.8) contrast(1.5) invert(1) sepia() saturate(0) hue-rotate(0deg)",
              }}
              loading="lazy"
              decoding="async"
            />
          </Box>

          {isSelected && (
            <Box
              component={motion.div}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "#C0D3CA",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 16, color: "#000" }} />
            </Box>
          )}

          <Typography
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(transparent, rgba(0, 0, 0, 0.8))",
              color: "#fff",
              fontSize: { xs: "0.7rem", md: "0.8rem" },
              fontWeight: 500,
              textAlign: "center",
              py: 0.5,
              px: 0.5,
            }}
          >
            {item.label}
          </Typography>
        </Box>
      </motion.div>
    );
  },
  (prev, next) =>
    prev.isSelected === next.isSelected &&
    prev.item === next.item &&
    prev.size === next.size &&
    prev.onSelectName === next.onSelectName
);

const SuitDesign = ({ isMobile }) => {
  const { t } = useLanguage();
  const [selectedKind, setSelectedKind] = useAtom(currentKindAtom);
  const [selectedCollar, setSelectedCollar] = useAtom(selectedCollarAtom);
  const [selectedLapelType, setSelectedLapelType] = useAtom(
    selectedLapelTypeAtom
  );
  const [selectedPacketType, setSelectedPacketType] = useAtom(
    selectedPacketTypeAtom
  );
  const [, setSelectedKindType] = useAtom(selectedKindTypeAtom);
  const [, setCounterArray] = useAtom(counterAtom);

  const [selectedPocketStyle, setSelectedPocketStyle] = useState(true); // true = straight, false = crooked
  const [isTypeDrawerOpen, setIsTypeDrawerOpen] = useState(false);
  const [isCollarDrawerOpen, setIsCollarDrawerOpen] = useState(false);
  const [isPocketDrawerOpen, setIsPocketDrawerOpen] = useState(false);

  // Validate step whenever selections change
  React.useEffect(() => {
    if (
      selectedKind &&
      selectedCollar &&
      selectedLapelType &&
      selectedPacketType
    ) {
      setCounterArray((prevCounterArray) => {
        // Check if already validated to prevent unnecessary updates
        if (prevCounterArray[1]?.step2Validated) {
          return prevCounterArray;
        }
        const newCounterArray = [...prevCounterArray];
        newCounterArray[1] = { ...newCounterArray[1], step2Validated: true };
        return newCounterArray;
      });
    }
  }, [
    selectedKind,
    selectedCollar,
    selectedLapelType,
    selectedPacketType,
    setCounterArray,
  ]);

  const suitTypes = getSuitTypes(t);
  const collarStyles = getCollarStyles(t);
  const lapelLevels = getLapelLevels(t);
  const pocketTypesStraight = getPocketTypesStraight(t);
  const pocketTypesCrooked = getPocketTypesCrooked(t);

  const handlePocketStyleChange = (isStraight) => {
    setSelectedPocketStyle(isStraight);
    setSelectedKindType(isStraight ? "packetBottom" : "packetSide");
    if (!isStraight) {
      setSelectedPacketType("packet1");
    }
  };

  // variants moved to module scope

  // Stable handlers for selection
  const handleSelectKind = useCallback(
    (name) => setSelectedKind(name),
    [setSelectedKind]
  );
  const handleSelectCollar = useCallback(
    (name) => setSelectedCollar(name),
    [setSelectedCollar]
  );
  const handleSelectPacket = useCallback(
    (name) => setSelectedPacketType(name),
    [setSelectedPacketType]
  );

  // Mobile horizontal layout
  if (isMobile) {
    return (
      <Box
        component={motion.div}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          gap: 4,
          minWidth: "fit-content",
        }}
      >
        {/* Suit Type Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setIsTypeDrawerOpen(true)}
              sx={{
                position: "relative",
                borderRadius: "12px",
                px: 2,
                py: 1,
                color: "#C0D3CA",
                borderColor: "#C0D3CA",
                "&:hover": { backgroundColor: "rgba(192, 211, 202, 0.1)" },
                width: { xs: 100, md: 120 },
                height: { xs: 100, md: 120 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 1,
                overflow: "hidden",
              }}
            >
              <img
                src={
                  selectedKind
                    ? suitTypes.find((type) => type.name === selectedKind)
                        ?.image || suitTypes[0].image
                    : suitTypes[0].image
                }
                alt="Selected suit kind"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  aspectRatio: "1 / 1",
                  filter:
                    "brightness(0.8) contrast(1.5) invert(1) sepia() saturate(0) hue-rotate(0deg)",
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{
                  position: "absolute",
                  top: 4,
                  left: 0,
                  right: 0,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#C0D3CA",
                  textAlign: "center",
                  background:
                    "linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent)",
                  py: 0.5,
                  px: 1,
                }}
              >
                Suit Kind
              </Typography>
            </Button>
          </Box>
        </Box>

        {/* Collar Style Section → replaced with single button */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setIsCollarDrawerOpen(true)}
              sx={{
                position: "relative",
                borderRadius: "12px",
                px: 2,
                py: 1,
                color: "#C0D3CA",
                borderColor: "#C0D3CA",
                "&:hover": { backgroundColor: "rgba(192, 211, 202, 0.1)" },
                width: { xs: 100, md: 120 },
                height: { xs: 100, md: 120 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 1,
                overflow: "hidden",
              }}
            >
              <img
                src={
                  selectedCollar
                    ? collarStyles.find(
                        (style) => style.name === selectedCollar
                      )?.image || collarStyles[0].image
                    : collarStyles[0].image
                }
                alt="Selected lapel style"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  aspectRatio: "1 / 1",
                  filter:
                    "brightness(0.8) contrast(1.5) invert(1) sepia() saturate(0) hue-rotate(0deg)",
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{
                  position: "absolute",
                  top: 4,
                  left: 0,
                  right: 0,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#C0D3CA",
                  textAlign: "center",
                  background:
                    "linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent)",
                  py: 0.5,
                  px: 1,
                }}
              >
                Lapel
              </Typography>
            </Button>
          </Box>
        </Box>

        {/* Pocket Style Section → replaced with single button */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setIsPocketDrawerOpen(true)}
              sx={{
                position: "relative",
                borderRadius: "12px",
                px: 2,
                py: 1,
                color: "#C0D3CA",
                borderColor: "#C0D3CA",
                "&:hover": { backgroundColor: "rgba(192, 211, 202, 0.1)" },
                width: { xs: 100, md: 120 },
                height: { xs: 100, md: 120 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 1,
                overflow: "hidden",
              }}
            >
              <img
                src={
                  selectedPacketType
                    ? (selectedPocketStyle
                        ? pocketTypesStraight
                        : pocketTypesCrooked
                      ).find((pocket) => pocket.name === selectedPacketType)
                        ?.image ||
                      (selectedPocketStyle
                        ? pocketTypesStraight
                        : pocketTypesCrooked)[0].image
                    : (selectedPocketStyle
                        ? pocketTypesStraight
                        : pocketTypesCrooked)[0].image
                }
                alt="Selected pocket style"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  aspectRatio: "1 / 1",
                  filter:
                    "brightness(0.8) contrast(1.5) invert(1) sepia() saturate(0) hue-rotate(0deg)",
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{
                  position: "absolute",
                  top: 4,
                  left: 0,
                  right: 0,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#C0D3CA",
                  textAlign: "center",
                  background:
                    "linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent)",
                  py: 0.5,
                  px: 1,
                }}
              >
                Pocket
              </Typography>
            </Button>
          </Box>
        </Box>

        <Drawer
          anchor="bottom"
          open={isTypeDrawerOpen}
          onClose={() => setIsTypeDrawerOpen(false)}
          PaperProps={{
            sx: {
              height: "30vh",
              backgroundColor: "#0a0a0a",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              px: 2,
              pt: 2,
              pb: 3,
            },
          }}
          ModalProps={{ keepMounted: true }}
          BackdropProps={{
            invisible: false,
            sx: { backgroundColor: "transparent" },
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "#C0D3CA", textAlign: "center", mb: 2 }}
          >
            Choose Suit Style
          </Typography>
          {/* <img src={wew} alt="kind1" />
          <img src={wew2} alt="kind2" />

          <img src={kind1Img} alt="kind1" />
          <img src={kind2Img} alt="kind2" />
          <img src={kind3Img} alt="kind3" />
          <img src={kind4Img} alt="kind4" /> */}

          <Grid container spacing={2} justifyContent="center">
            {suitTypes.map((type) => (
              <Grid item key={type.name}>
                <OptionButton
                  item={type}
                  isSelected={selectedKind === type.name}
                  onSelectName={(name) => {
                    handleSelectKind(name);
                    setIsTypeDrawerOpen(false);
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Drawer>

        {/* Mobile Pocket Drawer */}
        <Drawer
          anchor="bottom"
          open={isPocketDrawerOpen}
          onClose={() => setIsPocketDrawerOpen(false)}
          PaperProps={{
            sx: {
              height: "30vh",
              backgroundColor: "#0a0a0a",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              px: 2,
              pt: 2,
              pb: 3,
            },
          }}
          ModalProps={{ keepMounted: true }}
          BackdropProps={{
            invisible: false,
            sx: { backgroundColor: "transparent" },
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "#C0D3CA", textAlign: "center", mb: 2 }}
          >
            Choose Pocket Style
          </Typography>

          {/* Pocket Orientation Toggle */}
          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 2 }}
          >
            <Button
              onClick={() => handlePocketStyleChange(true)}
              variant={selectedPocketStyle ? "contained" : "outlined"}
              sx={{
                borderRadius: "12px",
                px: 3,
                py: 1,
                color: selectedPocketStyle ? "#000" : "#C0D3CA",
                backgroundColor: selectedPocketStyle
                  ? "#C0D3CA"
                  : "transparent",
                borderColor: "#C0D3CA",
                "&:hover": {
                  backgroundColor: selectedPocketStyle
                    ? "#D0E3DA"
                    : "rgba(192, 211, 202, 0.1)",
                },
              }}
            >
              Straight
            </Button>
            <Button
              onClick={() => handlePocketStyleChange(false)}
              variant={!selectedPocketStyle ? "contained" : "outlined"}
              sx={{
                borderRadius: "12px",
                px: 3,
                py: 1,
                color: !selectedPocketStyle ? "#000" : "#C0D3CA",
                backgroundColor: !selectedPocketStyle
                  ? "#C0D3CA"
                  : "transparent",
                borderColor: "#C0D3CA",
                "&:hover": {
                  backgroundColor: !selectedPocketStyle
                    ? "#D0E3DA"
                    : "rgba(192, 211, 202, 0.1)",
                },
              }}
            >
              Angled
            </Button>
          </Box>

          {/* Pocket Type Options */}
          <Grid container spacing={1.5} justifyContent="center">
            {(selectedPocketStyle
              ? pocketTypesStraight
              : pocketTypesCrooked
            ).map((pocket) => (
              <Grid item key={pocket.name}>
                <OptionButton
                  item={pocket}
                  isSelected={selectedPacketType === pocket.name}
                  onSelectName={handleSelectPacket}
                  size="small"
                />
              </Grid>
            ))}
          </Grid>
        </Drawer>

        {/* Mobile Collar Drawer */}
        <Drawer
          anchor="bottom"
          open={isCollarDrawerOpen}
          onClose={() => setIsCollarDrawerOpen(false)}
          PaperProps={{
            sx: {
              height: "30vh",
              backgroundColor: "#0a0a0a",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              px: 2,
              pt: 2,
              pb: 3,
            },
          }}
          ModalProps={{ keepMounted: true }}
          BackdropProps={{
            invisible: false,
            sx: { backgroundColor: "transparent" },
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "#C0D3CA", textAlign: "center", mb: 2 }}
          >
            Choose Lapel Style
          </Typography>
          <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
            {collarStyles.map((style) => (
              <Grid item key={style.name}>
                <OptionButton
                  item={style}
                  isSelected={selectedCollar === style.name}
                  onSelectName={handleSelectCollar}
                />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ px: 2 }}>
            <Slider
              defaultValue={2}
              step={1}
              marks={lapelLevels}
              min={1}
              max={4}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) =>
                lapelLevels.find((level) => level.value === value)?.label ||
                "Standard"
              }
              onChange={(_, newValue) => {
                const selectedLevel = lapelLevels.find(
                  (level) => level.value === newValue
                );
                setSelectedLapelType(selectedLevel?.name || "Standard");
              }}
              sx={{
                color: "#C0D3CA",
                "& .MuiSlider-track": { backgroundColor: "#C0D3CA" },
                "& .MuiSlider-rail": {
                  backgroundColor: "rgba(192, 211, 202, 0.3)",
                },
                "& .MuiSlider-thumb": {
                  backgroundColor: "#C0D3CA",
                  border: "2px solid #0a0a0a",
                },
                "& .MuiSlider-mark": {
                  backgroundColor: "rgba(192, 211, 202, 0.5)",
                },
                "& .MuiSlider-markLabel": {
                  color: "#C0D3CA",
                  fontSize: "0.8rem",
                },
              }}
            />
          </Box>
        </Drawer>
      </Box>
    );
  }

  // Desktop vertical layout
  return (
    <Box
      component={motion.div}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      sx={{ width: "100%", height: "100%" }}
    >
      {/* Suit Type Selection */}
      <Box component={motion.div} variants={sectionVariants} sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: "1.25rem",
            fontWeight: 500,
            color: "#C0D3CA",
            mb: 2,
            textAlign: "center",
          }}
        >
          Suit Style
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {suitTypes.map((type) => (
            <Grid item key={type.name}>
              <OptionButton
                item={type}
                isSelected={selectedKind === type.name}
                onSelectName={handleSelectKind}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ backgroundColor: "rgba(192, 211, 202, 0.2)", my: 3 }} />

      {/* Collar Style (desktop: original inline list) */}
      <Box component={motion.div} variants={sectionVariants} sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: "1.25rem",
            fontWeight: 500,
            color: "#C0D3CA",
            mb: 2,
            textAlign: "center",
          }}
        >
          Lapel Style
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {collarStyles.map((style) => (
            <Grid item key={style.name}>
              <OptionButton
                item={style}
                isSelected={selectedCollar === style.name}
                onSelectName={handleSelectCollar}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Lapel Width Slider */}
      <Box sx={{ px: 2, mb: 4 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontSize: "1.1rem",
            fontWeight: 500,
            color: "#C0D3CA",
            mb: 2,
            textAlign: "center",
          }}
        >
          Lapel Width
        </Typography>

        <Slider
          defaultValue={2}
          step={1}
          marks={lapelLevels}
          min={1}
          max={4}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) =>
            lapelLevels.find((level) => level.value === value)?.label ||
            "Standard"
          }
          onChange={(_, newValue) => {
            const selectedLevel = lapelLevels.find(
              (level) => level.value === newValue
            );
            setSelectedLapelType(selectedLevel?.name || "Standard");
          }}
          sx={{
            color: "#C0D3CA",
            "& .MuiSlider-track": {
              backgroundColor: "#C0D3CA",
            },
            "& .MuiSlider-rail": {
              backgroundColor: "rgba(192, 211, 202, 0.3)",
            },
            "& .MuiSlider-thumb": {
              backgroundColor: "#C0D3CA",
              border: "2px solid #0a0a0a",
            },
            "& .MuiSlider-mark": {
              backgroundColor: "rgba(192, 211, 202, 0.5)",
            },
            "& .MuiSlider-markLabel": {
              color: "#C0D3CA",
              fontSize: "0.8rem",
            },
          }}
        />
      </Box>

      <Divider sx={{ backgroundColor: "rgba(192, 211, 202, 0.2)", my: 3 }} />

      {/* Pocket Style */}
      <Box component={motion.div} variants={sectionVariants}>
        <Typography
          variant="h6"
          sx={{
            fontSize: "1.25rem",
            fontWeight: 500,
            color: "#C0D3CA",
            mb: 2,
            textAlign: "center",
          }}
        >
          Pocket
        </Typography>

        {/* Pocket Orientation Toggle */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 3 }}>
          <Button
            onClick={() => handlePocketStyleChange(true)}
            variant={selectedPocketStyle ? "contained" : "outlined"}
            sx={{
              borderRadius: "12px",
              px: 3,
              py: 1,
              color: selectedPocketStyle ? "#000" : "#C0D3CA",
              backgroundColor: selectedPocketStyle ? "#C0D3CA" : "transparent",
              borderColor: "#C0D3CA",
              "&:hover": {
                backgroundColor: selectedPocketStyle
                  ? "#D0E3DA"
                  : "rgba(192, 211, 202, 0.1)",
              },
            }}
          >
            Straight
          </Button>
          <Button
            onClick={() => handlePocketStyleChange(false)}
            variant={!selectedPocketStyle ? "contained" : "outlined"}
            sx={{
              borderRadius: "12px",
              px: 3,
              py: 1,
              color: !selectedPocketStyle ? "#000" : "#C0D3CA",
              backgroundColor: !selectedPocketStyle ? "#C0D3CA" : "transparent",
              borderColor: "#C0D3CA",
              "&:hover": {
                backgroundColor: !selectedPocketStyle
                  ? "#D0E3DA"
                  : "rgba(192, 211, 202, 0.1)",
              },
            }}
          >
            Angled
          </Button>
        </Box>

        {/* Pocket Type Options */}
        <Grid container spacing={1.5} justifyContent="center">
          {(selectedPocketStyle ? pocketTypesStraight : pocketTypesCrooked).map(
            (pocket) => (
              <Grid item key={pocket.name}>
                <OptionButton
                  item={pocket}
                  isSelected={selectedPacketType === pocket.name}
                  onSelectName={handleSelectPacket}
                  size="small"
                />
              </Grid>
            )
          )}
        </Grid>
      </Box>
      {/* <Drawer
        anchor="bottom"
        open={isTypeDrawerOpen}
        onClose={() => setIsTypeDrawerOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#0a0a0a",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            px: 2,
            pt: 2,
            pb: 3,
          },
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "#C0D3CA", textAlign: "center", mb: 2 }}
        >
          Choose Suit Style
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {suitTypes.map((type) => (
            <Grid item key={type.name}>
              <OptionButton
                item={type}
                isSelected={selectedKind === type.name}
                onSelect={(item) => {
                  setSelectedKind(item.name);
                  setIsTypeDrawerOpen(false);
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Drawer> */}

      {/* Desktop has inline collar options; no drawer here */}
    </Box>
  );
};

export default React.memo(SuitDesign);

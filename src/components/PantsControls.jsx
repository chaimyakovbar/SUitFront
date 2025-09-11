import React, { useState } from "react";
import {
  selectedPantsHoleButtonAtom,
  selectedPantsHemAtom,
  selectedPantsKindAtom,
  selectedPantsButtonKindAtom,
  selectedPantsLoopsAtom,
  selectedPantsIronAtom,
} from "../Utils";
import { useAtom } from "jotai";
import {
  Box,
  Button,
  Drawer,
  Typography,
  Grid,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
    backgroundColor: "rgba(20, 20, 20, 0.8)",
    borderRadius: "4px",
    border: "1px solid rgba(192, 211, 202, 0.2)",
    padding: "20px",
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "1.8rem !important",
    fontWeight: "300 !important",
    marginBottom: "1.5rem !important",
    color: "#C0D3CA !important",
    textAlign: "center",
    letterSpacing: "0.05em !important",
  },
  controlButton: {
    backgroundColor: "rgba(30, 30, 30, 0.6) !important",
    border: "1px solid rgba(192, 211, 202, 0.2) !important",
    color: "#C0D3CA !important",
    padding: "16px 24px !important",
    borderRadius: "4px !important",
    textTransform: "none !important",
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    fontWeight: "400 !important",
    letterSpacing: "0.05em !important",
    transition: "all 0.3s ease !important",
    width: "100% !important",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.1) !important",
      border: "1px solid rgba(192, 211, 202, 0.4) !important",
      transform: "translateY(-2px)",
    },
  },
  drawerPaper: {
    backgroundColor: "#0a0a0a !important",
    color: "#fff !important",
    borderLeft: "1px solid rgba(192, 211, 202, 0.3) !important",
  },
  drawerTitle: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "1.5rem !important",
    fontWeight: "300 !important",
    marginBottom: "1rem !important",
    color: "#C0D3CA !important",
    letterSpacing: "0.05em !important",
  },
  closeButton: {
    color: "#C0D3CA !important",
    border: "1px solid rgba(192, 211, 202, 0.4) !important",
    padding: "8px !important",
    borderRadius: "0 !important",
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.7rem !important",
    letterSpacing: "0.1em !important",
    transition: "all 0.3s ease !important",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.2) !important",
    },
  },
  divider: {
    backgroundColor: "rgba(192, 211, 202, 0.3) !important",
    margin: "1rem 0 !important",
  },
  listItem: {
    backgroundColor: "rgba(30, 30, 30, 0.6) !important",
    marginBottom: "8px !important",
    borderRadius: "4px !important",
    border: "1px solid rgba(192, 211, 202, 0.1) !important",
    transition: "all 0.3s ease !important",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.1) !important",
      border: "1px solid rgba(192, 211, 202, 0.3) !important",
    },
  },
  selectedListItem: {
    backgroundColor: "rgba(192, 211, 202, 0.1) !important",
    border: "1px solid rgba(192, 211, 202, 0.5) !important",
  },
  listItemText: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    fontWeight: "400 !important",
    color: "#C0D3CA !important",
    letterSpacing: "0.05em !important",
  },
  checkIcon: {
    color: "#C0D3CA !important",
    fontSize: "20px !important",
  },
});

const PantsControls = ({ isMobile: mobileProp }) => {
  const isMobileQuery = useMediaQuery("(max-width:600px)");
  const isMobile = mobileProp !== undefined ? mobileProp : isMobileQuery;
  const classes = useStyles();

  const [selectedPantsHoleButton, setSelectedPantsHoleButton] = useAtom(
    selectedPantsHoleButtonAtom
  );
  const [selectedPantsHem, setSelectedPantsHem] = useAtom(selectedPantsHemAtom);

  // New pants5 atoms
  const [selectedPantsKind, setSelectedPantsKind] = useAtom(
    selectedPantsKindAtom
  );
  const [selectedPantsButtonKind, setSelectedPantsButtonKind] = useAtom(
    selectedPantsButtonKindAtom
  );
  const [selectedPantsLoops, setSelectedPantsLoops] = useAtom(
    selectedPantsLoopsAtom
  );
  const [selectedPantsIron, setSelectedPantsIron] = useAtom(
    selectedPantsIronAtom
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState(null);
  const [drawerTitle, setDrawerTitle] = useState("");

  // New pants5 options
  const kindOptions = [
    { value: "regularBase", label: "Regular" },
    { value: "longRegular", label: "Long Regular" },
    { value: "longWide", label: "Long Wide" },
    { value: "wide", label: "Wide" },
    { value: "MiddleWide", label: "Medium Wide" },
  ];

  const buttonOptions = {
    regularBase: [
      { value: "none", label: "No Button" },
      { value: "regularButton", label: "Regular Button" },
    ],
    longRegular: [
      { value: "none", label: "No Button" },
      { value: "longMidleButton", label: "Middle Button" },
    ],
    longWide: [
      { value: "none", label: "No Button" },
      { value: "longWideButton", label: "One Button" },
      { value: "longWideTwoButton", label: "Two Buttons" },
    ],
    wide: [
      { value: "none", label: "No Button" },
      { value: "wideButton", label: "One Button" },
      { value: "wideTowButton", label: "Two Buttons" },
    ],
    MiddleWide: [
      { value: "none", label: "No Button" },
      { value: "middleWideButton", label: "One Button" },
      { value: "middleWideTwoButton", label: "Two Buttons" },
    ],
  };

  const loopsOptions = {
    regularBase: [
      { value: "none", label: "No Loops" },
      { value: "loop", label: "One Loop" },
      { value: "twoLoop", label: "Two Loops" },
    ],
    longRegular: [
      { value: "none", label: "No Loops" },
      { value: "loop", label: "One Loop" },
      { value: "twoLoop", label: "Two Loops" },
    ],
    longWide: [
      { value: "none", label: "No Loops" },
      { value: "wideOneIoop", label: "One Loop" },
      { value: "wideTwoLoop", label: "Two Loops" },
    ],
    wide: [
      { value: "none", label: "No Loops" },
      { value: "wideOneIoop", label: "One Loop" },
      { value: "wideTwoLoop", label: "Two Loops" },
    ],
    MiddleWide: [
      { value: "none", label: "No Loops" },
      { value: "wideMiddleLoop", label: "One Loop" },
      { value: "wideMiddleTowLoop", label: "Two Loops" },
    ],
  };

  const ironOptions = {
    regularBase: [
      { value: "none", label: "No Iron" },
      { value: "regularIron", label: "Regular Iron" },
      { value: "oneIron", label: "One Iron" },
      { value: "oneIronTwoButton", label: "One Iron + Two Buttons" },
    ],
    longRegular: [
      { value: "none", label: "No Iron" },
      { value: "regularIron", label: "Regular Iron" },
      { value: "oneIron", label: "One Iron" },
      { value: "oneIronTwoButton", label: "One Iron + Two Buttons" },
    ],
    longWide: [
      { value: "none", label: "No Iron" },
      { value: "wideIron", label: "Wide Iron" },
    ],
    wide: [
      { value: "none", label: "No Iron" },
      { value: "wideIron", label: "Wide Iron" },
    ],
    MiddleWide: [
      { value: "none", label: "No Iron" },
      { value: "wideIron", label: "Wide Iron" },
    ],
  };

  // Removed lines options (unused)

  // const holeButtonOptions = [
  //   { value: "Regular", label: "Regular" },
  //   { value: "behindLeftSide", label: "Behind Left Side" },
  //   { value: "behindRegular", label: "Behind Regular" },
  //   { value: "LeftSide", label: "Left Side" },
  // ];

  const hemOptions = [
    { value: "none", label: "No Hem" },
    { value: "Hem", label: "With Hem" },
  ];

  const handleOpenDrawer = (title, options, currentValue, setValue) => {
    setDrawerTitle(title);
    setDrawerContent({ options, currentValue, setValue });
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleOptionSelect = (value) => {
    if (drawerContent && drawerContent.setValue) {
      drawerContent.setValue(value);
    }
    handleCloseDrawer();
  };

  // Reset loops and iron when kind changes
  const handleKindChange = (newKind) => {
    setSelectedPantsKind(newKind);
    setSelectedPantsLoops("none");
    setSelectedPantsIron("none");
    setSelectedPantsButtonKind("none");
  };

  // Mobile horizontal layout
  if (isMobile) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          gap: 4,
          minWidth: "fit-content",
        }}
      >
        {/* Pants Type Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#C0D3CA",
              textAlign: "center",
              mb: 1,
            }}
          >
            Pants Type
          </Typography>
          <Button
            variant="outlined"
            onClick={() =>
              handleOpenDrawer(
                "Pants Type",
                kindOptions,
                selectedPantsKind,
                handleKindChange
              )
            }
            sx={{
              borderRadius: "12px",
              px: 2,
              py: 1,
              color: "#C0D3CA",
              borderColor: "#C0D3CA",
              "&:hover": { backgroundColor: "rgba(192, 211, 202, 0.1)" },
            }}
          >
            Choose Type
          </Button>
        </Box>

        {/* Buttons Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#C0D3CA",
              textAlign: "center",
              mb: 1,
            }}
          >
            Buttons
          </Typography>
          <Button
            variant="outlined"
            onClick={() =>
              handleOpenDrawer(
                "Buttons",
                buttonOptions[selectedPantsKind] || [],
                selectedPantsButtonKind,
                setSelectedPantsButtonKind
              )
            }
            sx={{
              borderRadius: "12px",
              px: 2,
              py: 1,
              color: "#C0D3CA",
              borderColor: "#C0D3CA",
              "&:hover": { backgroundColor: "rgba(192, 211, 202, 0.1)" },
            }}
          >
            Choose Buttons
          </Button>
        </Box>

        {/* Iron Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#C0D3CA",
              textAlign: "center",
              mb: 1,
            }}
          >
            Iron
          </Typography>
          <Button
            variant="outlined"
            onClick={() =>
              handleOpenDrawer(
                "Iron",
                ironOptions[selectedPantsKind] || [],
                selectedPantsIron,
                setSelectedPantsIron
              )
            }
            sx={{
              borderRadius: "12px",
              px: 2,
              py: 1,
              color: "#C0D3CA",
              borderColor: "#C0D3CA",
              "&:hover": { backgroundColor: "rgba(192, 211, 202, 0.1)" },
            }}
            disabled={!selectedPantsKind}
          >
            Choose Iron
          </Button>
        </Box>

        {/* Loops Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#C0D3CA",
              textAlign: "center",
              mb: 1,
            }}
          >
            Loops
          </Typography>
          <Button
            variant="outlined"
            onClick={() =>
              handleOpenDrawer(
                "Loops",
                loopsOptions[selectedPantsKind] || [],
                selectedPantsLoops,
                setSelectedPantsLoops
              )
            }
            sx={{
              borderRadius: "12px",
              px: 2,
              py: 1,
              color: "#C0D3CA",
              borderColor: "#C0D3CA",
              "&:hover": { backgroundColor: "rgba(192, 211, 202, 0.1)" },
            }}
          >
            Choose Loops
          </Button>
        </Box>

        {/* Hole & Button Section */}

        {/* Hem Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#C0D3CA",
              textAlign: "center",
              mb: 1,
            }}
          >
            Hem
          </Typography>
          <Button
            variant="outlined"
            onClick={() =>
              handleOpenDrawer(
                "Hem",
                hemOptions,
                selectedPantsHem,
                setSelectedPantsHem
              )
            }
            sx={{
              borderRadius: "12px",
              px: 2,
              py: 1,
              color: "#C0D3CA",
              borderColor: "#C0D3CA",
              "&:hover": { backgroundColor: "rgba(192, 211, 202, 0.1)" },
            }}
          >
            Choose Hem
          </Button>
        </Box>

        {/* Mobile Drawer */}
        <Drawer
          anchor="bottom"
          open={drawerOpen}
          onClose={handleCloseDrawer}
          PaperProps={{
            className: classes.drawerPaper,
            sx: {
              height: "30vh",
              borderTop: "1px solid rgba(192, 211, 202, 0.3)",
            },
          }}
        >
          <Box sx={{ padding: "16px 16px 8px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography className={classes.drawerTitle}>
                {drawerTitle}
              </Typography>
              <IconButton onClick={handleCloseDrawer} sx={{ color: "#C0D3CA" }}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider className={classes.divider} />
            <List>
              {drawerContent?.options?.map((option) => (
                <ListItem
                  key={option.value}
                  disablePadding
                  className={`${classes.listItem} ${
                    drawerContent.currentValue === option.value
                      ? classes.selectedListItem
                      : ""
                  }`}
                >
                  <ListItemButton
                    onClick={() => handleOptionSelect(option.value)}
                    sx={{ padding: "14px 16px" }}
                  >
                    <ListItemText
                      primary={option.label}
                      className={classes.listItemText}
                    />
                    {drawerContent.currentValue === option.value && (
                      <CheckCircleIcon className={classes.checkIcon} />
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>
    );
  }

  // Desktop layout
  return (
    <Box className={classes.root}>
      <Typography className={classes.title}>Pants Customization</Typography>

      <Grid container spacing={3}>
        {/* Kind Selection */}
        <Grid item xs={12} md={3}>
          <Button
            className={classes.controlButton}
            onClick={() =>
              handleOpenDrawer(
                "Pants Type",
                kindOptions,
                selectedPantsKind,
                handleKindChange
              )
            }
          >
            Pants Type
          </Button>
        </Grid>

        {/* Button Selection */}
        <Grid item xs={12} md={3}>
          <Button
            className={classes.controlButton}
            onClick={() =>
              handleOpenDrawer(
                "Buttons",
                buttonOptions[selectedPantsKind] || [],
                selectedPantsButtonKind,
                setSelectedPantsButtonKind
              )
            }
          >
            Buttons
          </Button>
        </Grid>

        {/* Iron Selection */}
        <Grid item xs={12} md={3}>
          <Button
            className={classes.controlButton}
            onClick={() =>
              handleOpenDrawer(
                "Iron",
                ironOptions[selectedPantsKind] || [],
                selectedPantsIron,
                setSelectedPantsIron
              )
            }
            disabled={!selectedPantsKind}
          >
            Iron
          </Button>
        </Grid>

        {/* Hem Selection */}
        <Grid item xs={12} md={3}>
          <Button
            className={classes.controlButton}
            onClick={() =>
              handleOpenDrawer(
                "Hem",
                hemOptions,
                selectedPantsHem,
                setSelectedPantsHem
              )
            }
          >
            Hem
          </Button>
        </Grid>
      </Grid>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          className: classes.drawerPaper,
          sx: {
            width: "50vw",
          },
        }}
      >
        <Box sx={{ padding: "24px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography className={classes.drawerTitle}>
              {drawerTitle}
            </Typography>

            <IconButton onClick={handleCloseDrawer} sx={{ color: "#C0D3CA" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider className={classes.divider} />

          <List>
            {drawerContent?.options?.map((option) => (
              <ListItem
                key={option.value}
                disablePadding
                className={`${classes.listItem} ${
                  drawerContent.currentValue === option.value
                    ? classes.selectedListItem
                    : ""
                }`}
              >
                <ListItemButton
                  onClick={() => handleOptionSelect(option.value)}
                  sx={{ padding: "16px 20px" }}
                >
                  <ListItemText
                    primary={option.label}
                    className={classes.listItemText}
                  />
                  {drawerContent.currentValue === option.value && (
                    <CheckCircleIcon className={classes.checkIcon} />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default PantsControls;

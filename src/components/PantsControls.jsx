import React, { useState } from "react";
import {
  selectedPantsHoleButtonAtom,
  selectedPantsLinesAtom,
  selectedPantsHemAtom,
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
  const [selectedPantsLines, setSelectedPantsLines] = useAtom(
    selectedPantsLinesAtom
  );
  const [selectedPantsHem, setSelectedPantsHem] = useAtom(selectedPantsHemAtom);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState(null);
  const [drawerTitle, setDrawerTitle] = useState("");

  const linesOptions = [
    { value: "none", label: "ללא פסים" },
    { value: "OneLinesInTheTop", label: "פס אחד בחלק העליון" },
    { value: "twoLinesInTheTop", label: "שני פסים בחלק העליון" },
  ];

  const holeButtonOptions = [
    { value: "Regular", label: "רגיל" },
    { value: "behindLeftSide", label: "מאחורי הצד השמאלי" },
    { value: "behindRegular", label: "מאחורי רגיל" },
    { value: "LeftSide", label: "הצד השמאלי" },
  ];

  const hemOptions = [
    { value: "none", label: "ללא מכפלת" },
    { value: "Hem", label: "עם מכפלת" },
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

  // Mobile horizontal layout
  if (isMobile) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          gap: 3,
          minWidth: "fit-content",
        }}
      >
        {/* Lines Selection */}
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
            Lines
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5 }}>
            {linesOptions.map((option) => (
              <Box
                key={option.value}
                onClick={() => setSelectedPantsLines(option.value)}
                sx={{
                  cursor: "pointer",
                  borderRadius: "16px",
                  border:
                    selectedPantsLines === option.value
                      ? "2px solid #C0D3CA"
                      : "1px solid rgba(192, 211, 202, 0.2)",
                  background:
                    selectedPantsLines === option.value
                      ? "rgba(192, 211, 202, 0.1)"
                      : "rgba(30, 30, 30, 0.6)",
                  transition: "all 0.3s ease",
                  overflow: "hidden",
                  position: "relative",
                  width: "70px",
                  height: "70px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  pt: 1.5,
                  flexShrink: 0,
                  "&:hover": {
                    border: "2px solid rgba(192, 211, 202, 0.5)",
                    background: "rgba(192, 211, 202, 0.1)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.65rem",
                    fontWeight: 500,
                    color: "#C0D3CA",
                    textAlign: "center",
                    letterSpacing: "0.5px",
                    lineHeight: 1.1,
                    px: 0.5,
                  }}
                >
                  {option.label}
                </Typography>
                {selectedPantsLines === option.value && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#C0D3CA",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 12, color: "#000" }} />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Hole and Button Selection */}
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
            Hole & Button
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5 }}>
            {holeButtonOptions.slice(0, 3).map((option) => (
              <Box
                key={option.value}
                onClick={() => setSelectedPantsHoleButton(option.value)}
                sx={{
                  cursor: "pointer",
                  borderRadius: "16px",
                  border:
                    selectedPantsHoleButton === option.value
                      ? "2px solid #C0D3CA"
                      : "1px solid rgba(192, 211, 202, 0.2)",
                  background:
                    selectedPantsHoleButton === option.value
                      ? "rgba(192, 211, 202, 0.1)"
                      : "rgba(30, 30, 30, 0.6)",
                  transition: "all 0.3s ease",
                  overflow: "hidden",
                  position: "relative",
                  width: "70px",
                  height: "70px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  pt: 1.5,
                  flexShrink: 0,
                  "&:hover": {
                    border: "2px solid rgba(192, 211, 202, 0.5)",
                    background: "rgba(192, 211, 202, 0.1)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.65rem",
                    fontWeight: 500,
                    color: "#C0D3CA",
                    textAlign: "center",
                    letterSpacing: "0.5px",
                    lineHeight: 1.1,
                    px: 0.5,
                  }}
                >
                  {option.label}
                </Typography>
                {selectedPantsHoleButton === option.value && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#C0D3CA",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 12, color: "#000" }} />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Hem Selection */}
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
          <Box sx={{ display: "flex", gap: 1.5 }}>
            {hemOptions.map((option) => (
              <Box
                key={option.value}
                onClick={() => setSelectedPantsHem(option.value)}
                sx={{
                  cursor: "pointer",
                  borderRadius: "16px",
                  border:
                    selectedPantsHem === option.value
                      ? "2px solid #C0D3CA"
                      : "1px solid rgba(192, 211, 202, 0.2)",
                  background:
                    selectedPantsHem === option.value
                      ? "rgba(192, 211, 202, 0.1)"
                      : "rgba(30, 30, 30, 0.6)",
                  transition: "all 0.3s ease",
                  overflow: "hidden",
                  position: "relative",
                  width: "70px",
                  height: "70px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  pt: 1.5,
                  flexShrink: 0,
                  "&:hover": {
                    border: "2px solid rgba(192, 211, 202, 0.5)",
                    background: "rgba(192, 211, 202, 0.1)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.65rem",
                    fontWeight: 500,
                    color: "#C0D3CA",
                    textAlign: "center",
                    letterSpacing: "0.5px",
                    lineHeight: 1.1,
                    px: 0.5,
                  }}
                >
                  {option.label}
                </Typography>
                {selectedPantsHem === option.value && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: "#C0D3CA",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 12, color: "#000" }} />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  // Desktop layout
  return (
    <Box className={classes.root}>
      <Typography className={classes.title}>התאמת מכנסיים</Typography>

      <Grid container spacing={3}>
        {/* Lines Selection */}
        <Grid item xs={12} md={4}>
          <Button
            className={classes.controlButton}
            onClick={() =>
              handleOpenDrawer(
                "פסים על המכנסיים",
                linesOptions,
                selectedPantsLines,
                setSelectedPantsLines
              )
            }
          >
            פסים על המכנסיים
          </Button>
        </Grid>

        {/* Hole and Button Selection */}
        <Grid item xs={12} md={4}>
          <Button
            className={classes.controlButton}
            onClick={() =>
              handleOpenDrawer(
                "חור וכפתור",
                holeButtonOptions,
                selectedPantsHoleButton,
                setSelectedPantsHoleButton
              )
            }
          >
            חור וכפתור
          </Button>
        </Grid>

        {/* Hem Selection */}
        <Grid item xs={12} md={4}>
          <Button
            className={classes.controlButton}
            onClick={() =>
              handleOpenDrawer(
                "מכפלת",
                hemOptions,
                selectedPantsHem,
                setSelectedPantsHem
              )
            }
          >
            מכפלת
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
            width: isMobile ? "80%" : "400px",
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

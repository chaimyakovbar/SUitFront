import React, { useState } from "react";
import TakeSizes from "../components/TakeSizes";
import TakeSizes3 from "../components/TakeSize3";
import { useAtomValue } from "jotai";
import { userAtom } from "../Utils";
import { motion } from "framer-motion";
import { 
  Box, 
  Container, 
  Typography, 
  IconButton, 
  Tooltip,
  Paper,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const useStyles = makeStyles({
  root: {
    backgroundColor: "#0a0a0a",
    color: "#fff",
    minHeight: "100vh",
    paddingTop: "120px",
    paddingBottom: "80px",
    position: "relative",
  },
  container: {
    position: "relative",
  },
  heading: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "3rem !important",
    fontWeight: "300 !important",
    marginBottom: "1rem !important",
    letterSpacing: "0.05em !important",
    textAlign: "center",
  },
  subheading: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "1rem !important",
    fontWeight: "300 !important",
    marginBottom: "2rem !important",
    letterSpacing: "0.05em !important",
    color: "#C0D3CA !important",
    textAlign: "center",
  },
  switchButton: {
    position: "fixed !important",
    right: "30px",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(30, 30, 30, 0.7) !important",
    color: "#C0D3CA !important",
    border: "1px solid rgba(192, 211, 202, 0.3) !important",
    padding: "12px !important",
    zIndex: 1000,
    transition: "all 0.3s ease !important",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.1) !important",
      transform: "translateY(-50%) scale(1.1) !important",
    },
  },
  switchIcon: {
    fontSize: "2rem !important",
  },
  contentWrapper: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  viewLabel: {
    position: "fixed !important",
    right: "100px",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "transparent !important",
    color: "#C0D3CA !important",
    padding: "12px !important",
    zIndex: 1000,
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.8rem !important",
    letterSpacing: "0.1em !important",
    opacity: 0.7,
  }
});

const IndexSizes = () => {
  const classes = useStyles();
  const [optionOne, setOptionOne] = useState(false);
  const user = useAtomValue(userAtom);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleView = () => {
    setOptionOne(prev => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className={classes.root}
    >
      <Container maxWidth="lg" className={classes.container}>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography variant="h1" className={classes.heading}>
            Measurement Guide
          </Typography>
          <Typography variant="body1" className={classes.subheading}>
            Precision tailoring begins with accurate measurements
          </Typography>
        </motion.div>

        {user && (
          <>
            <Typography className={classes.viewLabel} sx={{ display: { xs: 'none', md: 'block' } }}>
              {optionOne ? "3D MODEL VIEW" : "STANDARD VIEW"}
            </Typography>
            <Tooltip title={optionOne ? "Switch to Standard View" : "Switch to 3D Model View"} placement="left">
              <IconButton 
                className={classes.switchButton}
                onClick={toggleView}
              >
                <CompareArrowsIcon className={classes.switchIcon} />
              </IconButton>
            </Tooltip>
          </>
        )}

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={classes.contentWrapper}
        >
          {!optionOne ? (
            <TakeSizes />
          ) : (
            <TakeSizes3 />
          )}
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default IndexSizes;

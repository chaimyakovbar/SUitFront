import React from "react";
import { makeStyles } from "@mui/styles";
import { Button, Box, IconButton } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useLanguage } from "../context/LanguageContext";

const useStyles = makeStyles({
  // languageToggle: {
  //   backgroundColor: "rgba(255,255,255,0.1) !important",
  //   color: "#fff !important",
  //   border: "1px solid rgba(255,255,255,0.3) !important",
  //   borderRadius: "50% !important",
  //   width: "50px !important",
  //   height: "50px !important",
  //   minWidth: "50px !important",
  //   transition: "all 0.3s ease !important",
  //   backdropFilter: "blur(10px) !important",
  //   "&:hover": {
  //     backgroundColor: "rgba(255,255,255,0.2) !important",
  //     border: "1px solid rgba(255,255,255,0.5) !important",
  //     transform: "translateY(-2px) !important",
  //     boxShadow: "0 6px 20px rgba(255,255,255,0.3) !important",
  //   },
  // },
  languageIcon: {
    width: "45px !important",
    fontSize: "1.5rem !important",
    color: "#fff !important",
  },
});

const LanguageToggle = () => {
  const classes = useStyles();
  const { toggleLanguage } = useLanguage();

  return (
    <IconButton
      className={classes.languageToggle}
      onClick={toggleLanguage}
      aria-label="Change language"
    >
      <LanguageIcon className={classes.languageIcon} />
    </IconButton>
  );
};

export default LanguageToggle;

import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Paper,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import StraightenIcon from "@mui/icons-material/Straighten";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SecurityIcon from "@mui/icons-material/Security";
import { useLanguage } from "../context/LanguageContext";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#0a0a0a",
    color: "#fff",
    minHeight: "100vh",
    paddingTop: "120px",
    paddingBottom: "80px",
  },
  container: {
    position: "relative",
  },
  returnButton: {
    position: "absolute",
    top: 0,
    left: 0,
    color: "#C0D3CA",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    fontSize: "0.9rem",
    fontFamily: "'Montserrat', sans-serif",
    letterSpacing: "0.1em",
    transition: "color 0.3s ease",
    "&:hover": {
      color: "#fff",
    },
  },
  returnIcon: {
    marginRight: "8px",
    fontSize: "1.2rem",
  },
  heading: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "3rem !important",
    fontWeight: "300 !important",
    marginBottom: "2rem !important",
    letterSpacing: "0.05em !important",
    textAlign: "center",
  },
  subheading: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "1.8rem !important",
    fontWeight: "300 !important",
    marginBottom: "1.5rem !important",
    letterSpacing: "0.05em !important",
    color: "#C0D3CA !important",
  },
  paragraph: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    fontWeight: "300 !important",
    lineHeight: "1.8 !important",
    marginBottom: "1rem !important",
    color: "#e0e0e0 !important",
  },
  accordion: {
    backgroundColor: "rgba(30, 30, 30, 0.6) !important",
    color: "#fff !important",
    marginBottom: "1rem !important",
    borderRadius: "4px !important",
    border: "1px solid rgba(192, 211, 202, 0.2) !important",
    "&:before": {
      display: "none !important",
    },
  },
  accordionSummary: {
    "& .MuiAccordionSummary-content": {
      display: "flex",
      alignItems: "center",
    },
  },
  accordionIcon: {
    color: "#C0D3CA !important",
    marginRight: "1rem !important",
  },
  expandIcon: {
    color: "#C0D3CA !important",
  },
  accordionTitle: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "1rem !important",
    fontWeight: "400 !important",
    letterSpacing: "0.05em !important",
  },
  accordionDetails: {
    display: "block !important",
    padding: "0 1rem 1.5rem 3.8rem !important",
  },
  listItem: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    fontWeight: "300 !important",
    color: "#e0e0e0 !important",
    marginBottom: "0.5rem !important",
    position: "relative !important",
    paddingLeft: "1rem !important",
    "&:before": {
      content: '"•"',
      position: "absolute",
      left: 0,
      color: "#C0D3CA",
    },
  },
  divider: {
    backgroundColor: "rgba(192, 211, 202, 0.2) !important",
    margin: "3rem 0 !important",
  },
  infoCard: {
    backgroundColor: "rgba(30, 30, 30, 0.6) !important",
    padding: "2rem !important",
    borderRadius: "4px !important",
    border: "1px solid rgba(192, 211, 202, 0.2) !important",
    marginBottom: "2rem !important",
  },
  infoCardTitle: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "1.5rem !important",
    fontWeight: "300 !important",
    marginBottom: "1rem !important",
    color: "#C0D3CA !important",
  },
});

const PolicySupport = () => {
  const classes = useStyles();
  const { t } = useLanguage();

  const policies = [
    {
      id: 1,
      titleKey: "shippingDelivery",
      icon: <LocalShippingIcon className={classes.accordionIcon} />,
      items: [
        "shippingItem1",
        "shippingItem2",
        "shippingItem3",
        "shippingItem4",
        "shippingItem5",
      ],
    },
    {
      id: 2,
      titleKey: "returnsExchanges",
      icon: <AssignmentReturnIcon className={classes.accordionIcon} />,
      items: ["returnsItem1", "returnsItem2", "returnsItem3", "returnsItem4"],
    },
    {
      id: 3,
      titleKey: "sizingAssistance",
      icon: <StraightenIcon className={classes.accordionIcon} />,
      items: ["sizingItem1", "sizingItem2", "sizingItem3"],
    },
    {
      id: 4,
      titleKey: "customerSupport",
      icon: <SupportAgentIcon className={classes.accordionIcon} />,
      items: ["supportItem1", "supportItem2", "supportItem3", "supportItem4"],
    },
    {
      id: 5,
      titleKey: "privacyPolicy",
      icon: <SecurityIcon className={classes.accordionIcon} />,
      items: ["privacyItem1", "privacyItem2", "privacyItem3", "privacyItem4"],
    },
  ];

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
            {t("policiesSupport")}
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Typography variant="h2" className={classes.subheading}>
                {t("ourPolicies")}
              </Typography>
              <Typography variant="body1" className={classes.paragraph}>
                {t("policiesDescription")}
              </Typography>

              {policies.map((policy, index) => (
                <motion.div
                  key={policy.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <Accordion className={classes.accordion}>
                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreIcon className={classes.expandIcon} />
                      }
                      className={classes.accordionSummary}
                    >
                      {policy.icon}
                      <Typography className={classes.accordionTitle}>
                        {t(policy.titleKey)}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.accordionDetails}>
                      {policy.items.map((item, idx) => (
                        <Typography key={idx} className={classes.listItem}>
                          {t(item)}
                        </Typography>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                </motion.div>
              ))}
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Paper elevation={0} className={classes.infoCard}>
                <Typography variant="h3" className={classes.infoCardTitle}>
                  {t("bespokeService")}
                </Typography>
                <Typography variant="body1" className={classes.paragraph}>
                  {t("bespokeDescription1")}
                </Typography>
                <Typography variant="body1" className={classes.paragraph}>
                  {t("bespokeDescription2")}
                </Typography>
              </Paper>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <Paper elevation={0} className={classes.infoCard}>
                  <Typography variant="h3" className={classes.infoCardTitle}>
                    {t("careInstructions")}
                  </Typography>
                  <Typography variant="body1" className={classes.paragraph}>
                    {t("careDescription1")}
                  </Typography>
                  <Typography variant="body1" className={classes.paragraph}>
                    {t("careDescription2")}
                  </Typography>
                </Paper>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <Paper elevation={0} className={classes.infoCard}>
                  <Typography variant="h3" className={classes.infoCardTitle}>
                    {t("warrantyInformation")}
                  </Typography>
                  <Typography variant="body1" className={classes.paragraph}>
                    {t("warrantyDescription1")}
                  </Typography>
                  <Typography variant="body1" className={classes.paragraph}>
                    {t("warrantyDescription2")}
                  </Typography>
                </Paper>
              </motion.div>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
};

export default PolicySupport;

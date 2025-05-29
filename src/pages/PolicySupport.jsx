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

  const policies = [
    {
      id: 1,
      title: "Shipping & Delivery",
      icon: <LocalShippingIcon className={classes.accordionIcon} />,
      items: [
        "Orders are processed within 1-3 business days.",
        "Standard shipping takes 5-10 business days; expedited 2-5 days.",
        "We offer worldwide shipping; delivery times vary.",
        "Shipping fees are calculated at checkout.",
        "Tracking information is sent via email once shipped.",
      ],
    },
    {
      id: 2,
      title: "Returns & Exchanges",
      icon: <AssignmentReturnIcon className={classes.accordionIcon} />,
      items: [
        "Returns accepted within 14 days if unworn and unaltered.",
        "Exchanges available within 7 days for size/style adjustments.",
        "Custom suits & clearance items are non-returnable.",
        "Refunds issued within 7 business days after return approval.",
      ],
    },
    {
      id: 3,
      title: "Sizing Assistance",
      icon: <StraightenIcon className={classes.accordionIcon} />,
      items: [
        "Use our detailed size guide for best fit.",
        "Custom-tailored suits available based on measurements.",
        "Live chat support for sizing help before ordering.",
      ],
    },
    {
      id: 4,
      title: "Customer Support",
      icon: <SupportAgentIcon className={classes.accordionIcon} />,
      items: [
        "Email: support@italiansuits.com",
        "Phone: +39 123 456 7890",
        "Live Chat: Available Mon-Fri, 9 AM - 6 PM (CET).",
        "We respond to inquiries within 24 hours.",
      ],
    },
    {
      id: 5,
      title: "Privacy Policy",
      icon: <SecurityIcon className={classes.accordionIcon} />,
      items: [
        "We use secure encryption to protect personal data.",
        "Your information is never sold or shared with third parties.",
        "You can opt out of marketing emails anytime.",
        "We comply with GDPR and other privacy regulations.",
      ],
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
        <Link to="/" className={classes.returnButton}>
          <ArrowBackIcon className={classes.returnIcon} />
          Return to Main Page
        </Link>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography variant="h1" className={classes.heading}>
            Policies & Support
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
                Our Policies
              </Typography>
              <Typography variant="body1" className={classes.paragraph}>
                At Italian Suits, we strive to provide exceptional service and
                support to our customers. Below you'll find detailed information
                about our policies and services.
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
                        {policy.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.accordionDetails}>
                      {policy.items.map((item, idx) => (
                        <Typography key={idx} className={classes.listItem}>
                          {item}
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
                  Bespoke Service
                </Typography>
                <Typography variant="body1" className={classes.paragraph}>
                  Our bespoke service offers a truly personalized experience.
                  Each custom suit is crafted to your exact measurements and
                  preferences, ensuring a perfect fit and unique style that
                  reflects your personality.
                </Typography>
                <Typography variant="body1" className={classes.paragraph}>
                  The bespoke process typically takes 4-6 weeks from initial
                  consultation to final delivery. During this time, our master
                  tailors will work meticulously to create a garment of
                  exceptional quality.
                </Typography>
              </Paper>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <Paper elevation={0} className={classes.infoCard}>
                  <Typography variant="h3" className={classes.infoCardTitle}>
                    Care Instructions
                  </Typography>
                  <Typography variant="body1" className={classes.paragraph}>
                    To maintain the quality and longevity of your suit, we
                    recommend dry cleaning only when necessary, typically 2-3
                    times per year. Between cleanings, use a soft brush to
                    remove dust and spot clean as needed.
                  </Typography>
                  <Typography variant="body1" className={classes.paragraph}>
                    Always hang your suit on a proper wooden hanger to maintain
                    its shape, and allow it to rest for at least 24 hours
                    between wearings to allow the natural fibers to recover.
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
                    Warranty Information
                  </Typography>
                  <Typography variant="body1" className={classes.paragraph}>
                    All our suits come with a 1-year warranty against
                    manufacturing defects. This includes issues with stitching,
                    buttons, and fabric quality under normal wear conditions.
                  </Typography>
                  <Typography variant="body1" className={classes.paragraph}>
                    For the first 30 days after purchase, we also offer
                    complimentary minor alterations to ensure your complete
                    satisfaction with the fit of your garment.
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

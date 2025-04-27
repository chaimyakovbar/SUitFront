import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper,
  Divider,
  IconButton
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

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
    marginBottom: "1.5rem !important",
    color: "#e0e0e0 !important",
  },
  formContainer: {
    backgroundColor: "rgba(30, 30, 30, 0.6) !important",
    padding: "2.5rem !important",
    borderRadius: "4px !important",
    border: "1px solid rgba(192, 211, 202, 0.2) !important",
  },
  textField: {
    marginBottom: "1.5rem !important",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "rgba(192, 211, 202, 0.3) !important",
      },
      "&:hover fieldset": {
        borderColor: "rgba(192, 211, 202, 0.5) !important",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#C0D3CA !important",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#C0D3CA !important",
    },
    "& .MuiInputBase-input": {
      color: "#fff !important",
    },
  },
  submitButton: {
    backgroundColor: "transparent !important",
    color: "#C0D3CA !important",
    border: "1px solid #C0D3CA !important",
    padding: "12px 30px !important",
    borderRadius: "0 !important",
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.8rem !important",
    letterSpacing: "0.2em !important",
    transition: "all 0.3s ease !important",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.1) !important",
      transform: "translateY(-2px) !important",
    },
  },
  contactInfo: {
    backgroundColor: "rgba(30, 30, 30, 0.6) !important",
    padding: "2.5rem !important",
    borderRadius: "4px !important",
    border: "1px solid rgba(192, 211, 202, 0.2) !important",
    height: "100%",
  },
  contactItem: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: "1.5rem",
  },
  contactIcon: {
    color: "#C0D3CA !important",
    marginRight: "1rem !important",
    marginTop: "0.2rem !important",
  },
  contactText: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    fontWeight: "300 !important",
    color: "#e0e0e0 !important",
  },
  contactLabel: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.8rem !important",
    fontWeight: "500 !important",
    color: "#C0D3CA !important",
    marginBottom: "0.3rem !important",
    letterSpacing: "0.05em !important",
    textTransform: "uppercase !important",
  },
  divider: {
    backgroundColor: "rgba(192, 211, 202, 0.2) !important",
    margin: "1.5rem 0 !important",
  },
});

const Contact = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message Sent Successfully!");
    setFormData({ name: "", email: "", subject: "", message: "" });
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
            Contact Us
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Paper elevation={0} className={classes.formContainer}>
                <Typography variant="h2" className={classes.subheading}>
                  Send Us a Message
                </Typography>
                <Typography variant="body1" className={classes.paragraph}>
                  We'd love to hear from you. Please fill out the form below and we'll get back to you as soon as possible.
                </Typography>
                
                <form onSubmit={handleSubmit}>
                  <TextField
                    className={classes.textField}
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  
                  <TextField
                    className={classes.textField}
                    label="Email Address"
                    variant="outlined"
                    fullWidth
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  
                  <TextField
                    className={classes.textField}
                    label="Subject"
                    variant="outlined"
                    fullWidth
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                  
                  <TextField
                    className={classes.textField}
                    label="Message"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                  
                  <Button 
                    type="submit" 
                    className={classes.submitButton}
                  >
                    Send Message
                  </Button>
                </form>
              </Paper>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Paper elevation={0} className={classes.contactInfo}>
                <Typography variant="h2" className={classes.subheading}>
                  Contact Information
                </Typography>
                
                <div className={classes.contactItem}>
                  <LocationOnIcon className={classes.contactIcon} />
                  <div>
                    <Typography variant="body2" className={classes.contactLabel}>
                      Address
                    </Typography>
                    <Typography variant="body1" className={classes.contactText}>
                      Via Roma 123<br />
                      Milan, 20121<br />
                      Italy
                    </Typography>
                  </div>
                </div>
                
                <div className={classes.contactItem}>
                  <PhoneIcon className={classes.contactIcon} />
                  <div>
                    <Typography variant="body2" className={classes.contactLabel}>
                      Phone
                    </Typography>
                    <Typography variant="body1" className={classes.contactText}>
                      +39 123 456 7890<br />
                      +39 098 765 4321
                    </Typography>
                  </div>
                </div>
                
                <div className={classes.contactItem}>
                  <EmailIcon className={classes.contactIcon} />
                  <div>
                    <Typography variant="body2" className={classes.contactLabel}>
                      Email
                    </Typography>
                    <Typography variant="body1" className={classes.contactText}>
                      info@italiansuits.com<br />
                      support@italiansuits.com
                    </Typography>
                  </div>
                </div>
                
                <Divider className={classes.divider} />
                
                <div className={classes.contactItem}>
                  <AccessTimeIcon className={classes.contactIcon} />
                  <div>
                    <Typography variant="body2" className={classes.contactLabel}>
                      Opening Hours
                    </Typography>
                    <Typography variant="body1" className={classes.contactText}>
                      Monday - Friday: 9:00 AM - 7:00 PM<br />
                      Saturday: 10:00 AM - 6:00 PM<br />
                      Sunday: Closed
                    </Typography>
                  </div>
                </div>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
};

export default Contact;
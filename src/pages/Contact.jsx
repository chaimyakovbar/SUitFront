import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendContactMessage } from "../api/contact";
import { useLanguage } from "../context/LanguageContext.jsx";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  IconButton,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

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
  const { t, language } = useLanguage();
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await sendContactMessage(formData);

      if (data.success) {
        enqueueSnackbar(
          language === "he"
            ? "ההודעה נשלחה בהצלחה!"
            : "Message Sent Successfully!",
          { variant: "success" }
        );
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        enqueueSnackbar(
          language === "he"
            ? "שגיאה בשליחת ההודעה. אנא נסה שוב."
            : "Failed to send message. Please try again.",
          { variant: "error" }
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      enqueueSnackbar(
        language === "he"
          ? "שגיאה בשליחת ההודעה. אנא נסה שוב."
          : "Failed to send message. Please try again.",
        { variant: "error" }
      );
    }
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="lg" className={classes.container}>


        <div>
          <Typography variant="h1" className={classes.heading}>
            {t("contactUs")}
          </Typography>
        </div>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <div>
              <Paper elevation={0} className={classes.formContainer}>
                <Typography variant="h2" className={classes.subheading}>
                  {t("sendUsMessage")}
                </Typography>
                <Typography variant="body1" className={classes.paragraph}>
                  {t("contactDescription")}
                </Typography>

                <form onSubmit={handleSubmit}>
                  <TextField
                    className={classes.textField}
                    label={t("fullName")}
                    variant="outlined"
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />

                  <TextField
                    className={classes.textField}
                    label={t("emailAddress")}
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
                    label={t("subject")}
                    variant="outlined"
                    fullWidth
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  />

                  <TextField
                    className={classes.textField}
                    label={t("message")}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                  />

                  <Button type="submit" className={classes.submitButton}>
                    {t("sendMessage")}
                  </Button>
                </form>
              </Paper>
            </div>
          </Grid>

          <Grid item xs={12} md={5}>
            <div>
              <Paper elevation={0} className={classes.contactInfo}>
                <Typography variant="h2" className={classes.subheading}>
                  {t("contactInformation")}
                </Typography>

                {/* <div className={classes.contactItem}>
                  <LocationOnIcon className={classes.contactIcon} />
                  <div>
                    <Typography
                      variant="body2"
                      className={classes.contactLabel}
                    >
                      {t("address")}
                    </Typography>
                    <Typography variant="body1" className={classes.contactText}>
                      Via Roma 123
                      <br />
                      Milan, 20121
                      <br />
                      Italy
                    </Typography>
                  </div>
                </div> */}

                <div className={classes.contactItem}>
                  <PhoneIcon className={classes.contactIcon} />
                  <div>
                    <Typography
                      variant="body2"
                      className={classes.contactLabel}
                    >
                      {t("phone")}
                    </Typography>
                    <Typography variant="body1" className={classes.contactText}>
                      0548720720
                    </Typography>
                  </div>
                </div>

                <div className={classes.contactItem}>
                  <EmailIcon className={classes.contactIcon} />
                  <div>
                    <Typography
                      variant="body2"
                      className={classes.contactLabel}
                    >
                      {t("email")}
                    </Typography>
                    <Typography variant="body1" className={classes.contactText}>
                      suit.custom.made@gmail.com
                    </Typography>
                  </div>
                </div>

                <Divider className={classes.divider} />

                <div className={classes.contactItem}>
                  <AccessTimeIcon className={classes.contactIcon} />
                  <div>
                    <Typography
                      variant="body2"
                      className={classes.contactLabel}
                    >
                      {t("openingHours")}
                    </Typography>
                    <Typography variant="body1" className={classes.contactText}>
                      {language === "he" ? (
                        <>
                          ראשון - חמישי: 10:30 - 17:00
                          <br />
                          שישי - שבת: סגור
                        </>
                      ) : (
                        <>
                          Sunday - Thursday: 10:30 - 17:00
                          <br />
                          Friday - Saturday: Closed
                        </>
                      )}
                    </Typography>
                  </div>
                </div>
              </Paper>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Contact;

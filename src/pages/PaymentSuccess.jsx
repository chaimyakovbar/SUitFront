import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
  Divider,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useLanguage } from "../context/LanguageContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#0a0a0a",
    color: "#fff",
    minHeight: "100vh",
    paddingTop: "120px",
    paddingBottom: "80px",
  },
  container: {
    maxWidth: "800px !important",
  },
  paper: {
    backgroundColor: "#202020 !important",
    color: "#fff !important",
    border: "1px solid rgba(255,255,255,0.1) !important",
    borderRadius: "12px !important",
    padding: "3rem !important",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3) !important",
    "&:hover": {
      boxShadow: "0 12px 40px rgba(0,0,0,0.4) !important",
    },
  },
  successIcon: {
    fontSize: "4rem !important",
    color: "#4CAF50 !important",
    marginBottom: "1rem !important",
  },
  pendingIcon: {
    fontSize: "4rem !important",
    color: "#FFC107 !important",
    marginBottom: "1rem !important",
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "2.5rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.12em !important",
    marginBottom: "1rem !important",
    textTransform: "uppercase",
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "1.1rem !important",
    fontWeight: "400 !important",
    letterSpacing: "0.08em !important",
    color: "rgba(255, 255, 255, 0.8) !important",
    marginBottom: "2rem !important",
    textAlign: "center",
  },
  statusChip: {
    backgroundColor: "rgba(255, 193, 7, 0.2) !important",
    color: "#FFC107 !important",
    border: "1px solid rgba(255, 193, 7, 0.4) !important",
    fontSize: "0.9rem !important",
    fontWeight: "500 !important",
    padding: "8px 16px !important",
    borderRadius: "20px !important",
    marginBottom: "2rem !important",
  },
  orderDetails: {
    backgroundColor: "rgba(255, 255, 255, 0.05) !important",
    border: "1px solid rgba(255, 255, 255, 0.1) !important",
    borderRadius: "8px !important",
    padding: "1.5rem !important",
    marginBottom: "2rem !important",
  },
  detailRow: {
    display: "flex !important",
    justifyContent: "space-between !important",
    alignItems: "center !important",
    marginBottom: "0.75rem !important",
    "&:last-child": {
      marginBottom: "0 !important",
    },
  },
  detailLabel: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    fontWeight: "400 !important",
    color: "rgba(255, 255, 255, 0.7) !important",
  },
  detailValue: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    fontWeight: "500 !important",
    color: "#fff !important",
  },
  alert: {
    backgroundColor: "rgba(255, 193, 7, 0.1) !important",
    border: "1px solid rgba(255, 193, 7, 0.3) !important",
    color: "#FFC107 !important",
    marginBottom: "2rem !important",
  },
  button: {
    backgroundColor: "transparent !important",
    color: "#fff !important",
    border: "1px solid #fff !important",
    padding: "12px 30px !important",
    fontSize: "0.85rem !important",
    borderRadius: "4px !important",
    fontWeight: "400 !important",
    letterSpacing: "0.15em !important",
    textTransform: "uppercase !important",
    transition: "all 0.3s ease !important",
    fontFamily: "'Montserrat', sans-serif !important",
    minWidth: "180px !important",
    "&:hover": {
      backgroundColor: "#fff !important",
      color: "#000 !important",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(255,255,255,0.2) !important",
    },
  },
  buttonGroup: {
    display: "flex !important",
    gap: "1rem !important",
    justifyContent: "center !important",
    flexWrap: "wrap !important",
  },
  divider: {
    backgroundColor: "rgba(255, 255, 255, 0.1) !important",
    margin: "2rem 0 !important",
  },
  infoText: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.85rem !important",
    color: "rgba(255, 255, 255, 0.6) !important",
    textAlign: "center !important",
    lineHeight: "1.6 !important",
  },
});

const PaymentSuccess = () => {
  const classes = useStyles();
  const location = useLocation();
  const { t } = useLanguage();
  const { paymentData, orderStatus, orderId, message } = location.state || {};

  // If no state data, show error
  if (!paymentData) {
    return (
      <Box className={classes.root}>
        <Container maxWidth="md" className={classes.container}>
          <Paper className={classes.paper}>
            <Typography className={classes.title}>
              {t("paymentInformationNotFound")}
            </Typography>
            <Typography className={classes.subtitle}>
              {t("returnToShoppingMessage")}
            </Typography>
            <Box className={classes.buttonGroup}>
              <Link to="/Shopping" style={{ textDecoration: "none" }}>
                <Button
                  className={classes.button}
                  startIcon={<ShoppingBagIcon />}
                >
                  {t("backToShopping")}
                </Button>
              </Link>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  const isPending = orderStatus === "PENDING";

  return (
    <Box className={classes.root}>
      <Container maxWidth="md" className={classes.container}>
        <Paper className={classes.paper}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            {isPending ? (
              <ScheduleIcon className={classes.pendingIcon} />
            ) : (
              <CheckCircleIcon className={classes.successIcon} />
            )}

            <Typography className={classes.title}>
              {isPending ? t("paymentProcessed") : t("paymentSuccessful")}
            </Typography>

            <Typography className={classes.subtitle}>
              {isPending
                ? t("paymentProcessedMessage")
                : t("thankYouForPurchase")}
            </Typography>

            <Chip
              label={isPending ? t("awaitingApproval") : t("completed")}
              className={classes.statusChip}
              icon={isPending ? <ScheduleIcon /> : <CheckCircleIcon />}
            />
          </Box>

          {isPending && (
            <Alert severity="warning" className={classes.alert}>
              <Typography variant="body2">{t("orderBeingReviewed")}</Typography>
            </Alert>
          )}

          {message && (
            <Alert severity="info" className={classes.alert}>
              <Typography variant="body2">{message}</Typography>
            </Alert>
          )}

          <Box className={classes.orderDetails}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "1.1rem",
                fontWeight: "600",
                marginBottom: "1rem",
                color: "#fff",
              }}
            >
              {t("orderDetails")}
            </Typography>

            <Box className={classes.detailRow}>
              <Typography className={classes.detailLabel}>
                {t("orderId")}
              </Typography>
              <Typography className={classes.detailValue}>
                {orderId || paymentData.paymentIntentId}
              </Typography>
            </Box>

            <Box className={classes.detailRow}>
              <Typography className={classes.detailLabel}>
                {t("totalAmount")}
              </Typography>
              <Typography className={classes.detailValue}>
                {paymentData.totalAmount}€
              </Typography>
            </Box>

            <Box className={classes.detailRow}>
              <Typography className={classes.detailLabel}>
                {t("shippingCost")}
              </Typography>
              <Typography className={classes.detailValue}>
                {paymentData.shippingCost === 0
                  ? t("free")
                  : `${paymentData.shippingCost}€`}
              </Typography>
            </Box>

            <Box className={classes.detailRow}>
              <Typography className={classes.detailLabel}>
                {t("shippingType")}
              </Typography>
              <Typography className={classes.detailValue}>
                {paymentData.shippingType}
              </Typography>
            </Box>

            <Box className={classes.detailRow}>
              <Typography className={classes.detailLabel}>
                {t("items")}
              </Typography>
              <Typography className={classes.detailValue}>
                {paymentData.suits?.length || 0}{" "}
                {paymentData.suits?.length === 1 ? t("suit") : t("suits")}
              </Typography>
            </Box>
          </Box>

          <Divider className={classes.divider} />

          <Typography className={classes.infoText}>
            {isPending
              ? t("processingOrderMessage")
              : t("orderConfirmedMessage")}
          </Typography>

          <Box className={classes.buttonGroup}>
            <Link to="/Shopping" style={{ textDecoration: "none" }}>
              <Button
                className={classes.button}
                startIcon={<ShoppingBagIcon />}
              >
                {t("continueShopping")}
              </Button>
            </Link>

            <Link to="/account" style={{ textDecoration: "none" }}>
              <Button
                className={classes.button}
                startIcon={<AccountCircleIcon />}
              >
                {t("viewOrders")}
              </Button>
            </Link>

            <Link to="/" style={{ textDecoration: "none" }}>
              <Button className={classes.button} startIcon={<HomeIcon />}>
                {t("home")}
              </Button>
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PaymentSuccess;

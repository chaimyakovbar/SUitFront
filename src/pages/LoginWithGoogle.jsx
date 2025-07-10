// src/pages/LoginWithGoogle.jsx
import React, { useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";
import {
  Button,
  Typography,
  Box,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Divider,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { makeStyles } from "@mui/styles";

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
  paper: {
    width: "90%",
    backgroundColor: "rgba(30, 30, 30, 0.6) !important",
    padding: "2rem !important",
    maxWidth: 450,
    borderRadius: "8px !important",
    textAlign: "center",
    border: "1px solid rgba(192, 211, 202, 0.2) !important",
    "@media (max-width: 768px)": {
      padding: "1rem !important",
    },
  },
  heading: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "2.2rem !important",
    fontWeight: "300 !important",
    marginBottom: "2.5rem !important",
    letterSpacing: "0.05em !important",
    color: "#fff !important",
  },
  errorText: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    fontWeight: "300 !important",
    color: "#ff6b6b !important",
    marginBottom: "1rem !important",
  },
  successText: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    fontWeight: "300 !important",
    color: "#4caf50 !important",
    marginBottom: "1rem !important",
  },
  googleSection: {
    marginBottom: "2rem",
  },
  googleButton: {
    backgroundColor: "#fff !important",
    color: "#333 !important",
    border: "1px solid #ddd !important",
    padding: "14px 24px !important",
    fontSize: "0.9rem !important",
    borderRadius: "4px !important",
    fontWeight: "500 !important",
    textTransform: "none !important",
    transition: "all 0.3s ease !important",
    fontFamily: "'Montserrat', sans-serif !important",
    width: "100% !important",
    marginBottom: "1rem !important",
    "&:hover": {
      backgroundColor: "#f8f9fa !important",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1) !important",
    },
    "&:disabled": {
      backgroundColor: "#f5f5f5 !important",
      color: "#999 !important",
    },
  },
  googleSignUpButton: {
    backgroundColor: "transparent !important",
    color: "#C0D3CA !important",
    border: "1px solid #C0D3CA !important",
    padding: "14px 24px !important",
    fontSize: "0.9rem !important",
    borderRadius: "4px !important",
    fontWeight: "500 !important",
    textTransform: "none !important",
    transition: "all 0.3s ease !important",
    fontFamily: "'Montserrat', sans-serif !important",
    width: "100% !important",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.1) !important",
    },
    "&:disabled": {
      backgroundColor: "rgba(192, 211, 202, 0.05) !important",
      border: "1px solid rgba(192, 211, 202, 0.3) !important",
      color: "rgba(192, 211, 202, 0.5) !important",
    },
  },
  divider: {
    backgroundColor: "rgba(192, 211, 202, 0.2) !important",
    margin: "2rem 0 !important",
  },
  dividerText: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.85rem !important",
    color: "rgba(192, 211, 202, 0.7) !important",
    margin: "0 1rem !important",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      color: "#fff !important",
      fontFamily: "'Montserrat', sans-serif !important",
      "& fieldset": {
        borderColor: "rgba(192, 211, 202, 0.2) !important",
      },
      "&:hover fieldset": {
        borderColor: "rgba(192, 211, 202, 0.4) !important",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#C0D3CA !important",
      },
    },
    "& .MuiInputLabel-root": {
      color: "rgba(192, 211, 202, 0.7) !important",
      fontFamily: "'Montserrat', sans-serif !important",
    },
    "& .MuiInputAdornment-root": {
      color: "rgba(192, 211, 202, 0.7) !important",
    },
    "& input": {
      textAlign: "center !important",
    },
  },
  emailButton: {
    backgroundColor: "transparent !important",
    color: "#C0D3CA !important",
    border: "1px solid #C0D3CA !important",
    padding: "12px 24px !important",
    fontSize: "0.85rem !important",
    borderRadius: "4px !important",
    fontWeight: "500 !important",
    textTransform: "none !important",
    transition: "all 0.3s ease !important",
    fontFamily: "'Montserrat', sans-serif !important",
    width: "100% !important",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.1) !important",
    },
    "&:disabled": {
      backgroundColor: "rgba(192, 211, 202, 0.05) !important",
      border: "1px solid rgba(192, 211, 202, 0.3) !important",
      color: "rgba(192, 211, 202, 0.5) !important",
    },
  },
  toggleText: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.85rem !important",
    color: "#C0D3CA !important",
    marginTop: "1rem",
    cursor: "pointer",
    textDecoration: "underline",
    transition: "color 0.2s",
    "&:hover": {
      color: "#fff !important",
    },
  },
  forgotPasswordText: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.8rem !important",
    color: "rgba(192, 211, 202, 0.8) !important",
    textAlign: "right",
    cursor: "pointer",
    textDecoration: "underline",
    transition: "color 0.2s",
    marginTop: "0.5rem",
    "&:hover": {
      color: "#C0D3CA !important",
    },
  },
  dialog: {
    "& .MuiDialog-paper": {
      backgroundColor: "rgba(30, 30, 30, 0.95) !important",
      color: "#fff !important",
      borderRadius: "8px !important",
      border: "1px solid rgba(192, 211, 202, 0.2) !important",
    },
  },
  dialogTitle: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "1.5rem !important",
    fontWeight: "300 !important",
    color: "#fff !important",
    textAlign: "center",
  },
  dialogTextField: {
    "& .MuiOutlinedInput-root": {
      color: "#fff !important",
      fontFamily: "'Montserrat', sans-serif !important",
      "& fieldset": {
        borderColor: "rgba(192, 211, 202, 0.2) !important",
      },
      "&:hover fieldset": {
        borderColor: "rgba(192, 211, 202, 0.4) !important",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#C0D3CA !important",
      },
    },
    "& .MuiInputLabel-root": {
      color: "rgba(192, 211, 202, 0.7) !important",
      fontFamily: "'Montserrat', sans-serif !important",
    },
  },
  dialogButton: {
    backgroundColor: "transparent !important",
    color: "#C0D3CA !important",
    border: "1px solid #C0D3CA !important",
    padding: "10px 20px !important",
    fontSize: "0.85rem !important",
    borderRadius: "4px !important",
    fontWeight: "500 !important",
    textTransform: "none !important",
    transition: "all 0.3s ease !important",
    fontFamily: "'Montserrat', sans-serif !important",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.1) !important",
    },
    "&:disabled": {
      backgroundColor: "rgba(192, 211, 202, 0.05) !important",
      border: "1px solid rgba(192, 211, 202, 0.3) !important",
      color: "rgba(192, 211, 202, 0.5) !important",
    },
  },
});

const LoginWithGoogle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { googleSignIn, emailSignIn, emailSignUp, resetPassword, error } =
    useAuth();
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  // Password reset modal state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetMessageType, setResetMessageType] = useState("");

  const getRedirectPath = () => {
    // 1. Check for redirect in query params
    const redirectTo = searchParams.get("redirect");
    if (redirectTo) {
      return redirectTo;
    }

    // 2. Check for stored location in state
    const from = location.state?.from?.pathname;
    if (from) {
      return from;
    }

    // 3. Default to dashboard if no redirect specified
    return "/dashboard";
  };

  const handleGoogleAuth = async (isNewUser = false) => {
    try {
      setIsGoogleLoading(true);
      setAuthError(""); // Clear previous errors
      await googleSignIn.mutateAsync({ isNewUser });
      const redirectPath = getRedirectPath();
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("Authentication error:", error);
      setAuthError(error.message || "שגיאה בהתחברות עם Google");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      setIsEmailLoading(true);
      setAuthError(""); // Clear previous errors
      if (isSignUp) {
        await emailSignUp.mutateAsync({ email, password });
      } else {
        await emailSignIn.mutateAsync({ email, password });
      }
      const redirectPath = getRedirectPath();
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("Email authentication error:", error);
      setAuthError(error.message || "שגיאה בהתחברות");
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setIsResetModalOpen(true);
    setResetEmail(email); // Pre-fill with current email if available
    setResetMessage("");
    setResetMessageType("");
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setResetMessage("Please enter an email address");
      setResetMessageType("error");
      return;
    }

    try {
      await resetPassword.mutateAsync({ email: resetEmail });
      setResetMessage(
        "Password reset email has been sent. Please check your inbox (including spam folder)."
      );
      setResetMessageType("success");
      setTimeout(() => {
        setIsResetModalOpen(false);
        setResetEmail("");
        setResetMessage("");
        setResetMessageType("");
      }, 5000); // Increased timeout to 5 seconds
    } catch (error) {
      console.error("Password reset error:", error);
      let errorMessage =
        "Error sending password reset email. Please try again later.";

      if (error.response?.status === 400) {
        errorMessage = error.response.data.message || "Invalid email address";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.message === "Network Error") {
        errorMessage =
          "Internet connection problem. Please check your connection and try again.";
      }

      setResetMessage(errorMessage);
      setResetMessageType("error");
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseResetModal = () => {
    setIsResetModalOpen(false);
    setResetEmail("");
    setResetMessage("");
    setResetMessageType("");
  };

  return (
    <Box className={classes.root}>
      <Container maxWidth="sm">
        <Paper className={classes.paper} elevation={0}>
          <Typography className={classes.heading}>
            Welcome to SuitFront
          </Typography>

          {(error || authError) && (
            <Typography className={classes.errorText}>
              {authError || error?.message}
            </Typography>
          )}

          {/* Google Authentication Section */}
          <Box className={classes.googleSection}>
            <Button
              className={classes.googleButton}
              startIcon={
                isGoogleLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <GoogleIcon />
                )
              }
              onClick={() => handleGoogleAuth(false)}
              disabled={isGoogleLoading || isEmailLoading}
            >
              {isGoogleLoading ? "Connecting..." : "Continue with Google"}
            </Button>

            <Button
              className={classes.googleSignUpButton}
              startIcon={
                isGoogleLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <GoogleIcon />
                )
              }
              onClick={() => handleGoogleAuth(true)}
              disabled={isGoogleLoading || isEmailLoading}
            >
              {isGoogleLoading ? "Connecting..." : "Sign up with Google"}
            </Button>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
            <Divider className={classes.divider} sx={{ flex: 1 }} />
            <Typography className={classes.dividerText}>or</Typography>
            <Divider className={classes.divider} sx={{ flex: 1 }} />
          </Box>

          {/* Email Authentication Section */}
          <form onSubmit={handleEmailAuth} className={classes.form}>
            {isSignUp && (
              <>
                <TextField
                  className={classes.textField}
                  label="Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  fullWidth
                  variant="outlined"
                  disabled={isEmailLoading}
                />
                <TextField
                  className={classes.textField}
                  label="Address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  fullWidth
                  variant="outlined"
                  disabled={isEmailLoading}
                />
                <TextField
                  className={classes.textField}
                  label="Phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  fullWidth
                  variant="outlined"
                  disabled={isEmailLoading}
                  inputProps={{
                    style: { textAlign: "center" },
                  }}
                />
              </>
            )}
            <TextField
              className={classes.textField}
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              variant="outlined"
              disabled={isEmailLoading}
            />
            <TextField
              className={classes.textField}
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              variant="outlined"
              disabled={isEmailLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{ color: "rgba(192, 211, 202, 0.7)" }}
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {!isSignUp && (
              <Typography
                className={classes.forgotPasswordText}
                onClick={handleForgotPassword}
                component="div"
              >
                Forgot Password
              </Typography>
            )}

            <Button
              type="submit"
              className={classes.emailButton}
              disabled={isEmailLoading || isGoogleLoading}
            >
              {isEmailLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : isSignUp ? (
                "Sign Up with Email"
              ) : (
                "Login with Email"
              )}
            </Button>
          </form>

          <Typography
            className={classes.toggleText}
            onClick={() => !isEmailLoading && setIsSignUp((prev) => !prev)}
            component="div"
            sx={{
              opacity: isEmailLoading ? 0.5 : 1,
              pointerEvents: isEmailLoading ? "none" : "auto",
            }}
          >
            {isSignUp
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </Typography>
        </Paper>
      </Container>

      {/* Password Reset Modal */}
      <Dialog
        open={isResetModalOpen}
        onClose={handleCloseResetModal}
        className={classes.dialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className={classes.dialogTitle}>
          Password Reset
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.9rem",
              color: "rgba(192, 211, 202, 0.8)",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Enter your email address and we'll send you a password reset link
          </Typography>

          <Typography
            sx={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.8rem",
              color: "rgba(192, 211, 202, 0.6)",
              marginBottom: "1rem",
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            💡 Tip: Also check your spam/junk folder if you don't find the email
          </Typography>

          {resetMessage && (
            <Alert
              severity={resetMessageType}
              sx={{
                marginBottom: "1rem",
                backgroundColor:
                  resetMessageType === "success"
                    ? "rgba(76, 175, 80, 0.1)"
                    : "rgba(244, 67, 54, 0.1)",
                color: resetMessageType === "success" ? "#4caf50" : "#f44336",
                border: `1px solid ${
                  resetMessageType === "success" ? "#4caf50" : "#f44336"
                }`,
              }}
            >
              {resetMessage}
            </Alert>
          )}

          <TextField
            className={classes.dialogTextField}
            label="Email"
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
            fullWidth
            variant="outlined"
            disabled={resetPassword.isLoading}
            sx={{ marginBottom: "1rem" }}
          />
        </DialogContent>
        <DialogActions sx={{ padding: "1rem", justifyContent: "center" }}>
          <Button
            onClick={handleCloseResetModal}
            className={classes.dialogButton}
            disabled={resetPassword.isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleResetPassword}
            className={classes.dialogButton}
            disabled={resetPassword.isLoading}
            startIcon={
              resetPassword.isLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            {resetPassword.isLoading ? "Sending..." : "Send Reset Email"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoginWithGoogle;

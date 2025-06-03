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
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
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
    backgroundColor: "rgba(30, 30, 30, 0.6) !important",
    padding: "2.5rem !important",
    maxWidth: 500,
    width: "100%",
    borderRadius: "4px !important",
    textAlign: "center",
    border: "1px solid rgba(192, 211, 202, 0.2) !important",
  },
  heading: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "2.2rem !important",
    fontWeight: "300 !important",
    marginBottom: "2rem !important",
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
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "2rem",
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
  },
  signInButton: {
    backgroundColor: "transparent !important",
    color: "#C0D3CA !important",
    border: "1px solid #C0D3CA !important",
    padding: "12px 35px !important",
    fontSize: "0.85rem !important",
    borderRadius: "0 !important",
    fontWeight: "400 !important",
    letterSpacing: "0.15em !important",
    textTransform: "uppercase !important",
    transition: "all 0.3s ease !important",
    fontFamily: "'Montserrat', sans-serif !important",
    marginBottom: "1rem !important",
    width: "100% !important",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.1) !important",
      transform: "translateY(-2px) !important",
    },
    "&:disabled": {
      backgroundColor: "rgba(192, 211, 202, 0.05) !important",
      border: "1px solid rgba(192, 211, 202, 0.3) !important",
      color: "rgba(192, 211, 202, 0.5) !important",
    },
  },
  signUpButton: {
    backgroundColor: "transparent !important",
    color: "#fff !important",
    border: "1px solid #fff !important",
    padding: "12px 35px !important",
    fontSize: "0.85rem !important",
    borderRadius: "0 !important",
    fontWeight: "400 !important",
    letterSpacing: "0.15em !important",
    textTransform: "uppercase !important",
    transition: "all 0.3s ease !important",
    fontFamily: "'Montserrat', sans-serif !important",
    width: "100% !important",
    "&:hover": {
      backgroundColor: "#fff !important",
      color: "#000 !important",
    },
    "&:disabled": {
      backgroundColor: "rgba(255, 255, 255, 0.05) !important",
      border: "1px solid rgba(255, 255, 255, 0.3) !important",
      color: "rgba(255, 255, 255, 0.5) !important",
    },
  },
  toggleText: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    color: "#C0D3CA !important",
    marginTop: "-1rem",
    marginBottom: "1.5rem",
    cursor: "pointer",
    textDecoration: "underline",
    transition: "color 0.2s",
    "&:hover": {
      color: "#fff !important",
    },
  },
  divider: {
    backgroundColor: "rgba(192, 211, 202, 0.2) !important",
    margin: "2rem 0 !important",
  },
  dividerText: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    color: "rgba(192, 211, 202, 0.7) !important",
    margin: "0 1rem !important",
  },
});

const LoginWithGoogle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { googleSignIn, emailSignIn, emailSignUp, isLoading, error } =
    useAuth();
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

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
      await googleSignIn.mutateAsync({ isNewUser });
      const redirectPath = getRedirectPath();
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("Authentication error:", error);
      // Error is already handled in the useAuth hook
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        // Sign up with Firebase
        const user = await emailSignUp.mutateAsync({ email, password });
        // Send extra fields to backend
        await fetch("http://localhost:3020/user/auth-webhook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email,
            name,
            address,
            phone,
            firebaseUid: user.uid,
          }),
        });
      } else {
        await emailSignIn.mutateAsync({ email, password });
      }
      const redirectPath = getRedirectPath();
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("Email authentication error:", error);
    }
  };

  return (
    <Box className={classes.root}>
      <Container maxWidth="sm">
        <Paper className={classes.paper} elevation={0}>
          <Typography className={classes.heading}>
            Welcome to SuitFront
          </Typography>

          {error && (
            <Typography className={classes.errorText}>
              {error.message}
            </Typography>
          )}

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
            />
            <TextField
              className={classes.textField}
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              variant="outlined"
            />
            <Button
              type="submit"
              className={classes.signInButton}
              disabled={isLoading}
            >
              {isLoading ? (
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
            onClick={() => setIsSignUp((prev) => !prev)}
            component="div"
          >
            {isSignUp
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
            <Divider className={classes.divider} sx={{ flex: 1 }} />
            <Typography className={classes.dividerText}>OR</Typography>
            <Divider className={classes.divider} sx={{ flex: 1 }} />
          </Box>

          <Button
            className={classes.signInButton}
            startIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <GoogleIcon />
              )
            }
            onClick={() => handleGoogleAuth(false)}
            disabled={isLoading}
          >
            {isLoading ? "Loging..." : "Login with Google"}
          </Button>

          <Button
            className={classes.signUpButton}
            startIcon={<GoogleIcon />}
            onClick={() => handleGoogleAuth(true)}
            disabled={isLoading}
          >
            Sign up with Google
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginWithGoogle;

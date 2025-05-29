// src/pages/LoginWithGoogle.jsx
import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { Google as GoogleIcon, Email as EmailIcon } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Alert,
  Paper,
  Typography,
  Box,
  Stack,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
} from "@mui/material";
import { registerUser, loginUser } from "../api/user";

const LoginWithGoogle = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [showEmailAuth, setShowEmailAuth] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    lastName: "",
    phoneNumber: "",
    address: "",
  });

  const handleSuccessfulAuth = () => {
    // Get the intended destination from location state, or default to "/"
    const from = location.state?.from?.pathname || "/";
    navigate(from, { replace: true });
  };

  const handleGoogleAuth = async (isNewUser = false) => {
    setLoading(true);
    setError(null);
    try {
      if (isNewUser) {
        provider.setCustomParameters({
          prompt: "select_account",
        });
      }

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userData = {
        email: user.email,
        name: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
        photoURL: user.photoURL,
        phoneNumber: "",
        address: "",
        password: user.uid,
      };

      try {
        if (isNewUser) {
          await registerUser(userData);
        }

        const loginResponse = await loginUser({
          email: user.email,
          password: user.uid,
        });

        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            ...loginResponse.user,
          })
        );

        handleSuccessfulAuth();
      } catch (backendError) {
        console.error("❌ Error with backend:", backendError);
        setError(backendError.message || "Error connecting to server");
      }
    } catch (error) {
      console.error("❌ Error with Google auth:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 0) {
        // Sign In
        const loginResponse = await loginUser({
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("user", JSON.stringify(loginResponse.user));
      } else {
        // Sign Up
        await registerUser(formData);
        const loginResponse = await loginUser({
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("user", JSON.stringify(loginResponse.user));
      }
      setShowEmailAuth(false);
      handleSuccessfulAuth();
    } catch (error) {
      setError(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Box
      sx={{
        backgroundColor: "#161616",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        marginTop: "100px",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Welcome to SuitFront
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={2} sx={{ width: "100%", mt: 2 }}>
          {/* Main Login Options */}
          <Typography variant="h6" sx={{ alignSelf: "center", mb: 1 }}>
            Login Options
          </Typography>

          <Button
            variant="contained"
            onClick={() => handleGoogleAuth(false)}
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <GoogleIcon />
              )
            }
            sx={{
              backgroundColor: "#4285F4",
              "&:hover": {
                backgroundColor: "#357ABD",
              },
              height: "48px",
              fontSize: "1.1rem",
            }}
          >
            {loading ? "Signing in..." : "Login with Google"}
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              setActiveTab(0); // Set to Sign In tab
              setShowEmailAuth(true);
            }}
            startIcon={<EmailIcon />}
            sx={{
              backgroundColor: "#2E7D32",
              "&:hover": {
                backgroundColor: "#1B5E20",
              },
              height: "48px",
              fontSize: "1.1rem",
            }}
          >
            Login with Email
          </Button>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              New to SuitFront?
            </Typography>
          </Divider>

          {/* Sign Up Options */}
          <Typography variant="h6" sx={{ alignSelf: "center", mb: 1 }}>
            Create Account
          </Typography>

          <Button
            variant="outlined"
            onClick={() => handleGoogleAuth(true)}
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <GoogleIcon />
              )
            }
            sx={{
              borderColor: "#4285F4",
              color: "#4285F4",
              "&:hover": {
                borderColor: "#357ABD",
                backgroundColor: "rgba(66, 133, 244, 0.04)",
              },
              height: "48px",
              fontSize: "1.1rem",
            }}
          >
            {loading ? "Creating account..." : "Sign up with Google"}
          </Button>

          <Button
            variant="outlined"
            onClick={() => {
              setActiveTab(1); // Set to Sign Up tab
              setShowEmailAuth(true);
            }}
            startIcon={<EmailIcon />}
            sx={{
              borderColor: "#2E7D32",
              color: "#2E7D32",
              "&:hover": {
                borderColor: "#1B5E20",
                backgroundColor: "rgba(46, 125, 50, 0.04)",
              },
              height: "48px",
              fontSize: "1.1rem",
            }}
          >
            Sign up with Email
          </Button>
        </Stack>
      </Paper>

      {/* Email Authentication Dialog */}
      <Dialog
        open={showEmailAuth}
        onClose={() => setShowEmailAuth(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            centered
          >
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {activeTab === 1 && (
              <>
                <TextField
                  label="First Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </>
            )}
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              required
            />
            {activeTab === 1 && (
              <>
                <TextField
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  multiline
                  rows={2}
                />
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEmailAuth(false)}>Cancel</Button>
          <Button
            onClick={handleEmailAuth}
            variant="contained"
            disabled={
              loading ||
              !formData.email ||
              !formData.password ||
              (activeTab === 1 &&
                (!formData.name ||
                  !formData.lastName ||
                  !formData.phoneNumber ||
                  !formData.address))
            }
          >
            {loading ? "Processing..." : activeTab === 0 ? "Login" : "Sign Up"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoginWithGoogle;

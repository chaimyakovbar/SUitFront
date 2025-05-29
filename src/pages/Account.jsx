import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { authUserAtom } from "../Utils";
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import {
  Email as EmailIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ListAlt as ListAltIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
// import PhoneIcon from '@mui/icons-material/Phone';
import { makeStyles } from "@mui/styles";
import { bodyPoints } from "../consts/KindOfColors";
import useProduct from "../Hooks/useProduct";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../api/user";
import { useSnackbar } from "notistack";
import { postProduct } from "../api/suit";

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
  heading: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "3rem !important",
    fontWeight: "300 !important",
    marginBottom: "2rem !important",
    letterSpacing: "0.05em !important",
    textAlign: "center",
    color: "#fff !important",
  },
  paper: {
    color: "white !important",
    backgroundColor: "rgba(30, 30, 30, 0.6) !important",
    padding: "2.5rem !important",
    borderRadius: "4px !important",
    border: "1px solid rgba(255, 255, 255, 0.2) !important",
  },
  avatar: {
    width: 100,
    height: 100,
    marginRight: 3,
    border: "2px solid rgba(255, 255, 255, 0.3)",
  },
  userName: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "2.2rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.05em !important",
    color: "#fff !important",
  },
  userSubtitle: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    fontWeight: "300 !important",
    color: "#fff !important",
    letterSpacing: "0.05em !important",
  },
  divider: {
    backgroundColor: "rgba(255, 255, 255, 0.2) !important",
    margin: "2rem 0 !important",
  },
  listItem: {
    color: "white !important",
    padding: "1rem 0",
    "& .MuiListItemIcon-root": {
      color: "#fff !important",
    },
  },
  listItemText: {
    color: "white !important",
    "& .MuiTypography-root": {
      fontFamily: "'Montserrat', sans-serif !important",
      color: "#fff !important",
    },
    "& .MuiListItemText-primary": {
      color: "#fff !important",
      fontSize: "0.9rem !important",
      fontWeight: "400 !important",
      letterSpacing: "0.05em !important",
    },
    "& .MuiListItemText-secondary": {
      color: "#fff !important",
      fontSize: "0.85rem !important",
      fontWeight: "300 !important",
    },
  },
  notLoggedIn: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "1.1rem !important",
    fontWeight: "300 !important",
    color: "#fff !important",
    textAlign: "center",
    letterSpacing: "0.05em !important",
  },
  sizesSection: {
    marginTop: "2rem",
  },
  sizesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1.5rem",
    marginTop: "1.5rem",
    padding: "0.5rem",
  },
  sizeItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: "1.2rem",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
  },
  sizeLabel: {
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "500",
    marginBottom: "0.8rem",
    letterSpacing: "0.5px",
  },
  sizeValue: {
    color: "#fff",
    fontSize: "1.2rem",
    fontWeight: "300",
    letterSpacing: "0.5px",
  },
  editButton: {
    color: "#fff !important",
    backgroundColor: "rgba(30, 30, 30, 0.6) !important",
    border: "1px solid rgba(214, 64, 64, 0.3) !important",
    marginTop: "1rem",
    padding: "0.8rem 1.5rem",
    borderRadius: "8px",
    textTransform: "none",
    fontSize: "1rem",
    fontWeight: "500",
    fontFamily: "'Montserrat', sans-serif !important",
    letterSpacing: "0.05em !important",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.2) !important",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
    transition: "all 0.3s ease",
  },
  logoutButton: {
    color: "#fff !important",
    backgroundColor: "rgba(30, 30, 30, 0.6) !important",
    border: "1px solid rgba(214, 64, 64, 0.3) !important",
    marginTop: "2rem",
    padding: "0.8rem 1.5rem",
    borderRadius: "8px",
    textTransform: "none",
    fontSize: "1rem",
    fontWeight: "500",
    fontFamily: "'Montserrat', sans-serif !important",
    letterSpacing: "0.05em !important",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.2) !important",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
    transition: "all 0.3s ease",
  },
  smallEditButton: {
    color: "#fff !important",
    backgroundColor: "rgba(30, 30, 30, 0.6) !important",
    border: "1px solid rgba(214, 64, 64, 0.3) !important",
    marginLeft: "1rem",
    padding: "0.4rem 0.8rem",
    borderRadius: "4px",
    textTransform: "none",
    fontSize: "0.8rem",
    fontWeight: "500",
    fontFamily: "'Montserrat', sans-serif !important",
    letterSpacing: "0.05em !important",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.2) !important",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
    transition: "all 0.3s ease",
  },
});

function Account() {
  const [user, setUser] = useAtom(authUserAtom);
  const classes = useStyles();
  const { data } = useProduct();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [openPhoneDialog, setOpenPhoneDialog] = useState(false);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [address, setAddress] = useState(user?.address || "");
  const [isLoading, setIsLoading] = useState(false);
  const [sizeProfiles, setSizeProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [newProfileName, setNewProfileName] = useState("");
  const [openNewProfileDialog, setOpenNewProfileDialog] = useState(false);

  useEffect(() => {
    if (data?.sizes) {
      const profiles = Object.entries(data.sizes).reduce(
        (acc, [key, value]) => {
          if (key.startsWith("profile_")) {
            const profileName = key.replace("profile_", "");
            acc.push({
              name: profileName,
              sizes: value,
            });
          }
          return acc;
        },
        []
      );
      setSizeProfiles(profiles);

      if (profiles.length > 0 && !selectedProfile) {
        setSelectedProfile(profiles[0]);
      }
    }
  }, [data]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim()) {
      enqueueSnackbar("Phone number cannot be empty", { variant: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await updateUser(user.email, { phoneNumber });
      setUser(updatedUser);
      enqueueSnackbar("Phone number updated successfully", {
        variant: "success",
      });
      setOpenPhoneDialog(false);
    } catch (error) {
      console.error("Error updating phone number:", error);
      enqueueSnackbar(error.message || "Failed to update phone number", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSubmit = async () => {
    if (!address.trim()) {
      enqueueSnackbar("Address cannot be empty", { variant: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await updateUser(user.email, { address });
      setUser(updatedUser);
      enqueueSnackbar("Address updated successfully", { variant: "success" });
      setOpenAddressDialog(false);
    } catch (error) {
      console.error("Error updating address:", error);
      enqueueSnackbar(error.message || "Failed to update address", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewProfile = async () => {
    if (!newProfileName.trim()) {
      enqueueSnackbar("Please enter a profile name", { variant: "error" });
      return;
    }

    const newProfile = {
      name: newProfileName.trim(),
      sizes: {},
    };

    try {
      const updatedSizes = {
        ...data?.sizes,
        [`profile_${newProfileName.trim()}`]: newProfile.sizes,
      };

      await postProduct({
        email: user.email,
        sizes: updatedSizes,
      });

      setSizeProfiles([...sizeProfiles, newProfile]);
      setSelectedProfile(newProfile);
      setNewProfileName("");
      setOpenNewProfileDialog(false);
      enqueueSnackbar("New profile created successfully", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error creating new profile:", error);
      enqueueSnackbar("Failed to create new profile", { variant: "error" });
    }
  };

  if (!user) {
    return (
      <Box className={classes.root}>
        <Container maxWidth="md">
          <Typography className={classes.notLoggedIn}>
            Please log in to view your account details
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box className={classes.root}>
      <Container maxWidth="md">
        <Typography className={classes.heading}>
          Hello {user.displayName || user.name}
        </Typography>

        <Paper elevation={0} className={classes.paper}>
          {/* <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Box>
              <Typography className={classes.userName}>
                {user.displayName || user.name} {user.lastName}
              </Typography>
              <Typography className={classes.userSubtitle}>
                Account Details
              </Typography>
            </Box>
          </Box> */}

          <Divider className={classes.divider} />

          <List>
            <ListItem className={classes.listItem}>
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText
                primary="Email"
                secondary={user.email}
                className={classes.listItemText}
                sx={{
                  "& .MuiListItemText-primary": {
                    color: "#fff !important",
                  },
                  "& .MuiListItemText-secondary": {
                    color: "#fff !important",
                  },
                }}
              />
            </ListItem>

            {user.address && (
              <ListItem className={classes.listItem}>
                <ListItemIcon>
                  <LocationIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Address"
                  secondary={user.address}
                  className={classes.listItemText}
                  sx={{
                    "& .MuiListItemText-primary": {
                      color: "#fff !important",
                    },
                    "& .MuiListItemText-secondary": {
                      color: "#fff !important",
                    },
                  }}
                />
                <Button
                  variant="contained"
                  className={classes.smallEditButton}
                  onClick={() => setOpenAddressDialog(true)}
                >
                  Edit
                </Button>
              </ListItem>
            )}
            {!user.address && (
              <ListItem className={classes.listItem}>
                <ListItemIcon>
                  <LocationIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Missing address, cannot be sent to customer"
                  secondary={user.address}
                  className={classes.listItemText}
                  sx={{
                    "& .MuiListItemText-primary": {
                      color: "#ef5350 !important",
                    },
                    "& .MuiListItemText-secondary": {
                      color: "#ef5350 !important",
                    },
                  }}
                />
                <Button
                  variant="contained"
                  className={classes.smallEditButton}
                  onClick={() => setOpenAddressDialog(true)}
                >
                  Add Address
                </Button>
              </ListItem>
            )}
            {user.phoneNumber && (
              <ListItem className={classes.listItem}>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Phone Number"
                  secondary={user.phoneNumber}
                  className={classes.listItemText}
                  sx={{
                    "& .MuiListItemText-primary": {
                      color: "#fff !important",
                    },
                    "& .MuiListItemText-secondary": {
                      color: "#fff !important",
                    },
                  }}
                />
                <Button
                  variant="contained"
                  className={classes.smallEditButton}
                  onClick={() => setOpenPhoneDialog(true)}
                >
                  Edit
                </Button>
              </ListItem>
            )}
            {!user.phoneNumber && (
              <ListItem className={classes.listItem}>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Missing phoneNumber, cannot be sent to customer"
                  secondary={user.phoneNumber}
                  className={classes.listItemText}
                  sx={{
                    "& .MuiListItemText-primary": {
                      color: "#ef5350 !important",
                    },
                    "& .MuiListItemText-secondary": {
                      color: "#ef5350 !important",
                    },
                  }}
                />
                <Button
                  variant="contained"
                  className={classes.smallEditButton}
                  onClick={() => setOpenPhoneDialog(true)}
                >
                  Add Phone
                </Button>
              </ListItem>
            )}

            {/* <ListItem className={classes.listItem}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText
                primary="User ID"
                secondary={user.uid}
                className={classes.listItemText}
                sx={{
                  "& .MuiListItemText-primary": {
                    color: "#fff !important",
                  },
                  "& .MuiListItemText-secondary": {
                    color: "#fff !important",
                  },
                }}
              />
            </ListItem> */}
          </List>

          <Divider className={classes.divider} />

          <Box className={classes.sizesSection}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography className={classes.userName}>
                Size Profiles
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  className={classes.editButton}
                  startIcon={<ListAltIcon />}
                  onClick={() => (window.location.href = "/sizes/measure")}
                >
                  Edit Measurements
                </Button>
                <Button
                  variant="contained"
                  className={classes.editButton}
                  onClick={() => setOpenNewProfileDialog(true)}
                >
                  Add New Profile
                </Button>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: "#fff" }}>
                Select Profile
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {sizeProfiles.map((profile) => (
                  <Button
                    key={profile.name}
                    variant={
                      selectedProfile?.name === profile.name
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() => setSelectedProfile(profile)}
                    sx={{
                      color: "#fff",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      "&:hover": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                      },
                    }}
                  >
                    {profile.name}
                  </Button>
                ))}
              </Box>
            </Box>

            {selectedProfile && (
              <Box className={classes.sizesGrid}>
                {bodyPoints.map((point) => {
                  const value = selectedProfile.sizes[point.category];
                  return (
                    <Box
                      key={point.id}
                      className={classes.sizeItem}
                      style={{
                        backgroundColor: value
                          ? "rgba(255, 255, 255, 0.05)"
                          : "#faf0f0",
                        border: value
                          ? "1px solid rgba(255, 255, 255, 0.1)"
                          : "1px solid #ef5350",
                        boxShadow: value
                          ? "none"
                          : "0 2px 8px rgba(239, 83, 80, 0.2)",
                      }}
                    >
                      <Typography
                        className={classes.sizeLabel}
                        style={{ color: value ? "#fff" : "#333" }}
                      >
                        {point.label}
                      </Typography>
                      <Typography
                        className={classes.sizeValue}
                        style={{ color: value ? "#fff" : "#333" }}
                      >
                        {value ? `${value} cm` : "?"}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="contained"
              className={classes.logoutButton}
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Add Dialogs */}
      <Dialog
        open={openPhoneDialog}
        onClose={() => !isLoading && setOpenPhoneDialog(false)}
        PaperProps={{
          style: {
            backgroundColor: "#1e1e1e",
            color: "#fff",
          },
        }}
      >
        <DialogTitle>Edit Phone Number</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Phone Number"
            type="tel"
            fullWidth
            variant="outlined"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.7)",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenPhoneDialog(false)}
            sx={{ color: "#fff" }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePhoneSubmit}
            variant="contained"
            sx={{ backgroundColor: "#333" }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAddressDialog}
        onClose={() => !isLoading && setOpenAddressDialog(false)}
        PaperProps={{
          style: {
            backgroundColor: "#1e1e1e",
            color: "#fff",
          },
        }}
      >
        <DialogTitle>Edit Address</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Address"
            type="text"
            fullWidth
            variant="outlined"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.7)",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenAddressDialog(false)}
            sx={{ color: "#fff" }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddressSubmit}
            variant="contained"
            sx={{ backgroundColor: "#333" }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openNewProfileDialog}
        onClose={() => setOpenNewProfileDialog(false)}
        PaperProps={{
          style: {
            backgroundColor: "#1e1e1e",
            color: "#fff",
          },
        }}
      >
        <DialogTitle>Create New Size Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Profile Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.7)",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenNewProfileDialog(false)}
            sx={{ color: "#fff" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateNewProfile}
            variant="contained"
            sx={{ backgroundColor: "#333" }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Account;

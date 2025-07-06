import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { authUserAtom } from "../Utils";
import {
  Box,
  Typography,
  Paper,
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
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Badge,
} from "@mui/material";
import {
  Email as EmailIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Height as HeightIcon,
  ShoppingBag as ShoppingBagIcon,
  CheckCircle as CheckCircleIcon,
  LocalShipping as LocalShippingIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { bodyPoints } from "../consts/KindOfColors";
import useProduct from "../Hooks/useProduct";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../api/user";
import { useSnackbar } from "notistack";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#0a0a0a",
    color: "#fff",
    minHeight: "100vh",
    paddingTop: "120px",
    paddingBottom: "80px",
  },
  sidebar: {
    width: 280,
    backgroundColor: "rgba(30, 30, 30, 0.8)",
    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
    height: "calc(100vh - 200px)",
    position: "sticky",
    top: 120,
  },
  mainContent: {
    flex: 1,
    paddingLeft: "2rem",
  },
  heading: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "2.5rem !important",
    fontWeight: "300 !important",
    marginBottom: "2rem !important",
    letterSpacing: "0.05em !important",
    color: "#fff !important",
  },
  sectionTitle: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "1.8rem !important",
    fontWeight: "300 !important",
    marginBottom: "1.5rem !important",
    letterSpacing: "0.05em !important",
    color: "#fff !important",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  card: {
    backgroundColor: "rgba(30, 30, 30, 0.6) !important",
    border: "1px solid rgba(255, 255, 255, 0.1) !important",
    borderRadius: "12px !important",
    marginBottom: "1.5rem",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
    },
  },
  avatar: {
    width: 80,
    height: 80,
    border: "3px solid rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  userName: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "2rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.05em !important",
    color: "#fff !important",
  },
  userEmail: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    fontWeight: "300 !important",
    color: "rgba(255, 255, 255, 0.7) !important",
    letterSpacing: "0.05em !important",
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem 0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    "&:last-child": {
      borderBottom: "none",
    },
  },
  infoLabel: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    fontWeight: "500 !important",
    color: "rgba(255, 255, 255, 0.8) !important",
    minWidth: "120px",
  },
  infoValue: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    fontWeight: "300 !important",
    color: "#fff !important",
    flex: 1,
  },
  missingInfo: {
    color: "#ef5350 !important",
    fontStyle: "italic",
  },
  editButton: {
    color: "#fff !important",
    backgroundColor: "rgba(214, 64, 64, 0.2) !important",
    border: "1px solid rgba(214, 64, 64, 0.3) !important",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    textTransform: "none",
    fontSize: "0.8rem",
    fontWeight: "500",
    fontFamily: "'Montserrat', sans-serif !important",
    letterSpacing: "0.05em !important",
    "&:hover": {
      backgroundColor: "rgba(214, 64, 64, 0.3) !important",
      transform: "translateY(-1px)",
    },
    transition: "all 0.3s ease",
  },
  measurementsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    marginTop: "1rem",
  },
  measurementCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    textAlign: "center",
  },
  measurementValue: {
    fontSize: "1.5rem",
    fontWeight: "300",
    color: "#FFD700",
    marginBottom: "0.5rem",
  },
  measurementLabel: {
    fontSize: "0.8rem",
    color: "rgba(255, 255, 255, 0.7)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  orderCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: "1rem",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },
  orderNumber: {
    fontSize: "1.1rem",
    fontWeight: "500",
    color: "#FFD700",
  },
  orderDate: {
    fontSize: "0.9rem",
    color: "rgba(255, 255, 255, 0.7)",
  },
  orderStatus: {
    padding: "0.25rem 0.75rem",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "500",
  },
  statusPreparing: {
    backgroundColor: "rgba(255, 193, 7, 0.2)",
    color: "#FFC107",
  },
  statusShipped: {
    backgroundColor: "rgba(33, 150, 243, 0.2)",
    color: "#2196F3",
  },
  statusCompleted: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    color: "#4CAF50",
  },
  statusCancelled: {
    backgroundColor: "rgba(244, 67, 54, 0.2)",
    color: "#F44336",
  },
  orderDetails: {
    padding: "1rem",
  },
  orderTotal: {
    fontSize: "1.2rem",
    fontWeight: "500",
    color: "#FFD700",
    textAlign: "right",
  },
  logoutButton: {
    color: "#fff !important",
    backgroundColor: "rgba(214, 64, 64, 0.2) !important",
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
      backgroundColor: "rgba(214, 64, 64, 0.3) !important",
      transform: "translateY(-2px)",
    },
    transition: "all 0.3s ease",
  },
  sidebarItem: {
    color: "rgba(255, 255, 255, 0.8) !important",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.05) !important",
    },
    "&.active": {
      backgroundColor: "rgba(214, 64, 64, 0.2) !important",
      color: "#fff !important",
      borderLeft: "3px solid #d64040",
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
});

// Mock order data - replace with actual API call
const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "completed",
    products: ["Classic Black Suit", "White Dress Shirt"],
    total: 899.99,
    deliveryDate: "2024-01-20",
  },
  {
    id: "ORD-002",
    date: "2024-02-10",
    status: "shipped",
    products: ["Navy Blue Suit", "Tie Set"],
    total: 749.99,
    deliveryDate: "2024-02-18",
  },
  {
    id: "ORD-003",
    date: "2024-03-05",
    status: "preparing",
    products: ["Gray Pinstripe Suit"],
    total: 649.99,
    deliveryDate: "2024-03-15",
  },
];

function AccountNew() {
  const [user, setUser] = useAtom(authUserAtom);
  const { data } = useProduct();
  const classes = useStyles();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Dialog states
  const [openPhoneDialog, setOpenPhoneDialog] = useState(false);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [openNameDialog, setOpenNameDialog] = useState(false);

  // Form states
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [address, setAddress] = useState(user?.address || "");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [isLoading, setIsLoading] = useState(false);

  // Active section state
  const [activeSection, setActiveSection] = useState("profile");

  // Size profiles state
  const [sizeProfiles, setSizeProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

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

  const handleNameSubmit = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      enqueueSnackbar("First and last name cannot be empty", {
        variant: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await updateUser(user.email, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        displayName: `${firstName.trim()} ${lastName.trim()}`,
      });
      setUser(updatedUser);
      enqueueSnackbar("Name updated successfully", { variant: "success" });
      setOpenNameDialog(false);
    } catch (error) {
      console.error("Error updating name:", error);
      enqueueSnackbar(error.message || "Failed to update name", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon style={{ color: "#4CAF50" }} />;
      case "shipped":
        return <LocalShippingIcon style={{ color: "#2196F3" }} />;
      case "preparing":
        return <PendingIcon style={{ color: "#FFC107" }} />;
      case "cancelled":
        return <CancelIcon style={{ color: "#F44336" }} />;
      default:
        return <PendingIcon style={{ color: "#FFC107" }} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return classes.statusCompleted;
      case "shipped":
        return classes.statusShipped;
      case "preparing":
        return classes.statusPreparing;
      case "cancelled":
        return classes.statusCancelled;
      default:
        return classes.statusPreparing;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderProfileSection = () => (
    <Box>
      <Typography className={classes.sectionTitle}>
        <PersonIcon /> Basic Information
      </Typography>

      <Card className={classes.card}>
        <CardContent>
          <Box className={classes.userInfo}>
            <Avatar className={classes.avatar}>
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
            </Avatar>
            <Box>
              <Typography className={classes.userName}>
                {user?.displayName || user?.firstName || "User"}
              </Typography>
              <Typography className={classes.userEmail}>
                {user?.email}
              </Typography>
            </Box>
            <IconButton
              onClick={() => setOpenNameDialog(true)}
              style={{ color: "#fff", marginLeft: "auto" }}
            >
              <EditIcon />
            </IconButton>
          </Box>

          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>First Name:</Typography>
            <Typography className={classes.infoValue}>
              {user?.firstName || "Not provided"}
            </Typography>
          </Box>

          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>Last Name:</Typography>
            <Typography className={classes.infoValue}>
              {user?.lastName || "Not provided"}
            </Typography>
          </Box>

          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>Email:</Typography>
            <Typography className={classes.infoValue}>{user?.email}</Typography>
          </Box>

          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>Phone:</Typography>
            <Typography
              className={`${classes.infoValue} ${
                !user?.phoneNumber ? classes.missingInfo : ""
              }`}
            >
              {user?.phoneNumber || "Missing phone number"}
            </Typography>
            <Button
              className={classes.editButton}
              onClick={() => setOpenPhoneDialog(true)}
            >
              {user?.phoneNumber ? "Edit" : "Add"}
            </Button>
          </Box>

          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>Address:</Typography>
            <Typography
              className={`${classes.infoValue} ${
                !user?.address ? classes.missingInfo : ""
              }`}
            >
              {user?.address || "Missing address"}
            </Typography>
            <Button
              className={classes.editButton}
              onClick={() => setOpenAddressDialog(true)}
            >
              {user?.address ? "Edit" : "Add"}
            </Button>
          </Box>

          <Box className={classes.infoItem}>
            <Typography className={classes.infoLabel}>Registration:</Typography>
            <Typography className={classes.infoValue}>
              {user?.metadata?.creationTime
                ? formatDate(user.metadata.creationTime)
                : "Unknown"}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  const renderMeasurementsSection = () => (
    <Box>
      <Typography className={classes.sectionTitle}>
        <HeightIcon /> Body Measurements
      </Typography>

      <Card className={classes.card}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" style={{ color: "#fff" }}>
              Size Profiles
            </Typography>
            <Button
              className={classes.editButton}
              onClick={() => navigate("/sizes/measure")}
            >
              Edit Measurements
            </Button>
          </Box>

          {selectedProfile && (
            <Box className={classes.measurementsGrid}>
              {bodyPoints.map((point) => {
                const value = selectedProfile.sizes[point.category];
                return (
                  <Box
                    key={point.id}
                    className={classes.measurementCard}
                    style={{
                      backgroundColor: value
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(239, 83, 80, 0.1)",
                      border: value
                        ? "1px solid rgba(255, 255, 255, 0.1)"
                        : "1px solid rgba(239, 83, 80, 0.3)",
                    }}
                  >
                    <Typography className={classes.measurementValue}>
                      {value ? `${value} cm` : "?"}
                    </Typography>
                    <Typography className={classes.measurementLabel}>
                      {point.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}

          {sizeProfiles.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" style={{ color: "#fff", mb: 1 }}>
                Select Profile:
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {sizeProfiles.map((profile) => (
                  <Chip
                    key={profile.name}
                    label={profile.name}
                    onClick={() => setSelectedProfile(profile)}
                    variant={
                      selectedProfile?.name === profile.name
                        ? "filled"
                        : "outlined"
                    }
                    style={{
                      color: "#fff",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      backgroundColor:
                        selectedProfile?.name === profile.name
                          ? "rgba(214, 64, 64, 0.3)"
                          : "transparent",
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {data?.sizesTable && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" style={{ color: "#FFD700", mb: 2 }}>
                Recommended Sizes
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Box className={classes.measurementCard}>
                  <Typography className={classes.measurementValue}>
                    {data.sizesTable.jacket}
                  </Typography>
                  <Typography className={classes.measurementLabel}>
                    Jacket Size
                  </Typography>
                </Box>
                <Box className={classes.measurementCard}>
                  <Typography className={classes.measurementValue}>
                    {data.sizesTable.pants}
                  </Typography>
                  <Typography className={classes.measurementLabel}>
                    Pants Size
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );

  const renderOrderHistorySection = () => (
    <Box>
      <Typography className={classes.sectionTitle}>
        <ShoppingBagIcon /> Order History
      </Typography>

      {mockOrders.length === 0 ? (
        <Card className={classes.card}>
          <CardContent>
            <Typography
              style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.7)" }}
            >
              No orders found. Start shopping to see your order history here.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        mockOrders.map((order) => (
          <Card key={order.id} className={classes.orderCard}>
            <Box className={classes.orderHeader}>
              <Box>
                <Typography className={classes.orderNumber}>
                  {order.id}
                </Typography>
                <Typography className={classes.orderDate}>
                  {formatDate(order.date)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {getStatusIcon(order.status)}
                <Chip
                  label={order.status}
                  className={getStatusClass(order.status)}
                  size="small"
                />
              </Box>
            </Box>

            <Box className={classes.orderDetails}>
              <Typography variant="subtitle2" style={{ color: "#fff", mb: 1 }}>
                Products:
              </Typography>
              <Box sx={{ mb: 2 }}>
                {order.products.map((product, index) => (
                  <Typography
                    key={index}
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: "0.9rem",
                    }}
                  >
                    • {product}
                  </Typography>
                ))}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "0.9rem",
                  }}
                >
                  Delivery: {formatDate(order.deliveryDate)}
                </Typography>
                <Typography className={classes.orderTotal}>
                  ${order.total}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Button
                  className={classes.editButton}
                  startIcon={<VisibilityIcon />}
                  size="small"
                >
                  View Details
                </Button>
              </Box>
            </Box>
          </Card>
        ))
      )}
    </Box>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSection();
      case "measurements":
        return renderMeasurementsSection();
      case "orders":
        return renderOrderHistorySection();
      default:
        return renderProfileSection();
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
      <Container maxWidth="lg">
        <Typography className={classes.heading}>User Profile</Typography>

        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper className={classes.sidebar}>
              <List>
                <ListItem
                  button
                  className={`${classes.sidebarItem} ${
                    activeSection === "profile" ? "active" : ""
                  }`}
                  onClick={() => setActiveSection("profile")}
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Basic Information" />
                </ListItem>

                <ListItem
                  button
                  className={`${classes.sidebarItem} ${
                    activeSection === "measurements" ? "active" : ""
                  }`}
                  onClick={() => setActiveSection("measurements")}
                >
                  <ListItemIcon>
                    <HeightIcon />
                  </ListItemIcon>
                  <ListItemText primary="Measurements" />
                </ListItem>

                <ListItem
                  button
                  className={`${classes.sidebarItem} ${
                    activeSection === "orders" ? "active" : ""
                  }`}
                  onClick={() => setActiveSection("orders")}
                >
                  <ListItemIcon>
                    <Badge badgeContent={mockOrders.length} color="error">
                      <ShoppingBagIcon />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText primary="Order History" />
                </ListItem>
              </List>

              <Box
                sx={{ p: 2, borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
              >
                <Button
                  fullWidth
                  className={classes.logoutButton}
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <Box className={classes.mainContent}>{renderContent()}</Box>
          </Grid>
        </Grid>
      </Container>

      {/* Dialogs */}
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
        open={openNameDialog}
        onClose={() => !isLoading && setOpenNameDialog(false)}
        PaperProps={{
          style: {
            backgroundColor: "#1e1e1e",
            color: "#fff",
          },
        }}
      >
        <DialogTitle>Edit Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            type="text"
            fullWidth
            variant="outlined"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
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
          <TextField
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            variant="outlined"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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
            onClick={() => setOpenNameDialog(false)}
            sx={{ color: "#fff" }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleNameSubmit}
            variant="contained"
            sx={{ backgroundColor: "#333" }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AccountNew;

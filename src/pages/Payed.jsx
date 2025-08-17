import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Divider,
  IconButton,
  Fade,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useAtom } from "jotai";
import { authUserAtom } from "../Utils";
import useProduct from "../Hooks/useProduct";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import GetAllSuitFromDat from "../components/GetAllSuitFromData";
import { useMediaQuery } from "@mui/material";
import PaymentDialog from "../components/Payment/PaymentDialog";
import { postSuitProduct } from "../api/suit";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#0a0a0a",
    color: "#fff",
    minHeight: "100vh",
    paddingTop: "80px",
    paddingBottom: "80px",
    transition: "all 0.3s ease",
  },
  container: {
    position: "relative",
    maxWidth: "1000px !important",
  },
  paper: {
    backgroundColor: "#202020 !important",
    color: "#fff !important",
    border: "1px solid rgba(255,255,255,0.1) !important",
    borderRadius: "4px !important",
    padding: "3rem !important",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2) !important",
    "&:hover": {
      boxShadow: "0 6px 24px rgba(0,0,0,0.3) !important",
    },
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "2.4rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.12em !important",
    marginBottom: "1.5rem !important",
    textTransform: "uppercase",
    transition: "all 0.3s ease",
  },
  subtitle: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.08em !important",
    color: "#aaa !important",
    marginBottom: "0.5rem !important",
  },
  price: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "2.2rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.05em !important",
    color: "#fff !important",
    marginBottom: "2rem !important",
  },
  shippingTitle: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.95rem !important",
    fontWeight: "400 !important",
    letterSpacing: "0.12em !important",
    textTransform: "uppercase",
    color: "#fff !important",
    marginBottom: "1.2rem !important",
  },
  shippingButton: {
    backgroundColor: "transparent !important",
    color: "#fff !important",
    border: "1px solid rgba(255,255,255,0.2) !important",
    padding: "10px 20px !important",
    fontSize: "0.8rem !important",
    borderRadius: "2px !important",
    fontWeight: "300 !important",
    letterSpacing: "0.12em !important",
    textTransform: "uppercase !important",
    transition: "all 0.3s ease !important",
    fontFamily: "'Montserrat', sans-serif !important",
    marginRight: "1rem !important",
    marginBottom: "0.5rem !important",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.1) !important",
      border: "1px solid rgba(255,255,255,0.4) !important",
      transform: "translateY(-1px)",
    },
  },
  shippingButtonSelected: {
    backgroundColor: "#fff !important",
    color: "#000 !important",
    border: "1px solid #fff !important",
    boxShadow: "0 2px 8px rgba(255,255,255,0.2) !important",
  },
  divider: {
    backgroundColor: "rgba(255,255,255,0.1) !important",
    margin: "2.5rem 0 !important",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    padding: "1rem 0",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },
  totalText: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.9rem !important",
    fontWeight: "400 !important",
    letterSpacing: "0.12em !important",
    textTransform: "uppercase",
    color: "#fff !important",
  },
  totalPrice: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "1.8rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.05em !important",
    color: "#fff !important",
  },
  profileSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  profileTitle: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.95rem !important",
    fontWeight: "400 !important",
    letterSpacing: "0.12em !important",
    textTransform: "uppercase",
    color: "#fff !important",
  },
  editLink: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.8rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.12em !important",
    color: "#aaa !important",
    textDecoration: "none !important",
    transition: "all 0.3s ease !important",
    "&:hover": {
      color: "#fff !important",
      transform: "translateX(2px)",
    },
  },
  paymentButton: {
    backgroundColor: "transparent !important",
    color: "#fff !important",
    border: "1px solid #fff !important",
    padding: "14px 40px !important",
    fontSize: "0.85rem !important",
    borderRadius: "2px !important",
    fontWeight: "300 !important",
    letterSpacing: "0.15em !important",
    textTransform: "uppercase !important",
    transition: "all 0.3s ease !important",
    fontFamily: "'Montserrat', sans-serif !important",
    marginTop: "2.5rem !important",
    width: "100% !important",
    "&:hover": {
      backgroundColor: "#fff !important",
      color: "#000 !important",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(255,255,255,0.2) !important",
    },
    "&:disabled": {
      backgroundColor: "rgba(255,255,255,0.05) !important",
      border: "1px solid rgba(255,255,255,0.2) !important",
      color: "rgba(255,255,255,0.3) !important",
      transform: "none",
      boxShadow: "none",
    },
  },
  dialog: {
    width: (props) => (props.isMobile ? "100% !important" : "90% !important"),
    height: (props) => (props.isMobile ? "90% !important" : "90% !important"),
    "& .MuiDialog-paper": {
      backgroundColor: "#202020 !important",
      color: "#fff !important",
      borderRadius: "4px !important",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3) !important",
    },
  },
  dialogTitle: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "1.6rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.12em !important",
    textTransform: "uppercase",
    color: "#fff !important",
    padding: "2rem !important",
    borderBottom: "1px solid rgba(255,255,255,0.1) !important",
  },
  contactInfo: {
    backgroundColor: "rgba(255,255,255,0.03) !important",
    padding: "1.5rem !important",
    borderRadius: "2px !important",
    marginTop: "2rem !important",
  },
  contactLabel: {
    color: "#fff !important",
    fontSize: "0.85rem !important",
    fontWeight: "400 !important",
    letterSpacing: "0.08em !important",
    marginBottom: "0.3rem !important",
  },
  contactValue: {
    color: "#aaa !important",
    fontSize: "0.9rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.05em !important",
  },
  errorText: {
    color: "#ef5350 !important",
    fontSize: "0.85rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.05em !important",
    marginBottom: "0.5rem !important",
  },
});

const Payed = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const classes = useStyles({ isMobile });
  const navigate = useNavigate();
  const { data: products } = useProduct();
  const [user] = useAtom(authUserAtom);
  const [open, setOpen] = useState(false);
  const [selectedSuits, setSelectedSuits] = useState(() => {
    const saved = localStorage.getItem("selectedSuits");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [totalPrice, setTotalPrice] = useState(() => {
    const saved = localStorage.getItem("totalPrice");
    return saved ? Number(saved) : 0;
  });
  const [shippingCost, setShippingCost] = useState(0);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [sizeProfiles, setSizeProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileType, setProfileType] = useState("regular");
  const [hasSizesTable, setHasSizesTable] = useState(false);

  // Initialize profiles from data
  useEffect(() => {
    if (products?.sizes) {
      // Check for sizesTable
      if (products.sizesTable) {
        setHasSizesTable(true);
      }

      const profiles = Object.entries(products.sizes).reduce(
        (acc, [key, value]) => {
          if (key.startsWith("profile_")) {
            const profileName = key.replace("profile_", "");
            acc.push({
              name: profileName,
              sizes: value || {},
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
  }, [products]);

  // Automatically select all suits when entering the payment page
  useEffect(() => {
    if (products?.allSuitPart) {
      const allSuitIds = new Set(products.allSuitPart.map((suit) => suit._id));
      const total = products.allSuitPart.reduce(
        (sum, suit) => sum + suit.totalPrice,
        0
      );

      setSelectedSuits(allSuitIds);
      setTotalPrice(total);
    }
  }, [products]);

  // Save to localStorage whenever selectedSuits or totalPrice changes
  useEffect(() => {
    localStorage.setItem("selectedSuits", JSON.stringify([...selectedSuits]));
    localStorage.setItem("totalPrice", totalPrice.toString());
  }, [selectedSuits, totalPrice]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleSelect = (suitId, price) => {
    const isSelected = selectedSuits.has(suitId);
    const newSet = new Set(selectedSuits);

    if (isSelected) {
      newSet.delete(suitId);
      setTotalPrice(totalPrice - price);
    } else {
      newSet.add(suitId);
      setTotalPrice(totalPrice + price);
    }

    setSelectedSuits(newSet);
  };

  const handlePayment = async () => {
    if (selectedSuits.size === 0) {
      alert("Please select at least one suit before proceeding to payment");
      return;
    }

    if (!user?.address || !user?.phoneNumber) {
      alert(
        "Please complete your contact information before proceeding to payment"
      );
      return;
    }

    setIsPaymentDialogOpen(true);
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      const selectedSuitIds = Array.from(selectedSuits);
      const selectedSuitsData = products.allSuitPart.filter((suit) =>
        selectedSuitIds.includes(suit._id)
      );

      const paymentData = {
        userEmail: user.email,
        suits: selectedSuitsData,
        totalAmount: totalPrice,
        shippingCost: shippingCost,
        shippingType:
          shippingCost === 0
            ? "Free"
            : shippingCost === 20
            ? "Fast"
            : "Fastest",
        paymentIntentId: paymentIntent.id,
      };

      // Create order with pending approval status
      const orderData = {
        userId: user.email || user.uid || `user_${Date.now()}`,
        name: user.displayName || user.name || "Unknown User",
        email: user.email,
        phoneNumber: user.phoneNumber || "0000000000",
        address: user.address || "No address provided",
        paymentId: paymentIntent.id,
        totalAmount: totalPrice,
        shippingCost: shippingCost,
        shippingSpeed:
          shippingCost === 0
            ? "STANDARD"
            : shippingCost === 20
            ? "EXPRESS"
            : "SAME_DAY",
        selectedSuits: selectedSuitsData,
        sizeProfile: selectedProfile?.name || "",
        sizeMeasurements: selectedProfile?.sizes || {},
        paymentDate: new Date().toISOString(),
      };

      // Save the order with pending status
      const response = await fetch(`${baseURL}/payments/create-order-pending`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const orderResult = await response.json();

      // Clear the cart
      localStorage.removeItem("selectedSuits");
      localStorage.removeItem("totalPrice");

      // Navigate to success page with pending status info
      navigate("/payment-success", {
        state: {
          paymentData,
          orderStatus: "PENDING",
          orderId: orderResult.orderId,
          message:
            "Your payment has been processed and is awaiting approval. You will receive a confirmation email once your order is approved.",
        },
      });
    } catch (error) {
      console.error("Error saving order:", error);
      alert("There was an error saving your order. Please contact support.");
    }
  };

  // if (!user) return <HaveUser />;

  const selectedItemsCount = selectedSuits.size;

  return (
    <Fade in={true} timeout={800}>
      <Box className={classes.root}>
        <Container maxWidth="md" className={classes.container}>
          <Paper className={classes.paper}>
            <Stack spacing={4}>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <ShoppingBagIcon
                    sx={{ mr: 2, color: "#fff", fontSize: "2rem" }}
                  />
                  <Typography className={classes.title}>Your Order</Typography>
                  <IconButton
                    onClick={handleClick}
                    sx={{
                      color: "#fff",
                      marginLeft: "auto",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "rotate(180deg)",
                      },
                    }}
                  >
                    <KeyboardArrowDownIcon />
                  </IconButton>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography className={classes.subtitle}>
                    {selectedItemsCount} Item/s in your Bag for a value of
                  </Typography>
                  <Typography className={classes.price}>
                    {totalPrice.toFixed(2)}€
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography className={classes.shippingTitle}>
                    Shipping cost:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    <Button
                      onClick={() => {
                        setShippingCost(0);
                        setTotalPrice((prev) => prev - shippingCost);
                      }}
                      className={`${classes.shippingButton} ${
                        shippingCost === 0 ? classes.shippingButtonSelected : ""
                      }`}
                    >
                      Free & tracked (0€)
                    </Button>
                    <Button
                      onClick={() => {
                        setShippingCost(20);
                        setTotalPrice((prev) => prev - shippingCost + 20);
                      }}
                      className={`${classes.shippingButton} ${
                        shippingCost === 20
                          ? classes.shippingButtonSelected
                          : ""
                      }`}
                    >
                      Fast & tracked (+20€)
                    </Button>
                    <Button
                      onClick={() => {
                        setShippingCost(35);
                        setTotalPrice((prev) => prev - shippingCost + 35);
                      }}
                      className={`${classes.shippingButton} ${
                        shippingCost === 35
                          ? classes.shippingButtonSelected
                          : ""
                      }`}
                    >
                      Fastest & tracked (+35€)
                    </Button>
                  </Box>
                </Box>

                <Divider className={classes.divider} />
              </Box>

              <Box>
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography className={classes.shippingTitle}>
                      Select Size Profile Type
                    </Typography>
                    <Link to="/IndexSizes" className={classes.editLink}>
                      Edit
                    </Link>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <Button
                      onClick={() => setProfileType("regular")}
                      className={`${classes.shippingButton} ${
                        profileType === "regular"
                          ? classes.shippingButtonSelected
                          : ""
                      }`}
                    >
                      Regular Profile
                    </Button>
                    {hasSizesTable && (
                      <Button
                        onClick={() => setProfileType("sizesTable")}
                        className={`${classes.shippingButton} ${
                          profileType === "sizesTable"
                            ? classes.shippingButtonSelected
                            : ""
                        }`}
                      >
                        Size Table
                      </Button>
                    )}
                  </Box>

                  {profileType === "regular" && (
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Select
                        value={selectedProfile?.name || ""}
                        onChange={(e) => {
                          const profile = sizeProfiles.find(
                            (p) => p.name === e.target.value
                          );
                          setSelectedProfile(profile);
                        }}
                        sx={{
                          color: "#fff",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255, 255, 255, 0.2)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255, 255, 255, 0.4)",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#fff",
                          },
                        }}
                      >
                        {sizeProfiles.map((profile) => (
                          <MenuItem key={profile.name} value={profile.name}>
                            {profile.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  {profileType === "sizesTable" && products?.sizesTable && (
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ color: "#fff", mb: 1 }}>
                        Jacket Size: {products.sizesTable.jacket}
                      </Typography>
                      <Typography sx={{ color: "#fff" }}>
                        Pants Size: {products.sizesTable.pants}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box className={classes.contactInfo}>
                  <Typography className={classes.shippingTitle}>
                    Contact Information
                  </Typography>
                  {user?.address ? (
                    <Box sx={{ mb: 2 }}>
                      <Typography className={classes.contactLabel}>
                        Address:
                      </Typography>
                      <Typography className={classes.contactValue}>
                        {user.address}
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ mb: 2 }}>
                      <Typography className={classes.errorText}>
                        Missing address, please add your address in your account
                        settings
                      </Typography>
                    </Box>
                  )}

                  {user?.phoneNumber ? (
                    <Box sx={{ mb: 2 }}>
                      <Typography className={classes.contactLabel}>
                        Phone:
                      </Typography>
                      <Typography className={classes.contactValue}>
                        {user.phoneNumber}
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ mb: 2 }}>
                      <Typography className={classes.errorText}>
                        Missing phone number, please add your phone in your
                        account settings
                      </Typography>
                    </Box>
                  )}

                  <Link to="/account" className={classes.editLink}>
                    Edit Contact Information
                  </Link>
                </Box>
              </Box>

              <Box className={classes.totalRow}>
                <Typography className={classes.totalText}>
                  Subtotal (VAT incl.)
                </Typography>
                <Typography className={classes.totalPrice}>
                  {totalPrice}€
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Button
            variant="outlined"
            onClick={handlePayment}
            disabled={!selectedProfile}
            className={classes.paymentButton}
          >
            Continue to Payment
          </Button>

          <PaymentDialog
            open={isPaymentDialogOpen}
            onClose={() => setIsPaymentDialogOpen(false)}
            amount={totalPrice * 100} // Convert to cents
            userEmail={user?.email}
            shippingType={
              shippingCost === 0
                ? "Free"
                : shippingCost === 20
                ? "Fast"
                : "Fastest"
            }
            onSuccess={handlePaymentSuccess}
          />

          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            maxWidth="md"
            fullWidth
            className={classes.dialog}
          >
            <DialogTitle className={classes.dialogTitle}>
              Select Items
            </DialogTitle>
            <DialogContent>
              <GetAllSuitFromDat
                onSelect={handleSelect}
                selectedSuits={selectedSuits}
              />
            </DialogContent>
          </Dialog>
        </Container>
      </Box>
    </Fade>
  );
};

export default Payed;

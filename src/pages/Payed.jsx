import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Container,
  Stack,
  Divider,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import GetAllSuitFromDat from "../components/GetAllSuitFromData";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import useProduct from "../Hooks/useProduct";
import { authUserAtom } from "../Utils";
import { useAtom } from "jotai";
import { makeStyles } from "@mui/styles";
import { useMediaQuery } from "@mui/material";
// import HaveUser from "../components/HaveUser";

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
    backgroundColor: "#202020 !important",
    color: "#fff !important",
    border: "1px solid rgba(255,255,255,0.1) !important",
    borderRadius: "0 !important",
    padding: "2rem !important",
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "2.8rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.1em !important",
    marginBottom: "2rem !important",
    textTransform: "uppercase",
  },
  subtitle: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.95rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.05em !important",
    color: "#aaa !important",
  },
  price: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "2rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.05em !important",
    color: "#fff !important",
  },
  shippingTitle: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "1rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.1em !important",
    textTransform: "uppercase",
    color: "#fff !important",
    marginBottom: "1rem !important",
  },
  shippingButton: {
    backgroundColor: "transparent !important",
    color: "#fff !important",
    border: "1px solid rgba(255,255,255,0.3) !important",
    padding: "8px 16px !important",
    fontSize: "0.85rem !important",
    borderRadius: "0 !important",
    fontWeight: "300 !important",
    letterSpacing: "0.1em !important",
    textTransform: "uppercase !important",
    transition: "all 0.3s ease !important",
    fontFamily: "'Montserrat', sans-serif !important",
    marginRight: "1rem !important",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.1) !important",
      border: "1px solid rgba(255,255,255,0.5) !important",
    },
  },
  shippingButtonSelected: {
    backgroundColor: "#fff !important",
    color: "#000 !important",
    border: "1px solid #fff !important",
  },
  divider: {
    backgroundColor: "rgba(255,255,255,0.1) !important",
    margin: "2rem 0 !important",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  totalText: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "1rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.1em !important",
    textTransform: "uppercase",
    color: "#fff !important",
  },
  totalPrice: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "1.5rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.05em !important",
    color: "#fff !important",
  },
  profileSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  profileTitle: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "1rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.1em !important",
    textTransform: "uppercase",
    color: "#fff !important",
  },
  editLink: {
    fontFamily: "'Montserrat', sans-serif !important",
    fontSize: "0.85rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.1em !important",
    color: "#aaa !important",
    textDecoration: "none !important",
    transition: "color 0.3s ease !important",
    "&:hover": {
      color: "#fff !important",
    },
  },
  paymentButton: {
    backgroundColor: "transparent !important",
    color: "#fff !important",
    border: "1px solid #fff !important",
    padding: "12px 35px !important",
    fontSize: "0.85rem !important",
    borderRadius: "0 !important",
    fontWeight: "300 !important",
    letterSpacing: "0.15em !important",
    textTransform: "uppercase !important",
    transition: "all 0.3s ease !important",
    fontFamily: "'Montserrat', sans-serif !important",
    marginTop: "2rem !important",
    "&:hover": {
      backgroundColor: "#fff !important",
      color: "#000 !important",
    },
    "&:disabled": {
      backgroundColor: "rgba(255,255,255,0.1) !important",
      border: "1px solid rgba(255,255,255,0.3) !important",
      color: "rgba(255,255,255,0.5) !important",
    },
  },
  dialog: {
    width: (props) => (props.isMobile ? "100% !important" : "100% !important"),
    height: (props) => (props.isMobile ? "80% !important" : "100% !important"),
    "& .MuiDialog-paper": {
      backgroundColor: "#202020 !important",
      color: "#fff !important",
      borderRadius: "0 !important",
    },
  },
  dialogTitle: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "1.8rem !important",
    fontWeight: "300 !important",
    letterSpacing: "0.1em !important",
    textTransform: "uppercase",
    color: "#fff !important",
    padding: "2rem !important",
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [sizeProfiles, setSizeProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileType, setProfileType] = useState("regular"); // 'regular' or 'sizesTable'
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

    setIsProcessing(true);
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
      };

      // Here you would typically call your payment API
      // For example:
      // const response = await fetch('YOUR_PAYMENT_API_ENDPOINT', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(paymentData),
      // });

      // For now, we'll just navigate to a success page
      navigate("/payment-success", { state: { paymentData } });
    } catch (error) {
      console.error("Payment processing error:", error);
      alert("There was an error processing your payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // if (!user) return <HaveUser />;

  const selectedItemsCount = selectedSuits.size;

  return (
    <Box className={classes.root}>
      <Container maxWidth="md" className={classes.container}>
        <Paper className={classes.paper}>
          <Stack spacing={3}>
            <Box>
              <ShoppingBagIcon sx={{ mr: 1, color: "#fff" }} />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography className={classes.title}>Your Order</Typography>
                </Box>
                <IconButton onClick={handleClick} sx={{ color: "#fff" }}>
                  <KeyboardArrowDownIcon />
                </IconButton>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography className={classes.subtitle}>
                  {selectedItemsCount} Item/s in your Bag for a value of
                </Typography>
                <Typography className={classes.price}>
                  {totalPrice.toFixed(2)}€
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography className={classes.shippingTitle}>
                  Shipping cost:
                </Typography>
                <Box>
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
                      shippingCost === 20 ? classes.shippingButtonSelected : ""
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
                      shippingCost === 35 ? classes.shippingButtonSelected : ""
                    }`}
                  >
                    Fastest & tracked (+35€)
                  </Button>
                </Box>
              </Box>

              <Divider className={classes.divider} />
            </Box>
            <Box>
              <Box sx={{ mb: 3 }}>
                <div>
                  <Typography className={classes.shippingTitle}>
                    Select Size Profile Type
                  </Typography>
                  <Link to="/IndexSizes" className={classes.editLink}>
                    Edit
                  </Link>
                </div>

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
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
                          borderColor: "rgba(255, 255, 255, 0.3)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(255, 255, 255, 0.5)",
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
              <Box className={classes.profileSection}></Box>

              {/* Contact Information */}
              <Box sx={{ mt: 3 }}>
                <Typography className={classes.shippingTitle}>
                  Contact Information
                </Typography>
                {user?.address ? (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      sx={{ color: "#fff", fontSize: "0.9rem", mb: 0.5 }}
                    >
                      Address:
                    </Typography>
                    <Typography sx={{ color: "#aaa", fontSize: "0.85rem" }}>
                      {user.address}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ color: "#ef5350", fontSize: "0.9rem" }}>
                      Missing address, please add your address in your account
                      settings
                    </Typography>
                  </Box>
                )}

                {user?.phoneNumber ? (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      sx={{ color: "#fff", fontSize: "0.9rem", mb: 0.5 }}
                    >
                      Phone:
                    </Typography>
                    <Typography sx={{ color: "#aaa", fontSize: "0.85rem" }}>
                      {user.phoneNumber}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ color: "#ef5350", fontSize: "0.9rem" }}>
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
          disabled={isProcessing || !selectedProfile}
          className={classes.paymentButton}
        >
          {isProcessing ? "Processing..." : "Continue to Payment"}
        </Button>

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
  );
};

export default Payed;

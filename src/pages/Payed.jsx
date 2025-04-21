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
} from "@mui/material";
import GetAllSuitFromDat from "../components/GetAllSuitFromData";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import useProduct from "../Hooks/useProduct";
import { userAtom } from "../Utils";
import { useAtom } from "jotai";
import HaveUser from "../components/HaveUser";

const Payed = () => {
  const navigate = useNavigate();
  const { data: products } = useProduct();
  const [user] = useAtom(userAtom);
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

  if (!user) return <HaveUser />;

  const selectedItemsCount = selectedSuits.size;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: "#f8f8f8",
        }}
      >
        <Stack spacing={3}>
          {/* Order Summary Section */}
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ShoppingBagIcon sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="medium">
                  Your Order
                </Typography>
              </Box>
              <IconButton onClick={handleClick}>
                <KeyboardArrowDownIcon />
              </IconButton>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                {selectedItemsCount} Item/s in your Bag for a value of
              </Typography>
              <Typography variant="h6">{totalPrice.toFixed(2)}€</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Box>
                <h2>Shipping cost:</h2>
                <div>
                  <Button
                    onClick={() => {
                      setShippingCost(0);
                      setTotalPrice((prev) => prev - shippingCost);
                    }}
                    sx={{
                      backgroundColor:
                        shippingCost === 0 ? "#4CAF50" : "inherit",
                      color: shippingCost === 0 ? "white" : "inherit",
                      "&:hover": {
                        backgroundColor:
                          shippingCost === 0 ? "#388E3C" : "rgba(0,0,0,0.04)",
                      },
                    }}
                  >
                    Free & tracked (0€)
                  </Button>
                  <Button
                    onClick={() => {
                      setShippingCost(20);
                      setTotalPrice((prev) => prev - shippingCost + 20);
                    }}
                    sx={{
                      backgroundColor:
                        shippingCost === 20 ? "#4CAF50" : "inherit",
                      color: shippingCost === 20 ? "white" : "inherit",
                      "&:hover": {
                        backgroundColor:
                          shippingCost === 20 ? "#388E3C" : "rgba(0,0,0,0.04)",
                      },
                    }}
                  >
                    Fast & tracked (+20€)
                  </Button>
                  <Button
                    onClick={() => {
                      setShippingCost(35);
                      setTotalPrice((prev) => prev - shippingCost + 35);
                    }}
                    sx={{
                      backgroundColor:
                        shippingCost === 35 ? "#4CAF50" : "inherit",
                      color: shippingCost === 35 ? "white" : "inherit",
                      "&:hover": {
                        backgroundColor:
                          shippingCost === 35 ? "#388E3C" : "rgba(0,0,0,0.04)",
                      },
                    }}
                  >
                    Fastest & tracked (+35€)
                  </Button>
                </div>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6">Subtotal (VAT incl.)</Typography>
              <Typography variant="h6">{totalPrice}€</Typography>
            </Box>
          </Box>

          {/* Body Profile Section */}
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Your body profile</Typography>
              <Link
                to="/IndexSizes"
                style={{
                  textDecoration: "none",
                  color: "#666",
                  fontWeight: "500",
                }}
              >
                Edit
              </Link>
            </Box>
          </Box>
        </Stack>
      </Paper>

      <Button
        variant="contained"
        onClick={handlePayment}
        disabled={isProcessing}
        sx={{
          mt: 3,
          backgroundColor: "#4CAF50",
          color: "white",
          "&:hover": {
            backgroundColor: "#388E3C",
          },
          "&:disabled": {
            backgroundColor: "#cccccc",
          },
        }}
      >
        {isProcessing ? "Processing..." : "Continue to Payment"}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Select Items</DialogTitle>
        <DialogContent>
          <GetAllSuitFromDat
            onSelect={handleSelect}
            selectedSuits={selectedSuits}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Payed;

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  AddressElement,
} from "@stripe/react-stripe-js";
import { useSnackbar } from "notistack";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: "if_required",
      });

      if (error) {
        enqueueSnackbar(error.message, { variant: "error" });
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      enqueueSnackbar("An error occurred while processing your payment.", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ maxWidth: 500, mx: "auto", p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Payment Details
        </Typography>

        <Box sx={{ mb: 3 }}>
          <PaymentElement />
        </Box>

        <Box sx={{ mb: 3 }}>
          <AddressElement options={{ mode: "shipping" }} />
        </Box>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "10px 20px",
              backgroundColor: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              borderRadius: "2px",
              cursor: "pointer",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.85rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || isLoading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#fff",
              border: "1px solid #fff",
              color: "#000",
              borderRadius: "2px",
              cursor: "pointer",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.85rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={16} color="inherit" />
                Processing...
              </>
            ) : (
              `Pay ${(amount / 100).toFixed(2)}€`
            )}
          </button>
        </Box>
      </Box>
    </form>
  );
};

const PaymentDialog = ({
  open,
  onClose,
  amount,
  userEmail,
  shippingType,
  onSuccess,
}) => {
  const [clientSecret, setClientSecret] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (open) {
      // Create PaymentIntent as soon as the dialog opens
      fetch("http://localhost:3020/api/payments/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          userEmail,
          shippingType,
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch((err) => {
          enqueueSnackbar("Failed to initialize payment", { variant: "error" });
          onClose();
        });
    }
  }, [open, amount, userEmail, shippingType]);

  const appearance = {
    theme: "night",
    variables: {
      colorPrimary: "#ffffff",
      colorBackground: "#202020",
      colorText: "#ffffff",
      colorDanger: "#df1b41",
      fontFamily:
        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      spacingUnit: "4px",
      borderRadius: "4px",
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#202020",
          color: "#fff",
          borderRadius: "4px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.6rem",
          fontWeight: 300,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#fff",
          padding: "2rem",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        Complete Your Payment
      </DialogTitle>
      <DialogContent>
        {clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance,
            }}
          >
            <PaymentForm
              amount={amount}
              onSuccess={onSuccess}
              onCancel={onClose}
            />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;

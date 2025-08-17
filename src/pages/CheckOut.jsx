import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { saveOrder, removePurchasedSuits } from "../api/orders";
import useProduct from "../Hooks/useProduct";

const Checkout = ({
  totalPrice = 199.99,
  user = null,
  selectedSuits = [],
  shippingCost = 0,
  shippingSpeed = "STANDARD",
  sizeProfile = null,
  sizeMeasurements = {},
  onPaymentSuccess = null,
}) => {
  const { data: products } = useProduct();

  // Helper function to save user data to database (excluding payment info)
  const saveUserDataToDatabase = async (paymentDetails) => {
    try {
      // Generate a fallback userId if none exists
      const userId =
        user?.uid || user?.id || user?.email || `user_${Date.now()}`;


      // Build full suit objects array
      let fullSuits = [];
      if (products?.allSuitPart && selectedSuits) {
        const selectedIds = Array.from(selectedSuits);
        fullSuits = products.allSuitPart.filter((suit) =>
          selectedIds.includes(suit._id)
        );
      }

      const userData = {
        userId: userId,
        name: user?.displayName || user?.name || "Unknown User",
        email: user?.email || "no-email@example.com",
        phoneNumber: user?.phoneNumber || "0000000000",
        address: user?.address || "No address provided",
        paymentId: paymentDetails.id,
        paymentStatus: paymentDetails.status,
        totalAmount: totalPrice,
        shippingCost: shippingCost,
        shippingSpeed: shippingSpeed,
        selectedSuits: fullSuits, // Send full suit objects
        sizeProfile: sizeProfile,
        sizeMeasurements: sizeMeasurements,
        paymentDate: new Date().toISOString(),
        // Add any other relevant user data you want to store
      };


      // Try to save to server first, fallback to localStorage
      let savedOrder = null;
      try {
        const response = await saveOrder(userData);
        savedOrder = response.order;

        // Remove purchased suits from database
        try {
          await removePurchasedSuits(
            savedOrder.orderId,
            Array.from(selectedSuits)
          );
        } catch (removeError) {
          console.warn("Failed to remove suits from database:", removeError);
          // Continue with the process even if suit removal fails
        }
      } catch (serverError) {
        console.warn(
          "Server not available, saving to localStorage:",
          serverError
        );

        // Save to localStorage as fallback
        const existingOrders = JSON.parse(
          localStorage.getItem("orders") || "[]"
        );
        savedOrder = {
          ...userData,
          orderId: Date.now(), // Generate local ID
          savedLocally: true,
        };
        existingOrders.push(savedOrder);
        localStorage.setItem("orders", JSON.stringify(existingOrders));
      }

      // Call the success callback if provided
      if (onPaymentSuccess) {
        onPaymentSuccess(paymentDetails, savedOrder);
      }
    } catch (error) {
      console.error("Error saving user data:", error);
      // You might want to show an error message to the user
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AZVzZ1I_zTgDWt84EE7L4sdey4O59ZcVDmNgPYTpMZzYrdEvUs5iT0H4VUb0nNzTy9GN1OEGOVtpwFfh",
        currency: "ILS",
        locale: "he_IL",
      }}
    >
      <div style={{ maxWidth: 400, margin: "auto" }}>
        <h2 style={{ color: "white" }}>סה״כ לתשלום: ₪{totalPrice}</h2>

        <PayPalButtons
          style={{ layout: "vertical", color: "gold" }}
          forceReRender={[totalPrice, user]}
          createOrder={(data, actions) => {
            // Start with minimal required order data
            const orderData = {
              purchase_units: [
                {
                  amount: {
                    value: totalPrice.toFixed(2),
                    currency_code: "ILS",
                  },
                },
              ],
            };

            // Only add basic payer info if we have valid data
            if (user && user.email) {
              orderData.payer = {
                email_address: user.email,
              };

              // Add name only if it exists and is not empty
              if (user.displayName && user.displayName.trim()) {
                orderData.payer.name = {
                  given_name: user.displayName.trim(),
                };
              } else if (user.name && user.name.trim()) {
                orderData.payer.name = {
                  given_name: user.name.trim(),
                };
              }
            }

            return actions.order.create(orderData);
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then((details) => {
             

              // Save user data to database (excluding payment info)
              saveUserDataToDatabase(details);

              alert(`התשלום הושלם בהצלחה! מספר הזמנה: ${details.id}`);
            });
          }}
          onError={(err) => {
            console.error("PayPal payment error:", err);
            alert("אירעה שגיאה בתהליך התשלום. אנא נסה שוב.");
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default Checkout;

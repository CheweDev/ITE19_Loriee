// PayPalButton.jsx
import React, { useEffect } from "react";

const PayPalButton = ({ amount, onSuccess }) => {
  useEffect(() => {
    if (!window.paypal) {
      // Dynamically load the PayPal SDK (sandbox environment)
      const script = document.createElement("script");
      script.src =
        "https://www.paypal.com/sdk/js?client-id=AS1ycbrpeUKgnUQv77WYPoy-NvrrEfJnQPtw3gtQWxQ2WYe8-LA8KZZfEyzJICDEVwaQB8uJ9NUEp4QY"; // Replace with your sandbox Client ID
      script.async = true;
      script.onload = () => {
        renderPayPalButton();
      };
      document.body.appendChild(script);
    } else {
      renderPayPalButton();
    }
  }, []);

  const renderPayPalButton = () => {
    window.paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount, // Amount to be paid
                },
              },
            ],
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            console.log("Payment successful:", details);
            onSuccess(details); // Pass the payment details to the parent component
          });
        },
        onError: (err) => {
          console.error("Error with PayPal button:", err);
          alert("An error occurred during the payment process.");
        },
      })
      .render("#paypal-button-container");
  };

  return <div id="paypal-button-container"></div>;
};

export default PayPalButton;

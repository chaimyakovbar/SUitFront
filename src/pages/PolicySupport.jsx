import React from "react";

const PolicySupport = () => {
  return (
    <div
      style={{
        backgroundColor: "#FAF3E0", // Cream background for luxury feel
        color: "#2C2C2C",
        padding: "50px",
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          backgroundColor: "#FFF",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          borderLeft: "5px solid #8B5E3C", // Luxurious brown accent
          textAlign: "left",
        }}
      >
        <h2
          style={{
            color: "#1B3B6F", // Deep blue for luxury feel
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "15px",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          Policy & Support
        </h2>

        <h3 style={{ color: "#8B5E3C" }}>1. Shipping & Delivery</h3>
        <ul>
          <li>Orders are processed within 1-3 business days.</li>
          <li>Standard shipping takes 5-10 business days; expedited 2-5 days.</li>
          <li>We offer worldwide shipping; delivery times vary.</li>
          <li>Shipping fees are calculated at checkout.</li>
          <li>Tracking information is sent via email once shipped.</li>
        </ul>

        <h3 style={{ color: "#8B5E3C" }}>2. Returns & Exchanges</h3>
        <ul>
          <li>Returns accepted within 14 days if unworn and unaltered.</li>
          <li>Exchanges available within 7 days for size/style adjustments.</li>
          <li>Custom suits & clearance items are non-returnable.</li>
          <li>Refunds issued within 7 business days after return approval.</li>
        </ul>

        <h3 style={{ color: "#8B5E3C" }}>3. Sizing Assistance</h3>
        <ul>
          <li>Use our detailed size guide for best fit.</li>
          <li>Custom-tailored suits available based on measurements.</li>
          <li>Live chat support for sizing help before ordering.</li>
        </ul>

        <h3 style={{ color: "#8B5E3C" }}>4. Customer Support</h3>
        <ul>
          <li>Email: support@yourstore.com</li>
          <li>Phone: +1 234 567 890</li>
          <li>Live Chat: Available Mon-Fri, 9 AM - 6 PM (EST).</li>
          <li>We respond to inquiries within 24 hours.</li>
        </ul>

        <h3 style={{ color: "#8B5E3C" }}>5. Privacy Policy</h3>
        <ul>
          <li>We use secure encryption to protect personal data.</li>
          <li>Your information is never sold or shared with third parties.</li>
          <li>You can opt out of marketing emails anytime.</li>
        </ul>
      </div>
    </div>
  );
};

export default PolicySupport;

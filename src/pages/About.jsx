import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div
      style={{
        backgroundColor: "#FAF3E0", // Cream-colored background
        color: "#2C2C2C",
        padding: "50px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Back to Home Button */}
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-start", marginBottom: "20px" }}>
        <Link
          to="/"
          style={{
            backgroundColor: "#8B5E3C", // Luxurious brown
            color: "#FFF",
            padding: "10px 20px",
            fontSize: "18px",
            borderRadius: "5px",
            textDecoration: "none",
            fontWeight: "bold",
            transition: "0.3s",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#5E3C1B")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#8B5E3C")}
        >
          ← Return to Main Page
        </Link>
      </div>

      {/* About Us Section */}
      <div
        style={{
          maxWidth: "800px",
          backgroundColor: "#FFF",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          borderLeft: "5px solid #8B5E3C",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#1B3B6F",
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "15px",
            textTransform: "uppercase",
          }}
        >
          About Us – Italian Suit Store Since 1957
        </h2>

        <p style={{ fontSize: "18px", lineHeight: "1.6", color: "#3E3E3E" }}>
          Founded in 1957, our Italian suit store has been a symbol of timeless
          elegance and exceptional craftsmanship for over six decades. Located in
          the heart of Italy, we take pride in designing and tailoring
          high-quality suits that blend tradition with modern sophistication.
        </p>

        <p style={{ fontSize: "18px", lineHeight: "1.6", color: "#3E3E3E" }}>
          Each suit is crafted with precision by skilled artisans using the
          finest Italian fabrics, ensuring a perfect fit and unparalleled
          comfort. Whether you're looking for a classic business suit, a stylish
          tuxedo, or a custom-made masterpiece, our collection offers a wide
          range of designs to suit every occasion.
        </p>

        <p style={{ fontSize: "18px", lineHeight: "1.6", color: "#3E3E3E" }}>
          Our commitment to excellence and attention to detail have made us a
          trusted name in men's fashion, attracting clients from around the world.
          We believe that a well-tailored suit is more than just clothing—it’s a
          statement of confidence, style, and tradition.
        </p>

        <p
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#8B5E3C",
            marginTop: "20px",
          }}
        >
          Visit us and experience the essence of Italian tailoring, where
          quality meets heritage, and every suit tells a story.
        </p>
      </div>
    </div>
  );
};

export default About;

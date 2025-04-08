import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message Sent Successfully!"); // כאן תוכל להוסיף לוגיקה לשליחת הנתונים לשרת
    setFormData({ name: "", email: "", message: "" });
  };
  const navigate = useNavigate();

  return (
    <div style={{backgroundColor: "#FAF3E0"}}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "#8B5E3C",
            color: "#FFF",
            marginLeft: "20px",
            marginTop: "30px",
            padding: "10px 20px",
            fontSize: "18px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "0.3s",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#5E3C1B")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#8B5E3C")}
        >
          ← Return to Main Page
        </button>
      </div>
      <div
        style={{
          maxWidth: "600px",
          margin: "50px auto",
          padding: "40px",
          backgroundColor: "#FAF3E0", // רקע שמנת
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#1B3B6F" }}>Contact Us</h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <label
            style={{
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#8B5E3C",
            }}
          >
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              marginBottom: "15px",
              border: "1px solid #8B5E3C",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          />

          <label
            style={{
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#8B5E3C",
            }}
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              marginBottom: "15px",
              border: "1px solid #8B5E3C",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          />

          <label
            style={{
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#8B5E3C",
            }}
          >
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="4"
            style={{
              padding: "10px",
              marginBottom: "15px",
              border: "1px solid #8B5E3C",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          ></textarea>

          <button
            type="submit"
            style={{
              padding: "12px",
              fontSize: "18px",
              backgroundColor: "#1B3B6F", // כחול יוקרתי
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#8B5E3C")} // שינוי צבע לחום כהה
            onMouseOut={(e) => (e.target.style.backgroundColor = "#1B3B6F")}
          >
            Send Message
          </button>
        </form>

        <div style={{ marginTop: "30px", textAlign: "center", color: "#333" }}>
          <p>
            <strong>Email:</strong> info@italiansuits.com
          </p>
          <p>
            <strong>Phone:</strong> +39 123 456 7890
          </p>
          <p>
            <strong>Address:</strong> Via Roma 123, Milan, Italy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;

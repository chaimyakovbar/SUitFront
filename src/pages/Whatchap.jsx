import { useState } from "react";
import { Dialog, Button, IconButton } from "@mui/material";
import { WhatsApp, Mail, Chat } from "@mui/icons-material";

const styles = {
  floatingButtonContainer: {
    position: "fixed",
    bottom: "100px", // נמוך יותר במסך
    right: "20px", // בצד שמאל
    zIndex: 100,
  },
  fabButton: {
    backgroundColor: "#25D366",
    color: "white",
  },
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    gap: "20px",
  },
  actionButton: {
    width: "80%",
    padding: "15px",
    fontSize: "18px",
    color: "#fff",
    borderRadius: "10px",
    textDecoration: "none",
    textAlign: "center",
  },
  whatsappButton: { backgroundColor: "#25D366" },
  emailButton: { backgroundColor: "#0078D4" },
};

const Whatchap = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* כפתור עם position: fixed בצד שמאל למטה */}
      <div style={styles.floatingButtonContainer}>
        <IconButton style={styles.fabButton} onClick={() => setOpen(true)}>
          <Chat />
        </IconButton>
      </div>

      {/* דיאלוג נפתח */}
      <Dialog fullScreen open={open} onClose={() => setOpen(false)}>
        <div style={styles.dialogContent}>
          {/* כפתור WhatsApp */}
          <a
            href="https://api.whatsapp.com/send?phone=972548005704&text=אני+מעוניין+בצלם++"
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...styles.actionButton, ...styles.whatsappButton }}
          >
            <WhatsApp /> WhatsApp
          </a>

          {/* כפתור Email */}
          <a
            href="mailto:8005704@gmail.com"
            style={{ ...styles.actionButton, ...styles.emailButton }}
          >
            <Mail /> Email
          </a>

          {/* כפתור סגירה */}
          <Button onClick={() => setOpen(false)}>סגור</Button>
        </div>
      </Dialog>
    </>
  );
};

export default Whatchap;

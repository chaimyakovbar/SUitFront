import React from "react";
import { Dialog, Slide, Box, Typography, Button } from "@mui/material";

const ExplainDialog = ({ open, handleClose, content }) => {
  return (
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      PaperProps={{
        sx: {
          padding: 2,
          maxWidth: 500,
          width: "400px",
          borderRadius: 2,
          textAlign: "center",
          backgroundColor: "#ffffff",
        },
      }}
    >
      <Box>
        {/* <Typography variant="h6" fontWeight="bold" gutterBottom>
          הסבר על השלב
        </Typography> */}
        <Typography sx={{ mb: 2 }}>{content}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClose}
        >
          הבנתי
        </Button>
      </Box>
    </Dialog>
  );
};

export default ExplainDialog;

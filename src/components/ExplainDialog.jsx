import React from "react";
import { Dialog, Slide, Box, Typography, Button } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ExplainDialog = ({ open, handleClose, content }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
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
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          הסבר על השלב
        </Typography>
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

import React, { useState } from "react";
import { openUserDialog } from "../Utils";
import { useAtom } from "jotai";
import UserLogin from "../User/UserLogin";
import UserSignUp from "../User/UserSignUp";
import {
  Box,
  Button,
  Dialog,
  Slide,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";

const HaveUser = () => {
  const [dialogType, setDialogType] = useState(null);
  const [open, setOpen] = useAtom(openUserDialog);

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        position: "relative",
      }}
    >

      <Paper
        elevation={6}
        sx={{
          padding: 4,
          maxWidth: 500,
          width: "100%",
          borderRadius: 4,
          textAlign: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          על מנת לשמור את המידות יש להתחבר
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog("login")}
          >
            היכנס
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleOpenDialog("signup")}
          >
            הירשם
          </Button>
        </Stack>
      </Paper>

      <Dialog open={open} keepMounted onClose={handleClose}>
        <Box p={3}>
          {dialogType === "login" && (
            <UserLogin setDialogType={setDialogType} />
          )}
          {dialogType === "signup" && (
            <UserSignUp setDialogType={setDialogType} />
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default HaveUser;

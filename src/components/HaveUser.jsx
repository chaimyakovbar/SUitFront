import React, { useState } from "react";
import { openUserDialog } from "../Utils";
import { useAtom } from "jotai";
import UserLogin from "../User/UserLogin";
import UserSignUp from "../User/UserSignUp";
import { Box, Button, Dialog, Typography, Stack, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    backgroundColor: "#0a0a0a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    px: 2,
    position: "relative",
  },
  paper: {
    backgroundColor: "rgba(30, 30, 30, 0.6) !important",
    padding: "2.5rem !important",
    maxWidth: 500,
    width: "100%",
    borderRadius: "4px !important",
    textAlign: "center",
    border: "1px solid rgba(192, 211, 202, 0.2) !important",
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif !important",
    fontSize: "2.2rem !important",
    fontWeight: "300 !important",
    marginBottom: "2rem !important",
    letterSpacing: "0.05em !important",
    color: "#fff !important",
  },
  button: {
    backgroundColor: "transparent !important",
    padding: "12px 35px !important",
    fontSize: "0.85rem !important",
    borderRadius: "0 !important",
    fontWeight: "400 !important",
    letterSpacing: "0.15em !important",
    textTransform: "uppercase !important",
    transition: "all 0.3s ease !important",
    fontFamily: "'Montserrat', sans-serif !important",
  },
  loginButton: {
    color: "#C0D3CA !important",
    border: "1px solid #C0D3CA !important",
    "&:hover": {
      backgroundColor: "rgba(192, 211, 202, 0.1) !important",
      transform: "translateY(-2px) !important",
    },
  },
  signupButton: {
    color: "#fff !important",
    border: "1px solid #fff !important",
    "&:hover": {
      backgroundColor: "#fff !important",
      color: "#000 !important",
    },
  },
  dialogBox: {
    "& .MuiDialog-paper": {
      backgroundColor: "#0a0a0a !important",
      color: "#fff !important",
      borderRadius: "4px !important",
      border: "1px solid rgba(192, 211, 202, 0.2) !important",
    },
  },
});

const HaveUser = () => {
  const classes = useStyles();
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
    <Box className={classes.root}>
      <Paper className={classes.paper} elevation={0}>
        <Typography className={classes.title}>
          על מנת לשמור את המידות יש להתחבר
        </Typography>

        <Stack direction="row" spacing={3} justifyContent="center">
          <Button
            className={`${classes.button} ${classes.loginButton}`}
            onClick={() => handleOpenDialog("login")}
          >
            היכנס
          </Button>
          <Button
            className={`${classes.button} ${classes.signupButton}`}
            onClick={() => handleOpenDialog("signup")}
          >
            הירשם
          </Button>
        </Stack>
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        className={classes.dialogBox}
        maxWidth="sm"
        fullWidth
      >
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

import React, { useState } from "react";
import { Button, Dialog, Slide, Typography, Stack, Box } from "@mui/material";
import UserSignUp from "./UserSignUp";
import UserLogin from "./UserLogin";
import { openUserDialog, userAtom } from "../../Utils";
import { useAtom } from "jotai";
import { Link } from "react-router-dom";

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

const User = () => {
  const [user] = useAtom(userAtom);
  const [open, setOpen] = useAtom(openUserDialog);
  const [dialogType, setDialogType] = useState(null);

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 3,
            width: 400,
            textAlign: "center",
          },
        }}
      >
        {user ? (
          <Typography variant="h6" fontWeight="bold">
            שלום {user.name}!
          </Typography>
        ) : (
          <>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              אנא התחבר או הירשם
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

            {dialogType === "login" && (
              <Box mt={3}>
                <UserLogin setDialogType={setDialogType} />
              </Box>
            )}
            {dialogType === "signup" && (
              <Box mt={3}>
                <UserSignUp setDialogType={setDialogType} />
              </Box>
            )}
          </>
        )}
      </Dialog>
    </>
  );
};

export default User;

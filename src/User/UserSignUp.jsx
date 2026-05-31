import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TextField } from "@mui/material";
import { openUserDialog, authUserAtom } from "../Utils";
import { useAtom } from "jotai";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { registerUser, loginUser } from "../api/user";

const UserSignUp = ({ setDialogType }) => {
  const SchemaYupForUser = Yup.object({
    name: Yup.string().required("Name is required"),
    lastName: Yup.string("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string()
      .matches(/^\+?[0-9]{9,12}$/, "Invalid phone number")
      .required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    password: Yup.string().required("Password is required"),
  });

  const [open, setOpen] = useAtom(openUserDialog);
  const [, setUser] = useAtom(authUserAtom);
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleClose = (resetForm) => {
    setOpen(false);
    setDialogType(null);
    if (resetForm) resetForm();
  };

  const handleCreatUser = async (values, { resetForm }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // First register the user
      await registerUser(values);

      // Then automatically log them in
      const loginData = await loginUser({
        email: values.email,
        password: values.password,
      });

      setUser(loginData.user);
      enqueueSnackbar("Registration and login successful!", {
        variant: "success",
      });
      setOpen(false);
      setDialogType(null);
      resetForm();
    } catch (error) {
      enqueueSnackbar(error.message || "Email is already in use", {
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <Formik
          initialValues={{
            name: "",
            email: "",
            lastName: "",
            phoneNumber: null,
            address: "",
            password: null,
          }}
          validationSchema={SchemaYupForUser}
          onSubmit={handleCreatUser}
        >
          {({
            handleSubmit,
            resetForm,
            touched,
            errors,
            isSubmitting: formikSubmitting,
          }) => (
            <Form onSubmit={handleSubmit}>
              <DialogTitle>Sign Up</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please fill in your user details
                </DialogContentText>
                <Field
                  as={TextField}
                  label="Name"
                  name="name"
                  fullWidth
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
                <Field
                  as={TextField}
                  label="Last Name"
                  name="lastName"
                  fullWidth
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                />
                <Field
                  as={TextField}
                  label="Email"
                  name="email"
                  type="email"
                  fullWidth
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                <Field
                  as={TextField}
                  label="Phone"
                  name="phoneNumber"
                  fullWidth
                  error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                  helperText={touched.phoneNumber && errors.phoneNumber}
                />
                <Field
                  as={TextField}
                  label="Address"
                  name="address"
                  fullWidth
                  error={touched.address && Boolean(errors.address)}
                  helperText={touched.address && errors.address}
                />
                <Field
                  as={TextField}
                  label="Password"
                  name="password"
                  type="password"
                  fullWidth
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => handleClose(resetForm)}>Cancel</Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || formikSubmitting}
                >
                  {isSubmitting ? "Signing up..." : "Sign Up"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default UserSignUp;

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
    name: Yup.string().required("חובה למלא שם"),
    lastName: Yup.string("יש למלא שם משפחה"),
    email: Yup.string().email("אימייל לא תקין").required("חובה למלא אימייל"),
    phoneNumber: Yup.string()
      .matches(/^\+?[0-9]{9,12}$/, "טלפון לא תקין")
      .required("חובה למלא מספר טלפון"),
    address: Yup.string().required("חובה למלא כתובת"),
    password: Yup.string().required("חובה לבחור סיסמא"),
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
      enqueueSnackbar("נרשמת והתחברת בהצלחה!", { variant: "success" });
      setOpen(false);
      setDialogType(null);
      resetForm();
    } catch (error) {
      enqueueSnackbar(error.message || "כבר יש שימוש במייל זה", {
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
              <DialogTitle>הירשם</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  אנא מלא את פרטי המשתמש שלך
                </DialogContentText>
                <Field
                  as={TextField}
                  label="שם"
                  name="name"
                  fullWidth
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
                <Field
                  as={TextField}
                  label="משפחה"
                  name="lastName"
                  fullWidth
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                />
                <Field
                  as={TextField}
                  label="אימייל"
                  name="email"
                  type="email"
                  fullWidth
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                <Field
                  as={TextField}
                  label="טלפון"
                  name="phoneNumber"
                  fullWidth
                  error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                  helperText={touched.phoneNumber && errors.phoneNumber}
                />
                <Field
                  as={TextField}
                  label="כתובת"
                  name="address"
                  fullWidth
                  error={touched.address && Boolean(errors.address)}
                  helperText={touched.address && errors.address}
                />
                <Field
                  as={TextField}
                  label="סיסמה"
                  name="password"
                  type="password"
                  fullWidth
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => handleClose(resetForm)}>ביטול</Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || formikSubmitting}
                >
                  {isSubmitting ? "נרשם..." : "הירשם"}
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

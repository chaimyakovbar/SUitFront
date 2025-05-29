import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useAtom } from "jotai";
import { TextField } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { openUserDialog, authUserAtom } from "../Utils";
import { loginUser } from "../api/user";

const UserLogin = ({ setDialogType }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useAtom(openUserDialog);
  const [, setUser] = useAtom(authUserAtom);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validationSchema = Yup.object({
    email: Yup.string().email("אימייל לא תקין").required("חובה למלא אימייל"),
    password: Yup.string().required("חובה למלא סיסמה"),
  });

  const handleClose = () => {
    setOpen(false);
    setDialogType(null);
  };

  const handleLogin = async (values, { resetForm }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const userData = await loginUser(values);
      setUser(userData.user);
      enqueueSnackbar("התחברת בהצלחה!", { variant: "success" });
      setDialogType(null);
      setOpen(false);
      resetForm();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "שגיאה בהתחברות";
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} keepMounted onClose={handleClose}>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({
            handleSubmit,
            touched,
            errors,
            isSubmitting: formikSubmitting,
          }) => (
            <Form onSubmit={handleSubmit}>
              <DialogTitle>התחברות</DialogTitle>
              <DialogContent>
                <Field
                  as={TextField}
                  label="אימייל"
                  name="email"
                  type="email"
                  fullWidth
                  margin="normal"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                <Field
                  as={TextField}
                  label="סיסמה"
                  name="password"
                  type="password"
                  fullWidth
                  margin="normal"
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} disabled={isSubmitting}>
                  ביטול
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || formikSubmitting}
                >
                  {isSubmitting ? "מתחבר..." : "התחבר"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default UserLogin;

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useAtom, useSetAtom} from "jotai";
import { TextField } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useSnackbar } from "notistack";
import { openUserDialog, userAtom } from "../../Utils"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserLogin = ({ setDialogType }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useAtom(openUserDialog);
  const setUser = useSetAtom(userAtom);

  const validationSchema = Yup.object({
    email: Yup.string().email("אימייל לא תקין").required("חובה למלא אימייל"),
    password: Yup.string().required("חובה למלא סיסמה"),
  });

  const handleClose = () => {
    setOpen(false);
    setDialogType(null);
  };

  const handleLogin = async (values, { resetForm }) => {
    try {
      const response = await axios.post("https://suitback.onrender.com/user/login",values, { withCredentials: true })
      
      if (response.data.success) {
        setUser(response.data.user)
        enqueueSnackbar("התחברת בהצלחה!", { variant: "success" });
        setDialogType(null);
        setOpen(false);
        resetForm();
      } else {
        enqueueSnackbar(response.data.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "שגיאה בהתחברות", {
        variant: "error",
      });
    }
  }

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
      >
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ handleSubmit, touched, errors }) => (
            <Form onSubmit={handleSubmit}>
              <DialogTitle>התחברות</DialogTitle>
              <DialogContent>
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
                  label="סיסמה"
                  name="password"
                  type="password"
                  fullWidth
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>ביטול</Button>
                <Button type="submit">התחבר</Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default UserLogin;



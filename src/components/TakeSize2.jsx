import React, { useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../Utils";
import HaveUser from "../components/HaveUser";
import {
    userSizes,
  sizesCollectionExpleines,
} from "../consts/KindOfColors";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import YouTubeIcon from "@mui/icons-material/YouTube";
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Dialog,
  Slide,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
  import { useSnackbar } from "notistack";
import { postProduct } from "../api/suit";

// const drawerWidth = 240;

const TakeSizes2 = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);
  const [open, setOpen] = useState(true);
  const [sizes, setSizes] = useState({});
  const [dialogType, setDialogType] = useState(null);
  const [dialogContent, setDialogContent] = useState(null);

  if (!user) return <HaveUser />;

  const handleSizeChange = (key, value) => {
    setSizes((prev) => ({ ...prev, [key]: value }));
  }

  const handleOpenDialog = (type, content) => {
    setDialogType(type);
    setDialogContent(content);
    setOpen(true);
  };

  const handleClose = () => {
    setDialogType(null);
    setDialogContent(null);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(sizes).length < 16) {
      enqueueSnackbar("אנא מלא את השדות שלפניך ");
      return;
    }

    try {
      await postProduct({
        email: user.email,
        sizes,
      });
      enqueueSnackbar("המידות נשמרו בהצלחה!");
    } catch (error) {
      console.error("שגיאה בשליחת הנתונים:", error);
      enqueueSnackbar("שגיאה בשמירת המידות.");
    }
  }

//   const sizes []

  return (
    <Box style={{ display: "flex" }}>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
      >
        <button
          onClick={() => navigate("/Shopping")}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#5E3C1B")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#8B5E3C")}
        >
         לך לקניות
        </button>

        <Button
          variant="contained"
          color="primary"
          style={{ margin: "10px" }}
          onClick={handleSubmit}
        >
          שלח נתונים
        </Button>
        <List>
          {userSizes.map((category, index) => (
            <ListItem key={index}>
              <ListItemText primary={category} />
              <TextField
                type="number"
                value={sizes[category] || ""}
                onChange={(e) => handleSizeChange(category, e.target.value)}
                variant="outlined"
                size="small"
                style={{ width: "80px" }}
              />
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          color="primary"
          style={{ margin: "10px" }}
          onClick={handleSubmit}
        >
          שלח נתונים
        </Button>
      </Drawer>

      <Box
        component="main"
        style={{
          flexGrow: 1,
          padding: "20px",
          marginLeft: open ? 240 : 0,
        }}
      >
        <Toolbar />

        <Box
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            // marginTop: "20px",
          }}
        >
          {sizesCollectionExpleines.map((item, index) => (
            <div key={index}>
              {index + 1}
              <div style={{ border: "1px solid black", width: "200px" }} >
                <img
                  src={item.img}
                  alt={item.title}
                  style={{ width: "200px", height: "150px" }}
                />
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Tooltip title="לחץ לצפייה" placement="top">
                    <Button
                      onClick={() => handleOpenDialog("YouTube", item.video)}
                    >
                      <YouTubeIcon style={{ color: "red" }} />
                    </Button>
                  </Tooltip>
                  <Tooltip title="לחץ להסבר מפורט" placement="top">
                    <Button
                      onClick={() => handleOpenDialog("Error", item.title)}
                    >
                      <ErrorOutlineIcon />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}
        </Box>
      </Box>

      {dialogType && (
        <Dialog
          open={dialogType !== null}
          keepMounted
          onClose={handleClose}
        >
          <Box padding={2}>{dialogContent}</Box>
        </Dialog>
      )}
    </Box>
  );
};

export default TakeSizes2;

import React, { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  Typography,
  useMediaQuery,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useAtom } from "jotai";
import { currentIndexAtom } from "../../Utils";

import inside from "/assets/kinds/insid.svg";
import poshet from "/assets/kinds/poshet.svg";
import button from "/assets/kinds/button.svg";
import holes from "/assets/kinds/AllSuit2.png";

import ButtonInside from "./ButtonInside";
import ButtonHoles from "./ButtonHoles";
import ButtonPoshet from "./ButtonPoshet";
import ButtonButton from "./ButtonButton";

const RightSide = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [currentIndex] = useAtom(currentIndexAtom);
  const [drawerContent, setDrawerContent] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  if (currentIndex !== 2) return null;

  const handleClick = (key) => {
    setSelectedCategory(key);

    const components = {
      imagesInsideUp: <ButtonInside handleCloseDrawer={handleCloseDrawer} />,
      imagesHoles: <ButtonHoles handleCloseDrawer={handleCloseDrawer} />,
      imagesPoshet: <ButtonPoshet handleCloseDrawer={handleCloseDrawer} />,
      imageButton: <ButtonButton handleCloseDrawer={handleCloseDrawer} />,
    };

    setDrawerContent(components[key]);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const categories = [
    { key: "imagesInsideUp", label: "סטייל פנימי", image: inside },
    { key: "imagesPoshet", label: "בד כיס", image: poshet },
    { key: "imageButton", label: "סטייל כפתור", image: button },
    { key: "imagesHoles", label: "חורי כפתור", image: holes },
  ];

  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: 1000,
        width: isMobile ? "190px" : "30%",
        backgroundColor: "#F5F5F7",
        height: isMobile ? "42vh" : "80vh",
        overflowY: "auto",
        padding: isMobile ? "0px" : "30px",
        boxSizing: "border-box",
        marginRight: "20px",
      }}
    >
      {categories.map(({ key, label, image }) => (
        <Box
          key={key}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // marginBottom: "24px",
          }}
        >
          <Typography
            sx={{
              fontSize: isMobile ? "14px" : "18px",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "8px",
            }}
          >
            {label}
          </Typography>
          <Box
            sx={{
              position: "relative",
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              width: isMobile ? "50px" : "100px",
              height: isMobile ? "50px" : "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
            onClick={() => handleClick(key)}
          >
            <img
              src={image}
              alt={key}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "12px",
              }}
            />
            {selectedCategory === key && (
              <VerifiedIcon
                sx={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  color: "#FF5722",
                  fontSize: isMobile ? "20px" : "24px",
                }}
              />
            )}
          </Box>
        </Box>
      ))}

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: {
            width: isMobile ? "90%" : "350px",
            borderRadius: "12px 0 0 12px",
          },
        }}
        BackdropProps={{ invisible: true }}
      >
        <Box sx={{ padding: "24px" }}>
          <Button
            variant="contained"
            onClick={handleCloseDrawer}
            sx={{
              backgroundColor: "#FF5722",
              color: "white",
              "&:hover": {
                backgroundColor: "#E65100",
              },
              marginBottom: "16px",
            }}
          >
            סגור
          </Button>
          {drawerContent}
        </Box>
      </Drawer>
    </Box>
  );
};

export default RightSide;

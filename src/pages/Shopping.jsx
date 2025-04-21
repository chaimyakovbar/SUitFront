import React, { useState } from "react";
import HaveUser from "../components/HaveUser";
import { userAtom } from "../Utils";
import { useAtom } from "jotai";
import GetAllSuitFromData from "../components/GetAllSuitFromData";
import { Button, Drawer, Box } from "@mui/material";
import { Link } from "react-router-dom";
import ShowSizes from "../components/ShowSizes";
import useProduct from "../Hooks/useProduct";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    padding: "20px",
    gap: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
  },
  mainContent: {
    // display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
    flex: 1,
  },
  footer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "auto",
    padding: "20px 0",
  },
  button: {
    width: "200px",
    height: "50px",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "bold",
    textTransform: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    "&:hover": {
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      transform: "translateY(-2px)",
      transition: "all 0.3s ease",
    },
  },
  "@media (min-width: 768px)": {
    mainContent: {
      gridTemplateColumns: "300px 1fr",
    },
  },
};

const Shopping = () => {
  const [user] = useAtom(userAtom);
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const { data } = useProduct();

  const toggleSideDrawer = () => {
    setSideDrawerOpen(!sideDrawerOpen);
  };

  if (!user) return <HaveUser />;

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Button
          variant="contained"
          color="primary"
          onClick={toggleSideDrawer}
          sx={styles.button}
        >
          הצג את כל המידות
        </Button>

        <Link to="/Payed" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={styles.button}
          >
            מעבר לתשלום
          </Button>
        </Link>
      </Box>

      <Box sx={styles.mainContent}>
        <Box>
          <GetAllSuitFromData />
        </Box>
      </Box>

      <Box sx={styles.footer}>
        <Link to="/Payed" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ minWidth: "200px" }}
          >
            מעבר לתשלום
          </Button>
        </Link>
      </Box>

      <Drawer
        anchor="right"
        open={sideDrawerOpen}
        onClose={toggleSideDrawer}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "400px" },
          },
        }}
      >
        <ShowSizes data={data} onClose={toggleSideDrawer} />
      </Drawer>
    </Box>
  );
};

export default Shopping;

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
const Payed = () => {
  return (
    <div>
      <Link to="/">
        <Button>מעבר לדף הבית </Button>
      </Link>
      פתשלום
    </div>
  );
};

export default Payed;

import React from "react";
import HaveUser from "../components/HaveUser";
import { userAtom } from "../Utils";
import { useAtom } from "jotai";
import GetAllSuitFromData from "../components/GetAllSuitFromData";
import OnlySizes from "../components/OnlySizes";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const Shopping = () => {
  const [user] = useAtom(userAtom);

  if (!user) return <HaveUser />;

  return (
    <div style={{ display: "flex" }}>
      <Link to="/">
        <Button>מעבר לדף הבית </Button>
      </Link>
      <div>
        <OnlySizes />
      </div>
      <div>
        <GetAllSuitFromData />
      </div>
      <Link to="/Payed">
        <Button>מעבר לתשלום</Button>
      </Link>
    </div>
  );
};

export default Shopping;

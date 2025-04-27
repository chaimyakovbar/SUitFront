import React from "react";
import first from "../assets/places/first.png";
import sec from "../assets/places/sec.png";
import therd from "../assets/places/therd.png";

const MostPoPular = () => {
  return (
    <div style={{ display: "flex", width: "100%" }}>
      <img style={{ width: "33.3%" }} src={sec} />
      <img style={{ width: "33.3%" }} src={first} />
      <img style={{ width: "33.3%" }} src={therd} />
    </div>
  );
};
export default MostPoPular;

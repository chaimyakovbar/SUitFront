import React from "react";
import TakeSizes from "../components/TakeSizes";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Button, Tooltip, Divider } from "@mui/material";
import TakeSizes2 from "../components/TakeSize2";
import TakeSizes3 from "../components/TakeSize3";
// import { useAtomValue } from "jotai";
// import { authUserAtom } from "../Utils";
import TakeSizes4 from "../components/TakeSizes4";
import { useNavigate } from "react-router-dom";
import imgFor from "../assets/takeSizesM.png";
import imgFor2 from "../assets/takeSizesR.png";

const IndexSizes = () => {
  // const [optionOne, setOptionOne] = useState(false);
  // const user = useAtomValue(authUserAtom);
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: "#f0f2f5" }}>
      <div
        style={{
          marginTop: "200px",
          backgroundColor: "#161616",
        }}
      >
        <h1 style={{ display: "flex", justifyContent: "center", color: "white" }}>
          Choose your plan
        </h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            style={{
              backgroundColor: "transparent",
              color: "white",
              borderRadius: "8px",
              border: "1px solid gray",
              marginRight: "10px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/sizes/regular")}
          >
            <p style={{ fontSize: "26px", borderBottom: "1px solid gray" }}>
              regular sizes
            </p>
            <img
              style={{ width: "40%", height: "70%" }}
              src={imgFor2}
              alt="imgFor"
            />
          </button>

          <button
            style={{
              backgroundColor: "transparent",
              color: "white",
              borderRadius: "8px",
              border: "1px solid gray",
              marginLeft: "10px",
            }}
            onClick={() => navigate("/sizes/measure")}
          >
            <p style={{ fontSize: "26px", borderBottom: "1px solid gray" }}>
              measure your body
            </p>
            <img
              style={{ width: "40%", height: "70%" }}
              src={imgFor}
              alt="imgFor"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndexSizes;

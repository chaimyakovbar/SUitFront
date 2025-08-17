import React from "react";
// import TakeSizes from "../components/TakeSizes";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import { Button, Tooltip, Divider } from "@mui/material";
// import TakeSizes2 from "../components/TakeSize2";
// import TakeSizes3 from "../components/TakeSize3";
import { useMediaQuery } from "@mui/material";
// import TakeSizes4 from "../components/TakeSizes4";
import { useNavigate } from "react-router-dom";
import imgFor from "../assets/takeSizesM.png";
import imgFor2 from "../assets/takeSizesR.png";
import imgFor3 from "../assets/suitMeasur.jpeg";

const IndexSizes = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  // const [optionOne, setOptionOne] = useState(false);
  // const user = useAtomValue(authUserAtom);
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: "#f0f2f5" }}>
      <div
        style={{
          marginTop: isMobile ? "100px" : "200px",
          backgroundColor: "#161616",
        }}
      >
        <h1
          style={{ display: "flex", justifyContent: "center", color: "white" }}
        >
          Choose your plan
        </h1>
        <div
          style={{
            display: isMobile ? "block" : "flex",
            justifyContent: "center",
          }}
        >
          <button
            style={{
              backgroundColor: "transparent",
              color: "white",
              borderRadius: "8px",
              border: "1px solid gray",
              marginRight: isMobile ? "0px" : "10px",
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
              marginLeft: isMobile ? "0px" : "10px",
              marginTop: isMobile ? "10px" : "0px",
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
          
          {/* <button
            style={{
              backgroundColor: "transparent",
              color: "white",
              borderRadius: "8px",
              border: "1px solid gray",
              marginLeft: isMobile ? "0px" : "10px",
              marginTop: isMobile ? "10px" : "0px",
            }}
            onClick={() => navigate("/sizes/suitMeasur")}
          >
            <p style={{ fontSize: "26px", borderBottom: "1px solid gray" }}>
              measure your body
            </p>
            <img
              style={{ width: "40%", height: "70%" }}
              src={imgFor3}
              alt="imgFor"
            />
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default IndexSizes;

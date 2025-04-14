import React, { useState } from "react";
import TakeSizes from "../components/TakeSizes";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Tooltip } from "@mui/material";
import TakeSizes2 from "../components/TakeSize2";
import TakeSizes3 from "../components/TakeSize3";
import { useAtomValue } from "jotai";
import { userAtom } from "../Utils";

const IndexSizes = () => {
  const [optionOne, setOptionOne] = useState(false);
  const user = useAtomValue(userAtom)

  return (
    <div style={{ backgroundColor: "#f0f2f5"}}>
            {user && (
        <Tooltip title="לצורה אחרת של מידות לחץ ">
          <div
          style={{ position: 'absolute', right: 0, top: '30%', zIndex:1000 }}
            onClick={() => setOptionOne((prev) => !prev)}
          >
            <ArrowForwardIcon style={{ fontSize: "70px" }} />
          </div>
        </Tooltip>
    )} 
      {!optionOne && (
        <div >
          <TakeSizes />
        </div>
      )}
      {optionOne && (
        <div style={{ width: "90%" }}>
          <TakeSizes3 />
        </div>
      )}
    </div>
  );
};

export default IndexSizes;

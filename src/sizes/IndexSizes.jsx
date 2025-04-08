import React, { useState } from "react";
import TakeSizes from "../components/TakeSizes";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Tooltip } from "@mui/material";
import TakeSizes2 from "../components/TakeSize2";
import TakeSizes3 from "../components/TakeSize3";
import TakeSizesOld from "../TakeSizesOld";
import { useAtomValue } from "jotai";
import { userAtom } from "../../Utils";

const IndexSizes = () => {
  const [optionOne, setOptionOne] = useState(false);
  const user = useAtomValue(userAtom)

  return (
    <div style={{ backgroundColor: "#f0f2f5", }}>
            {user && (
        <Tooltip title="לצורה אחרת של מידות לחץ ">
          <div
            onClick={() => setOptionOne((prev) => !prev)}
            style={{ marginTop: "25%" }}
          >
            <ArrowForwardIcon style={{ fontSize: "70px" }} />
          </div>
        </Tooltip>
      )}
      {!optionOne && (
        <div style={{ width: "90%" }}>
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

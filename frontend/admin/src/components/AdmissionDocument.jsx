import React, { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import Prospectus from "./Prospectus";
import Undertaking from "./Undertaking";
import ProgramSubjectCombination from "./ProgramSubjectCombination";

const AdmissionDocument = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div
      className="adminDocs"
      style={{
        height: "60vh",
      }}
    >
      <Tabs value={tabValue} onChange={handleChange} indicatorColor="primary">
        <Tab label="Prospectus" />
        <Tab label="Undertaking" />
      </Tabs>
      {tabValue === 0 && <Prospectus />}
      {tabValue === 1 && <Undertaking />}
    </div>
  );
};

export default AdmissionDocument;

import React from "react";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PolicySupport from "./pages/PolicySupport";
// import AllCollection from "./pages/AllCollection"

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import IndexCustomSuit from "./customSuite/IndexCustomSuit";
// import ImageFilterComponent from './components/ImageCollector'
import IndexSizes from "./sizes/IndexSizes";
import HomePage2 from "./homePage/HomePage2";
import Shopping from "./pages/Shopping";
import AccessibilityMenu from "./pages/AccessibilityMenu";
import Whatchap from "./pages/Whatchap";
import Payed from "./pages/Payed";
import NavBar from "./homePage/NavBar";

const App = () => {
  return (
    <>
      <Router>
        <NavBar />
        <Whatchap />
        <AccessibilityMenu />
        <Routes>
          <Route path="/" element={<HomePage2 />} />
          <Route path="/customSuit" element={<IndexCustomSuit />} />
          <Route path="/Shopping" element={<Shopping />} />
          <Route path="/PolicySupport" element={<PolicySupport />} />
          <Route path="/indexSizes" element={<IndexSizes />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/Payed" element={<Payed />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;

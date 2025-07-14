import React from "react";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PolicySupport from "./pages/PolicySupport";
// import AllCollection from "./pages/AllCollection"
import { useAtomValue } from "jotai";
import { authUserAtom } from "./Utils";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import IndexCustomSuit from "./customSuite/IndexCustomSuit";
// import ImageFilterComponent from './components/ImageCollector'
import IndexSizes from "./sizes/IndexSizes";
import HomePage2 from "./homePage/HomePage2";
// import Shopping from "./pages/Shopping";
import AccessibilityMenu from "./pages/AccessibilityMenu";
// import Whatchap from "./pages/Whatchap";
import Payed from "./pages/Payed";
// import PaymentSuccess from "./pages/PaymentSuccess";
import NavBar from "./homePage/NavBar";
import LoginWithGoogle from "./pages/LoginWithGoogle";
import ResetPassword from "./pages/ResetPassword";
import { AuthProvider } from "./context/AuthContext.jsx";
import TakeSizes4 from "./components/TakeSizes4";
import TakeSizes3 from "./components/TakeSize3";
import Account from "./pages/Account";
import CheckoutModern from "./pages/CheckoutModern";

const App = () => {
  const user = useAtomValue(authUserAtom);
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        {/* <Whatchap /> */}
        <AccessibilityMenu />
        <Routes>
          <Route path="/" element={<HomePage2 />} />
          <Route path="/login" element={<LoginWithGoogle />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* <Route path="/customSuit" element={<IndexCustomSuit />} /> */}
          <Route
            path="/Shopping"
            element={
              user ? (
                // <Shopping />
                <CheckoutModern />
              ) : (
                <Navigate
                  to="/login"
                  state={{ from: { pathname: "/Shopping" } }}
                />
              )
            }
          />
          <Route
            path="/account"
            element={
              user ? (
                <Account />
              ) : (
                <Navigate
                  to="/login"
                  state={{ from: { pathname: "/account" } }}
                />
              )
            }
          />
          <Route
            path="/customSuit"
            element={
              user ? (
                <IndexCustomSuit />
              ) : (
                <Navigate
                  to="/login"
                  state={{ from: { pathname: "/customSuit" } }}
                />
              )
            }
          />
          <Route path="/indexSizes" element={<IndexSizes />} />
          <Route path="/PolicySupport" element={<PolicySupport />} />
          <Route path="/sizes/regular" element={<TakeSizes4 />} />
          <Route path="/sizes/measure" element={<TakeSizes3 />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/Payed" element={<Payed />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

import React, { Suspense, lazy } from "react";
import { Box } from "@mui/material";
import { useAtomValue } from "jotai";
import { authUserAtom } from "./Utils";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

// ─── Eager: minimal shell (NavBar + home) ──────────────────────────────────
import HomePage2 from "./homePage/HomePage2";
import NavBar from "./homePage/NavBar";
import OfflineIndicator from "./components/OfflineIndicator";
import { AuthProvider } from "./context/AuthContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";

// ─── Lazy: everything else ─────────────────────────────────────────────────
const SuitCustomizer = lazy(() =>
  import("./components/suit-customizer/SuitCustomizer")
);
const TakeSizes3 = lazy(() => import("./components/TakeSize3"));
const TakeSizes4 = lazy(() => import("./components/TakeSizes4"));
const TakeSizes5 = lazy(() => import("./components/TakeSizes5.jsx"));
const Account = lazy(() => import("./pages/Account"));
const Shopping = lazy(() => import("./pages/Shopping"));
const CheckoutModern = lazy(() => import("./pages/CheckoutModern"));
const IndexSizes = lazy(() => import("./sizes/IndexSizes"));
const AIQuickSize = lazy(() => import("./pages/AIQuickSize"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PolicySupport = lazy(() => import("./pages/PolicySupport"));
const LoginWithGoogle = lazy(() => import("./pages/LoginWithGoogle"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AccessibilityMenu = lazy(() => import("./pages/AccessibilityMenu"));
const Payed = lazy(() => import("./pages/Payed"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));

// Loading component for lazy loaded components
const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#0a0a0a",
      color: "#fff",
    }}
  >
    <div>Loading...</div>
  </div>
);

// NavBarWrapper provides scrollToAllCollection logic for NavBar
const NavBarWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollToAllCollection = () => {
    if (location.pathname === "/") {
      const element = document.getElementById("targetSection");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/", { state: { scrollToAllCollection: true } });
    }
  };
  return <NavBar scrollToTargetSection={scrollToAllCollection} />;
};

const App = () => {
  const user = useAtomValue(authUserAtom);
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Box sx={{ position: "relative", width: "100%", minHeight: "100vh" }}>
            <OfflineIndicator />
            <NavBarWrapper />
            {/* <Whatchap /> */}
            <AccessibilityMenu />
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<HomePage2 />} />
                <Route path="/login" element={<LoginWithGoogle />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                {/* <Route path="/customSuit" element={<SuitCustomizer />} /> */}
                <Route
                  path="/Shopping"
                  element={
                    user ? (
                      <Shopping />
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
                      <SuitCustomizer />
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
                <Route path="/sizes/suitMeasur" element={<TakeSizes5 />} />
                <Route path="/sizes/ai" element={<AIQuickSize />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/Payed" element={<Payed />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
              </Routes>
            </Suspense>
          </Box>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;

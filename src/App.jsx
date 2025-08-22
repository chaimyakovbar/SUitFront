import React, { Suspense, lazy } from "react";
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
  useNavigate,
  useLocation,
} from "react-router-dom";

// Lazy load heavy components
const SuitCustomizer = lazy(() =>
  import("./components/suit-customizer/SuitCustomizer")
);
const TakeSizes3 = lazy(() => import("./components/TakeSize3"));
const TakeSizes4 = lazy(() => import("./components/TakeSizes4"));
const TakeSizes5 = lazy(() => import("./components/TakeSizes5.jsx"));
const Account = lazy(() => import("./pages/Account"));
const CheckoutModern = lazy(() => import("./pages/CheckoutModern"));

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
import { LanguageProvider } from "./context/LanguageContext.jsx";

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
    <div>טוען...</div>
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
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/Payed" element={<Payed />} />
            </Routes>
          </Suspense>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;

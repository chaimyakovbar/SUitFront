import { StrictMode } from "react";
import axios from "axios";

import App from "./App.jsx";
import { SnackbarProvider } from "notistack";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

axios.defaults.withCredentials = true;

// Register Service Worker for offline caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Add global styles to fix black overlay issue
const globalStyles = `
  body, html {
    background-color: black !important;
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }
  
  #root {
    background-color: black !important;
    min-height: 100vh;
  }
`;

// Inject global styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider maxSnack={3}>
        <App /> {/* Already contains <Router> */}
      </SnackbarProvider>
    </QueryClientProvider>
  </StrictMode>
);

import { StrictMode } from "react";
import axios from "axios";

import App from "./App.jsx";
import { SnackbarProvider } from "notistack";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider maxSnack={3}>
          <App />
      </SnackbarProvider>
    </QueryClientProvider>
  </StrictMode>
);

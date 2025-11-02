import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { Toaster } from "sonner";
import QueryProvider from "./context/query-provider.tsx";
import App from "./App.tsx";
import "./index.css";
import "./styles/google-calendar-theme.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <BrowserRouter>
        <NuqsAdapter>
          <App />
        </NuqsAdapter>
      </BrowserRouter>
      <Toaster />
    </QueryProvider>
  </StrictMode>
);

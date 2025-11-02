import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { Toaster } from "sonner";
import QueryProvider from "./context/query-provider";
import { ThemeProvider } from "./context/theme-provider";
import App from "./App";
import "./index.css";
import "./styles/google-calendar-theme.css";
import "./styles/google-calendar.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider>
        <QueryProvider>
          <BrowserRouter>
            <NuqsAdapter>
              <App />
            </NuqsAdapter>
            <Toaster />
          </BrowserRouter>
        </QueryProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);

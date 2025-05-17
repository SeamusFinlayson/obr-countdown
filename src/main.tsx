import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PluginThemeProvider } from "./PluginThemeProvider.tsx";
import OBR from "@owlbear-rodeo/sdk";

OBR.onReady(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <PluginThemeProvider>
        <App />
      </PluginThemeProvider>
    </StrictMode>,
  );
});

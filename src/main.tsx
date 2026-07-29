import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/roboto/latin-500.css";
import App from "./App";
import "./styles.css";
import "./prototype.css";
import { initializeTelegramMiniApp } from "./telegram";

initializeTelegramMiniApp();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

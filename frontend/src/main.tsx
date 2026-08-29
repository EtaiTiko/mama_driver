import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// This is an intentionally minimal entry point. Routing, auth context,
// and real pages are built starting in Phase 2/3 — see PROJECT_STATUS.md.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

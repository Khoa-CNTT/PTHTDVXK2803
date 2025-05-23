import "bootstrap/dist/css/bootstrap.min.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import App from "./App";
import AppProviders from "./contexts/AppProviders";
import "./styles/index.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>
);

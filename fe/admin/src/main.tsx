import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.scss";
// import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);

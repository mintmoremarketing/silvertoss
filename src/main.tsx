import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { AppProviders } from "@/app/providers";
import router from "@/app/router";

import "bootstrap/dist/css/bootstrap.min.css";
import "@/features/admin/styles.css";
import "@/styles/tokens.css";
import "@/styles/globals.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <AppProviders>
    <RouterProvider router={router} />
  </AppProviders>
);

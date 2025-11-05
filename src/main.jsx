import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider} from "react-router-dom";
import router from "./assets/Routes/Routes";
import AuthProvider from "./assets/Providers/AuthProviders";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  </React.StrictMode>
);

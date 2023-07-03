import React from "react";
import { createRoot } from "react-dom/client";
import { Provider as StoreProvider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { store } from "./store";
import { ConfigProvider, UserProvider } from "./providers";
import { theme } from "./theme";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element.");
}

const root = createRoot(rootElement);

let router = createBrowserRouter([{ path: "*", element: <App /> }]);

root.render(
  <ThemeProvider theme={theme}>
    <StoreProvider store={store}>
      <ConfigProvider>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </ConfigProvider>
    </StoreProvider>
  </ThemeProvider>
);

import React from "react";
import { createRoot } from "react-dom/client";
import { Provider as StoreProvider } from "react-redux";
import "./index.css";
import App from "./App";
import { store } from "./store";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ConfigProvider, UserProvider } from "./providers";
import GrinderyNexusContextProvider from "use-grindery-nexus";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element.");
}

const root = createRoot(rootElement);

let router = createBrowserRouter([{ path: "*", element: <App /> }]);

root.render(
  <React.StrictMode>
    <GrinderyNexusContextProvider>
      <StoreProvider store={store}>
        <ConfigProvider>
          <UserProvider>
            <RouterProvider router={router} />
          </UserProvider>
        </ConfigProvider>
      </StoreProvider>
    </GrinderyNexusContextProvider>
  </React.StrictMode>
);

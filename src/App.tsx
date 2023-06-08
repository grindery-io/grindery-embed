import React, { useEffect } from "react";
import "./App.css";
import useContentHeight from "./hooks/useContentHeight";
import { sendPostMessage } from "./utils/postMessages";
import { Route, Routes } from "react-router-dom";
import { CommonIntegrationPage, CustomIntegrationPage } from "./pages";
import { useAppSelector } from "./store";
import { selectUserStore } from "./store/slices/userSlice";
import { Box, Button, Typography } from "@mui/material";
import { useUserProvider } from "./providers/UserProvider";
import { AppContainer } from "./components";

function App() {
  const { height } = useContentHeight();
  const { accessToken } = useAppSelector(selectUserStore);
  const { connectUser } = useUserProvider();

  useEffect(() => {
    sendPostMessage("gr_resize", {
      height: height,
    });
    console.log("height", height);
  }, [height]);

  return (
    <AppContainer>
      {accessToken ? (
        <Routes>
          <Route path="/integration/*" element={<CustomIntegrationPage />} />
          <Route
            path="/:triggerConnectorKey/:actionConnectorKey"
            element={<CommonIntegrationPage />}
          />
          <Route
            path="/"
            element={
              <Box>
                <Typography
                  variant="h3"
                  sx={{ textAlign: "center", padding: "36px" }}
                >
                  Grindery Embed App
                </Typography>
              </Box>
            }
          />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      ) : (
        <Box
          sx={{
            padding: "32px",
            textAlign: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              connectUser();
            }}
          >
            Connect MetaMask wallet
          </Button>
        </Box>
      )}
    </AppContainer>
  );
}

export default App;

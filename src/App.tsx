import React, { useEffect } from "react";
import "./App.css";
import useContentHeight from "./hooks/useContentHeight";
import { sendPostMessage } from "./utils/postMessages";
import { Route, Routes } from "react-router-dom";
import {
  CommonIntegrationPage,
  CustomIntegrationPage,
  OauthPage,
} from "./pages";
import { useAppSelector } from "./store";
import { selectUserStore } from "./store/slices/userSlice";
import { Box, Button, Typography } from "@mui/material";
import { useUserProvider } from "./providers/UserProvider";
import { AppContainer, Loading } from "./components";

function App() {
  const { height } = useContentHeight();
  const { accessToken } = useAppSelector(selectUserStore);
  const { connectUser } = useUserProvider();
  const [initialized, setInitialized] = React.useState<boolean>(false);

  useEffect(() => {
    sendPostMessage("gr_resize", {
      height: height,
    });
  }, [height]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialized(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppContainer>
      {initialized ? (
        <>
          {accessToken ? (
            <Routes>
              <Route path="/oauth" element={<OauthPage />} />
              <Route
                path="/integration/*"
                element={<CustomIntegrationPage />}
              />
              <Route
                path="/:triggerConnectorKey/:actionConnectorKey"
                element={<CommonIntegrationPage />}
              />
              <Route
                path="/:triggerConnectorKey"
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
            <Routes>
              <Route path="/oauth" element={<OauthPage />} />
              <Route
                path="*"
                element={
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
                      color="primary"
                    >
                      Connect MetaMask wallet
                    </Button>
                  </Box>
                }
              />
            </Routes>
          )}
        </>
      ) : (
        <Loading title="Loading..." />
      )}
    </AppContainer>
  );
}

export default App;

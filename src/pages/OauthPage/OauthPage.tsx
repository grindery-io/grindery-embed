import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Loading } from "../../components";

const OauthPage = () => {
  const bc = new BroadcastChannel("grindery-connector-authentication");
  const [success, setSuccess] = useState<boolean>(false);
  const receiveMessage = (e: { origin: any; data: any }) => {
    if (e.origin === window.location.origin) {
      const { data } = e;
      if (data.gr_close) {
        setSuccess(true);
      }
    }
  };

  useEffect(() => {
    bc.postMessage({ gr_url: window.location.href });
    bc.onmessage = (e) => receiveMessage(e);
  }, []);

  return success ? (
    <Box
      sx={{
        padding: "150px 32px",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" sx={{ margin: "0 0 20px" }}>
        Connected
      </Typography>
      <Typography sx={{ whiteSpace: "pre-wrap" }}>
        {"Your account successfully connected, you can"}
      </Typography>
      <Button
        sx={{ margin: "10px 0 0 " }}
        variant="contained"
        size="small"
        onClick={() => {
          window.close();
        }}
        color="secondary"
      >
        Close this window
      </Button>
    </Box>
  ) : (
    <Loading title="Connecting..." />
  );
};

export default OauthPage;

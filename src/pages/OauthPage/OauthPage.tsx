import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Loading } from "../../components";

const OauthPage = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const code = urlParams.get("code");
  const authCode = code || null;
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (window.opener && authCode) {
      window.opener.postMessage(
        { method: "gr_authCode", params: { authCode: authCode } },
        "*"
      );
      setSuccess(true);
    }
  }, [authCode]);

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

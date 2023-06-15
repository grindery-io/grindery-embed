import React from "react";
import { Loading } from "../../components";
import { sendPostMessage } from "../../utils/postMessages";
import { Box, Button, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { inIframe } from "../../utils/iFrame";
import { useSafeSlackIntegrationContext } from "./SafeSlackIntegrationContext";
import ErrorIcon from "@mui/icons-material/Error";

const SafeSlackIntegrationStep3 = () => {
  const { saving, error } = useSafeSlackIntegrationContext();

  return saving ? (
    <Loading title="Saving..." />
  ) : (
    <Box
      sx={{
        padding: "150px 32px",
        textAlign: "center",
      }}
    >
      {!error ? (
        <>
          <CheckCircleIcon
            sx={{ fontSize: "42px", margin: "0 0 20px", color: "#344054" }}
          />
          <Typography variant="h4">Integration saved</Typography>
          {inIframe() && (
            <Button
              sx={{ margin: "16px 0 0 " }}
              variant="contained"
              size="small"
              onClick={() => {
                sendPostMessage("gr_complete");
              }}
              color="secondary"
            >
              Close
            </Button>
          )}
        </>
      ) : (
        <>
          <ErrorIcon
            color="error"
            sx={{ fontSize: "42px", margin: "0 0 20px" }}
          />
          <Typography variant="h4">{error}</Typography>

          <Button
            sx={{ margin: "16px 0 0 " }}
            variant="contained"
            size="small"
            onClick={() => {
              window.location.reload();
            }}
            color="secondary"
          >
            Try again
          </Button>
        </>
      )}
    </Box>
  );
};

export default SafeSlackIntegrationStep3;

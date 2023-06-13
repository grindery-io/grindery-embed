import React, { useEffect, useState } from "react";
import { Loading } from "../../components";
import { sendPostMessage } from "../../utils/postMessages";
import { Box, Button, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { inIframe } from "../../utils/iFrame";

const SafeGsheetIntegrationStep3 = () => {
  const [imported, setImported] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setImported(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return !imported ? (
    <Loading title="Importing..." />
  ) : (
    <Box
      sx={{
        padding: "150px 32px",
        textAlign: "center",
      }}
    >
      <CheckCircleIcon
        sx={{ fontSize: "42px", margin: "0 0 20px", color: "#344054" }}
      />
      <Typography variant="h4">Import completed</Typography>
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
    </Box>
  );
};

export default SafeGsheetIntegrationStep3;

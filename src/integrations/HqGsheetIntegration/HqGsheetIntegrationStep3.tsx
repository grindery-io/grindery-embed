import React, { useEffect, useState } from "react";
import { Loading } from "../../components";
import { sendPostMessage } from "../../utils/postMessages";
import { Box, Typography } from "@mui/material";

const HqGsheetIntegrationStep3 = () => {
  const [imported, setImported] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setImported(true);
      sendPostMessage("gr_complete");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return !imported ? (
    <Loading title="Importing..." />
  ) : (
    <Box
      sx={{
        padding: "32px",
        textAlign: "center",
      }}
    >
      <Typography variant="h4">Import completed</Typography>
    </Box>
  );
};

export default HqGsheetIntegrationStep3;

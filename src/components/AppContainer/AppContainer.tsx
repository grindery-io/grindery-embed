import React from "react";
import { Box } from "@mui/material";

type Props = {
  children: React.ReactNode;
};

const AppContainer = (props: Props) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "622px",
        margin: "0 auto",
      }}
    >
      {props.children}
    </Box>
  );
};

export default AppContainer;

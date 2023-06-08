import React from "react";
import { Box, Typography } from "@mui/material";

type Props = {
  title: string;
  subtitle?: string;
};

const StepHeader = (props: Props) => {
  const { title, subtitle } = props;
  return (
    <Box
      sx={{
        padding: "32px",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <Typography variant="h1" sx={{ margin: "0", padding: 0 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ margin: "6px 0 0", padding: 0 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default StepHeader;

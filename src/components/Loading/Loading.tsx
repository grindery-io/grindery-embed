import React from "react";
import { Box, Button, SxProps, Typography } from "@mui/material";

type Props = {
  title?: string;
  subtitle?: string;
  containerStyle?: React.CSSProperties | SxProps;
  titleStyle?: React.CSSProperties | SxProps;
  animationStyle?: React.CSSProperties;
  tryAgain?: boolean;
};

const Loading = (props: Props) => {
  const {
    title,
    subtitle,
    tryAgain,
    containerStyle,
    titleStyle,
    animationStyle,
  } = props;
  return (
    <Box
      sx={{
        padding: "32px",
        textAlign: "center",
        ...(containerStyle || {}),
      }}
    >
      {title && (
        <Typography
          variant="h4"
          sx={{ margin: "0 0 20px", ...(titleStyle || {}) }}
        >
          {title}
        </Typography>
      )}

      <img
        src="/images/load-animation.gif"
        alt="loading"
        style={{ width: "72px", height: "38px", ...(animationStyle || {}) }}
      />
      {subtitle && (
        <Typography sx={{ margin: "20px 0 0", whiteSpace: "pre-wrap" }}>
          {subtitle}
        </Typography>
      )}
      {typeof tryAgain !== "undefined" && tryAgain && (
        <Button
          sx={{ margin: "10px 0 0" }}
          variant="contained"
          onClick={() => {
            window.location.reload();
          }}
          size="small"
          color="secondary"
        >
          Try again
        </Button>
      )}
    </Box>
  );
};

export default Loading;

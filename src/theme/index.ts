import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#101828",
      dark: "#101828",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#F2F4F7",
      dark: "#F2F4F7",
      contrastText: "#344054",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    allVariants: {
      color: "#344054",
    },
    h1: {
      fontWeight: "400",
      fontSize: "24px",
      lineHeight: "36px",
      fontStyle: "normal",
    },
    h2: {},
    h3: {},
    h4: {
      fontWeight: "700",
      fontSize: "18px",
      lineHeight: "120%",
      fontStyle: "normal",
    },
    body2: {
      fontWeight: "500",
      fontSize: "14px",
      lineHeight: "21px",
      fontStyle: "normal",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          boxShadow: "none",
          textTransform: "none",
        },
        sizeMedium: {
          borderRadius: "8px",
          padding: "16px 32px",
          fontWeight: "600",
          fontSize: "16px",
          lineHeight: "24px",
        },
        sizeSmall: {
          padding: "3px 8px",
          fontWeight: "600",
          fontSize: "12px",
          lineHeight: "18px",
          borderRadius: "4px",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: "8px !important",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          padding: "14px 12px 14px 9px",
          fontWeight: "500",
          fontSize: "14px",
          lineHeight: "20px",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: "14px 12px 14px 9px",
          fontWeight: "500",
          fontSize: "14px",
          lineHeight: "20px",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "22px 8px",
          fontWeight: "300",
          fontSize: "14px",
          lineHeight: "24px",
          color: "#2D2D2C",
        },
        head: {
          padding: "13px 8px",
          fontWeight: "600",
          fontSize: "12px",
          lineHeight: "18px",
          color: "#777675",
          background: "#FBFAFA",
        },
        paddingCheckbox: {
          padding: "0 0 0 24px",
        },
      },
    },
  },
});

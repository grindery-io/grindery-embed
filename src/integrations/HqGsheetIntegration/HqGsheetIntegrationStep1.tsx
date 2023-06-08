import React from "react";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import {
  HQ_FIELDS,
  useHqGsheetIntegrationContext,
} from "./HqGsheetIntegrationContext";
import { CustomLabel, Loading } from "../../components";

const HqGsheetIntegrationStep1 = () => {
  const {
    isAuthenticated,
    trigger,
    input,
    hqFieldsInput,
    connectionFailed,
    handleInputChange,
    handleHqFieldsInputChange,
    handlePreviewButtonClick,
    handleCancelButtonClick,
  } = useHqGsheetIntegrationContext();

  return isAuthenticated && trigger ? (
    <>
      <Box
        sx={{
          padding: "32px",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <Typography variant="h1" sx={{ margin: "0 0 6px", padding: 0 }}>
          Google Sheets Configuration
        </Typography>
        <Typography variant="body2" sx={{ margin: 0, padding: 0 }}>
          Select a spreadsheet and map each column accordingly
        </Typography>
      </Box>
      <Box
        sx={{
          padding: "32px",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <Stack
          direction="row"
          alignItems="stretch"
          justifyContent="space-between"
          flexWrap="nowrap"
          gap="24px"
        >
          <Stack
            sx={{ flex: 1 }}
            direction="column"
            alignItems="stretch"
            justifyContent="flex-start"
            flexWrap="nowrap"
            gap="24px"
          >
            {trigger?.operation?.inputFields?.find(
              (field: any) => field.key === "spreadsheet"
            ) && (
              <Box>
                <CustomLabel id="spreadsheet-label">
                  Choose spreadsheet
                </CustomLabel>
                <FormControl fullWidth>
                  <Select
                    labelId="spreadsheet-label"
                    id="spreadsheet-select"
                    value={input.spreadsheet || ""}
                    label=""
                    onChange={(event: SelectChangeEvent) => {
                      handleInputChange(
                        "spreadsheet",
                        event.target.value || ""
                      );
                    }}
                  >
                    <MenuItem value={""}>Select spreadsheet</MenuItem>
                    {trigger?.operation?.inputFields
                      ?.find((field: any) => field.key === "spreadsheet")
                      ?.choices?.map((choice: any) => (
                        <MenuItem key={choice.value} value={choice.value}>
                          {choice.label}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            )}
            {trigger?.operation?.inputFields?.find(
              (field: any) => field.key === "worksheet"
            ) && (
              <Box>
                <CustomLabel id="worksheet-label">Choose worksheet</CustomLabel>
                <FormControl fullWidth>
                  <Select
                    labelId="worksheet-label"
                    id="worksheet-select"
                    value={input.worksheet || ""}
                    label=""
                    onChange={(event: SelectChangeEvent) => {
                      handleInputChange("worksheet", event.target.value || "");
                    }}
                  >
                    <MenuItem value={""}>Select worksheet</MenuItem>
                    {trigger?.operation?.inputFields
                      ?.find((field: any) => field.key === "worksheet")
                      ?.choices?.map((choice: any) => (
                        <MenuItem key={choice.value} value={choice.value}>
                          {choice.label}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          </Stack>
          <Box
            sx={{
              width: "1px",
              background: "#E5E7EB",
            }}
          />
          <Stack
            sx={{ flex: 1 }}
            direction="column"
            alignItems="stretch"
            justifyContent="flex-start"
            flexWrap="nowrap"
            gap="24px"
          >
            {trigger?.operation?.outputFields &&
              trigger?.operation?.outputFields.length > 0 &&
              HQ_FIELDS.map((field) => (
                <Box>
                  <CustomLabel id={`${field.key}-label`}>
                    {field.label}
                  </CustomLabel>
                  <FormControl fullWidth key={field.key}>
                    <Select
                      labelId={`${field.key}-label`}
                      id={`${field.key}-select`}
                      value={hqFieldsInput[field.key] || ""}
                      label=""
                      onChange={(event: SelectChangeEvent) => {
                        handleHqFieldsInputChange(
                          field.key,
                          event.target.value || ""
                        );
                      }}
                    >
                      <MenuItem value={""}>Select spreadsheet column</MenuItem>
                      {trigger?.operation?.outputFields?.map((choice: any) => (
                        <MenuItem key={choice.key} value={choice.key}>
                          {choice.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              ))}
          </Stack>
        </Stack>
      </Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        gap="30px"
        sx={{ padding: "32px" }}
      >
        <Button
          variant="contained"
          onClick={handleCancelButtonClick}
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={handlePreviewButtonClick}
          disabled={
            !isAuthenticated ||
            !input.spreadsheet ||
            !input.worksheet ||
            !trigger
          }
        >
          Preview
        </Button>
      </Stack>
    </>
  ) : (
    <Loading
      title="Connecting to Google Sheets..."
      subtitle={
        connectionFailed
          ? "This is taking longer than expected, please wait\na few more moments, or"
          : "Allow popup windows in your browser\nto connect to Google Sheets"
      }
      tryAgain={connectionFailed}
    />
  );
};

export default HqGsheetIntegrationStep1;

import React from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
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

const HqGsheetIntegrationStep1 = () => {
  const {
    isAuthenticated,
    trigger,
    input,
    hqFieldsInput,
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
              <FormControl fullWidth>
                <InputLabel id="spreadsheet-label">
                  Choose spreadsheet
                </InputLabel>
                <Select
                  labelId="spreadsheet-label"
                  id="spreadsheet-select"
                  value={input.spreadsheet || ""}
                  label="Choose spreadsheet"
                  onChange={(event: SelectChangeEvent) => {
                    handleInputChange("spreadsheet", event.target.value || "");
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
            )}
            {trigger?.operation?.inputFields?.find(
              (field: any) => field.key === "worksheet"
            ) && (
              <FormControl fullWidth>
                <InputLabel id="worksheet-label">Choose worksheet</InputLabel>
                <Select
                  labelId="worksheet-label"
                  id="worksheet-select"
                  value={input.worksheet || ""}
                  label="Choose worksheet"
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
                <FormControl fullWidth key={field.key}>
                  <InputLabel id={`${field.key}-label`}>
                    {field.label}
                  </InputLabel>
                  <Select
                    labelId={`${field.key}-label`}
                    id={`${field.key}-select`}
                    value={hqFieldsInput[field.key] || ""}
                    label={field.label}
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
        <Button variant="contained" onClick={handleCancelButtonClick}>
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
  ) : null;
};

export default HqGsheetIntegrationStep1;

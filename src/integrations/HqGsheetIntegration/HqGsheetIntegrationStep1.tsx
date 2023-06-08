import React from "react";
import { Box, Button, SelectChangeEvent, Stack } from "@mui/material";
import {
  HQ_FIELDS,
  useHqGsheetIntegrationContext,
} from "./HqGsheetIntegrationContext";
import { CustomSelect, Loading, StepHeader } from "../../components";

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
      <StepHeader
        title="Google Sheets Configuration"
        subtitle="Select a spreadsheet and map each column accordingly"
      />
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
              <CustomSelect
                name="spreadsheet"
                label="Choose spreadsheet"
                value={input.spreadsheet || ""}
                placeholder="Select spreadsheet"
                options={
                  trigger?.operation?.inputFields?.find(
                    (field: any) => field.key === "spreadsheet"
                  )?.choices || []
                }
                onChange={(event: SelectChangeEvent) => {
                  handleInputChange("spreadsheet", event.target.value || "");
                }}
              />
            )}
            {trigger?.operation?.inputFields?.find(
              (field: any) => field.key === "worksheet"
            ) && (
              <CustomSelect
                name="worksheet"
                label="Choose worksheet"
                value={input.worksheet || ""}
                placeholder="Select worksheet"
                options={
                  trigger?.operation?.inputFields?.find(
                    (field: any) => field.key === "worksheet"
                  )?.choices || []
                }
                onChange={(event: SelectChangeEvent) => {
                  handleInputChange("worksheet", event.target.value || "");
                }}
              />
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
                <CustomSelect
                  key={field.key}
                  name={field.key}
                  label={field.label}
                  value={hqFieldsInput[field.key] || ""}
                  placeholder="Select spreadsheet column"
                  options={
                    trigger?.operation?.outputFields?.map((output: any) => ({
                      value: output.key,
                      label: output.label,
                    })) || []
                  }
                  onChange={(event: SelectChangeEvent) => {
                    handleHqFieldsInputChange(
                      field.key,
                      event.target.value || ""
                    );
                  }}
                />
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

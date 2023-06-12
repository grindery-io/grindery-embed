import React from "react";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  SelectChangeEvent,
  Skeleton,
  Stack,
} from "@mui/material";
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
    connectorLoading,
    error,
    handleInputChange,
    handleHqFieldsInputChange,
    handlePreviewButtonClick,
    handleCancelButtonClick,
  } = useHqGsheetIntegrationContext();

  return isAuthenticated ? (
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
          flexWrap="wrap"
          gap="24px"
        >
          <Stack
            sx={{
              width: {
                xs: "100%",
                md: "calc(50% - 24.5px)",
              },
            }}
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
                  handleInputChange("worksheet", "");
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
            {connectorLoading && (!input.spreadsheet || !input.worksheet) && (
              <Box>
                <Skeleton width="150px" sx={{ marginBottom: "10px" }} />
                <Skeleton variant="rounded" height={48} />
              </Box>
            )}
          </Stack>
          <Box
            sx={{
              width: "1px",
              background: "#E5E7EB",
              display: {
                xs: "none",
                md: "block",
              },
            }}
          />
          <Stack
            sx={{
              width: {
                xs: "100%",
                md: "calc(50% - 24.5px)",
              },
            }}
            direction="column"
            alignItems="stretch"
            justifyContent="flex-start"
            flexWrap="nowrap"
            gap="24px"
          >
            {!connectorLoading &&
              trigger?.operation?.outputFields &&
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
            {connectorLoading &&
              input.worksheet &&
              input.spreadsheet &&
              [1, 2, 3, 4, 5].map((i: number) => (
                <Box key={`loading-${i}`}>
                  <Skeleton width="150px" sx={{ marginBottom: "10px" }} />
                  <Skeleton variant="rounded" height={48} />
                </Box>
              ))}
          </Stack>
        </Stack>
        {error && (
          <Box sx={{ padding: "32px 0 0" }}>
            <Alert
              severity="error"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  RELOAD
                </Button>
              }
            >
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          </Box>
        )}
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
            !trigger ||
            !!error ||
            connectorLoading
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

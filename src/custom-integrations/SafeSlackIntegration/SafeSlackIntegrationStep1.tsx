import React, { useEffect } from "react";
import { Alert, AlertTitle, Box, Button, Stack } from "@mui/material";
import {
  CustomInput,
  CustomSelect,
  Loading,
  StepHeader,
} from "../../components";
import { useSafeSlackIntegrationContext } from "./SafeSlackIntegrationContext";
import useOAuth2 from "../../hooks/useOAuth2";
import { useAppSelector } from "../../store";
import { selectUserStore } from "../../store/slices/userSlice";
import { Field } from "../../types/Connector";

const SafeSlackIntegrationStep1 = () => {
  const { accessToken } = useAppSelector(selectUserStore);
  const {
    trigger,
    connectorLoading,
    error,
    triggerInput,
    safeCredentials,
    chains,
    handleCancelButtonClick,
    handleNextButtonClick,
    handleCredentialsChange,
    handleTriggerInputChange,
  } = useSafeSlackIntegrationContext();

  const { credentials, connectionFailed } = useOAuth2({
    accessToken,
    connectorKey: "safe",
    authenticated: !!safeCredentials,
  });

  useEffect(() => {
    if (credentials) {
      handleCredentialsChange("safe", credentials);
    }
  }, [credentials, handleCredentialsChange]);

  return safeCredentials ? (
    <>
      <StepHeader title="Safe configuration" subtitle="Select something" />
      <Box
        sx={{
          padding: "32px",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <Stack
          direction="column"
          alignItems="stretch"
          justifyContent="flex-start"
          flexWrap="nowrap"
          gap="24px"
        >
          {trigger?.operation?.inputFields?.map((field: Field) => {
            if (
              (field.choices && field.choices.length > 0) ||
              field.key === "_grinderyChain"
            ) {
              return (
                <CustomSelect
                  label={field.label || ""}
                  name={field.key}
                  placeholder={field.placeholder}
                  options={
                    field.key === "_grinderyChain"
                      ? chains.map((chain: any) => ({
                          value: chain.value,
                          label: chain.label,
                        }))
                      : field.choices?.map((choice: any) => ({
                          value: choice.value,
                          label: choice.label,
                        })) || []
                  }
                  value={triggerInput[field.key] || ""}
                  onChange={(event) => {
                    handleTriggerInputChange(field.key, event.target.value);
                  }}
                />
              );
            } else {
              return (
                <CustomInput
                  label={field.label || ""}
                  name={field.key}
                  placeholder={field.placeholder}
                  value={triggerInput[field.key] || ""}
                  onChange={(event) => {
                    handleTriggerInputChange(field.key, event.target.value);
                  }}
                />
              );
            }
          })}
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
          onClick={handleNextButtonClick}
          disabled={!safeCredentials || !trigger || !!error || connectorLoading}
        >
          Next
        </Button>
      </Stack>
    </>
  ) : (
    <Loading
      title="Connecting to Safe..."
      subtitle={
        connectionFailed
          ? "This is taking longer than expected, please wait\na few more moments, or"
          : "Allow popup windows in your browser\nto connect to Safe"
      }
      tryAgain={connectionFailed}
    />
  );
};

export default SafeSlackIntegrationStep1;

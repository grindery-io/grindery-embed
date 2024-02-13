import React, { useCallback, useEffect } from "react";
import GrinderyClient from "grindery-nexus-client";
import { useParams } from "react-router";
import { ThemeProvider, Button } from "grindery-ui";
import WorkflowContextProvider from "../../workflows/WorkflowContext";
import WorkflowBuilder from "../../workflows/WorkflowBuilder";
import { useAppDispatch, useAppSelector } from "../../store";
import { selectUserStore } from "../../store/slices/userSlice";
import WorkflowsList from "../../workflows/WorkflowsList";
import { Workflow } from "../../types/Workflow";
import { Loading } from "../../components";
import { Box, Stack, Typography } from "@mui/material";
import {
  configStoreActions,
  selecConfigStore,
} from "../../store/slices/configSlice";
import { useGrinderyUserProvider } from "../../providers/GrinderyUserProvider";

const CommonIntegrationPage = () => {
  const dispatch = useAppDispatch();
  const {
    loading,
    create,
    workflows,
    workflowKey,
    triggerConnector,
    actionConnector,
    connectors,
    redirect,
    connect,
    description,
  } = useAppSelector(selecConfigStore);
  let { triggerConnectorKey, actionConnectorKey } = useParams();
  const hasAction = !!actionConnectorKey;
  const { accessToken } = useAppSelector(selectUserStore);
  const { connectUser } = useGrinderyUserProvider();
  const [connectTriggered, setConnectTriggered] =
    React.useState<boolean>(false);

  const filteredWorkflows = workflows.filter(
    (item: Workflow) =>
      item.trigger?.connector === triggerConnectorKey &&
      (actionConnectorKey
        ? item.actions?.[0]?.connector === actionConnectorKey
        : true)
  );

  const getConnector = useCallback(
    async (connectorKey: string, type: string) => {
      const client = new GrinderyClient();

      const connectorsRes = await client.connector.get({
        driverKey: connectorKey,
        enrich: true,
      });
      if (connectorsRes) {
        if (type === "trigger") {
          dispatch(configStoreActions.setTriggerConnector(connectorsRes));
        }
        if (type === "action") {
          dispatch(configStoreActions.setActionConnector(connectorsRes));
        }
      }
    },
    [dispatch]
  );

  const getConnectors = useCallback(async () => {
    const client = new GrinderyClient(accessToken);

    const connectorsRes = await client.connector.list({});

    dispatch(configStoreActions.setConnectors(connectorsRes || []));
  }, [accessToken, dispatch]);

  const getWorkflows = useCallback(async () => {
    const client = new GrinderyClient(accessToken);
    if (accessToken) {
      try {
        const workflowsResponse = await client.workflow.list({});
        const workflows = workflowsResponse
          ? workflowsResponse.map((wr: any) => ({
              key: wr.key,
              ...wr.workflow,
            }))
          : [];
        dispatch(configStoreActions.setWorkflows(workflows));
      } catch (error: any) {
        console.error("getWorkflows error: ", error.message);
        dispatch(configStoreActions.setWorkflows([]));
      }
      dispatch(configStoreActions.setLoading(false));
    }
  }, [accessToken, dispatch]);

  useEffect(() => {
    if (accessToken) {
      getConnectors();
    }
  }, [accessToken, getConnectors]);

  useEffect(() => {
    if (triggerConnectorKey) {
      getConnector(triggerConnectorKey, "trigger");
    }
    if (actionConnectorKey) {
      getConnector(actionConnectorKey, "action");
    }
  }, [triggerConnectorKey, actionConnectorKey, getConnector]);

  useEffect(() => {
    getWorkflows();
  }, [create, workflowKey, getWorkflows]);

  useEffect(() => {
    if (!accessToken && connect && !connectTriggered) {
      connectUser();
      setConnectTriggered(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, connect, connectTriggered]);

  return accessToken ? (
    <>
      {connectors &&
      triggerConnector &&
      !loading &&
      ((hasAction && actionConnector) || !hasAction) ? (
        <ThemeProvider>
          {!create && !workflowKey ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                justifyContent: "center",
                padding: "40px",
              }}
            >
              {filteredWorkflows && filteredWorkflows.length > 0 && (
                <WorkflowsList
                  connectors={connectors}
                  workflows={filteredWorkflows}
                />
              )}

              <Button
                value="Create New Integration"
                onClick={() => {
                  dispatch(configStoreActions.setCreate(true));
                }}
              />
            </Box>
          ) : (
            <WorkflowContextProvider
              triggerConnector={triggerConnector}
              actionConnector={actionConnector}
              onSaved={
                redirect
                  ? () => {
                      window.open(redirect, "_self");
                    }
                  : getWorkflows
              }
            >
              <WorkflowBuilder />
            </WorkflowContextProvider>
          )}
        </ThemeProvider>
      ) : (
        <Loading title="Loading..." />
      )}{" "}
    </>
  ) : (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        padding: "40px",
      }}
    >
      {(window.location.hostname === "templates.grindery.com" ||
        description) && (
        <>
          {triggerConnector && (
            <>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                flexWrap="nowrap"
                sx={{
                  marginBottom: "24px",
                  "& img": {
                    width: "48px",
                    height: "48px",
                    display: "block",
                  },
                }}
              >
                <Box
                  sx={{
                    padding: "10px",
                    background: "#fff",
                    border: "1px solid rgb(220, 220, 220)",
                    borderRadius: "8px",
                  }}
                >
                  <img
                    src={triggerConnector?.icon}
                    alt={`${triggerConnector.name} icon`}
                  />
                </Box>
                {actionConnector && (
                  <>
                    <Box
                      sx={{
                        position: "relative",
                        width: "68px",
                        height: "70px",
                      }}
                    >
                      <Box
                        sx={{
                          background: "rgb(220, 220, 220)",
                          position: "absolute",
                          left: 0,
                          top: "35px",
                          width: "100%",
                          height: "1px",
                        }}
                      />
                      <img
                        style={{
                          position: "absolute",
                          left: "24px",
                          top: "25px",
                          width: "20px",
                          height: "20px",
                          display: "block",
                        }}
                        src="https://www.grindery.com/hubfs/plus-icon.svg"
                        alt="plus icon"
                      />
                    </Box>

                    <Box
                      sx={{
                        padding: "10px",
                        background: "#fff",
                        border: "1px solid rgb(220, 220, 220)",
                        borderRadius: "8px",
                      }}
                    >
                      <img
                        src={actionConnector?.icon}
                        alt={`${actionConnector.name} icon`}
                      />
                    </Box>
                  </>
                )}
              </Stack>
              <Typography
                sx={{
                  marginBottom: "32px",
                  fontSize: "32px",
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#000",
                  lineHeight: "130%",
                }}
              >
                Connect
                <br />
                {triggerConnector.name} to{" "}
                {actionConnector?.name || "Apps/dApps"}
              </Typography>
            </>
          )}
        </>
      )}

      <Box sx={{ textAlign: "center", "& button": { width: "auto" } }}>
        <Button
          variant="contained"
          onClick={() => {
            connectUser();
          }}
          color="primary"
          value="Connect MetaMask Wallet"
          icon="/images/icons/metamask-logo.svg"
        ></Button>
      </Box>

      {(window.location.hostname === "templates.grindery.com" ||
        description) && (
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "18px",
            fontWeight: "bold",
            margin: "32px 0",
            color: "#000",
          }}
        >
          Grindery's integration-platform-as-a-protocol (iPaaP) is the fastest
          and easiest way to connect dApps with thousands of web2 Apps.
        </Typography>
      )}
    </Box>
  );
};

export default CommonIntegrationPage;

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
import { Box } from "@mui/material";
import {
  configStoreActions,
  selecConfigStore,
} from "../../store/slices/configSlice";

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
  } = useAppSelector(selecConfigStore);
  let { triggerConnectorKey, actionConnectorKey } = useParams();
  const { accessToken } = useAppSelector(selectUserStore);

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

  return connectors && triggerConnector && !loading ? (
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
  );
};

export default CommonIntegrationPage;

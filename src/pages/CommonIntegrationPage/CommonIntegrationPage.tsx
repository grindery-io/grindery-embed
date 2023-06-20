import React, { useCallback, useEffect, useState } from "react";
import GrinderyClient from "grindery-nexus-client";
import { useParams } from "react-router";
import { ThemeProvider, Button } from "grindery-ui";
import WorkflowContextProvider from "../../workflows/WorkflowContext";
import WorkflowBuilder from "../../workflows/WorkflowBuilder";
import { Connector } from "../../types/Connector";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  selectUserStore,
  userStoreActions,
} from "../../store/slices/userSlice";
import WorkflowsList from "../../workflows/WorkflowsList";
import { Workflow } from "../../types/Workflow";
import { Loading } from "../../components";
import { Box } from "@mui/material";

const CommonIntegrationPage = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  let { triggerConnectorKey, actionConnectorKey } = useParams();
  const { accessToken, create, workflows, workflowKey } =
    useAppSelector(selectUserStore);

  const [triggerConnector, setTriggerConnector] = useState<Connector | null>(
    null
  );
  const [actionConnector, setActionConnector] = useState<Connector | null>(
    null
  );

  const filteredWorkflows = workflows.filter(
    (item: Workflow) =>
      item.trigger?.connector === triggerConnectorKey &&
      item.actions?.[0]?.connector === actionConnectorKey
  );

  const getConnector = async (connectorKey: string, type: string) => {
    const client = new GrinderyClient();

    const connectorsRes = await client.connector.get({
      driverKey: connectorKey,
      enrich: true,
    });
    if (connectorsRes) {
      if (type === "trigger") {
        setTriggerConnector(connectorsRes);
      }
      if (type === "action") {
        setActionConnector(connectorsRes);
      }
    }
  };

  const getWorkflows = useCallback(async () => {
    const client = new GrinderyClient(accessToken);
    if (accessToken) {
      try {
        const workflowsResponse = await client.workflow.list({});
        const workflows = workflowsResponse
          ? workflowsResponse.map((wr: any) => wr.workflow)
          : [];
        dispatch(userStoreActions.setWorkflows(workflows));
      } catch (error: any) {
        console.error("getWorkflows error: ", error.message);
        dispatch(userStoreActions.setWorkflows([]));
      }
      setLoading(false);
    }
  }, [accessToken, dispatch]);

  useEffect(() => {
    if (triggerConnectorKey) {
      getConnector(triggerConnectorKey, "trigger");
    }
    if (actionConnectorKey) {
      getConnector(actionConnectorKey, "action");
    }
  }, [triggerConnectorKey, actionConnectorKey]);

  useEffect(() => {
    getWorkflows();
  }, [create, workflowKey, getWorkflows]);

  return triggerConnector && actionConnector && !loading ? (
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
              connectors={[triggerConnector, actionConnector]}
              workflows={filteredWorkflows}
            />
          )}

          <Button
            value="Create New Integration"
            onClick={() => {
              dispatch(userStoreActions.setCreate(true));
            }}
          />
        </Box>
      ) : (
        <WorkflowContextProvider
          triggerConnector={triggerConnector}
          actionConnector={actionConnector}
          onSaved={getWorkflows}
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

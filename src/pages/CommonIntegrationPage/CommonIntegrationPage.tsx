import React, { useEffect, useState } from "react";
import NexusClient from "grindery-nexus-client";
import { useParams } from "react-router";
import { ThemeProvider } from "grindery-ui";
import WorkflowContextProvider from "../../workflows/WorkflowContext";
import WorkflowBuilder from "../../workflows/WorkflowBuilder";
import { Connector } from "../../types/Connector";

const CommonIntegrationPage = () => {
  let { triggerConnectorKey, actionConnectorKey } = useParams();

  const [triggerConnector, setTriggerConnector] = useState<Connector | null>(
    null
  );
  const [actionConnector, setActionConnector] = useState<Connector | null>(
    null
  );

  const getConnector = async (connectorKey: string, type: string) => {
    const client = new NexusClient();
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

  useEffect(() => {
    if (triggerConnectorKey) {
      getConnector(triggerConnectorKey, "trigger");
    }
    if (actionConnectorKey) {
      getConnector(actionConnectorKey, "action");
    }
  }, [triggerConnectorKey, actionConnectorKey]);

  return triggerConnector && actionConnector ? (
    <ThemeProvider>
      <WorkflowContextProvider
        triggerConnector={triggerConnector}
        actionConnector={actionConnector}
      >
        <WorkflowBuilder />
      </WorkflowContextProvider>
    </ThemeProvider>
  ) : null;
};

export default CommonIntegrationPage;

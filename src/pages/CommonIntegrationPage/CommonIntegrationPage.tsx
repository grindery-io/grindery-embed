import React, { useEffect, useState } from "react";
import NexusClient from "grindery-nexus-client";
import { useParams } from "react-router";

const CommonIntegrationPage = () => {
  let { triggerConnectorKey, actionConnectorKey } = useParams();

  const [connectors, setConnectors] = useState<any[]>([]);
  const triggerConnector = connectors.find(
    (connector: any) => connector.key === triggerConnectorKey
  );
  const actionConnector = connectors.find(
    (connector: any) => connector.key === actionConnectorKey
  );

  const getConnectors = async () => {
    const client = new NexusClient();
    const connectorsRes = await client.connector.list({
      access: "public",
    });
    if (connectorsRes) {
      setConnectors(connectorsRes);
    }
  };

  useEffect(() => {
    getConnectors();
  }, []);

  return triggerConnector && actionConnector ? (
    <div>
      {triggerConnector.name} + {actionConnector.name}
    </div>
  ) : null;
};

export default CommonIntegrationPage;
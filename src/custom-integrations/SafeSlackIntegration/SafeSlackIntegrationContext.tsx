import React, {
  createContext,
  useEffect,
  useContext,
  useState,
  useCallback,
} from "react";
import { Connector } from "grindery-nexus-client/dist/types/types";
import NexusClient from "grindery-nexus-client";
import { useAppSelector } from "../../store";
import { selectUserStore } from "../../store/slices/userSlice";
import { sendPostMessage } from "../../utils/postMessages";
import { Action, Trigger } from "../../types/Connector";
import { Workflow } from "../../types/Workflow";

// Context props
type ContextProps = {
  trigger: Trigger | null;
  action: any;
  triggerInput: any;
  actionInput: any;
  step: number;
  connectorLoading: boolean;
  error: string;
  safeCredentials: any;
  slackCredentials: any;
  chains: any[];
  saving: boolean;
  handleTriggerInputChange: (key: string, value: string) => void;
  handleActionInputChange: (key: string, value: string) => void;
  handleCredentialsChange: (connectorKey: string, credentials: any) => void;
  handleCancelButtonClick: () => void;
  handleNextButtonClick: () => void;
  handleSaveButtonClick: () => void;
  handleBackButtonClick: () => void;
  saveWorkflow: () => void;
};

// Context provider props
type UserProviderProps = {
  children: React.ReactNode;
};

// Init context
export const SafeSlackIntegrationContext = createContext<ContextProps>({
  trigger: null,
  action: null,
  triggerInput: {},
  actionInput: {},
  step: 1,
  connectorLoading: false,
  error: "",
  safeCredentials: null,
  slackCredentials: null,
  chains: [],
  saving: false,
  handleTriggerInputChange: () => {},
  handleActionInputChange: () => {},
  handleCredentialsChange: () => {},
  handleCancelButtonClick: () => {},
  handleNextButtonClick: () => {},
  handleSaveButtonClick: () => {},
  handleBackButtonClick: () => {},
  saveWorkflow: () => {},
});

export const SafeSlackIntegrationContextProvider = ({
  children,
}: UserProviderProps) => {
  const [step, setStep] = useState<number>(1);
  const [safe, setSafe] = useState<Connector | null>();
  const [slack, setSlack] = useState<Connector | null>();
  const { userId, accessToken } = useAppSelector(selectUserStore);
  const [connectorLoading, setConnectorLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [triggerInput, setTriggerInput] = useState<any>({});
  const [actionInput, setActionInput] = useState<any>({});
  const [updatedAction, setUpdatedAction] = useState<any>(null);
  const [safeCredentials, setSafeCredentials] = useState<any>(null);
  const [slackCredentials, setSlackCredentials] = useState<any>(null);
  const safeTrigger = safe?.triggers?.find(
    (t: Trigger) => t.key === "safeTransactionExecutedTransferNative"
  );
  const slackAction = slack?.actions?.find(
    (a: Action) => a.key === "sendChannelMessage"
  );
  const trigger = safeTrigger || null;
  const [chains, setChains] = useState<any[]>([]);
  const [saving, setSaving] = useState<boolean>(false);

  const action = slackAction
    ? {
        ...slackAction,
        operation: {
          ...slackAction.operation,
          inputFields:
            updatedAction?.inputFields ||
            slackAction.operation?.inputFields ||
            [],
          outputFields:
            updatedAction?.outputFields &&
            updatedAction?.outputFields.length > 0
              ? updatedAction?.outputFields
              : slackAction.operation?.outputFields || [],
          sample: updatedAction?.sample || slackAction.operation?.sample || {},
        },
      }
    : null;

  const handleCredentialsChange = useCallback(
    (connectorKey: string, credentials: any) => {
      if (connectorKey === "safe") {
        setSafeCredentials(credentials);
      } else if (connectorKey === "slack") {
        setSlackCredentials(credentials);
      }
    },
    []
  );

  const getSafe = async () => {
    try {
      const client = new NexusClient();
      const connector = await client.connector.get({
        driverKey: "safe",
      });
      setSafe(connector || null);
    } catch (error: any) {
      setError("Connector error. Please reload the page, any try again.");
    }
  };

  const getSlack = async () => {
    try {
      const client = new NexusClient();
      const connector = await client.connector.get({
        driverKey: "slack",
      });
      setSlack(connector || null);
    } catch (error: any) {
      setError("Connector error. Please reload the page, any try again.");
    }
  };

  const handleTriggerInputChange = useCallback(
    (key: string, value: string) => {
      setTriggerInput({
        ...triggerInput,
        [key]: value,
      });
    },
    [triggerInput]
  );

  const handleActionInputChange = useCallback(
    (key: string, value: string) => {
      setActionInput({
        ...actionInput,
        [key]: value,
      });
    },
    [actionInput]
  );

  const saveWorkflow = async () => {
    if (
      safe &&
      slack &&
      trigger &&
      action &&
      userId &&
      accessToken &&
      safeCredentials &&
      slackCredentials
    ) {
      setSaving(true);
      const workflow: Workflow = {
        state: "on",
        title: "Safe Slack Embedded Integration",
        creator: userId,
        trigger: {
          type: "trigger",
          connector: safe?.key,
          operation: trigger?.key,
          input: triggerInput,
          authentication: safeCredentials.token,
          authenticationKey: safeCredentials.key,
        },
        actions: [
          {
            type: "action",
            connector: slack.key,
            operation: action.key,
            input: actionInput,
            authentication: slackCredentials.token,
            authenticationKey: slackCredentials.key,
          },
        ],
        source: "urn:grindery:embed",
      };
      const newWorkflow = {
        ...workflow,
        signature: JSON.stringify(workflow),
      };
      const client = new NexusClient(accessToken);
      try {
        await client.workflow.create({ workflow: newWorkflow });
      } catch (error: any) {
        console.error("Workflow saving error: ", error);
        setError("Workflow saving error. Please try again.");
      }
      setSaving(false);
    } else {
      setError("Workflow saving error. Please try again.");
    }
  };

  const handleCancelButtonClick = () => {
    setStep(0);
    sendPostMessage("gr_complete");
  };

  const handleBackButtonClick = () => {
    setStep(1);
  };

  const handleNextButtonClick = () => {
    setStep(2);
  };

  const handleSaveButtonClick = () => {
    setStep(3);
    saveWorkflow();
  };

  const updateAction = useCallback(async () => {
    setConnectorLoading(true);
    try {
      const client = new NexusClient(accessToken);
      const fieldsData = { ...actionInput };
      const action = await client.connector.callInputProvider({
        connectorKey: "slack",
        operationKey: "sendChannelMessage",
        body: {
          jsonrpc: "2.0",
          method: "grinderyNexusConnectorUpdateFields",
          id: new Date(),
          params: {
            key: "sendChannelMessage",
            fieldData: fieldsData,
            authentication: slackCredentials.token,
          },
        },
      });
      if (action) {
        setUpdatedAction(action);
      } else {
        setError("Connector error. Please reload the page, any try again.");
      }
    } catch (error: any) {
      setError("Connector error. Please reload the page, any try again.");
    }
    setConnectorLoading(false);
  }, [accessToken, slackCredentials, actionInput]);

  const getChains = useCallback(async () => {
    const client = new NexusClient();
    const chains = await client.chain.list({ type: "evm" });
    setChains(chains || []);
  }, []);

  useEffect(() => {
    getSafe();
    getSlack();
    getChains();
  }, [getChains]);

  useEffect(() => {
    if (accessToken && slackCredentials && slackCredentials.token) {
      updateAction();
    }
  }, [accessToken, slackCredentials, updateAction]);

  return (
    <SafeSlackIntegrationContext.Provider
      value={{
        trigger,
        action,
        triggerInput,
        actionInput,
        step,
        connectorLoading,
        error,
        safeCredentials,
        slackCredentials,
        chains,
        saving,
        handleTriggerInputChange,
        handleActionInputChange,
        handleCredentialsChange,
        handleCancelButtonClick,
        handleNextButtonClick,
        handleSaveButtonClick,
        handleBackButtonClick,
        saveWorkflow,
      }}
    >
      {children}
    </SafeSlackIntegrationContext.Provider>
  );
};

export const useSafeSlackIntegrationContext = () =>
  useContext(SafeSlackIntegrationContext);

export default SafeSlackIntegrationContextProvider;

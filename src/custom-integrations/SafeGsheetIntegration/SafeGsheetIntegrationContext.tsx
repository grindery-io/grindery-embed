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
import useOAuth2 from "../../hooks/useOAuth2";

export const CUSTOM_FIELDS = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "wallet_address",
    label: "Wallet address",
  },
  {
    key: "detail",
    label: "Detail",
  },
  {
    key: "amount",
    label: "Amount",
  },
  {
    key: "token",
    label: "Token",
  },
];

// Context props
type ContextProps = {
  trigger: any;
  isAuthenticated: boolean;
  input: any;
  customFieldsInput: any;
  step: number;
  connectionFailed: boolean;
  connectorLoading: boolean;
  error: string;
  handleInputChange: (key: string, value: string) => void;
  handleCustomFieldsInputChange: (key: string, value: string) => void;
  handlePreviewButtonClick: () => void;
  handleCancelButtonClick: () => void;
  handleBackButtonClick: () => void;
  handleImportButtonClick: () => void;
};

// Context provider props
type UserProviderProps = {
  children: React.ReactNode;
};

// Init context
export const SafeGsheetIntegrationContext = createContext<ContextProps>({
  trigger: null,
  isAuthenticated: false,
  input: {},
  customFieldsInput: {},
  step: 1,
  connectionFailed: false,
  connectorLoading: false,
  error: "",
  handleInputChange: () => {},
  handleCustomFieldsInputChange: () => {},
  handlePreviewButtonClick: () => {},
  handleCancelButtonClick: () => {},
  handleBackButtonClick: () => {},
  handleImportButtonClick: () => {},
});

export const SafeGsheetIntegrationContextProvider = ({
  children,
}: UserProviderProps) => {
  const [step, setStep] = useState<number>(1);
  const [gsheetConnector, setGsheetConnector] = useState<Connector | null>();
  const { accessToken } = useAppSelector(selectUserStore);
  const {
    isConnected: isAuthenticated,
    credentials,
    connectionFailed,
  } = useOAuth2({
    accessToken,
    connectorKey: "googleSheets",
  });
  const [connectorLoading, setConnectorLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [input, setInput] = useState<any>({});
  const [customFieldsInput, setCustomFieldsInput] = useState<any>({});
  const [updatedTrigger, setUpdatedTrigger] = useState<any>(null);
  const gsheetTrigger = gsheetConnector?.triggers?.find(
    (trig: any) => trig.key === "newSpreadsheetRow"
  );
  const trigger = gsheetTrigger
    ? {
        ...gsheetTrigger,
        operation: {
          ...gsheetTrigger.operation,
          inputFields:
            updatedTrigger?.inputFields ||
            gsheetTrigger.operation?.inputFields ||
            [],
          outputFields:
            updatedTrigger?.outputFields &&
            updatedTrigger?.outputFields.length > 0
              ? updatedTrigger?.outputFields
              : gsheetTrigger.operation?.outputFields || [],
          sample:
            updatedTrigger?.sample || gsheetTrigger.operation?.sample || {},
        },
      }
    : null;

  const getGsheetConnector = async () => {
    try {
      const client = new NexusClient();
      const connector = await client.connector.get({
        driverKey: "googleSheets",
      });
      setGsheetConnector(connector || null);
    } catch (error: any) {
      setError("Connector error. Please reload the page, any try again.");
    }
  };

  const updateTrigger = useCallback(async () => {
    setConnectorLoading(true);
    try {
      const client = new NexusClient(accessToken);
      const fieldsData = { ...input };
      if (!fieldsData.spreadsheet) {
        delete fieldsData.spreadsheet;
      }
      if (!fieldsData.worksheet) {
        delete fieldsData.worksheet;
      }
      const trig = await client.connector.callInputProvider({
        connectorKey: "googleSheets",
        operationKey: "newSpreadsheetRow",
        body: {
          jsonrpc: "2.0",
          method: "grinderyNexusConnectorUpdateFields",
          id: new Date(),
          params: {
            key: "newSpreadsheetRow",
            fieldData: fieldsData,
            authentication: credentials.token,
          },
        },
      });
      if (trig) {
        setUpdatedTrigger(trig);
      } else {
        setError("Connector error. Please reload the page, any try again.");
      }
    } catch (error: any) {
      setError("Connector error. Please reload the page, any try again.");
    }

    setConnectorLoading(false);
  }, [accessToken, credentials, input]);

  const handleInputChange = useCallback(
    (key: string, value: string) => {
      setInput({
        ...input,
        [key]: value,
      });
    },
    [input]
  );

  const handleCustomFieldsInputChange = useCallback(
    (key: string, value: string) => {
      setCustomFieldsInput({
        ...customFieldsInput,
        [key]: value,
      });
    },
    [customFieldsInput]
  );

  const handlePreviewButtonClick = () => {
    setStep(2);
  };

  const handleCancelButtonClick = () => {
    setStep(0);
    sendPostMessage("gr_complete");
  };

  const handleBackButtonClick = () => {
    setStep(1);
  };

  const handleImportButtonClick = () => {
    setStep(3);
  };

  useEffect(() => {
    getGsheetConnector();
  }, []);

  useEffect(() => {
    if (accessToken && credentials && credentials.token) {
      updateTrigger();
    }
  }, [accessToken, credentials, updateTrigger]);

  return (
    <SafeGsheetIntegrationContext.Provider
      value={{
        trigger,
        isAuthenticated,
        input,
        customFieldsInput,
        step,
        connectionFailed,
        connectorLoading,
        error,
        handleInputChange,
        handleCustomFieldsInputChange,
        handlePreviewButtonClick,
        handleCancelButtonClick,
        handleBackButtonClick,
        handleImportButtonClick,
      }}
    >
      {children}
    </SafeGsheetIntegrationContext.Provider>
  );
};

export const useSafeGsheetIntegrationContext = () =>
  useContext(SafeGsheetIntegrationContext);

export default SafeGsheetIntegrationContextProvider;

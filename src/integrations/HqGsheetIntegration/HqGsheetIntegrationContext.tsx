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
import axios from "axios";
import { sendPostMessage } from "../../utils/postMessages";

export const HQ_FIELDS = [
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
  hqFieldsInput: any;
  step: number;
  connectionFailed: boolean;
  handleInputChange: (key: string, value: string) => void;
  handleHqFieldsInputChange: (key: string, value: string) => void;
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
export const HqGsheetIntegrationContext = createContext<ContextProps>({
  trigger: null,
  isAuthenticated: false,
  input: {},
  hqFieldsInput: {},
  step: 1,
  connectionFailed: false,
  handleInputChange: () => {},
  handleHqFieldsInputChange: () => {},
  handlePreviewButtonClick: () => {},
  handleCancelButtonClick: () => {},
  handleBackButtonClick: () => {},
  handleImportButtonClick: () => {},
});

export const HqGsheetIntegrationContextProvider = ({
  children,
}: UserProviderProps) => {
  const [step, setStep] = useState<number>(1);
  const [gsheetConnector, setGsheetConnector] = useState<Connector | null>();
  const [authCode, setAuthCode] = useState<string | null>(null);
  const { accessToken } = useAppSelector(selectUserStore);
  const [credentials, setCredentials] = useState<any>(null);
  const [input, setInput] = useState<any>({});
  const [hqFieldsInput, setHqFieldsInput] = useState<any>({});
  const [updatedTrigger, setUpdatedTrigger] = useState<any>(null);
  const [connectionFailed, setConnectionFailed] = useState<boolean>(false);
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

  const isAuthenticated = accessToken && credentials?.token;

  const getGsheetConnector = async () => {
    const client = new NexusClient();
    const connector = await client.connector.get({ driverKey: "googleSheets" });
    setGsheetConnector(connector || null);
  };

  const getGsheetCredentials = useCallback(async () => {
    if (accessToken && authCode) {
      const res = await axios
        .post(
          "https://orchestrator.grindery.org/credentials/auth/complete",
          { code: authCode },
          {
            headers: {
              Authorization: `Bearer ${accessToken || ""}`,
            },
          }
        )
        .catch(() => {
          // handle error
        });
      if (res && res.data) {
        setCredentials(res.data || null);
      }
    }
  }, [accessToken, authCode]);

  const updateTrigger = useCallback(async () => {
    const client = new NexusClient(accessToken);
    const trig = await client.connector.callInputProvider({
      connectorKey: "googleSheets",
      operationKey: "newSpreadsheetRow",
      body: {
        jsonrpc: "2.0",
        method: "grinderyNexusConnectorUpdateFields",
        id: new Date(),
        params: {
          key: "newSpreadsheetRow",
          fieldData: input,
          authentication: credentials.token,
        },
      },
    });
    setUpdatedTrigger(trig);
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

  const handleHqFieldsInputChange = useCallback(
    (key: string, value: string) => {
      setHqFieldsInput({
        ...hqFieldsInput,
        [key]: value,
      });
    },
    [hqFieldsInput]
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
    function handleMessage(event: any) {
      if (
        event.data &&
        event.data.method === "gr_authCode" &&
        event.data.params &&
        event.data.params.authCode
      ) {
        setAuthCode(event.data.params.authCode);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (accessToken && !authCode) {
      window.open(
        `https://orchestrator.grindery.org/credentials/production/googleSheets/auth?access_token=${accessToken}&redirect_uri=${window.location.origin}/oauth`
      );
    }
  }, [accessToken, authCode]);

  useEffect(() => {
    if (accessToken && authCode) {
      getGsheetConnector();
      getGsheetCredentials();
    }
  }, [accessToken, authCode, getGsheetCredentials]);

  useEffect(() => {
    if (accessToken && credentials && credentials.token) {
      updateTrigger();
    }
  }, [accessToken, credentials, updateTrigger]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setConnectionFailed(true);
    }, 60000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <HqGsheetIntegrationContext.Provider
      value={{
        trigger,
        isAuthenticated,
        input,
        hqFieldsInput,
        step,
        connectionFailed,
        handleInputChange,
        handleHqFieldsInputChange,
        handlePreviewButtonClick,
        handleCancelButtonClick,
        handleBackButtonClick,
        handleImportButtonClick,
      }}
    >
      {children}
    </HqGsheetIntegrationContext.Provider>
  );
};

export const useHqGsheetIntegrationContext = () =>
  useContext(HqGsheetIntegrationContext);

export default HqGsheetIntegrationContextProvider;

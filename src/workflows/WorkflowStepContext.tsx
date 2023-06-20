import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import NexusClient from "grindery-nexus-client";
import { Action, Connector, Field, Trigger } from "../types/Connector";
import { useWorkflowContext } from "./WorkflowContext";
import { useAppSelector } from "../store";
import { selectUserStore } from "../store/slices/userSlice";

type WorkflowStepContextProps = {
  type: "trigger" | "action";
  index: number;
  step: number;
  activeRow: number;
  username: string;
  connector: null | Connector;
  operation: Trigger | Action | undefined | null;
  operationIsConfigured: boolean;
  operationIsAuthenticated: boolean;
  operationAuthenticationIsRequired: boolean;
  inputError: string;
  errors: any;
  operationIsTested: boolean | string;
  savedCredentials: any[];
  setConnector: (connector: Connector | null) => void;
  setActiveRow: (row: number) => void;
  setUsername: (name: string) => void;
  getConnector: (key: string) => void;
  setInputError: (a: string) => void;
  setErrors: (a: any) => void;
  setOperationIsTested: (a: boolean | string) => void;
  setSavedCredentials: React.Dispatch<React.SetStateAction<any[]>>;
};

type WorkflowStepContextProviderProps = {
  children: React.ReactNode;
  type: "trigger" | "action";
  index: number;
  step: number;
  setOutputFields: React.Dispatch<React.SetStateAction<any[]>>;
};

export const WorkflowStepContext = createContext<WorkflowStepContextProps>({
  type: "trigger",
  index: 0,
  step: 1,
  activeRow: 0,
  username: "",
  connector: null,
  operation: undefined,
  operationIsConfigured: false,
  operationIsAuthenticated: false,
  operationAuthenticationIsRequired: false,
  inputError: "",
  errors: false,
  operationIsTested: false,
  savedCredentials: [],
  setConnector: () => {},
  setActiveRow: () => {},
  setUsername: () => {},
  getConnector: () => {},
  setInputError: () => {},
  setErrors: () => {},
  setOperationIsTested: () => {},
  setSavedCredentials: () => {},
});

export const WorkflowStepContextProvider = ({
  children,
  type,
  index,
  step,
  setOutputFields,
}: WorkflowStepContextProviderProps) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const actionParam = urlParams.get("action");
  const triggerParam = urlParams.get("trigger");
  const { accessToken: access_token, workflowKey: key } =
    useAppSelector(selectUserStore);
  const client = new NexusClient(access_token);
  const { workflow, updateWorkflow } = useWorkflowContext();
  const [activeRow, setActiveRow] = useState(
    type === "trigger" && triggerParam
      ? 1
      : type === "action" && actionParam
      ? 1
      : 0
  );
  const [username, setUsername] = useState("");
  const [connector, setConnector] = useState<null | Connector>(null);
  const [inputError, setInputError] = useState("");
  const [errors, setErrors] = useState<any>(false);
  const [operation, setOperation] = useState<
    null | undefined | Trigger | Action
  >(null);
  const [operationIsTested, setOperationIsTested] = useState<boolean | string>(
    "skipped"
  );
  // key ? "skipped" : false

  const [savedCredentials, setSavedCredentials] = useState<any[]>([]);

  const workflowInput =
    type === "trigger" ? workflow.trigger.input : workflow.actions[index].input;

  const requiredFields = [
    ...((operation &&
      operation.operation &&
      operation.operation.inputFields &&
      operation.operation.inputFields
        .filter((field: Field) => field && field.required)
        .map((field: Field) => field.key)) ||
      []),
    ...((operation &&
      operation.inputFields &&
      operation.inputFields
        .filter((field: Field) => field && field.required)
        .map((field: Field) => field.key)) ||
      []),
  ];

  const operationIsConfigured = Boolean(
    requiredFields.filter(
      (field: string) =>
        workflowInput &&
        typeof workflowInput[field] !== "undefined" &&
        workflowInput[field] !== "" &&
        workflowInput[field] !== null
    ).length === requiredFields.length &&
      (operation &&
      operation.operation &&
      operation.operation.type === "blockchain:event"
        ? workflowInput._grinderyChain && workflowInput._grinderyContractAddress
        : true) &&
      !inputError &&
      typeof errors === "boolean"
  );

  const operationIsAuthenticated = Boolean(
    (connector && !connector.authentication) ||
      (type === "trigger"
        ? workflow.trigger?.authentication && connector?.authentication
        : workflow.actions[index]?.authentication && connector?.authentication)
  );

  const operationAuthenticationIsRequired = Boolean(
    connector && connector.authentication
  );

  const passOutputFields = useCallback(() => {
    setOutputFields((outputFields: any[]) => {
      const workflowOutput = [...outputFields];
      workflowOutput[step - 1] = {
        connector,
        operation: {
          ...operation?.operation,
          type: type,
        },
        step: step,
        index: step - 2,
      };
      return workflowOutput;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operation]);

  const getConnector = async (key: string) => {
    const res = await client?.connector.get({ driverKey: key, enrich: false });
    if (res) {
      setConnector(res);
    } else {
      setConnector(null);
      setSavedCredentials([]);
    }
  };

  const listCredentials = async () => {
    const res = await client?.credentials.list({
      connectorId: connector?.key || "",
      environment: "production",
    });
    if (res) {
      setSavedCredentials(res);
    } else {
      setSavedCredentials([]);
    }
  };

  useEffect(() => {
    setOperation(
      type === "trigger"
        ? connector?.triggers?.find(
            (trigger) => trigger.key === workflow.trigger.operation
          )
        : connector?.actions?.find(
            (action) => action.key === workflow.actions[index].operation
          )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connector, type, workflow]);

  useEffect(() => {
    passOutputFields();
  }, [passOutputFields]);

  useEffect(() => {
    if (type === "trigger") {
      updateWorkflow({
        "system.trigger.selected": operation ? true : false,
        "system.trigger.authenticated": operationIsAuthenticated ? true : false,
        "system.trigger.configured": operationIsConfigured ? true : false,
        "system.trigger.tested": true,
      });
    } else {
      updateWorkflow({
        ["system.actions[" + index + "].selected"]: operation ? true : false,
        ["system.actions[" + index + "].authenticated"]:
          operationIsAuthenticated ? true : false,
        ["system.actions[" + index + "].configured"]: operationIsConfigured
          ? true
          : false,
        ["system.actions[" + index + "].tested"]: operationIsTested
          ? true
          : false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    operation,
    operationIsAuthenticated,
    operationIsConfigured,
    operationIsTested,
    key,
  ]);

  useEffect(() => {
    if (operationAuthenticationIsRequired) {
      listCredentials();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connector?.key, operationAuthenticationIsRequired]);

  return (
    <WorkflowStepContext.Provider
      value={{
        type,
        index,
        step,
        activeRow,
        username,
        connector,
        operation,
        operationIsConfigured,
        operationIsAuthenticated,
        operationAuthenticationIsRequired,
        inputError,
        errors,
        operationIsTested,
        savedCredentials,
        setConnector,
        setActiveRow,
        setUsername,
        getConnector,
        setInputError,
        setErrors,
        setOperationIsTested,
        setSavedCredentials,
      }}
    >
      {children}
    </WorkflowStepContext.Provider>
  );
};

export const useWorkflowStepContext = () => useContext(WorkflowStepContext);

export default WorkflowStepContextProvider;

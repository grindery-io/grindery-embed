import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Connector } from "../../types/Connector";
import { Workflow } from "../../types/Workflow";

interface ConfigState {
  actionConnector: Connector | null;
  connectors: Connector[];
  create: boolean;
  loading: boolean;
  triggerConnector: Connector | null;
  workflows: Workflow[];
  workflowKey: string;
  triggerOperation: string | undefined;
  actionOperation: string | undefined;
  triggerDefaultInput: any | undefined;
  actionDefaultInput: any | undefined;
  triggerAuthentication: string | null | undefined;
  triggerAuthenticationKey: string | null | undefined;
  actionAuthentication: string | null | undefined;
  actionAuthenticationKey: string | null | undefined;
  actionsWhitelist: string[];
  hideTrigger: boolean;
  skipTriggerAuth?: boolean;
  skipActionAuth?: boolean;
  redirect: string;
  connect?: boolean;
}

const initialState: ConfigState = {
  actionConnector: null,
  connectors: [],
  create: false,
  loading: true,
  triggerConnector: null,
  workflows: [],
  workflowKey: "",
  triggerOperation: "",
  actionOperation: "",
  triggerDefaultInput: undefined,
  actionDefaultInput: undefined,
  triggerAuthentication: undefined,
  triggerAuthenticationKey: undefined,
  actionAuthentication: undefined,
  actionAuthenticationKey: undefined,
  actionsWhitelist: [],
  hideTrigger: false,
  skipTriggerAuth: false,
  skipActionAuth: false,
  redirect: "",
  connect: false,
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setConfig(state, action: PayloadAction<Partial<ConfigState>>) {
      const newState = { ...state, ...action.payload };
      return newState;
    },
    setWorkflows(state, action: PayloadAction<Workflow[]>) {
      state.workflows = action.payload;
    },
    setCreate(state, action: PayloadAction<boolean>) {
      state.create = action.payload;
    },
    setWorkflowKey(state, action: PayloadAction<string>) {
      state.workflowKey = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setTriggerConnector(state, action: PayloadAction<Connector>) {
      state.triggerConnector = action.payload;
    },
    setActionConnector(state, action: PayloadAction<Connector>) {
      state.actionConnector = action.payload;
    },
    setConnectors(state, action: PayloadAction<Connector[]>) {
      state.connectors = action.payload;
    },
  },
});

export const selecConfigStore = (state: RootState) => state.config;
export const configStoreActions = configSlice.actions;
export default configSlice.reducer;

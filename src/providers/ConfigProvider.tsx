import React, { useCallback, useEffect, useMemo } from "react";
import GrinderyClient from "grindery-nexus-client";
import { useAppDispatch, useAppSelector } from "../store";
import {
  configStoreActions,
  selecConfigStore,
} from "../store/slices/configSlice";
import { Action, Trigger } from "../types/Connector";
import { selectUserStore } from "../store/slices/userSlice";

type ConfigProviderProps = {
  children: React.ReactNode;
};

export const ConfigProvider = ({ children }: ConfigProviderProps) => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector(selectUserStore);
  const { create, workflowKey, triggerConnector, actionConnector } =
    useAppSelector(selecConfigStore);
  const queryString = window.location.search;
  const urlParams = useMemo(
    () => new URLSearchParams(queryString),
    [queryString]
  );
  const actionParam = urlParams.get("action");
  const triggerParam = urlParams.get("trigger");
  const triggerOperation =
    triggerConnector?.triggers?.find((t: Trigger) => t.key === triggerParam)
      ?.key || "";
  const actionOperation =
    actionConnector?.actions?.find((a: Action) => a.key === actionParam)?.key ||
    "";

  const triggerAuthenticationParam = urlParams.get("trigger.authentication");
  const triggerAuthenticationKeyParam = urlParams.get(
    "trigger.authenticationKey"
  );
  const actionAuthenticationParam = urlParams.get("action.authentication");
  const actionAuthenticationKeyParam = urlParams.get(
    "action.authenticationKey"
  );

  const actionsWhitelist = urlParams.get("action.whitelist");
  const hideTrigger = urlParams.get("trigger.hide");

  const skipTriggerAuth = urlParams.get("trigger.skipAuth");
  const skipActionAuth = urlParams.get("action.skipAuth");

  const getWorkflows = useCallback(async () => {
    const client = new GrinderyClient(accessToken);
    if (accessToken) {
      try {
        const workflowsResponse = await client.workflow.list({});
        const workflows = workflowsResponse
          ? workflowsResponse.map((wr: any) => wr.workflow)
          : [];
        dispatch(configStoreActions.setWorkflows(workflows));
      } catch (error: any) {
        console.error("getWorkflows error: ", error.message);
        dispatch(configStoreActions.setWorkflows([]));
      }
      dispatch(configStoreActions.setLoading(false));
    }
  }, [accessToken, dispatch]);

  const getDefaultInputs = useCallback(() => {
    const triggerDefaultInput: any = {};
    const actionDefaultInput: any = {};

    for (var value of Array.from(urlParams.keys())) {
      if (value.includes("trigger.input.")) {
        const key = value.replace("trigger.input.", "");
        triggerDefaultInput[key] = urlParams.get(value) || "";
      }
      if (value.includes("action.input.")) {
        const key = value.replace("action.input.", "");
        actionDefaultInput[key] = urlParams.get(value) || "";
      }
    }
    return { triggerDefaultInput, actionDefaultInput };
  }, [urlParams]);

  useEffect(() => {
    getWorkflows();
  }, [create, workflowKey, getWorkflows]);

  useEffect(() => {
    function handleMessage(event: any) {
      if (
        event.data &&
        event.data.method === "gr_initialize" &&
        event.data.params
      ) {
        console.log("initialization message received", event.data);
        dispatch(configStoreActions.setConfig(event.data.params));
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [dispatch]);

  useEffect(() => {
    const { triggerDefaultInput, actionDefaultInput } = getDefaultInputs();
    dispatch(
      configStoreActions.setConfig({
        triggerOperation,
        actionOperation,
        triggerDefaultInput,
        actionDefaultInput,
        triggerAuthentication: triggerAuthenticationParam,
        triggerAuthenticationKey: triggerAuthenticationKeyParam,
        actionAuthentication: actionAuthenticationParam,
        actionAuthenticationKey: actionAuthenticationKeyParam,
        actionsWhitelist: actionsWhitelist?.split(",") || [],
        hideTrigger: hideTrigger === "1",
        skipTriggerAuth: skipTriggerAuth === "1",
        skipActionAuth: skipActionAuth === "1",
      })
    );
  }, [
    triggerOperation,
    actionOperation,
    getDefaultInputs,
    triggerAuthenticationParam,
    triggerAuthenticationKeyParam,
    actionAuthenticationParam,
    actionAuthenticationKeyParam,
    actionsWhitelist,
    hideTrigger,
    dispatch,
    skipTriggerAuth,
    skipActionAuth,
  ]);

  return <>{children}</>;
};

export default ConfigProvider;

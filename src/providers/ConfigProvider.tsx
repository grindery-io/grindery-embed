import React, { useEffect } from "react";
import { useAppDispatch } from "../store";
import { configStoreActions } from "../store/slices/configSlice";

type ConfigProviderProps = {
  children: React.ReactNode;
};

export const ConfigProvider = ({ children }: ConfigProviderProps) => {
  const dispatch = useAppDispatch();

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

  return <>{children}</>;
};

export default ConfigProvider;

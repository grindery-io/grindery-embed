import { useState, useEffect } from "react";

export default function useConfig() {
  const [config, setConfig] = useState({});

  useEffect(() => {
    function handleMessage(event: any) {
      if (
        event.data &&
        event.data.method === "gr_initialize" &&
        event.data.params
      ) {
        console.log("initialization message received", event.data);
        setConfig(event.data.params);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return config;
}

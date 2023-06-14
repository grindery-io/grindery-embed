import { useCallback, useEffect, useState } from "react";
import axios from "axios";

type UseOAuth2Props = {
  accessToken: string;
  connectorKey?: string;
  authenticated?: boolean;
};

const useOAuth2 = (props: UseOAuth2Props) => {
  const { accessToken, connectorKey, authenticated } = props;
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<any>(null);
  const [connectionFailed, setConnectionFailed] = useState<boolean>(false);
  const isConnected = accessToken && credentials?.token;

  const getCredentials = useCallback(async () => {
    if (accessToken && authCode) {
      try {
        const res = await axios.post(
          "https://orchestrator.grindery.org/credentials/auth/complete",
          { code: authCode },
          {
            headers: {
              Authorization: `Bearer ${accessToken || ""}`,
            },
          }
        );

        if (res && res.data) {
          setCredentials(res.data || null);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, [accessToken, authCode]);

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
    if (accessToken && !authCode && !authenticated) {
      window.open(
        `https://orchestrator.grindery.org/credentials/production/${connectorKey}/auth?access_token=${accessToken}&redirect_uri=${window.location.origin}/oauth`
      );
    }
  }, [accessToken, authCode, connectorKey, authenticated]);

  useEffect(() => {
    if (accessToken && authCode) {
      getCredentials();
    }
  }, [accessToken, authCode, getCredentials]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setConnectionFailed(true);
    }, 60000);
    return () => clearTimeout(timer);
  }, []);

  return {
    credentials,
    connectionFailed,
    isConnected,
  };
};

export default useOAuth2;

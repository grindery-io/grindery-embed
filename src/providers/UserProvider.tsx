import React, { createContext, useEffect, useContext } from "react";
import { useGrinderyNexus } from "use-grindery-nexus";
import { useAppDispatch } from "../store";
import { userStoreActions } from "../store/slices/userSlice";

// Context props
type ContextProps = {
  connectUser: () => void;
  disconnectUser: () => void;
};

// Context provider props
type UserProviderProps = {
  children: React.ReactNode;
};

// Init context
export const UserContext = createContext<ContextProps>({
  connectUser: () => {},
  disconnectUser: () => {},
});

export const UserProvider = ({ children }: UserProviderProps) => {
  const { connect, disconnect, token, user } = useGrinderyNexus();
  const dispatch = useAppDispatch();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const tokenParam = urlParams.get("access_token");
  const userParam = urlParams.get("user_address");
  const access_token = token?.access_token || tokenParam || "";
  const userId = user ? user : userParam ? `eip155:1:${userParam}` : ``;

  const connectUser = () => {
    connect();
  };

  const disconnectUser = () => {
    disconnect();
    dispatch(userStoreActions.setAccessToken(""));
    dispatch(userStoreActions.setUserId(""));
  };

  useEffect(() => {
    dispatch(userStoreActions.setAccessToken(access_token));
  }, [access_token, dispatch]);

  useEffect(() => {
    dispatch(userStoreActions.setUserId(userId));
  }, [userId, dispatch]);

  return (
    <UserContext.Provider
      value={{
        connectUser,
        disconnectUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserProvider = () => useContext(UserContext);

export default UserProvider;

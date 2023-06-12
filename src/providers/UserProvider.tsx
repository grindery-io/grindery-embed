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

  const connectUser = () => {
    connect();
  };

  const disconnectUser = () => {
    disconnect();
  };

  useEffect(() => {
    dispatch(userStoreActions.setAccessToken(token?.access_token || ""));
  }, [token?.access_token, dispatch]);

  useEffect(() => {
    dispatch(userStoreActions.setUserId(user || ""));
  }, [user, dispatch]);

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

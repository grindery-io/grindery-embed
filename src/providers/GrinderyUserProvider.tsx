import React, { createContext, useEffect, useContext } from "react";
import { useGrinderyNexus } from "use-grindery-nexus";
import { useAppDispatch, useAppSelector } from "../store";
import { selectUserStore, userStoreActions } from "../store/slices/userSlice";

// Context props
type ContextProps = {
  connectUser: () => void;
  disconnectUser: () => void;
};

// Context provider props
type GrinderyUserProviderProps = {
  children: React.ReactNode;
};

// Init context
export const UserContext = createContext<ContextProps>({
  connectUser: () => {},
  disconnectUser: () => {},
});

export const GrinderyUserProvider = ({
  children,
}: GrinderyUserProviderProps) => {
  const { connect, disconnect, token, user } = useGrinderyNexus();
  const dispatch = useAppDispatch();
  const { accessToken, userId } = useAppSelector(selectUserStore);

  const access_token = token?.access_token || "";

  const connectUser = () => {
    connect();
  };

  const disconnectUser = () => {
    disconnect();
    dispatch(userStoreActions.setAccessToken(""));
    dispatch(userStoreActions.setUserId(""));
  };

  useEffect(() => {
    if (!accessToken && access_token) {
      dispatch(userStoreActions.setAccessToken(access_token));
    }
  }, [accessToken, access_token, dispatch]);

  useEffect(() => {
    if (user && !userId) {
      dispatch(userStoreActions.setUserId(user));
    }
  }, [userId, user, dispatch]);

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

export const useGrinderyUserProvider = () => useContext(UserContext);

export default GrinderyUserProvider;

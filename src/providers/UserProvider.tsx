import React, { createContext, useEffect, useContext } from "react";
import { useAppDispatch } from "../store";
import { userStoreActions } from "../store/slices/userSlice";
import GrinderyUserProvider from "./GrinderyUserProvider";
import GrinderyNexusContextProvider from "use-grindery-nexus";

// Context props
type ContextProps = {};

// Context provider props
type UserProviderProps = {
  children: React.ReactNode;
};

// Init context
export const UserContext = createContext<ContextProps>({});

export const UserProvider = ({ children }: UserProviderProps) => {
  const dispatch = useAppDispatch();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const tokenParam = urlParams.get("access_token");
  const userParam = urlParams.get("user_address");
  const userChain = urlParams.get("user_chain");
  const access_token = tokenParam || "";
  const userId = userParam ? `eip155:${userChain || "1"}:${userParam}` : ``;

  console.log("tokenParam", tokenParam);

  useEffect(() => {
    dispatch(userStoreActions.setAccessToken(access_token));
  }, [access_token, dispatch]);

  useEffect(() => {
    dispatch(userStoreActions.setUserId(userId));
  }, [userId, dispatch]);

  return (
    <UserContext.Provider value={{}}>
      {!tokenParam ? (
        <GrinderyNexusContextProvider cacheProvider={false}>
          <GrinderyUserProvider>{children}</GrinderyUserProvider>
        </GrinderyNexusContextProvider>
      ) : (
        children
      )}
    </UserContext.Provider>
  );
};

export const useUserProvider = () => useContext(UserContext);

export default UserProvider;

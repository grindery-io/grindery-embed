import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ConfigState {
  userAccessToken: string;
}

const initialState: ConfigState = {
  userAccessToken: "",
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setUserAccessToken(state, action: PayloadAction<string>) {
      state.userAccessToken = action.payload || "";
    },
    setConfig(state, action: PayloadAction<ConfigState>) {
      state = { ...state, ...action.payload };
    },
  },
});

export const selecConfigStore = (state: RootState) => state.config;
export const configStoreActions = configSlice.actions;
export default configSlice.reducer;

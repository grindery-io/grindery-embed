import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Workflow } from "../../types/Workflow";

interface UserState {
  accessToken: string;
  create: boolean;
  userId: string;
  workflows: Workflow[];
}

const initialState: UserState = {
  accessToken: "",
  create: false,
  userId: "",
  workflows: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload || "";
    },
    setUserId(state, action: PayloadAction<string>) {
      state.userId = action.payload || "";
    },
    setWorkflows(state, action: PayloadAction<Workflow[]>) {
      state.workflows = action.payload;
    },
    setCreate(state, action: PayloadAction<boolean>) {
      state.create = action.payload;
    },
  },
});

export const selectUserStore = (state: RootState) => state.user;
export const userStoreActions = userSlice.actions;
export default userSlice.reducer;

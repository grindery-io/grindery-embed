import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface UserState {
  accessToken: string;
  userId: string;
}

const initialState: UserState = {
  accessToken: "",
  userId: "",
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
  },
});

export const selectUserStore = (state: RootState) => state.user;
export const userStoreActions = userSlice.actions;
export default userSlice.reducer;

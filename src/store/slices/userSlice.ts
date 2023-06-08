import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface UserState {
  accessToken: string;
}

const initialState: UserState = {
  accessToken: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload || "";
    },
  },
});

export const selectUserStore = (state: RootState) => state.user;
export const userStoreActions = userSlice.actions;
export default userSlice.reducer;

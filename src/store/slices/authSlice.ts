/* eslint-disable @typescript-eslint/no-unused-expressions */
import type { IProfile } from "src/types/admin";
import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  profile: IProfile;
  isLoading: boolean;
  isLoadingRefresh: boolean;
  loggedIn: boolean;
  error: string | null;
}

const initialState: AuthState = {
  profile: {
    firstname: "",
    lastname: "",
    phoneNumber: "",
    telegramId: "",
    role: null,
  },
  isLoading: false,
  isLoadingRefresh: false,
  loggedIn: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    refreshStart(state) {
      state.isLoadingRefresh = true;
      state.error = null;
    },
    refreshSuccess(
      state,
      action: PayloadAction<{
        profile: IProfile;
        accessToken?: string;
        token?: string;
      }>
    ) {
      state.isLoadingRefresh = false;
      state.loggedIn = true;
      state.profile = action.payload.profile;
      state.error = null;
      const token = action.payload.accessToken || action.payload.token;
      token && localStorage.setItem("accessToken", token);
    },
    refreshFailure(state, action: PayloadAction<string>) {
      state.isLoadingRefresh = false;
      state.error = action.payload;
      localStorage.removeItem("accessToken");
    },

    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(
      state,
      action: PayloadAction<{
        profile: IProfile;
        accessToken?: string;
        token?: string;
      }>
    ) {
      state.isLoading = false;
      state.loggedIn = true;
      state.profile = action.payload.profile;
      state.error = null;
      const token = action.payload.accessToken || action.payload.token;
      token && localStorage.setItem("accessToken", token);
    },

    loginFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // refreshUserFailure(state, action: PayloadAction<string>) {
    //   state.isLoading = false;
    //   state.error = action.payload;
    //   localStorage.removeItem("accessToken");
    // },

    logoutUser(state) {
      localStorage.removeItem("accessToken");
      state.loggedIn = false;
      state.isLoading = false;
      state.isLoadingRefresh = false;
      state.profile = {
        firstname: "",
        lastname: "",
        phoneNumber: "",
        telegramId: "",
        role: null,
      };
      state.error = null;
    },
  },
});

export const {
  refreshStart,
  refreshSuccess,
  refreshFailure,

  loginStart,
  loginSuccess,
  logoutUser,
  loginFailure,
  // signUserFailure,
  // refreshUserFailure,
} = authSlice.actions;
export default authSlice.reducer;

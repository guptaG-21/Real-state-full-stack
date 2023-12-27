import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  curruser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state, action) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.curruser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateSuccessful: (state, action) => {
      state.curruser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateStart: (state, action) => {
      state.loading = true;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteSuccessful: (state, action) => {
      state.curruser = null;
      state.loading = false;
      state.error = null;
    },
    deleteStart: (state, action) => {
      state.loading = true;
    },
    deleteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOutSuccessful: (state, action) => {
      state.curruser = null;
      state.loading = false;
      state.error = null;
    },
    signOutStart: (state, action) => {
      state.loading = true;
    },
    signOutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signInStart,
  signInFailure,
  signInSuccess,
  updateSuccessful,
  updateStart,
  updateFailure,
  deleteSuccessful,
  deleteStart,
  deleteFailure,
  signOutSuccessful,
  signOutFailure,
  signOutStart,
} = userSlice.actions;
export default userSlice.reducer;

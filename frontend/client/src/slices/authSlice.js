import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clientInfo: localStorage.getItem("clientInfo")
    ? JSON.parse(localStorage.getItem("clientInfo"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.clientInfo = action.payload;
      localStorage.setItem("clientInfo", JSON.stringify(action.payload));
    },
    logout: (state, action) => {
      state.clientInfo = null;
      localStorage.removeItem("clientInfo");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {

};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
    },
    logout: (state, action) => {
      state.userInfo = action.payload;
    },
  }, 
});

export const { setCredentials, logout } = authSlice.actions;

const authReducer = authSlice.reducer;
export default authReducer;
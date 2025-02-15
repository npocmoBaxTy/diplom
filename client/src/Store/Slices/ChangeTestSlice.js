import { createSlice } from "@reduxjs/toolkit";

const changeTestSlice = createSlice({
  name: "changeTest",
  initialState: {
    item: null,
  },
  reducers: {
    setCurTest: (state, action) => {
      state.item = action.payload;
    },
  },
});

export const { setCurTest } = changeTestSlice.actions;

export default changeTestSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import login from "./Slices/LoginSlice";
import changeTest from "./Slices/ChangeTestSlice";
export const store = configureStore({
  reducer: {
    login,
    changeTest,
  },
});

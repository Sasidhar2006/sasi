import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import alertReducer from "./alertSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    alerts: alertReducer,
  },
});

export default store;

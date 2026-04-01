import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../feature/user/userSlice";
let store = configureStore({
  reducer: {
    user: userReducer,
  },
});
export default store;
import usersSlice from "./usersSlice";
import loadersSlice from "./loadersSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    users: usersSlice,
    loaders: loadersSlice,
  },
});

export default store;

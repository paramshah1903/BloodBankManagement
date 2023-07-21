import usersSlice from "./usersSlice";
import loadersSlice from "./loadersSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    users: usersSlice,
    loaders: loadersSlice,
  },
});

// console.log(store);

export default store;

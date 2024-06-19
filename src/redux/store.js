import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import mailReducer from "./reducers/mailReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    mail: mailReducer,
  },
});

export default store;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "redux/reducers/authReducer";
import mailReducer from "redux/reducers/mailReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    mail: mailReducer,
  },
});

export default store;

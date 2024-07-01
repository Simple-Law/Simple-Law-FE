import { combineReducers } from "redux";
import authReducer from "./authReducer";
import mailReducer from "./mailReducer";
import loadingReducer from "./loadingReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  mail: mailReducer,
  loading: loadingReducer,
});

export default rootReducer;

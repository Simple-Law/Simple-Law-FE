import { combineReducers } from "redux";
import authReducer from "./authReducer";
import mailReducer from "./mailReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  mail: mailReducer,
});

export default rootReducer;

import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk"; // 이름 있는 내보내기 사용
import authReducer from "reducers/authReducer";
import mailReducer from "reducers/mailReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  mail: mailReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

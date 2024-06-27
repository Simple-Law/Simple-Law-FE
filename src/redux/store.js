// store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { thunk } from "redux-thunk";
import storageSession from "redux-persist/lib/storage/session";
import rootReducer from "./reducers/index"; // 결합된 리듀서 가져오기

// Persist Config 설정
const persistConfig = {
  key: "root",
  storage: storageSession, // sessionStorage를 사용,창 닫으면 로그아웃
  whitelist: ["auth"], // 지속할 리듀서 목록
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 스토어 생성
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"], // redux-persist 관련 액션 무시
      },
    }).concat(thunk),
  devTools: process.env.NODE_ENV !== "production",
});

// Persistor 생성
const persistor = persistStore(store);

export { store, persistor };

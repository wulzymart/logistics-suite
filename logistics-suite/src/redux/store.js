import { combineReducers, configureStore } from "@reduxjs/toolkit";
import customerReducer from "./customer.slice";
import menuReducer from "./menu.slice";

import orderReducer from "./order.slice";
import staffReducer from "./staff.slice";

import storageSession from "reduxjs-toolkit-persist/lib/storage/session";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
  customer: customerReducer,
  menu: menuReducer,

  order: orderReducer,
  staff: staffReducer,
});
const persistConfig = {
  key: "root",
  storage: storageSession,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});
export const persistor = persistStore(store);

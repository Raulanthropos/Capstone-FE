import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import profileReducer from "../reducers/profileReducer";
import { API_BASE_URL } from "../../api/client";

const reducer = combineReducers({ loadedProfile: profileReducer });
const persistConfig = {
  // Separate local MySQL sessions from old Railway data and other API origins.
  key: "woof-paws-mysql-v1:" + API_BASE_URL,
  storage,
  whitelist: ["loadedProfile"],
};

export const store = configureStore({
  reducer: persistReducer(persistConfig, reducer),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

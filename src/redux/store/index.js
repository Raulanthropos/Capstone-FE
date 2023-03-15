import { persistStore, persistReducer } from 'redux-persist';
import localStorage from 'redux-persist/lib/storage';
import { configureStore, combineReducers } from "@reduxjs/toolkit"
import profileReducer from '../reducers/profileReducer';

const bigReducer = combineReducers({
  loadedProfile: profileReducer,
})


const persistConfig = {
  key: 'root',
  storage: localStorage,
  whitelist: ["loadedProfile", "accessToken"]
};

const persistedReducer = persistReducer(persistConfig, bigReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})


export const persistor = persistStore(store);
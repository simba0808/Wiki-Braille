import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import { searchReducer, deleteDescReducer } from "./slices/dashboardSlice";
import { apiSlice } from "./slices/apiSlice";


const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, combineReducers(
  {
    auth: authReducer,
    search: searchReducer,
    delete: deleteDescReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  })
);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({ serializableCheck: false }).concat(apiSlice.middleware),
  devTools: true,
});

export const persistor  = persistStore(store);

export default store;
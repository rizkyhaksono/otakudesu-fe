import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
} from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import rootReducer, { rootPersistConfig } from "./root-reducer";
import { baseAnimeApi, baseComicApi, baseMovieApi } from "./axios-base-query";

const store = configureStore({
  reducer: persistReducer(rootPersistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(
      baseAnimeApi.middleware,
      baseComicApi.middleware,
      baseMovieApi.middleware
    ),
});

const persistor = persistStore(store);
const { dispatch } = store;
const useSelector = useAppSelector;
const useDispatch = () => useAppDispatch();
export { store, persistor, dispatch, useSelector, useDispatch };

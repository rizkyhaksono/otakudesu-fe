import { combineReducers } from "redux";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { baseAnimeApi, baseComicApi, baseMovieApi } from "./axios-base-query";

export const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  setItem(_key, value) {
    return Promise.resolve(value);
  },
  removeItem() {
    return Promise.resolve();
  },
});

export const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

export const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  whitelist: [],
};

const rootReducer = combineReducers({
  [baseAnimeApi.reducerPath]: baseAnimeApi.reducer,
  [baseComicApi.reducerPath]: baseComicApi.reducer,
  [baseMovieApi.reducerPath]: baseMovieApi.reducer,
});

export default rootReducer;

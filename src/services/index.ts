import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import RootReducer from "./root-reducers";

export const Store = configureStore({
  reducer: RootReducer,
});

export type AppDispatch = typeof Store.dispatch;
export type RootState = ReturnType<typeof Store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();